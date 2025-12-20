import { supabaseAdmin } from './supabaseAdmin'
import type { DividendClaim } from '@/types/v4'

interface RecordClaimInput {
  projectId: string
  partnerShareId: string
  vaultPeriod: string
  amount?: string
  txHash?: string
}

export async function recordDividendClaim(input: RecordClaimInput) {
  const { data, error } = await supabaseAdmin
    .from('dividend_claims')
    .insert({
      project_id: input.projectId,
      partner_share_id: input.partnerShareId,
      vault_period: input.vaultPeriod,
      amount: input.amount ?? null,
      tx_hash: input.txHash ?? null,
    })
    .select('*')
    .single()
  if (error) {
    throw error
  }
  return data
}

export async function listClaimsForShare(partnerShareId: string) {
  const { data, error } = await supabaseAdmin
    .from('dividend_claims')
    .select('*')
    .eq('partner_share_id', partnerShareId)
    .order('claimed_at', { ascending: false })
  if (error) {
    throw error
  }
  return data
}

