import { NextResponse } from 'next/server'
import { castProposalVote } from '@/lib/v4/governance'
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
    const { voter, support, votingPowerBps } = body ?? {}
    if (!voter || typeof support !== 'boolean') {
      return NextResponse.json({ error: 'Invalid vote payload' }, { status: 400 })
    }

    const vote = await castProposalVote({
      proposalId: params.proposalId,
      voter,
      support,
      votingPowerBps: Number(votingPowerBps ?? 0)
    })

    return NextResponse.json({ vote }, { status: 201 })
  } catch (error: any) {
    console.error('[POST /api/v4/proposals/:id/vote]', error)
    return NextResponse.json({ error: error.message ?? 'Internal error' }, { status: 500 })
  }
}

