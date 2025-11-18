import { NextResponse } from 'next/server'
import { markProposalStatus } from '@/lib/v4/governance'
import { dispatchJob } from '@/lib/v4/jobs'
import { ENABLE_V4_PROTOCOL } from '@/lib/features'

interface Params {
  params: { proposalId: string }
}

export async function POST(request: Request, { params }: Params) {
  if (!ENABLE_V4_PROTOCOL) {
    return NextResponse.json({ error: 'V4 protocol disabled' }, { status: 503 })
  }

  try {
    const body = await request.json()
    const { action, payload, walletAddress, shareBps } = body ?? {}
    if (action !== 'approve' || !walletAddress || !shareBps) {
      return NextResponse.json({ error: 'Unsupported action' }, { status: 400 })
    }

    const proposal = await markProposalStatus(params.proposalId, 'approved', payload ?? null)

    // Fire-and-forget job (register share, etc.)
    await dispatchJob('registerPartnerShare', {
      proposalId: params.proposalId,
      projectId: proposal.project_id,
      walletAddress,
      shareBps,
      status: 'pending_work'
    })

    if (payload?.type === 'payout' && typeof payload?.period === 'string') {
      await dispatchJob('startDistribution', {
        projectId: proposal.project_id,
        period: payload.period,
      })
    }

    return NextResponse.json({ proposal })
  } catch (error: any) {
    console.error('[POST /api/v4/proposals/:id/accept]', error)
    return NextResponse.json({ error: error.message ?? 'Internal error' }, { status: 500 })
  }
}

