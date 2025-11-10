/**
 * Privacy Settings API
 * GET /api/profiles/privacy - Get privacy settings
 * PUT /api/profiles/privacy - Update privacy settings
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAuth, getAuthenticatedWallet } from '@/lib/auth'

/**
 * GET /api/profiles/privacy
 * Get privacy settings for authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const walletAddress = getAuthenticatedWallet(request)
    if (!walletAddress) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch privacy settings
    const { data, error } = await supabase
      .from('profile_privacy')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single()

    if (error) {
      console.error('Error fetching privacy settings:', error)
      return NextResponse.json({ error: 'Failed to fetch privacy settings' }, { status: 500 })
    }

    return NextResponse.json({ privacy: data })
  } catch (error) {
    console.error('Error fetching privacy:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * PUT /api/profiles/privacy
 * Update privacy settings
 */
export async function PUT(request: NextRequest) {
  try {
    // Verify authentication
    const walletAddress = getAuthenticatedWallet(request)
    if (!walletAddress) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()

    // Allowed fields
    const allowedFields = [
      'show_token_holdings',
      'show_earnings',
      'show_wallet_address',
      'show_activity_feed',
      'show_github_activity',
      'allow_follows',
      'allow_endorsements',
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

    // Update privacy settings
    const { data, error } = await supabase
      .from('profile_privacy')
      .update(updates)
      .eq('wallet_address', walletAddress)
      .select()
      .single()

    if (error) {
      console.error('Error updating privacy settings:', error)
      return NextResponse.json({ error: 'Failed to update privacy settings' }, { status: 500 })
    }

    return NextResponse.json({ privacy: data })
  } catch (error) {
    console.error('Error updating privacy:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

