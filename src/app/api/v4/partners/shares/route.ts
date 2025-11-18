import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/v4/supabaseAdmin'
import type { PartnerShare, V4Project } from '@/types/v4'
import { ENABLE_V4_PROTOCOL } from '@/lib/features'

export async function GET(request: Request) {
  if (!ENABLE_V4_PROTOCOL) {
    return NextResponse.json({ error: 'V4 protocol disabled' }, { status: 503 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get('wallet')

    if (!walletAddress) {
      return NextResponse.json({ error: 'wallet parameter required' }, { status: 400 })
    }

    // Fetch partner shares with project info
    const { data: shares, error: sharesError } = await supabaseAdmin
      .from<PartnerShare>('partner_shares')
      .select(`
        *,
        project:projects_v4!inner (
          id,
          name,
          slug,
          mission,
          status
        )
      `)
      .eq('wallet_address', walletAddress.toLowerCase())
      .order('created_at', { ascending: false })

    if (sharesError) throw sharesError

    // Transform to include project info
    const sharesWithProjects = (shares || []).map((share: any) => ({
      ...share,
      project: share.project,
    }))

    return NextResponse.json({ shares: sharesWithProjects })
  } catch (error: any) {
    console.error('[GET /api/v4/partners/shares]', error)
    return NextResponse.json({ error: error.message ?? 'Internal error' }, { status: 500 })
  }
}


