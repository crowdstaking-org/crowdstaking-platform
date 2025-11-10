/**
 * Pioneer Response API
 * PUT /api/proposals/respond/:id - Pioneer responds to admin actions
 * 
 * PHASE 4: Pioneer can accept or reject counter-offers and approvals
 * PHASE 5: Auto-trigger smart contract agreement creation on acceptance
 */

import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { jsonResponse, errorResponse } from '@/lib/api'
import { requireAuth } from '@/lib/auth'
import { getVestingService, isVestingServiceAvailable } from '@/lib/contracts/vestingService'
import { tokenAmountToWei } from '@/lib/contracts/utils'
import type { Proposal, ProposalStatus } from '@/types/proposal'
import { updateContributorStats, updateActivityStats } from '@/lib/gamification/statsUpdater'
import { checkAndAwardBadges } from '@/lib/gamification/badgeAwarder'
import { createActivityEvent } from '@/lib/gamification/activityLogger'

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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params (Next.js 16 change)
    const { id } = await params

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
      .eq('id', id)
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
      // PHASE 5: Create smart contract agreement on acceptance
      console.log(
        `Pioneer ${wallet} accepted ${proposal.status === 'counter_offer_pending' ? 'counter-offer' : 'approval'} ` +
        `for proposal ${id}`
      )
      
      // Determine agreed amount (counter-offer or original request)
      const agreedAmount = proposal.foundation_offer_cstake_amount || proposal.requested_cstake_amount
      
      // Try to create blockchain agreement if vesting service is available
      let contractTxHash: string | null = null
      
      if (isVestingServiceAvailable()) {
        try {
          console.log('[Phase 5] Creating blockchain agreement...')
          
          if (!agreedAmount || agreedAmount <= 0) {
            throw new Error('Invalid token amount')
          }
          
          // Convert to wei (assuming 18 decimals for $CSTAKE)
          const amountInWei = tokenAmountToWei(agreedAmount)
          
          console.log('[Phase 5] Agreement details:', {
            proposalId: id,
            contributor: proposal.creator_wallet_address,
            amount: agreedAmount,
            amountInWei: amountInWei.toString(),
          })
          
          // Create agreement on blockchain
          const vestingService = getVestingService()
          contractTxHash = await vestingService.createAgreement(
            id,
            proposal.creator_wallet_address,
            amountInWei
          )
          
          console.log('[Phase 5] Agreement created successfully:', contractTxHash)
          
          // If contract creation successful, move to work_in_progress
          newStatus = 'work_in_progress'
        } catch (contractError: any) {
          console.error('[Phase 5] Failed to create blockchain agreement:', contractError)
          
          // If contract fails, still mark as accepted but don't move to work_in_progress
          // Admin can retry contract creation later
          newStatus = 'accepted'
          
          // Log warning but don't fail the entire request
          console.warn(
            '[Phase 5] Proposal accepted but contract creation failed. ' +
            'Status set to "accepted". Admin must create contract manually.'
          )
        }
      } else {
        // No vesting service configured - just move to accepted
        console.log('[Phase 5] Vesting service not configured. Skipping contract creation.')
        newStatus = 'accepted'
      }
      
      // Update proposal with new status and contract tx hash
      const updateData: Partial<Proposal> = { status: newStatus }
      if (contractTxHash) {
        updateData.contract_agreement_tx = contractTxHash
      }
      
      const { data: updated, error: updateError } = await supabase
        .from('proposals')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()
      
      if (updateError) {
        console.error('Error updating proposal:', updateError)
        throw updateError
      }
      
      // GAMIFICATION: Update stats and check badges (fire and forget)
      Promise.all([
        updateContributorStats(proposal.creator_wallet_address),
        updateActivityStats(proposal.creator_wallet_address),
        checkAndAwardBadges(proposal.creator_wallet_address),
        createActivityEvent(
          proposal.creator_wallet_address,
          'proposal_accepted',
          {
            proposal_id: id,
            proposal_title: proposal.title,
            amount: agreedAmount,
          }
        ),
      ]).catch((error) => {
        console.error('Failed to update gamification stats:', error)
      })
      
      return jsonResponse({ 
        success: true, 
        proposal: updated as Proposal,
        message: contractTxHash 
          ? 'Agreement created on blockchain! You can now start working on the deliverable.'
          : 'Proposal accepted successfully',
        contractTxHash,
      })
      
    } else {
      // Reject action
      newStatus = 'rejected'
      console.log(
        `Pioneer ${wallet} rejected ${proposal.status === 'counter_offer_pending' ? 'counter-offer' : 'approval'} ` +
        `for proposal ${id}`
      )
      
      // Update proposal
      const { data: updated, error: updateError } = await supabase
        .from('proposals')
        .update({ status: newStatus })
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
        message: 'Proposal rejected'
      })
    }
    
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

