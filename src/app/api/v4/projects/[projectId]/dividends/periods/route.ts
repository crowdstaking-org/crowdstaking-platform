import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/v4/supabaseAdmin'
import { ENABLE_V4_PROTOCOL } from '@/lib/features'

interface Params {
  params: { projectId: string }
}

export async function GET(_request: Request, { params }: Params) {
  if (!ENABLE_V4_PROTOCOL) {
    return NextResponse.json({ error: 'V4 protocol disabled' }, { status: 503 })
  }

  try {
    // Get all dividend claims for this project to find available periods
    const { data: claims, error } = await supabaseAdmin
      .from('dividend_claims')
      .select('vault_period')
      .eq('project_id', params.projectId)

    if (error) throw error

    // Get unique periods from dividend claims
    const periodsFromClaims = Array.from(new Set((claims || []).map((c) => c.vault_period)))

    // Also check on-chain ProfitVault for periods that have been started
    // Note: This requires reading from the contract, which is done in the frontend
    // when fetching available periods. The frontend calls getPeriodInfo for each period.
    // For now, we return periods from claims. Future optimization: query contract directly.

    return NextResponse.json({ periods: periodsFromClaims })
  } catch (error: any) {
    console.error('[GET /api/v4/projects/:id/dividends/periods]', error)
    return NextResponse.json({ error: error.message ?? 'Internal error' }, { status: 500 })
  }
}

