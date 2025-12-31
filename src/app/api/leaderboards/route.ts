/**
 * Leaderboards API
 * GET /api/leaderboards?type=contributors&period=all
 * Types: contributors, founders, rising_stars
 * Period: week, month, all
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * GET /api/leaderboards
 * Get leaderboard data based on type and period
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const type = url.searchParams.get('type') || 'contributors'
    const period = url.searchParams.get('period') || 'all'
    const limit = parseInt(url.searchParams.get('limit') || '100')

    // Validate parameters
    if (!['contributors', 'founders', 'rising_stars'].includes(type)) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    if (!['week', 'month', 'all'].includes(period)) {
      return NextResponse.json({ error: 'Invalid period' }, { status: 400 })
    }

    let data
    let error

    switch (type) {
      case 'contributors':
        ;({ data, error } = await getContributorsLeaderboard(period, limit))
        break
      case 'founders':
        ;({ data, error } = await getFoundersLeaderboard(period, limit))
        break
      case 'rising_stars':
        ;({ data, error } = await getRisingStarsLeaderboard(period, limit))
        break
    }

    if (error) {
      console.error('Error fetching leaderboard:', error)
      return NextResponse.json({ error: error.message || 'Failed to fetch leaderboard' }, { status: 500 })
    }

    return NextResponse.json({ data: data || [] })
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * Get contributors leaderboard (sorted by missions completed)
 */
async function getContributorsLeaderboard(period: string, limit: number) {
  let query = supabase
    .from('profile_stats')
    .select(
      `
      wallet_address,
      missions_completed,
      proposals_completed,
      completion_rate,
      last_active_at
    `
    )
    .gt('missions_completed', 0)
    .order('missions_completed', { ascending: false })
    .limit(limit)

  // Apply period filter
  if (period !== 'all') {
    const daysAgo = period === 'week' ? 7 : 30
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysAgo)

    query = query.gte('last_active_at', cutoffDate.toISOString())
  }

  const { data, error } = await query
  
  if (error || !data) return { data: [], error }

  // Manually fetch profiles
  const addresses = data.map(d => d.wallet_address)
  
  const { data: profiles } = await supabase
    .from('profiles')
    .select('wallet_address, display_name, avatar_url, trust_score, bio')
    .in('wallet_address', addresses)
    
  // Map profiles
  const profileMap = new Map((profiles || []).map(p => [p.wallet_address, p]))

  const flattenedData = data.map(item => {
    const profile = profileMap.get(item.wallet_address)
    
    return {
      wallet_address: item.wallet_address,
      missions_completed: item.missions_completed,
      proposals_completed: item.proposals_completed,
      completion_rate: item.completion_rate,
      last_active_at: item.last_active_at,
      display_name: profile?.display_name,
      avatar_url: profile?.avatar_url,
      bio: profile?.bio,
      trust_score: profile?.trust_score,
    }
  })

  return { data: flattenedData, error: null }
}

/**
 * Get founders leaderboard (sorted by projects live + mission payout)
 */
async function getFoundersLeaderboard(period: string, limit: number) {
  let query = supabase
    .from('profile_stats')
    .select(
      `
      wallet_address,
      projects_created,
      projects_live,
      missions_created,
      total_missions_payout,
      last_active_at
    `
    )
    .gt('projects_created', 0)
    .order('projects_live', { ascending: false })
    .order('total_missions_payout', { ascending: false })
    .limit(limit)

  // Apply period filter
  if (period !== 'all') {
    const daysAgo = period === 'week' ? 7 : 30
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysAgo)

    query = query.gte('last_active_at', cutoffDate.toISOString())
  }

  const { data, error } = await query
  
  if (error || !data) return { data: [], error }

  // Manually fetch profiles
  const addresses = data.map(d => d.wallet_address)
  
  const { data: profiles } = await supabase
    .from('profiles')
    .select('wallet_address, display_name, avatar_url, trust_score, bio')
    .in('wallet_address', addresses)
    
  // Map profiles
  const profileMap = new Map((profiles || []).map(p => [p.wallet_address, p]))

  const flattenedData = data.map(item => {
    const profile = profileMap.get(item.wallet_address)
    
    return {
      wallet_address: item.wallet_address,
      projects_created: item.projects_created,
      projects_live: item.projects_live,
      missions_created: item.missions_created,
      total_missions_payout: item.total_missions_payout,
      last_active_at: item.last_active_at,
      display_name: profile?.display_name,
      avatar_url: profile?.avatar_url,
      bio: profile?.bio,
      trust_score: profile?.trust_score,
    }
  })

  return { data: flattenedData, error: null }
}

/**
 * Get rising stars leaderboard (new users with high activity)
 */
async function getRisingStarsLeaderboard(period: string, limit: number) {
  // Rising stars are users created in last 30 days with high activity
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  // Get recently created profiles
  const profilesQuery = supabase
    .from('profiles')
    .select(
      `
      wallet_address,
      display_name,
      avatar_url,
      bio,
      trust_score,
      created_at
    `
    )
    .gte('created_at', thirtyDaysAgo.toISOString())
    .order('created_at', { ascending: false })
    .limit(limit * 2) // Fetch more to allow filtering by activity

  const { data: profiles, error: profilesError } = await profilesQuery

  if (profilesError || !profiles) {
    return { data: null, error: profilesError }
  }

  // Manually fetch stats for these profiles
  const addresses = profiles.map(p => p.wallet_address)
  
  const { data: stats, error: statsError } = await supabase
    .from('profile_stats')
    .select('*')
    .in('wallet_address', addresses)

  if (statsError) {
    return { data: null, error: statsError }
  }

  // Map stats
  const statsMap = new Map((stats || []).map(s => [s.wallet_address, s]))

  // Combine data
  const combinedData = profiles.map(profile => {
    const stat = statsMap.get(profile.wallet_address) || {}
    return {
      ...profile,
      profile_stats: stat
    }
  })

  // Sort by activity score (custom calculation)
  const sortedData = combinedData.sort((a, b) => {
    const scoreA = calculateActivityScore(a.profile_stats)
    const scoreB = calculateActivityScore(b.profile_stats)
    return scoreB - scoreA
  })
  
  // Apply limit after sorting
  return { data: sortedData.slice(0, limit), error: null }
}

/**
 * Calculate activity score for rising stars
 */
function calculateActivityScore(stats: any): number {
  if (!stats) return 0

  return (
    (stats.missions_completed || 0) * 10 +
    (stats.proposals_submitted || 0) * 5 +
    (stats.projects_created || 0) * 20 +
    (stats.total_activity_days || 0) * 2 +
    (stats.streak_days || 0) * 3
  )
}

