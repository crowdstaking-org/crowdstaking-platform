/**
 * Followers API
 * GET /api/social/followers/[address] - Get followers list
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

interface RouteParams {
  params: {
    address: string
  }
}

/**
 * GET /api/social/followers/[address]
 * Get list of followers
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { address } = await params

    // Validate address
    if (!address || !address.match(/^0x[a-fA-F0-9]{40}$/)) {
      return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 })
    }

    // Get followers with profile info
    const { data, error } = await supabase
      .from('follows')
      .select(
        `
        follower_address,
        created_at,
        profiles:follower_address (
          wallet_address,
          display_name,
          avatar_url,
          bio,
          trust_score
        )
      `
      )
      .eq('following_address', address)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching followers:', error)
      return NextResponse.json({ error: 'Failed to fetch followers' }, { status: 500 })
    }

    return NextResponse.json({ followers: data || [] })
  } catch (error) {
    console.error('Error fetching followers:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

