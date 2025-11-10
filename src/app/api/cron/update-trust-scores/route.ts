/**
 * Cron Job: Update Trust Scores
 * Vercel Cron - Daily trust score recalculation
 * 
 * To enable:
 * Add to vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/update-trust-scores",
 *     "schedule": "0 2 * * *"
 *   }]
 * }
 */

import { NextRequest, NextResponse } from 'next/server'
import { batchUpdateTrustScores } from '@/lib/gamification/trustScore'
import { batchCheckBadges } from '@/lib/gamification/badgeAwarder'
import { supabase } from '@/lib/supabase'

/**
 * GET /api/cron/update-trust-scores
 * Updates trust scores for all active users
 */
export async function GET(request: NextRequest) {
  try {
    // Verify this is a Vercel Cron request
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    // In production, verify the cron secret
    if (process.env.NODE_ENV === 'production') {
      if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    console.log('[Cron] Starting trust score update job...')

    // Update trust scores for users active in last 30 days
    const trustScoreResults = await batchUpdateTrustScores(30)

    console.log(
      `[Cron] Trust scores updated: ${trustScoreResults.updated}, errors: ${trustScoreResults.errors}`
    )

    // Get all active users for badge checking
    const { data: activeUsers } = await supabase
      .from('profile_stats')
      .select('wallet_address')
      .gte(
        'last_active_at',
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      )

    // Check badges for active users
    let badgeResults = { checked: 0, awarded: 0 }
    if (activeUsers && activeUsers.length > 0) {
      badgeResults = await batchCheckBadges(activeUsers.map((u) => u.wallet_address))
    }

    console.log(`[Cron] Badges checked: ${badgeResults.checked}, awarded: ${badgeResults.awarded}`)

    return NextResponse.json({
      success: true,
      trustScores: trustScoreResults,
      badges: badgeResults,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[Cron] Trust score update job failed:', error)
    return NextResponse.json(
      {
        error: 'Failed to update trust scores',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}

