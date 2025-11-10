/**
 * Endorsement API
 * POST /api/social/endorse - Endorse a user's skill
 * GET /api/social/endorsements/[address] - Get endorsements for a user
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getAuthenticatedWallet } from '@/lib/auth'
import { createActivityEvent } from '@/lib/gamification/activityLogger'

/**
 * POST /api/social/endorse
 * Endorse a user's skill
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const walletAddress = getAuthenticatedWallet(request)
    if (!walletAddress) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const { endorsed_address, skill, message } = await request.json()

    if (!endorsed_address || !endorsed_address.match(/^0x[a-fA-F0-9]{40}$/)) {
      return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 })
    }

    if (!skill || skill.length < 2 || skill.length > 50) {
      return NextResponse.json({ error: 'Invalid skill (2-50 characters)' }, { status: 400 })
    }

    // Cannot endorse yourself
    if (walletAddress.toLowerCase() === endorsed_address.toLowerCase()) {
      return NextResponse.json({ error: 'Cannot endorse yourself' }, { status: 400 })
    }

    // Check if target user allows endorsements
    const { data: privacy } = await supabase
      .from('profile_privacy')
      .select('allow_endorsements')
      .eq('wallet_address', endorsed_address)
      .single()

    if (privacy && privacy.allow_endorsements === false) {
      return NextResponse.json({ error: 'User does not allow endorsements' }, { status: 403 })
    }

    // Insert endorsement
    const { error } = await supabase.from('endorsements').insert({
      endorser_address: walletAddress,
      endorsed_address: endorsed_address,
      skill: skill,
      message: message || null,
    })

    if (error) {
      if (error.code === '23505') {
        // Already endorsed this skill
        return NextResponse.json({ error: 'Already endorsed this skill' }, { status: 409 })
      }
      console.error('Error endorsing user:', error)
      return NextResponse.json({ error: 'Failed to endorse user' }, { status: 500 })
    }

    // Create activity event for endorsed user
    try {
      await createActivityEvent(endorsed_address, 'endorsement_received', {
        endorser_address: walletAddress,
        skill: skill,
        message: message,
      })
    } catch (err) {
      // Non-fatal error
      console.error('Failed to create activity event:', err)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error endorsing user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

