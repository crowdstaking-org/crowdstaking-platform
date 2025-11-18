import { NextResponse } from 'next/server'
import { ENABLE_V4_PROTOCOL } from '@/lib/features'
import { startDistributionOwner } from '@/lib/v4/vault'

export async function POST(_req: Request, { params }: { params: Promise<{ projectId: string }> }) {
  if (!ENABLE_V4_PROTOCOL) {
    return NextResponse.json({ error: 'V4 protocol disabled' }, { status: 503 })
  }
  try {
    const { projectId } = await params
    const body = await _req.json()
    const { period } = body ?? {}
    if (!period) {
      return NextResponse.json({ error: 'Missing period' }, { status: 400 })
    }
    const res = await startDistributionOwner(projectId, period)
    return NextResponse.json({ success: true, ...res })
  } catch (e: any) {
    console.error('[v4] start distribution failed', e)
    return NextResponse.json({ error: e.message ?? 'Failed' }, { status: 500 })
  }
}

