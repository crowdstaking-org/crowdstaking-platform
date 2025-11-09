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
 * Returns: Array of proposals sorted by created_at DESC
 */
export async function GET(request: NextRequest) {
  try {
    // Authenticate user and get wallet address
    const wallet = requireAuth(request)
    
    // Query proposals by creator
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .eq('creator_wallet_address', wallet)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Database error fetching user proposals:', error)
      return errorResponse('Failed to fetch your proposals', 500)
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

