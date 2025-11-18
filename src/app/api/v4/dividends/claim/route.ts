import { NextResponse } from 'next/server'
import { recordDividendClaim } from '@/lib/v4/dividends'
import { supabaseAdmin } from '@/lib/v4/supabaseAdmin'
import { ENABLE_V4_PROTOCOL } from '@/lib/features'
import type { PartnerShare } from '@/types/v4'

export async function POST(request: Request) {
  if (!ENABLE_V4_PROTOCOL) {
    return NextResponse.json({ error: 'V4 protocol disabled' }, { status: 503 })
  }
  try {
    const body = await request.json()
    const { projectId, partnerShareId, vaultPeriod, amount, txHash } = body ?? {}
    if (!projectId || !partnerShareId || !vaultPeriod) {
      return NextResponse.json(
        { error: 'projectId, partnerShareId and vaultPeriod are required' },
        { status: 400 }
      )
    }

    const { data: share, error: shareError } = await supabaseAdmin
      .from<PartnerShare>('partner_shares')
      .select('*')
      .eq('id', partnerShareId)
      .eq('project_id', projectId)
      .single()
    if (shareError || !share) {
      return NextResponse.json({ error: 'Partner share not found' }, { status: 404 })
    }

    if (share.status !== 'active') {
      return NextResponse.json({ error: 'Share is not active' }, { status: 400 })
    }

    const claim = await recordDividendClaim({
      projectId,
      partnerShareId,
      vaultPeriod,
      amount,
      txHash,
    })

    return NextResponse.json({ claim }, { status: 201 })
  } catch (error: any) {
    console.error('[POST /api/v4/dividends/claim]', error)
    return NextResponse.json({ error: error.message ?? 'Unable to record claim' }, { status: 500 })
  }
}

