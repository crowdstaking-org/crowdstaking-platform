import { NextResponse } from 'next/server'
import { createProposal } from '@/lib/v4/governance'
import { ENABLE_V4_PROTOCOL } from '@/lib/features'
import type { ProposalType } from '@/types/v4'

interface Params {
  params: { projectId: string }
}

export async function POST(request: Request, { params }: Params) {
  if (!ENABLE_V4_PROTOCOL) {
    return NextResponse.json({ error: 'V4 protocol disabled' }, { status: 503 })
  }

  try {
    const body = await request.json()
    const { createdBy, type, payload, deadline } = body ?? {}
    if (!createdBy || !type || !payload) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const proposal = await createProposal({
      projectId: params.projectId,
      createdBy,
      type: type as ProposalType,
      payload,
      deadline: deadline ?? null
    })

    return NextResponse.json({ proposal }, { status: 201 })
  } catch (error: any) {
    console.error('[POST /api/v4/projects/:id/proposals]', error)
    return NextResponse.json({ error: error.message ?? 'Internal error' }, { status: 500 })
  }
}

