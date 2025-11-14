/**
 * Admin Proposal Action API
 * PUT /api/proposals/admin/:id - Admin actions on proposals
 * 
 * PHASE 4: Admin can accept, reject, or counter-offer proposals
 */

import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { jsonResponse, errorResponse } from '@/lib/api'
import { requireAdmin } from '@/lib/auth'
import type { Proposal, ProposalStatus } from '@/types/proposal'

/**
 * Admin action types
 */
type AdminAction = 'accept' | 'reject' | 'counter_offer'

/**
 * Request body interface
 */
interface AdminActionRequest {
  action: AdminAction
  foundation_offer_cstake_amount?: number
  foundation_notes?: string
}

/**
 * PUT /api/proposals/admin/:id
 * 
 * Allows admin to take actions on proposals
 * 
 * Actions:
 * - accept: Approve the proposal as-is
 * - reject: Reject the proposal with notes
 * - counter_offer: Propose a different amount
 * 
 * @param request - Request with action and optional fields
 * @param params - URL params with proposal ID
 * @returns Updated proposal
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params (Next.js 16 change)
    const { id } = await params

    // Verify admin authentication
    const adminWallet = requireAdmin(request)
    
    // Parse request body
    const body: AdminActionRequest = await request.json()
    const { action, foundation_offer_cstake_amount, foundation_notes } = body
    
    // Validate action
    if (!action || !['accept', 'reject', 'counter_offer'].includes(action)) {
      return errorResponse('Invalid action. Must be: accept, reject, or counter_offer', 400)
    }
    
    // Fetch current proposal
    const { data: proposal, error: fetchError } = await supabase
      .from('proposals')
      .select('*')
      .eq('id', id)
      .single()
    
    if (fetchError || !proposal) {
      return errorResponse('Proposal not found', 404)
    }
    
    // Validate current status allows admin action
    if (proposal.status !== 'pending_review') {
      return errorResponse(
        `Proposal already processed (status: ${proposal.status})`,
        400
      )
    }
    
    // Determine new status and fields based on action
    let updates: Partial<Proposal> = {}
    let newStatus: ProposalStatus
    
    switch (action) {
      case 'accept':
        newStatus = 'approved'
        updates = { 
          status: newStatus,
          foundation_notes: foundation_notes || undefined
        }
        console.log(`Admin ${adminWallet} approved proposal ${id}`)
        break
      
      case 'reject':
        newStatus = 'rejected'
        updates = { 
          status: newStatus,
          foundation_notes: foundation_notes || 'Proposal rejected by admin'
        }
        console.log(`Admin ${adminWallet} rejected proposal ${id}`)
        break
      
      case 'counter_offer':
        if (!foundation_offer_cstake_amount || foundation_offer_cstake_amount <= 0) {
          return errorResponse('Counter offer amount required and must be positive', 400)
        }
        newStatus = 'counter_offer_pending'
        updates = {
          status: newStatus,
          foundation_offer_cstake_amount,
          foundation_notes: foundation_notes || undefined
        }
        console.log(
          `Admin ${adminWallet} made counter-offer on proposal ${id}: ` +
          `${foundation_offer_cstake_amount} (requested: ${proposal.requested_cstake_amount})`
        )
        break
    }
    
    // Update proposal in database
    const { data: updated, error: updateError } = await supabase
      .from('proposals')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (updateError) {
      console.error('Error updating proposal:', updateError)
      throw updateError
    }
    
    return jsonResponse({ 
      success: true, 
      proposal: updated as Proposal,
      message: `Proposal ${action}ed successfully`
    })
    
  } catch (error: any) {
    // Handle authorization errors
    if (error.message?.includes('Forbidden') || error.message?.includes('Unauthorized')) {
      return errorResponse(error.message, 403)
    }
    
    // Handle other errors
    console.error('Admin action API error:', error)
    return errorResponse(
      error.message || 'Failed to process admin action',
      500
    )
  }
}






