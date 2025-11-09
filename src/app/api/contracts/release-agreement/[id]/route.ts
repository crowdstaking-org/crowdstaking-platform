/**
 * Release Agreement API
 * POST /api/contracts/release-agreement/:id - Admin releases tokens to pioneer
 * 
 * PHASE 5: Admin verifies work and releases escrowed tokens via smart contract
 */

import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { jsonResponse, errorResponse } from '@/lib/api'
import { requireAdmin } from '@/lib/auth'
import { getVestingService, isVestingServiceAvailable } from '@/lib/contracts/vestingService'
import type { Proposal } from '@/types/proposal'

/**
 * POST /api/contracts/release-agreement/:id
 * 
 * Allows admin to release escrowed tokens after verifying work completion
 * Calls smart contract releaseAgreement() function
 * 
 * Requirements:
 * - Must be admin
 * - Proposal status must be 'work_in_progress'
 * - Pioneer must have confirmed work completion
 * - Vesting service must be configured
 * 
 * @param request - Request object with admin auth
 * @param params - URL params with proposal ID
 * @returns Updated proposal with completed status
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params (Next.js 16 change)
    const { id } = await params

    // Verify admin authentication
    const admin = requireAdmin(request)
    
    console.log(`[Release Agreement] Admin ${admin} releasing tokens for proposal ${id}`)
    
    // Check if vesting service is available
    if (!isVestingServiceAvailable()) {
      console.error('[Release Agreement] Vesting service not configured')
      return errorResponse(
        'Smart contract integration not configured. Cannot release tokens.',
        503
      )
    }
    
    // Get proposal
    const { data: proposal, error: fetchError } = await supabase
      .from('proposals')
      .select('*')
      .eq('id', id)
      .single()
    
    if (fetchError || !proposal) {
      console.error('[Release Agreement] Proposal not found:', id)
      return errorResponse('Proposal not found', 404)
    }
    
    // Verify status is work_in_progress
    if (proposal.status !== 'work_in_progress') {
      console.error('[Release Agreement] Invalid status:', proposal.status)
      return errorResponse(
        `Cannot release agreement for proposal in status: ${proposal.status}. Must be "work_in_progress".`,
        400
      )
    }
    
    // Verify pioneer confirmed work
    if (!proposal.pioneer_confirmed_at) {
      console.error('[Release Agreement] Pioneer has not confirmed work')
      return errorResponse(
        'Pioneer has not confirmed work completion yet. Cannot release tokens.',
        400
      )
    }
    
    // Check if already released
    if (proposal.contract_release_tx) {
      console.error('[Release Agreement] Already released:', proposal.contract_release_tx)
      return errorResponse('Tokens have already been released for this proposal', 400)
    }
    
    // Verify agreement exists on blockchain
    if (!proposal.contract_agreement_tx) {
      console.error('[Release Agreement] No blockchain agreement found')
      return errorResponse(
        'No blockchain agreement found for this proposal. Cannot release.',
        400
      )
    }
    
    // Release tokens via smart contract
    let txHash: string
    try {
    // Await params (Next.js 16 change)
    const { id } = await params

      console.log('[Release Agreement] Calling smart contract...')
      const vestingService = getVestingService()
      txHash = await vestingService.releaseAgreement(id)
      console.log('[Release Agreement] Tokens released on blockchain:', txHash)
    } catch (contractError: any) {
      console.error('[Release Agreement] Smart contract call failed:', contractError)
      return errorResponse(
        `Failed to release tokens on blockchain: ${contractError.message}`,
        500
      )
    }
    
    // Update DB with completed status and release tx hash
    const { data: updated, error: updateError } = await supabase
      .from('proposals')
      .update({
        status: 'completed',
        contract_release_tx: txHash,
      })
      .eq('id', id)
      .select()
      .single()
    
    if (updateError) {
      console.error('[Release Agreement] DB update failed:', updateError)
      
      // Note: Tokens are already released on blockchain at this point
      // Log critical error but don't fail the request
      console.error(
        '[Release Agreement] CRITICAL: Tokens released on blockchain but DB update failed!',
        {
          proposalId: id,
          txHash,
          error: updateError,
        }
      )
      
      // Still return success since blockchain operation completed
      return jsonResponse({
        success: true,
        txHash,
        warning: 'Tokens released successfully but database update failed. Please update manually.',
        message: 'Tokens released to contributor!',
      })
    }
    
    console.log('[Release Agreement] Success:', {
      proposalId: id,
      txHash,
      status: 'completed',
    })
    
    // Get block explorer URL
    const networkIsTestnet = !!process.env.BASE_SEPOLIA_RPC_URL
    const explorerUrl = networkIsTestnet
      ? `https://sepolia.basescan.org/tx/${txHash}`
      : `https://basescan.org/tx/${txHash}`
    
    return jsonResponse({ 
      success: true, 
      proposal: updated as Proposal,
      txHash,
      explorerUrl,
      message: 'Tokens released to contributor successfully!',
    })
    
  } catch (error: any) {
    // Handle authorization errors
    if (error.message?.includes('Forbidden') || error.message?.includes('Unauthorized')) {
      return errorResponse(error.message, 403)
    }
    
    // Handle other errors
    console.error('[Release Agreement] API error:', error)
    return errorResponse(
      error.message || 'Failed to release agreement',
      500
    )
  }
}

