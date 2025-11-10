/**
 * Discover Contributors API
 * GET /api/discover/contributors?skill=React&minTrustScore=70&availability=open
 * Helps founders discover contributors by skill and availability
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * GET /api/discover/contributors
 * Discover contributors by skills, trust score, availability
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)

    // Parse query parameters
    const skill = url.searchParams.get('skill')
    const minTrustScore = parseInt(url.searchParams.get('minTrustScore') || '0')
    const availability = url.searchParams.get('availability') // 'open', 'busy', 'unavailable'
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '20')

    // Calculate pagination
    const offset = (page - 1) * limit

    // Build query
    let query = supabase
      .from('profiles')
      .select(
        `
        wallet_address,
        display_name,
        avatar_url,
        bio,
        skills,
        availability_status,
        trust_score,
        profile_views,
        profile_stats!inner (
          missions_completed,
          completion_rate,
          endorsements_count,
          last_active_at
        )
      `,
        { count: 'exact' }
      )
      .gte('trust_score', minTrustScore)

    // Filter by skill (if provided)
    if (skill) {
      query = query.contains('skills', [skill])
    }

    // Filter by availability (if provided)
    if (availability) {
      query = query.eq('availability_status', availability)
    }

    // Only show contributors with at least some activity
    query = query.gt('profile_stats.missions_completed', 0)

    // Sort by trust score (desc) and last active
    query = query
      .order('trust_score', { ascending: false })
      .range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('Error discovering contributors:', error)
      return NextResponse.json({ error: 'Failed to discover contributors' }, { status: 500 })
    }

    return NextResponse.json({
      contributors: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error('Error discovering contributors:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

