/**
 * Confirm Work Completion API
 * POST /api/contracts/confirm-work/:id - Pioneer confirms work is done
 * 
 * PHASE 5: Pioneer marks work as complete, triggers timestamp in DB
 * Note: Actual blockchain confirmWorkDone() call should be made from frontend
 * so pioneer signs with their own wallet
 */

import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { jsonResponse, errorResponse } from '@/lib/api'
import { requireAuth } from '@/lib/auth'
import type { Proposal } from '@/types/proposal'

/**
 * POST /api/contracts/confirm-work/:id
 * 
 * Allows pioneer to confirm work completion
 * Sets pioneer_confirmed_at timestamp to signal readiness for admin review
 * 
 * Requirements:
 * - Must be the proposal creator (pioneer)
 * - Proposal status must be 'work_in_progress'
 * - Cannot confirm twice
 * 
 * @param request - Request object with auth
 * @param params - URL params with proposal ID
 * @returns Updated proposal
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params (Next.js 16 change)
    const { id } = await params
    
    // Verify authentication
    const wallet = requireAuth(request)
    
    console.log(`[Confirm Work] Pioneer ${wallet} confirming work for proposal ${id}`)
    
    // Get proposal
    const { data: proposal, error: fetchError } = await supabase
      .from('proposals')
      .select('*')
      .eq('id', id)
      .single()
    
    if (fetchError || !proposal) {
      console.error('[Confirm Work] Proposal not found:', id)
      return errorResponse('Proposal not found', 404)
    }
    
    // Verify caller is creator (pioneer)
    if (proposal.creator_wallet_address.toLowerCase() !== wallet.toLowerCase()) {
      console.error('[Confirm Work] Unauthorized:', {
        requester: wallet,
        creator: proposal.creator_wallet_address,
      })
      return errorResponse('Forbidden - You are not the creator of this proposal', 403)
    }
    
    // Verify status is work_in_progress
    if (proposal.status !== 'work_in_progress') {
      console.error('[Confirm Work] Invalid status:', proposal.status)
      return errorResponse(
        `Cannot confirm work for proposal in status: ${proposal.status}. Must be "work_in_progress".`,
        400
      )
    }
    
    // Check if already confirmed
    if (proposal.pioneer_confirmed_at) {
      console.error('[Confirm Work] Already confirmed at:', proposal.pioneer_confirmed_at)
      return errorResponse('Work completion already confirmed', 400)
    }
    
    // Update DB with confirmation timestamp
    const now = new Date().toISOString()
    const { data: updated, error: updateError } = await supabase
      .from('proposals')
      .update({
        pioneer_confirmed_at: now,
      })
      .eq('id', id)
      .select()
      .single()
    
    if (updateError) {
      console.error('[Confirm Work] DB update failed:', updateError)
      throw updateError
    }
    
    console.log('[Confirm Work] Success:', {
      proposalId: id,
      confirmedAt: now,
    })
    
    return jsonResponse({ 
      success: true, 
      proposal: updated as Proposal,
      message: 'Work completion confirmed! Awaiting admin verification and token release.',
    })
    
  } catch (error: any) {
    // Handle authorization errors
    if (error.message?.includes('Forbidden') || error.message?.includes('Unauthorized')) {
      return errorResponse(error.message, 403)
    }
    
    // Handle other errors
    console.error('[Confirm Work] API error:', error)
    return errorResponse(
      error.message || 'Failed to confirm work completion',
      500
    )
  }
}

