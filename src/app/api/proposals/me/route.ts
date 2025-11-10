/**
 * User's Own Proposals API Endpoint
 * GET /api/proposals/me - Returns proposals created by authenticated user
 * Phase 3: Enable users to view their own proposal submissions
 */

import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { successResponse, errorResponse } from '@/lib/api'
import { requireAuth } from '@/lib/auth'

/**
 * GET /api/proposals/me
 * Retrieves all proposals created by the authenticated user
 * 
 * Required: Authentication via session cookie
 * Returns: Array of proposals with creator profile data sorted by created_at DESC
 */
export async function GET(request: NextRequest) {
  try {
    // Authenticate user and get wallet address
    const wallet = requireAuth(request)
    
    // Query proposals by creator with profile join
    // Note: We try to use foreign key join, but fall back to manual if needed
    const { data, error } = await supabase
      .from('proposals')
      .select(`
        *,
        creator:profiles!proposals_creator_wallet_address_fkey (
          wallet_address,
          display_name,
          avatar_url,
          trust_score
        )
      `)
      .eq('creator_wallet_address', wallet)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Database error fetching user proposals:', error)
      // If the join failed due to missing FK, try without it
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('proposals')
        .select('*')
        .eq('creator_wallet_address', wallet)
        .order('created_at', { ascending: false })
      
      if (fallbackError) {
        return errorResponse('Failed to fetch your proposals', 500)
      }
      
      // Fetch profile separately
      const { data: profileData } = await supabase
        .from('profiles')
        .select('wallet_address, display_name, avatar_url, trust_score')
        .eq('wallet_address', wallet)
        .single()
      
      // Attach profile to all proposals
      const proposalsWithProfile = fallbackData?.map(p => ({
        ...p,
        creator: profileData || undefined
      }))
      
      return successResponse({
        proposals: proposalsWithProfile || [],
        count: proposalsWithProfile?.length || 0
      })
    }
    
    return successResponse({
      proposals: data || [],
      count: data?.length || 0
    })
    
  } catch (error) {
    console.error('User proposals fetch error:', error)
    
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return errorResponse(error.message, 401)
    }
    
    return errorResponse('Failed to fetch proposals', 500)
  }
}

