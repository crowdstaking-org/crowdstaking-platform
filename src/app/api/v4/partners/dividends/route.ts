import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/v4/supabaseAdmin'
import type { DividendClaim, PartnerShare } from '@/types/v4'
import { ENABLE_V4_PROTOCOL } from '@/lib/features'

export async function GET(request: Request) {
  if (!ENABLE_V4_PROTOCOL) {
    return NextResponse.json({ error: 'V4 protocol disabled' }, { status: 503 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get('wallet')
    const projectId = searchParams.get('projectId')

    if (!walletAddress) {
      return NextResponse.json({ error: 'wallet parameter required' }, { status: 400 })
    }

    // First, get all partner shares for this wallet
    let sharesQuery = supabaseAdmin
      .from<PartnerShare>('partner_shares')
      .select('id, project_id')
      .eq('wallet_address', walletAddress.toLowerCase())
      .eq('status', 'active')

    if (projectId) {
      sharesQuery = sharesQuery.eq('project_id', projectId)
    }

    const { data: shares, error: sharesError } = await sharesQuery

    if (sharesError) throw sharesError

    if (!shares || shares.length === 0) {
      return NextResponse.json({ claims: [], periods: [] })
    }

    const shareIds = shares.map((s) => s.id)

    // Fetch dividend claims for these shares
    const { data: claims, error: claimsError } = await supabaseAdmin
      .from<DividendClaim>('dividend_claims')
      .select('*')
      .in('partner_share_id', shareIds)
      .order('claimed_at', { ascending: false })

    if (claimsError) throw claimsError

    // Get unique periods
    const periods = Array.from(new Set((claims || []).map((c) => c.vault_period)))

    return NextResponse.json({
      claims: claims || [],
      periods,
    })
  } catch (error: any) {
    console.error('[GET /api/v4/partners/dividends]', error)
    return NextResponse.json({ error: error.message ?? 'Internal error' }, { status: 500 })
  }
}

