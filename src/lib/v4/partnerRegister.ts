import { getContract } from './eth'
import { supabaseAdmin } from './supabaseAdmin'
import type { V4ProjectContract } from '@/types/v4'
import { ethers } from 'ethers'

const PARTNER_REGISTER_ABI = [
  'function getShareBps(address account) view returns (uint256)',
  'function partners(address account) view returns (uint256 shareBps, bool exists)',
  'function partnerTokenId(address account) view returns (uint256)',
]

async function getContractAddress(projectId: string, type: V4ProjectContract['contract_type']) {
  const { data, error } = await supabaseAdmin
    .from('project_contracts')
    .select('address, contract_type')
    .eq('project_id', projectId)
    .eq('contract_type', type)
    .maybeSingle()
  if (error) throw error
  if (!data?.address) throw new Error(`Contract ${type} not found for project`)
  return data.address
}

/**
 * Get voting power (share percentage in basis points) for a wallet in a project
 */
export async function getVotingPower(projectId: string, walletAddress: string): Promise<number> {
  try {
    const addr = await getContractAddress(projectId, 'partner_register')
    const register = getContract(addr, PARTNER_REGISTER_ABI)
    const shareBps = await register.getShareBps(walletAddress)
    return Number(shareBps)
  } catch (error: any) {
    // If contract call fails (e.g., not a partner), return 0
    if (error?.message?.includes('not found') || error?.code === 'CALL_EXCEPTION') {
      return 0
    }
    throw error
  }
}

/**
 * Get SBT token ID for a wallet in a project
 */
export async function getSBTTokenId(projectId: string, walletAddress: string): Promise<string | null> {
  try {
    const addr = await getContractAddress(projectId, 'partner_register')
    const register = getContract(addr, PARTNER_REGISTER_ABI)
    const tokenId = await register.partnerTokenId(walletAddress)
    const tokenIdNum = Number(tokenId)
    return tokenIdNum > 0 ? tokenIdNum.toString() : null
  } catch (error: any) {
    if (error?.message?.includes('not found') || error?.code === 'CALL_EXCEPTION') {
      return null
    }
    throw error
  }
}


