import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/v4/supabaseAdmin'
import type { GovernanceProposal } from '@/types/v4'
import { ENABLE_V4_PROTOCOL } from '@/lib/features'

interface Params {
  params: { proposalId: string }
}

export async function GET(_request: Request, { params }: Params) {
  if (!ENABLE_V4_PROTOCOL) {
    return NextResponse.json({ error: 'V4 protocol disabled' }, { status: 503 })
  }

  try {
    const { data, error } = await supabaseAdmin
      .from<GovernanceProposal>('governance_proposals')
      .select('*')
      .eq('id', params.proposalId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Proposal not found' }, { status: 404 })
      }
      throw error
    }

    return NextResponse.json({ proposal: data })
  } catch (error: any) {
    console.error('[GET /api/v4/proposals/:id]', error)
    return NextResponse.json({ error: error.message ?? 'Internal error' }, { status: 500 })
  }
}

