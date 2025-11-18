import { getContract } from './eth'
import { supabaseAdmin } from './supabaseAdmin'
import type { V4ProjectContract } from '@/types/v4'
import { ethers } from 'ethers'

const GOVERNANCE_MODULE_ABI = [
  'function execute(uint256 proposalId)',
  'function castVote(uint256 proposalId, bool support)',
  'function proposals(uint256 proposalId) view returns (uint8 type, bytes data, uint256 deadline, bool executed, uint256 forVotes, uint256 againstVotes)',
]

async function getContractAddress(projectId: string, type: V4ProjectContract['contract_type']) {
  const { data, error } = await supabaseAdmin
    .from<V4ProjectContract>('project_contracts')
    .select('address, contract_type')
    .eq('project_id', projectId)
    .eq('contract_type', type)
    .maybeSingle()
  if (error) throw error
  if (!data?.address) throw new Error(`Contract ${type} not found for project`)
  return data.address
}

/**
 * Execute a governance proposal on-chain
 */
export async function executeProposal(projectId: string, proposalId: bigint | number) {
  const addr = await getContractAddress(projectId, 'governance_module')
  const governance = getContract(addr, GOVERNANCE_MODULE_ABI)
  const tx = await governance.execute(BigInt(proposalId))
  const receipt = await tx.wait()
  return { txHash: receipt?.hash }
}

/**
 * Cast a vote on-chain (alternative to off-chain voting)
 */
export async function castVoteOnChain(projectId: string, proposalId: bigint | number, support: boolean) {
  const addr = await getContractAddress(projectId, 'governance_module')
  const governance = getContract(addr, GOVERNANCE_MODULE_ABI)
  const tx = await governance.castVote(BigInt(proposalId), support)
  const receipt = await tx.wait()
  return { txHash: receipt?.hash }
}


