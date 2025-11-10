/**
 * Admin Proposals API
 * GET /api/proposals/admin - Fetch all proposals for admin review
 * 
 * PHASE 4: Admin panel to review and manage proposals
 */

import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { jsonResponse, errorResponse } from '@/lib/api'
import { requireAdmin } from '@/lib/auth'
import type { Proposal } from '@/types/proposal'

/**
 * GET /api/proposals/admin
 * 
 * Fetches all proposals for admin review
 * Requires admin authentication
 * 
 * Query params:
 * - status: Filter by status (optional)
 * 
 * @returns All proposals sorted by created_at DESC
 */
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    requireAdmin(request)
    
    // Get optional status filter
    const { searchParams } = new URL(request.url)
    const statusFilter = searchParams.get('status')
    
    // Build query with profile join
    let query = supabase
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
      .order('created_at', { ascending: false })
    
    // Apply status filter if provided
    if (statusFilter) {
      query = query.eq('status', statusFilter)
    }
    
    // Execute query
    const { data, error } = await query
    
    // If join failed, fall back to manual profile loading
    if (error) {
      console.warn('Foreign key join failed, falling back to manual profile loading:', error)
      
      let fallbackQuery = supabase
        .from('proposals')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (statusFilter) {
        fallbackQuery = fallbackQuery.eq('status', statusFilter)
      }
      
      const { data: proposals, error: proposalsError } = await fallbackQuery
      
      if (proposalsError) {
        console.error('Error fetching proposals:', proposalsError)
        throw proposalsError
      }
      
      // Get unique creator addresses
      const creatorAddresses = [...new Set(proposals?.map(p => p.creator_wallet_address) || [])]
      
      // Fetch all creator profiles in one query
      const { data: profiles } = await supabase
        .from('profiles')
        .select('wallet_address, display_name, avatar_url, trust_score')
        .in('wallet_address', creatorAddresses)
      
      // Create a map for quick lookup
      const profileMap = new Map(profiles?.map(p => [p.wallet_address, p]))
      
      // Attach profiles to proposals
      const proposalsWithProfiles = proposals?.map(p => ({
        ...p,
        creator: profileMap.get(p.creator_wallet_address) || undefined
      }))
      
      return jsonResponse({ 
        success: true, 
        proposals: proposalsWithProfiles as Proposal[],
        count: proposalsWithProfiles?.length || 0
      })
    }
    
    return jsonResponse({ 
      success: true, 
      proposals: data as Proposal[],
      count: data?.length || 0
    })
    
  } catch (error: any) {
    // Handle authorization errors
    if (error.message?.includes('Forbidden') || error.message?.includes('Unauthorized')) {
      return errorResponse(error.message, 403)
    }
    
    // Handle other errors
    console.error('Admin proposals API error:', error)
    return errorResponse(
      error.message || 'Failed to fetch proposals',
      500
    )
  }
}

