import { NextResponse } from 'next/server'
import { recordCapitalEvent, verifySignature } from '@/lib/v4/oracle'
import { dispatchJob } from '@/lib/v4/jobs'
import { ENABLE_V4_PROTOCOL } from '@/lib/features'
import { confirmCapitalDeposit } from '@/lib/v4/vault'

export async function POST(request: Request) {
  if (!ENABLE_V4_PROTOCOL) {
    return NextResponse.json({ error: 'V4 protocol disabled' }, { status: 503 })
  }

  const signature = request.headers.get('x-webhook-signature') ?? undefined
  const rawBody = await request.text()
  let parsed: any
  try {
    parsed = JSON.parse(rawBody)
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const verified = verifySignature(rawBody, signature)
  if (!verified) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  try {
    const event = await recordCapitalEvent(parsed, verified, signature)
    // Try to confirm deposit on-chain if payload contains depositId and project assignment is known
    if (parsed?.depositId && event.project_id) {
      try {
        await confirmCapitalDeposit(event.project_id, parsed.depositId, parsed.oracle_proof_hash ?? '')
      } catch (chainErr) {
        console.warn('[v4-oracle] confirmDeposit failed; continuing with activation job', chainErr)
      }
    }
    await dispatchJob('activateCapitalShare', {
      capitalEventId: event.id,
      payload: parsed,
    })
    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('[POST /api/v4/oracle/capital]', error)
    return NextResponse.json({ error: error.message ?? 'Internal error' }, { status: 500 })
  }
}

