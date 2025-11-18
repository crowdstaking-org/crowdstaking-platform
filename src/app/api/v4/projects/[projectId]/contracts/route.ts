import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/v4/supabaseAdmin'
import type { V4ProjectContract } from '@/types/v4'
import { ENABLE_V4_PROTOCOL } from '@/lib/features'

interface Params {
  params: { projectId: string }
}

export async function GET(request: Request, { params }: Params) {
  if (!ENABLE_V4_PROTOCOL) {
    return NextResponse.json({ error: 'V4 protocol disabled' }, { status: 503 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') as V4ProjectContract['contract_type'] | null

    let query = supabaseAdmin
      .from<V4ProjectContract>('project_contracts')
      .select('*')
      .eq('project_id', params.projectId)

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


