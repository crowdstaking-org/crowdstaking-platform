/**
 * Badge Awarder Service
 * Automatically checks and awards badges based on user activity
 */

import { supabase } from '@/lib/supabase'

export interface BadgeCriteria {
  type: string
  threshold?: number
  min_rate?: number
  min_missions?: number
  max_hours?: number
  max_rank?: number
}

/**
 * Check if user meets criteria for a badge
 */
async function checkBadgeCriteria(
  walletAddress: string,
  criteria: BadgeCriteria
): Promise<boolean> {
  const { data: stats } = await supabase
    .from('profile_stats')
    .select('*')
    .eq('wallet_address', walletAddress)
    .single()

  const { data: profile } = await supabase
    .from('profiles')
    .select('created_at')
    .eq('wallet_address', walletAddress)
    .single()

  if (!stats) return false

  switch (criteria.type) {
    case 'missions_completed':
      return stats.missions_completed >= (criteria.threshold || 0)

    case 'fast_completion':
      // Check if any mission was completed in < X hours
      // This would require mission completion timestamps
      // For now, check avg response time
      return (
        stats.avg_response_time_hours !== null &&
        stats.avg_response_time_hours <= (criteria.max_hours || 48)
      )

    case 'completion_rate':
      return (
        stats.completion_rate >= (criteria.min_rate || 0) &&
        stats.proposals_accepted >= (criteria.min_missions || 0)
      )

    case 'projects_created':
      return stats.projects_created >= (criteria.threshold || 0)

    case 'token_launched':
      // Check if user has a project with status 'active' and token on DEX
      // This would require additional project fields
      // For now, just check if they have live projects
      return stats.projects_live >= (criteria.threshold || 0)

    case 'fair_payout':
      // Check if founder has paid out 100% on X missions
      // This would require tracking payout completion
      // For now, check missions created
      return stats.missions_created >= (criteria.min_missions || 0)

    case 'unique_collaborators':
      // Count unique wallet addresses user has worked with
      const { data: proposals } = await supabase
        .from('proposals')
        .select('project_id')
        .eq('creator_wallet_address', walletAddress)
        .eq('status', 'completed')

      if (!proposals) return false

      // Get unique project founders
      const projectIds = [...new Set(proposals.map((p) => p.project_id))]

      const { data: projects } = await supabase
        .from('projects')
        .select('founder_wallet_address')
        .in('id', projectIds)

      const uniqueCollaborators = new Set(projects?.map((p) => p.founder_wallet_address) || [])

      return uniqueCollaborators.size >= (criteria.threshold || 0)

    case 'early_user':
      // Check if user is among first X users
      if (!profile) return false

      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .lt('created_at', profile.created_at)

      return (count || 0) < (criteria.max_rank || 100)

    default:
      return false
  }
}

/**
 * Check and award all eligible badges for a user
 * Returns array of newly awarded badge IDs
 */
export async function checkAndAwardBadges(walletAddress: string): Promise<string[]> {
  try {
    // Get all badge definitions
    const { data: badges } = await supabase
      .from('badge_definitions')
      .select('id, criteria')
      .order('sort_order')

    if (!badges) return []

    // Get already earned badges
    const { data: earnedBadges } = await supabase
      .from('user_badges')
      .select('badge_id')
      .eq('wallet_address', walletAddress)

    const earnedBadgeIds = new Set(earnedBadges?.map((b) => b.badge_id) || [])

    const newlyAwardedBadges: string[] = []

    // Check each badge
    for (const badge of badges) {
      // Skip if already earned
      if (earnedBadgeIds.has(badge.id)) continue

      // Check criteria
      const meetsRequirements = await checkBadgeCriteria(walletAddress, badge.criteria as BadgeCriteria)

      if (meetsRequirements) {
        // Award badge
        const { error } = await supabase.from('user_badges').insert({
          wallet_address: walletAddress,
          badge_id: badge.id,
        })

        if (!error) {
          newlyAwardedBadges.push(badge.id)
        }
      }
    }

    return newlyAwardedBadges
  } catch (error) {
    console.error('Error checking/awarding badges:', error)
    return []
  }
}

/**
 * Award a specific badge to a user (manual award)
 */
export async function awardBadge(
  walletAddress: string,
  badgeId: string
): Promise<boolean> {
  try {
    // Check if badge exists
    const { data: badge } = await supabase
      .from('badge_definitions')
      .select('id')
      .eq('id', badgeId)
      .single()

    if (!badge) {
      console.error(`Badge ${badgeId} not found`)
      return false
    }

    // Award badge (will be ignored if already earned due to UNIQUE constraint)
    const { error } = await supabase.from('user_badges').insert({
      wallet_address: walletAddress,
      badge_id: badgeId,
    })

    return !error
  } catch (error) {
    console.error('Error awarding badge:', error)
    return false
  }
}

/**
 * Get user's earned badges with details
 */
export async function getUserBadges(walletAddress: string) {
  const { data, error } = await supabase
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
    .eq('wallet_address', walletAddress)
    .order('earned_at', { ascending: false })

  if (error) {
    console.error('Error fetching user badges:', error)
    return []
  }

  return data
}

/**
 * Get badge progress for a user (which badges are close to earning)
 */
export async function getBadgeProgress(walletAddress: string) {
  // Get all badges
  const { data: badges } = await supabase
    .from('badge_definitions')
    .select('*')
    .order('sort_order')

  if (!badges) return []

  // Get already earned badges
  const { data: earnedBadges } = await supabase
    .from('user_badges')
    .select('badge_id')
    .eq('wallet_address', walletAddress)

  const earnedBadgeIds = new Set(earnedBadges?.map((b) => b.badge_id) || [])

  // Get current stats
  const { data: stats } = await supabase
    .from('profile_stats')
    .select('*')
    .eq('wallet_address', walletAddress)
    .single()

  if (!stats) return []

  const progress = []

  for (const badge of badges) {
    if (earnedBadgeIds.has(badge.id)) {
      // Already earned
      progress.push({
        badge,
        earned: true,
        progress: 100,
        current: null,
        required: null,
      })
    } else {
      // Calculate progress
      const criteria = badge.criteria as BadgeCriteria
      let current = 0
      let required = 0
      let progressPercent = 0

      switch (criteria.type) {
        case 'missions_completed':
          current = stats.missions_completed
          required = criteria.threshold || 0
          break
        case 'completion_rate':
          current = stats.completion_rate
          required = criteria.min_rate || 0
          break
        case 'projects_created':
          current = stats.projects_created
          required = criteria.threshold || 0
          break
        // Add more cases as needed
      }

      if (required > 0) {
        progressPercent = Math.min(100, (current / required) * 100)
      }

      progress.push({
        badge,
        earned: false,
        progress: progressPercent,
        current,
        required,
      })
    }
  }

  return progress
}

/**
 * Batch check badges for multiple users (used by cron)
 */
export async function batchCheckBadges(walletAddresses: string[]): Promise<{
  checked: number
  awarded: number
}> {
  let checked = 0
  let awarded = 0

  for (const address of walletAddresses) {
    try {
      const newBadges = await checkAndAwardBadges(address)
      checked++
      awarded += newBadges.length
    } catch (error) {
      console.error(`Failed to check badges for ${address}:`, error)
    }
  }

  return { checked, awarded }
}

