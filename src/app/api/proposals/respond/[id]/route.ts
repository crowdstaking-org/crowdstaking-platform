/**
 * Pioneer Response API
 * PUT /api/proposals/respond/:id - Pioneer responds to admin actions
 * 
 * PHASE 4: Pioneer can accept or reject counter-offers and approvals
 */

import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { jsonResponse, errorResponse } from '@/lib/api'
import { requireAuth } from '@/lib/auth'
import type { Proposal, ProposalStatus } from '@/types/proposal'

/**
 * Pioneer response action types
 */
type PioneerAction = 'accept' | 'reject'

/**
 * Request body interface
 */
interface PioneerResponseRequest {
  action: PioneerAction
}

/**
 * PUT /api/proposals/respond/:id
 * 
 * Allows proposal creator (pioneer) to respond to admin actions
 * 
 * Valid scenarios:
 * - Accept/Reject when status is 'counter_offer_pending'
 * - Accept when status is 'approved'
 * 
 * @param request - Request with action
 * @param params - URL params with proposal ID
 * @returns Updated proposal
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const wallet = requireAuth(request)
    
    // Parse request body
    const body: PioneerResponseRequest = await request.json()
    const { action } = body
    
    // Validate action
    if (!action || !['accept', 'reject'].includes(action)) {
      return errorResponse('Invalid action. Must be: accept or reject', 400)
    }
    
    // Fetch proposal
    const { data: proposal, error: fetchError } = await supabase
      .from('proposals')
      .select('*')
      .eq('id', params.id)
      .single()
    
    if (fetchError || !proposal) {
      return errorResponse('Proposal not found', 404)
    }
    
    // Verify this is the proposal creator
    if (proposal.creator_wallet_address.toLowerCase() !== wallet.toLowerCase()) {
      return errorResponse('Forbidden - Not your proposal', 403)
    }
    
    // Validate current status allows response
    const allowedStatuses: ProposalStatus[] = ['counter_offer_pending', 'approved']
    if (!allowedStatuses.includes(proposal.status)) {
      return errorResponse(
        `Cannot respond to proposal in status: ${proposal.status}`,
        400
      )
    }
    
    // Determine new status
    let newStatus: ProposalStatus
    
    if (action === 'accept') {
      newStatus = 'accepted'
      console.log(
        `Pioneer ${wallet} accepted ${proposal.status === 'counter_offer_pending' ? 'counter-offer' : 'approval'} ` +
        `for proposal ${params.id}`
      )
    } else {
      newStatus = 'rejected'
      console.log(
        `Pioneer ${wallet} rejected ${proposal.status === 'counter_offer_pending' ? 'counter-offer' : 'approval'} ` +
        `for proposal ${params.id}`
      )
    }
    
    // Update proposal
    const { data: updated, error: updateError } = await supabase
      .from('proposals')
      .update({ status: newStatus })
      .eq('id', params.id)
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
    console.error('Pioneer response API error:', error)
    return errorResponse(
      error.message || 'Failed to process response',
      500
    )
  }
}

