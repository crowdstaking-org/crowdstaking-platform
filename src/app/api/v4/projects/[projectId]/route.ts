import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/v4/supabaseAdmin'
import type { V4Project } from '@/types/v4'
import { ENABLE_V4_PROTOCOL } from '@/lib/features'

interface Params {
  params: { projectId: string }
}

/**
 * GET /api/v4/projects/[projectId]
 * Retrieves a single v4 project by ID
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await context.params
  if (!ENABLE_V4_PROTOCOL) {
    return NextResponse.json({ error: 'V4 protocol disabled' }, { status: 503 })
  }

  try {
    const { data: project, error } = await supabaseAdmin
      .from('projects_v4')
      .select('*')
      .eq('id', projectId)
      .single()

    // Fetch contracts
    const { data: contracts } = await supabaseAdmin
      .from('project_contracts')
      .select('contract_type, address, chain_id')
      .eq('project_id', projectId)

    return NextResponse.json({ 
      project: {
        ...project,
        contracts: contracts || []
      } 
    })
  } catch (error: any) {
    console.error('[GET /api/v4/projects/:id]', error)
    return NextResponse.json({ error: error.message ?? 'Internal error' }, { status: 500 })
  }
}



