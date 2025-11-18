import { NextResponse } from 'next/server'
import { getVotingPower } from '@/lib/v4/partnerRegister'
import { ENABLE_V4_PROTOCOL } from '@/lib/features'

export async function GET(request: Request) {
  if (!ENABLE_V4_PROTOCOL) {
    return NextResponse.json({ error: 'V4 protocol disabled' }, { status: 503 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const wallet = searchParams.get('wallet')

    if (!projectId || !wallet) {
      return NextResponse.json({ error: 'projectId and wallet parameters required' }, { status: 400 })
    }

    const votingPower = await getVotingPower(projectId, wallet)

    return NextResponse.json({ votingPower })
  } catch (error: any) {
    console.error('[GET /api/v4/partners/voting-power]', error)
    return NextResponse.json({ error: error.message ?? 'Internal error' }, { status: 500 })
  }
}

