/**
 * Trust Score Calculation
 * Calculates user reputation score based on multiple factors
 */

import { supabase } from '@/lib/supabase'

export interface TrustScoreFactors {
  completionRate: number      // 30% weight - Proposals completed vs accepted
  responseTime: number         // 20% weight - Average response time
  endorsements: number         // 25% weight - Community endorsements
  tokenHoldings: number        // 15% weight - Skin in the game
  timeOnPlatform: number       // 10% weight - Account age
}

export interface TrustScoreBreakdown {
  totalScore: number
  factors: TrustScoreFactors
  weights: {
    completionRate: number
    responseTime: number
    endorsements: number
    tokenHoldings: number
    timeOnPlatform: number
  }
}

/**
 * Calculate Trust Score for a user (0-100)
 */
export async function calculateTrustScore(
  walletAddress: string
): Promise<number> {
  const breakdown = await calculateTrustScoreWithBreakdown(walletAddress)
  return Math.round(breakdown.totalScore)
}

/**
 * Calculate Trust Score with detailed breakdown
 */
export async function calculateTrustScoreWithBreakdown(
  walletAddress: string
): Promise<TrustScoreBreakdown> {
  // Fetch user data
  const { data: profile } = await supabase
    .from('profiles')
    .select('created_at, total_earned_tokens')
    .eq('wallet_address', walletAddress)
    .single()

  const { data: stats } = await supabase
    .from('profile_stats')
    .select('*')
    .eq('wallet_address', walletAddress)
    .single()

  if (!profile || !stats) {
    // Default score for new users
    return {
      totalScore: 50,
      factors: {
        completionRate: 50,
        responseTime: 50,
        endorsements: 0,
        tokenHoldings: 0,
        timeOnPlatform: 0,
      },
      weights: getWeights(),
    }
  }

  // Calculate each factor
  const factors: TrustScoreFactors = {
    completionRate: calculateCompletionRateFactor(stats),
    responseTime: calculateResponseTimeFactor(stats),
    endorsements: calculateEndorsementsFactor(stats),
    tokenHoldings: calculateTokenHoldingsFactor(profile.total_earned_tokens),
    timeOnPlatform: calculateTimeOnPlatformFactor(profile.created_at),
  }

  const weights = getWeights()

  // Calculate weighted total
  const totalScore =
    factors.completionRate * weights.completionRate +
    factors.responseTime * weights.responseTime +
    factors.endorsements * weights.endorsements +
    factors.tokenHoldings * weights.tokenHoldings +
    factors.timeOnPlatform * weights.timeOnPlatform

  return {
    totalScore: Math.min(100, Math.max(0, totalScore)),
    factors,
    weights,
  }
}

/**
 * Get factor weights (sum = 1.0)
 */
function getWeights() {
  return {
    completionRate: 0.30,
    responseTime: 0.20,
    endorsements: 0.25,
    tokenHoldings: 0.15,
    timeOnPlatform: 0.10,
  }
}

/**
 * Completion Rate Factor (0-100)
 * Based on proposals_completed / proposals_accepted
 */
function calculateCompletionRateFactor(stats: any): number {
  if (stats.proposals_accepted === 0) {
    return 50 // Neutral score for new users
  }

  const rate = (stats.proposals_completed / stats.proposals_accepted) * 100

  // Bonus for high completion rate with many proposals
  let bonus = 0
  if (rate >= 90 && stats.proposals_accepted >= 5) {
    bonus = 10
  } else if (rate >= 80 && stats.proposals_accepted >= 3) {
    bonus = 5
  }

  return Math.min(100, rate + bonus)
}

/**
 * Response Time Factor (0-100)
 * Lower response time = higher score
 */
