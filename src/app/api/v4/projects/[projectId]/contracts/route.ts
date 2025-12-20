import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/v4/supabaseAdmin'
import type { V4ProjectContract } from '@/types/v4'
import { ENABLE_V4_PROTOCOL } from '@/lib/features'

export async function GET(
  request: Request,
  context: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await context.params
  if (!ENABLE_V4_PROTOCOL) {
    return NextResponse.json({ error: 'V4 protocol disabled' }, { status: 503 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') as V4ProjectContract['contract_type'] | null

    let query = supabaseAdmin
      .from('project_contracts')
      .select('*')
      .eq('project_id', projectId)

    if (type) {
      query = query.eq('contract_type', type)
    }

    const { data, error } = await query

    if (error) throw error

    if (type && data && data.length > 0) {
      return NextResponse.json({ address: data[0].address, chainId: data[0].chain_id })
    }

    return NextResponse.json({ contracts: data || [] })
  } catch (error: any) {
    console.error('[GET /api/v4/projects/:id/contracts]', error)
    return NextResponse.json({ error: error.message ?? 'Internal error' }, { status: 500 })
  }
}


