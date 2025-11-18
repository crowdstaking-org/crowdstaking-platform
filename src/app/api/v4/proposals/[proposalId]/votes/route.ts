import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/v4/supabaseAdmin'
import type { GovernanceVote } from '@/types/v4'
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
      .from<GovernanceVote>('governance_votes')
      .select('*')
      .eq('proposal_id', params.proposalId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ votes: data ?? [] })
  } catch (error: any) {
    console.error('[GET /api/v4/proposals/:id/votes]', error)
    return NextResponse.json({ error: error.message ?? 'Internal error' }, { status: 500 })
  }
}