function calculateResponseTimeFactor(stats: any): number {
  if (!stats.avg_response_time_hours || stats.proposals_submitted === 0) {
    return 50 // Neutral for new users
  }

  const hours = stats.avg_response_time_hours

  // Score based on response time
  // < 2h = 100, 2-12h = 80-100, 12-24h = 60-80, 24-48h = 40-60, >48h = 0-40
  if (hours <= 2) return 100
  if (hours <= 12) return 80 + ((12 - hours) / 10) * 20
  if (hours <= 24) return 60 + ((24 - hours) / 12) * 20
  if (hours <= 48) return 40 + ((48 - hours) / 24) * 20
  if (hours <= 96) return 20 + ((96 - hours) / 48) * 20

  return Math.max(0, 20 - (hours - 96) / 10)
}

/**
 * Endorsements Factor (0-100)
 * More endorsements = higher score (capped at 25 endorsements)
 */
function calculateEndorsementsFactor(stats: any): number {
  const count = stats.endorsements_count || 0

  // Each endorsement is worth 4 points, max 100 (25 endorsements)
  const baseScore = Math.min(100, count * 4)

  // Bonus for diverse endorsements (if we tracked endorser diversity)
  // For now, simple linear scale

  return baseScore
}

/**
 * Token Holdings Factor (0-100)
 * More tokens earned = more skin in the game
 */
function calculateTokenHoldingsFactor(totalEarned: number): number {
  if (!totalEarned || totalEarned === 0) {
    return 0
  }

  // Logarithmic scale - rewards participation but doesn't require huge amounts
  // 100 tokens = 20 points
  // 1000 tokens = 40 points
  // 10000 tokens = 60 points
  // 100000 tokens = 80 points
  // 1000000 tokens = 100 points

  const score = Math.log10(totalEarned + 1) * 20

  return Math.min(100, Math.max(0, score))
}

/**
 * Time on Platform Factor (0-100)
 * Longer time on platform = higher trust
 */
function calculateTimeOnPlatformFactor(createdAt: string): number {
  const accountAge = Date.now() - new Date(createdAt).getTime()
  const daysOnPlatform = accountAge / (1000 * 60 * 60 * 24)

  // Logarithmic scale
  // 1 day = 10 points
  // 7 days = 20 points
  // 30 days = 30 points
  // 90 days = 40 points
  // 180 days = 50 points
  // 365 days = 60 points
  // 730 days = 70 points

  if (daysOnPlatform < 1) return 5
  if (daysOnPlatform < 7) return 10 + (daysOnPlatform / 7) * 10
  if (daysOnPlatform < 30) return 20 + ((daysOnPlatform - 7) / 23) * 10
  if (daysOnPlatform < 90) return 30 + ((daysOnPlatform - 30) / 60) * 10
  if (daysOnPlatform < 180) return 40 + ((daysOnPlatform - 90) / 90) * 10
  if (daysOnPlatform < 365) return 50 + ((daysOnPlatform - 180) / 185) * 10
  if (daysOnPlatform < 730) return 60 + ((daysOnPlatform - 365) / 365) * 10

  return Math.min(100, 70 + ((daysOnPlatform - 730) / 365) * 5)
}

/**
 * Batch update trust scores for all active users
 * Used by cron job
 */
export async function batchUpdateTrustScores(
  daysActive: number = 30
): Promise<{ updated: number; errors: number }> {
  // Get all users active in last N days
  const { data: activeUsers, error } = await supabase
    .from('profile_stats')
    .select('wallet_address')
    .gte('last_active_at', new Date(Date.now() - daysActive * 24 * 60 * 60 * 1000).toISOString())

  if (error || !activeUsers) {
    console.error('Failed to fetch active users:', error)
    return { updated: 0, errors: 1 }
  }

  let updated = 0
  let errors = 0

  for (const user of activeUsers) {
    try {
      const trustScore = await calculateTrustScore(user.wallet_address)

      await supabase
        .from('profiles')
        .update({ trust_score: trustScore })
        .eq('wallet_address', user.wallet_address)

      updated++
    } catch (err) {
      console.error(`Failed to update trust score for ${user.wallet_address}:`, err)
      errors++
    }
  }

  return { updated, errors }
}

