/**
 * Stats Updater Service
 * Updates cached statistics in profile_stats table
 */

import { supabase } from '@/lib/supabase'
import { calculateTrustScore } from './trustScore'

/**
 * Update contributor stats after proposal status changes
 */
export async function updateContributorStats(
  walletAddress: string
): Promise<void> {
  try {
    // Count proposals by status
    const { data: proposals } = await supabase
      .from('proposals')
      .select('status, created_at, updated_at')
      .eq('creator_wallet_address', walletAddress)

    if (!proposals) return

    const stats = {
      proposals_submitted: proposals.length,
      proposals_accepted: proposals.filter(
        (p) => p.status === 'accepted' || p.status === 'in_progress' || p.status === 'completed'
      ).length,
      proposals_completed: proposals.filter((p) => p.status === 'completed').length,
    }

    // Calculate completion rate
    const completionRate =
      stats.proposals_accepted > 0
        ? (stats.proposals_completed / stats.proposals_accepted) * 100
        : 0

    // Calculate average response time (created_at to first acceptance)
    const acceptedProposals = proposals.filter((p) => p.status !== 'pending')
    let avgResponseTimeHours = null

    if (acceptedProposals.length > 0) {
      const totalResponseTime = acceptedProposals.reduce((sum, proposal) => {
        const responseTime =
          new Date(proposal.updated_at).getTime() -
          new Date(proposal.created_at).getTime()
        return sum + responseTime
      }, 0)

      avgResponseTimeHours = totalResponseTime / acceptedProposals.length / (1000 * 60 * 60)
    }

    // Update profile_stats
    const { error } = await supabase
      .from('profile_stats')
      .update({
        proposals_submitted: stats.proposals_submitted,
        proposals_accepted: stats.proposals_accepted,
        proposals_completed: stats.proposals_completed,
        completion_rate: completionRate,
        avg_response_time_hours: avgResponseTimeHours,
        updated_at: new Date().toISOString(),
      })
      .eq('wallet_address', walletAddress)

    if (error) {
      console.error('Failed to update contributor stats:', error)
    }

    // Recalculate trust score
    await recalculateTrustScore(walletAddress)
  } catch (error) {
    console.error('Error updating contributor stats:', error)
    throw error
  }
}

/**
 * Update founder stats after project/mission changes
 */
export async function updateFounderStats(walletAddress: string): Promise<void> {
  try {
    // Count projects
    const { data: projects } = await supabase
      .from('projects')
      .select('id, status')
      .eq('founder_wallet_address', walletAddress)

    const projectsCreated = projects?.length || 0
    const projectsLive = projects?.filter((p) => p.status === 'active').length || 0

    // Count missions and calculate total payout
    const { data: missions } = await supabase
      .from('missions')
      .select('id, token_amount')
      .in(
        'project_id',
        projects?.map((p) => p.id) || []
      )

    const missionsCreated = missions?.length || 0
    const totalMissionsPayout = missions?.reduce((sum, m) => sum + (Number(m.token_amount) || 0), 0) || 0

    // Update profile_stats
    const { error } = await supabase
      .from('profile_stats')
      .update({
        projects_created: projectsCreated,
        projects_live: projectsLive,
        missions_created: missionsCreated,
        total_missions_payout: totalMissionsPayout,
        updated_at: new Date().toISOString(),
      })
      .eq('wallet_address', walletAddress)

    if (error) {
      console.error('Failed to update founder stats:', error)
    }

    // Recalculate trust score
    await recalculateTrustScore(walletAddress)
  } catch (error) {
    console.error('Error updating founder stats:', error)
    throw error
  }
}

/**
 * Update social stats (called by database triggers, but can be called manually)
 */
