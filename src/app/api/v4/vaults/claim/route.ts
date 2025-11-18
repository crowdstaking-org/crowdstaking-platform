import { NextResponse } from 'next/server'
import { getPeriodInfo, hasClaimedDividend } from '@/lib/v4/vault'
import { ENABLE_V4_PROTOCOL } from '@/lib/features'

/**
 * NOTE: This endpoint only validates and returns period info.
 * The actual claim() transaction should be signed by the user's wallet on the frontend.
 * This is a security requirement - users must sign their own dividend claims.
 */
export async function POST(request: Request) {
  if (!ENABLE_V4_PROTOCOL) {
    return NextResponse.json({ error: 'V4 protocol disabled' }, { status: 503 })
  }

  try {
    const body = await request.json()
    const { projectId, period, walletAddress } = body ?? {}

    if (!projectId || !period || !walletAddress) {
      return NextResponse.json(
        { error: 'projectId, period, and walletAddress are required' },
        { status: 400 }
      )
    }

    // Validate period is claimable
    const periodInfo = await getPeriodInfo(projectId, period)
    if (!periodInfo.claimable) {
      return NextResponse.json({ error: 'Period is not claimable yet' }, { status: 400 })
    }

    // Check if already claimed
    const alreadyClaimed = await hasClaimedDividend(projectId, period, walletAddress)
    if (alreadyClaimed) {
      return NextResponse.json({ error: 'Already claimed for this period' }, { status: 400 })
    }

    // Return period info - frontend should call claim() with user's wallet
    return NextResponse.json({
      periodInfo,
      message: 'Please sign the claim transaction with your wallet',
    })
  } catch (error: any) {
    console.error('[POST /api/v4/vaults/claim]', error)
    return NextResponse.json({ error: error.message ?? 'Internal error' }, { status: 500 })
  }
}

