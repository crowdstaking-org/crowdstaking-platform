import crypto from 'node:crypto'
import { supabaseAdmin } from './supabaseAdmin'
import type { CapitalEvent } from '@/types/v4'

const secret = process.env.HONEST_FOUNDATION_WEBHOOK_SECRET || ''

export function verifySignature(body: string, signature: string | undefined) {
  if (!secret) {
    console.warn('HONEST_FOUNDATION_WEBHOOK_SECRET missing, skipping verification')
    return true
  }
  if (!signature) return false
  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
}

export async function recordCapitalEvent(
  payload: Record<string, unknown>,
  verified: boolean,
  signature?: string
) {
  const { data, error } = await supabaseAdmin
    .from('capital_events')
    .insert({
      payload,
      verified,
      signature: signature ?? null,
    })
    .select()
    .single()
  if (error) {
    throw error
  }
  return data
}

