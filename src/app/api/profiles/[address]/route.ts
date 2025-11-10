/**
 * Profile API Routes
 * GET /api/profiles/[address] - Get profile with stats
 * PUT /api/profiles/[address] - Update profile (owner only)
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAuth, getAuthenticatedWallet } from '@/lib/auth'

interface RouteParams {
  params: {
    address: string
  }
}

/**
 * GET /api/profiles/[address]
 * Get profile with stats, badges, and privacy-filtered data
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { address } = await params

    // Validate address format
    if (!address || !address.match(/^0x[a-fA-F0-9]{40}$/)) {
      return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 })
    }

    // Increment profile views (fire and forget)
    supabase
      .from('profiles')
      .update({ profile_views: supabase.rpc('increment', { x: 1 }) })
      .eq('wallet_address', address)
      .then(() => {})
      .catch(() => {})

    // Fetch profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('wallet_address', address)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Fetch stats
    const { data: stats } = await supabase
      .from('profile_stats')
      .select('*')
      .eq('wallet_address', address)
      .single()

    // Fetch badges
    const { data: badges } = await supabase
      .from('user_badges')
      .select(
        `
        id,
        badge_id,
        earned_at,
        badge_definitions (
          name,
          description,
          icon_emoji,
          category,
          rarity
        )
      `
      )
      .eq('wallet_address', address)
      .order('earned_at', { ascending: false })

    // Fetch privacy settings
    const { data: privacy } = await supabase
      .from('profile_privacy')
      .select('*')
      .eq('wallet_address', address)
      .single()

    // Apply privacy filters
    const filteredProfile = {
      ...profile,
      wallet_address:
        privacy?.show_wallet_address === false
          ? `${address.slice(0, 6)}...${address.slice(-4)}`
          : address,
      total_earned_tokens: privacy?.show_earnings === false ? null : profile.total_earned_tokens,
    }

    const filteredStats = {
      ...stats,
      total_missions_payout: privacy?.show_earnings === false ? null : stats?.total_missions_payout,
    }

    // Return combined data
    return NextResponse.json({
      profile: filteredProfile,
      stats: filteredStats,
      badges: badges || [],
      privacy: {
        show_wallet_address: privacy?.show_wallet_address !== false,
        show_earnings: privacy?.show_earnings !== false,
        allow_follows: privacy?.allow_follows !== false,
        allow_endorsements: privacy?.allow_endorsements !== false,
      },
    })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * PUT /api/profiles/[address]
 * Update profile (owner only)
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { address } = await params

    // Verify authentication
    const walletAddress = getAuthenticatedWallet(request)
    if (!walletAddress) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user owns this profile
    if (walletAddress.toLowerCase() !== address.toLowerCase()) {
      return NextResponse.json({ error: 'Forbidden: Can only update own profile' }, { status: 403 })
    }

    // Parse request body
    const body = await request.json()

    // Allowed fields to update
    const allowedFields = [
      'display_name',
      'bio',
      'avatar_url',
      'skills',
      'availability_status',
      'github_username',
      'twitter_username',
      'linkedin_url',
      'website_url',
    ]

    // Filter to only allowed fields
    const updates: any = {}
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field]
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    // Add updated_at timestamp
    updates.updated_at = new Date().toISOString()

    // Update profile
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('wallet_address', address)
      .select()
      .single()

    if (error) {
      console.error('Error updating profile:', error)
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }

    return NextResponse.json({ profile: data })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

