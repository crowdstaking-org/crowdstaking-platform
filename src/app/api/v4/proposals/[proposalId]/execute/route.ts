import { NextResponse } from 'next/server'
import { executeProposal } from '@/lib/v4/governanceContract'
import { supabaseAdmin } from '@/lib/v4/supabaseAdmin'
import { markProposalStatus } from '@/lib/v4/governance'
import type { GovernanceProposal } from '@/types/v4'
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
    const { projectId } = body ?? {}

    if (!projectId) {
      return NextResponse.json({ error: 'projectId is required' }, { status: 400 })
    }

    // Get proposal to verify it exists and get projectId
    const { data: proposal, error: proposalError } = await supabaseAdmin
      .from<GovernanceProposal>('governance_proposals')
      .select('*')
      .eq('id', params.proposalId)
      .single()

    if (proposalError || !proposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 })
    }

    if (proposal.project_id !== projectId) {
      return NextResponse.json({ error: 'Project ID mismatch' }, { status: 400 })
    }

    if (proposal.status === 'executed' || proposal.status === 'rejected') {
      return NextResponse.json({ error: 'Proposal already executed or rejected' }, { status: 400 })
    }

    // Execute on-chain
    const proposalIdNum = parseInt(params.proposalId, 10)
    if (isNaN(proposalIdNum)) {
      return NextResponse.json({ error: 'Invalid proposal ID format' }, { status: 400 })
    }

    const { txHash } = await executeProposal(projectId, proposalIdNum)

    // Update proposal status
    await markProposalStatus(params.proposalId, 'executed', { txHash })

    return NextResponse.json({ success: true, txHash })
  } catch (error: any) {
    console.error('[POST /api/v4/proposals/:id/execute]', error)
    return NextResponse.json({ error: error.message ?? 'Internal error' }, { status: 500 })
  }
}


