/**
 * Following API
 * GET /api/social/following/[address] - Get following list
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * GET /api/social/following/[address]
 * Get list of users this address is following
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params

    // Validate address
    if (!address || !address.match(/^0x[a-fA-F0-9]{40}$/)) {
      return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 })
    }

    // Get following with profile info
    const { data, error } = await supabase
      .from('follows')
      .select(
        `
        following_address,
        created_at,
        profiles:following_address (
          wallet_address,
          display_name,
          avatar_url,
          bio,
          trust_score
        )
      `
      )
      .eq('follower_address', address)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching following:', error)
      return NextResponse.json({ error: 'Failed to fetch following' }, { status: 500 })
    }

    return NextResponse.json({ following: data || [] })
  } catch (error) {
    console.error('Error fetching following:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

