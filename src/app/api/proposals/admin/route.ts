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
    
    // Build query
    let query = supabase
      .from('proposals')
      .select('*')
      .order('created_at', { ascending: false })
    
    // Apply status filter if provided
    if (statusFilter) {
      query = query.eq('status', statusFilter)
    }
    
    // Execute query
    const { data, error } = await query
    
    if (error) {
      console.error('Error fetching proposals:', error)
      throw error
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

