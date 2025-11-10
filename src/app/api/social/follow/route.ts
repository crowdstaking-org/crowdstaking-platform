/**
 * Follow API
 * POST /api/social/follow - Follow a user
 * DELETE /api/social/follow - Unfollow a user
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getAuthenticatedWallet } from '@/lib/auth'

/**
 * POST /api/social/follow
 * Follow a user
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const walletAddress = getAuthenticatedWallet(request)
    if (!walletAddress) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const { following_address } = await request.json()

    if (!following_address || !following_address.match(/^0x[a-fA-F0-9]{40}$/)) {
      return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 })
    }

    // Cannot follow yourself
    if (walletAddress.toLowerCase() === following_address.toLowerCase()) {
      return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 })
    }

    // Check if target user allows follows
    const { data: privacy } = await supabase
      .from('profile_privacy')
      .select('allow_follows')
      .eq('wallet_address', following_address)
      .single()

    if (privacy && privacy.allow_follows === false) {
      return NextResponse.json({ error: 'User does not allow follows' }, { status: 403 })
    }

    // Insert follow relationship
    const { error } = await supabase.from('follows').insert({
      follower_address: walletAddress,
      following_address: following_address,
    })

    if (error) {
      if (error.code === '23505') {
        // Unique constraint violation - already following
        return NextResponse.json({ error: 'Already following this user' }, { status: 409 })
      }
      console.error('Error following user:', error)
      return NextResponse.json({ error: 'Failed to follow user' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error following user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE /api/social/follow
 * Unfollow a user
 */
export async function DELETE(request: NextRequest) {
  try {
    // Verify authentication
    const walletAddress = getAuthenticatedWallet(request)
    if (!walletAddress) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get address from query params
    const url = new URL(request.url)
    const following_address = url.searchParams.get('address')

    if (!following_address || !following_address.match(/^0x[a-fA-F0-9]{40}$/)) {
      return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 })
    }

    // Delete follow relationship
    const { error } = await supabase
      .from('follows')
      .delete()
      .eq('follower_address', walletAddress)
      .eq('following_address', following_address)

    if (error) {
      console.error('Error unfollowing user:', error)
      return NextResponse.json({ error: 'Failed to unfollow user' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error unfollowing user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