export async function updateSocialStats(walletAddress: string): Promise<void> {
  try {
    // Count followers
    const { count: followersCount } = await supabase
      .from('follows')
      .select('*', { count: 'exact', head: true })
      .eq('following_address', walletAddress)

    // Count following
    const { count: followingCount } = await supabase
      .from('follows')
      .select('*', { count: 'exact', head: true })
      .eq('follower_address', walletAddress)

    // Count endorsements
    const { count: endorsementsCount } = await supabase
      .from('endorsements')
      .select('*', { count: 'exact', head: true })
      .eq('endorsed_address', walletAddress)

    // Update profile_stats
    const { error } = await supabase
      .from('profile_stats')
      .update({
        followers_count: followersCount || 0,
        following_count: followingCount || 0,
        endorsements_count: endorsementsCount || 0,
        updated_at: new Date().toISOString(),
      })
      .eq('wallet_address', walletAddress)

    if (error) {
      console.error('Failed to update social stats:', error)
    }

    // Recalculate trust score (endorsements affect trust)
    await recalculateTrustScore(walletAddress)
  } catch (error) {
    console.error('Error updating social stats:', error)
    throw error
  }
}

/**
 * Update activity stats (last active, streaks)
 */
export async function updateActivityStats(walletAddress: string): Promise<void> {
  try {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    // Get last active date
    const { data: stats } = await supabase
      .from('profile_stats')
      .select('last_active_at, streak_days, total_activity_days')
      .eq('wallet_address', walletAddress)
      .single()

    if (!stats) return

    const lastActive = stats.last_active_at ? new Date(stats.last_active_at) : null
    const lastActiveDate = lastActive
      ? new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate())
      : null

    let streakDays = stats.streak_days || 0
    let totalActivityDays = stats.total_activity_days || 0

    // Check if this is a new activity day
    if (!lastActiveDate || lastActiveDate < today) {
      // New activity day
      totalActivityDays++

      // Check streak
      if (lastActiveDate) {
        const daysSinceLastActive = Math.floor(
          (today.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24)
        )

        if (daysSinceLastActive === 1) {
          // Consecutive day - continue streak
          streakDays++
        } else if (daysSinceLastActive > 1) {
          // Streak broken - reset
          streakDays = 1
        }
      } else {
        // First activity
        streakDays = 1
      }
    }

    // Update profile_stats
    const { error } = await supabase
      .from('profile_stats')
      .update({
        last_active_at: now.toISOString(),
        streak_days: streakDays,
        total_activity_days: totalActivityDays,
        updated_at: now.toISOString(),
      })
      .eq('wallet_address', walletAddress)

    if (error) {
      console.error('Failed to update activity stats:', error)
    }
  } catch (error) {
    console.error('Error updating activity stats:', error)
    throw error
  }
}

/**
 * Recalculate trust score
 */
export async function recalculateTrustScore(walletAddress: string): Promise<void> {
  try {
    const trustScore = await calculateTrustScore(walletAddress)

    const { error } = await supabase
      .from('profiles')
      .update({ trust_score: trustScore })
      .eq('wallet_address', walletAddress)

    if (error) {
      console.error('Failed to update trust score:', error)
    }
  } catch (error) {
    console.error('Error recalculating trust score:', error)
    throw error
  }
}

/**
 * Update total earned tokens (called after mission completion)
 */
export async function updateTotalEarnings(
  walletAddress: string,
  tokenAmount: number
): Promise<void> {
  try {
    // Increment total earned tokens
    const { error } = await supabase.rpc('increment_earned_tokens', {
      p_wallet_address: walletAddress,
      p_amount: tokenAmount,
    })

    // Fallback if RPC doesn't exist
    if (error) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('total_earned_tokens')
        .eq('wallet_address', walletAddress)
        .single()

      if (profile) {
        await supabase
          .from('profiles')
          .update({
            total_earned_tokens: (profile.total_earned_tokens || 0) + tokenAmount,
          })
          .eq('wallet_address', walletAddress)
      }
    }

    // Recalculate trust score (token holdings affect trust)
    await recalculateTrustScore(walletAddress)
  } catch (error) {
    console.error('Error updating total earnings:', error)
    throw error
  }
}

/**
 * Comprehensive stats update (all categories)
 */
export async function updateAllStats(walletAddress: string): Promise<void> {
  await Promise.all([
    updateContributorStats(walletAddress),
    updateFounderStats(walletAddress),
    updateSocialStats(walletAddress),
    updateActivityStats(walletAddress),
  ])
}

