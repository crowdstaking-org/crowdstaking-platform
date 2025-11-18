import { NextResponse } from 'next/server'
import { getPeriodInfo } from '@/lib/v4/vault'
import { getVotingPower } from '@/lib/v4/partnerRegister'
import { ENABLE_V4_PROTOCOL } from '@/lib/features'

/**
 * Calculate the dividend amount a user would receive for a period
 * Based on their share percentage and the period's total amount
 */
export async function GET(request: Request) {
  if (!ENABLE_V4_PROTOCOL) {
    return NextResponse.json({ error: 'V4 protocol disabled' }, { status: 503 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const period = searchParams.get('period')
    const walletAddress = searchParams.get('wallet')

    if (!projectId || !period || !walletAddress) {
      return NextResponse.json(
        { error: 'projectId, period, and wallet parameters are required' },
        { status: 400 }
      )
    }

    // Get period info
    const periodInfo = await getPeriodInfo(projectId, period)
    if (!periodInfo.claimable) {
      return NextResponse.json({ error: 'Period is not claimable' }, { status: 400 })
    }

    // Get user's share percentage
    const shareBps = await getVotingPower(projectId, walletAddress)
    if (shareBps === 0) {
      return NextResponse.json({ error: 'User has no shares' }, { status: 400 })
    }

    // Calculate amount: (totalAmount * shareBps) / 10000
    const totalAmount = BigInt(periodInfo.totalAmount)
    const amount = (totalAmount * BigInt(shareBps)) / BigInt(10000)

    return NextResponse.json({
      amount: amount.toString(),
      totalAmount: periodInfo.totalAmount,
      shareBps,
      sharePercentage: shareBps / 100,
    })
  } catch (error: any) {
    console.error('[GET /api/v4/vaults/claim/amount]', error)
    return NextResponse.json({ error: error.message ?? 'Internal error' }, { status: 500 })
  }
}


