/**
 * User Activity Timeline API
 * GET /api/profiles/[address]/activity
 * 
 * Returns activity events for a user's profile
 * Respects privacy settings
 */

import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { successResponse, errorResponse } from '@/lib/api'
import { getAuthenticatedWallet } from '@/lib/auth'

/**
 * GET /api/profiles/[address]/activity
 * 
 * Fetches activity timeline for a user
 * Shows only public activities unless viewing own profile
 * 
 * Query params:
 * - limit: Number of activities to return (default: 20, max: 100)
 * - offset: Pagination offset (default: 0)
 * 
 * @returns Activity events sorted by created_at DESC
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await context.params
    const { searchParams } = new URL(request.url)
    
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const offset = parseInt(searchParams.get('offset') || '0')
    
    // Check if viewing own profile
    const authenticatedWallet = getAuthenticatedWallet(request)
    const isOwnProfile = authenticatedWallet?.toLowerCase() === address.toLowerCase()
    
    // Build query
    let query = supabase
      .from('activity_events')
      .select('*')
      .eq('wallet_address', address)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    
    // Only show public activities unless viewing own profile
    if (!isOwnProfile) {
      query = query.eq('is_public', true)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error fetching activities:', error)
      throw error
    }
    
    return successResponse({
      activities: data || [],
      count: data?.length || 0,
      hasMore: data && data.length === limit
    })
    
  } catch (error: any) {
    console.error('Activity API error:', error)
    return errorResponse(
      error.message || 'Failed to fetch activities',
      500
    )
  }
}

