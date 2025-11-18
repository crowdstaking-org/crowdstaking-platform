import { supabaseAdmin } from './supabaseAdmin'
import type { PartnerShare } from '@/types/v4'

interface RegisterSharePayload {
  projectId: string
  proposalId?: string
  walletAddress: string
  shareBps: number
  status?: PartnerShare['status']
}

export async function registerPartnerShare(payload: RegisterSharePayload) {
  const { data, error } = await supabaseAdmin
    .from<PartnerShare>('partner_shares')
    .upsert({
      project_id: payload.projectId,
      proposal_id: payload.proposalId ?? null,
      wallet_address: payload.walletAddress,
      share_bps: payload.shareBps,
      status: payload.status ?? 'pending',
    })
    .select('*')
    .single()
  if (error) {
    throw error
  }
  return data
}

export async function markWorkDelivered(shareId: string) {
  const { data, error } = await supabaseAdmin
    .from<PartnerShare>('partner_shares')
    .update({
      status: 'active',
      activated_at: new Date().toISOString(),
    })
    .eq('id', shareId)
    .select('*')
    .single()
  if (error) throw error
  return data
}

export async function activateCapitalShare(shareId: string) {
  return markWorkDelivered(shareId)
}

