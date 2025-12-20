import { getContract } from './eth'
import { supabaseAdmin } from './supabaseAdmin'
import type { V4ProjectContract } from '@/types/v4'
import { ethers } from 'ethers'

const PROFIT_VAULT_ABI = [
  'function ownerStartDistribution(bytes32 periodId)',
  'function claim(bytes32 periodId)',
  'function periods(bytes32 periodId) view returns (uint256 totalAmount, uint256 feeAmount, bool claimable)',
  'function hasClaimed(bytes32 periodId, address account) view returns (bool)',
  'event DistributionStarted(bytes32 indexed periodId, uint256 amount, uint256 fee)',
  'event Claimed(bytes32 indexed periodId, address indexed account, uint256 amount)',
]

const CAPITAL_VAULT_ABI = [
  'function confirmDeposit(bytes32 depositId, string proofRef)',
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

export async function startDistributionOwner(projectId: string, period: string) {
  const addr = await getContractAddress(projectId, 'profit_vault')
  const vault = getContract(addr, PROFIT_VAULT_ABI)
  const periodId = ethers.encodeBytes32String(period)
  const tx = await vault.ownerStartDistribution(periodId)
  const receipt = await tx.wait()
  return { txHash: receipt?.hash }
}

export async function confirmCapitalDeposit(projectId: string, depositIdHex: string, proofRef: string) {
  const addr = await getContractAddress(projectId, 'capital_vault')
  const vault = getContract(addr, CAPITAL_VAULT_ABI)
  const depositId = ethers.getBytes(depositIdHex)
  const tx = await vault.confirmDeposit(depositId, proofRef)
  const receipt = await tx.wait()
  return { txHash: receipt?.hash }
}

/**
 * Claim dividend from ProfitVault for a specific period
 * NOTE: This function should be called from the frontend with user's wallet.
 * For server-side calls, use a different approach (e.g., user signs transaction client-side).
 */
export async function claimDividend(projectId: string, period: string, walletAddress: string) {
  const addr = await getContractAddress(projectId, 'profit_vault')
  const vault = getContract(addr, PROFIT_VAULT_ABI)
  const periodId = ethers.encodeBytes32String(period)
  
  // Check if period is claimable
  const periodInfo = await vault.periods(periodId)
  if (!periodInfo.claimable) {
    throw new Error('Period is not claimable yet')
  }
  
  // Check if already claimed
  const alreadyClaimed = await vault.hasClaimed(periodId, walletAddress)
  if (alreadyClaimed) {
    throw new Error('Already claimed for this period')
  }
  
  // NOTE: This uses server wallet - for production, this should be called from frontend
  // with user's wallet. The API endpoint should return transaction data for user to sign.
  // Execute claim
  const tx = await vault.claim(periodId)
  const receipt = await tx.wait()
  
  // Parse Claimed event to get amount
  let claimedAmount = '0'
  if (receipt?.logs) {
    for (const log of receipt.logs) {
      try {
        const parsed = vault.interface.parseLog({ topics: log.topics, data: log.data })
        if (parsed && parsed.name === 'Claimed') {
          claimedAmount = parsed.args[2].toString()
          break
        }
      } catch {
        // Skip non-matching logs
      }
    }
  }
  
  return { txHash: receipt?.hash, amount: claimedAmount }
}

/**
 * Get period info from ProfitVault
 */
export async function getPeriodInfo(projectId: string, period: string) {
  const addr = await getContractAddress(projectId, 'profit_vault')
  const vault = getContract(addr, PROFIT_VAULT_ABI)
  const periodId = ethers.encodeBytes32String(period)
  const periodInfo = await vault.periods(periodId)
  return {
    totalAmount: periodInfo.totalAmount.toString(),
    feeAmount: periodInfo.feeAmount.toString(),
    claimable: periodInfo.claimable,
  }
}

/**
 * Check if a wallet has already claimed for a period
 */
export async function hasClaimedDividend(projectId: string, period: string, walletAddress: string): Promise<boolean> {
  const addr = await getContractAddress(projectId, 'profit_vault')
  const vault = getContract(addr, PROFIT_VAULT_ABI)
  const periodId = ethers.encodeBytes32String(period)
  return await vault.hasClaimed(periodId, walletAddress)
}

