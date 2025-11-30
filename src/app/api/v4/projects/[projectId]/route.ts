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
export async function GET(_request: Request, { params }: Params) {
  if (!ENABLE_V4_PROTOCOL) {
    return NextResponse.json({ error: 'V4 protocol disabled' }, { status: 503 })
  }

  try {
    const { data: project, error } = await supabaseAdmin
      .from<V4Project>('projects_v4')
      .select('*')
      .eq('id', params.projectId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 })
      }
      throw error
    }

    return NextResponse.json({ project })
  } catch (error: any) {
    console.error('[GET /api/v4/projects/:id]', error)
    return NextResponse.json({ error: error.message ?? 'Internal error' }, { status: 500 })
  }
}


