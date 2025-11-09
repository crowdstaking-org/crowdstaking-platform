/**
 * useTokenBalance Hook
 * Phase 6: Reads $CSTAKE token balance from user's wallet
 * Uses ThirdWeb SDK v5 for reading ERC20 balanceOf
 */

'use client'

import { useReadContract, useActiveAccount } from 'thirdweb/react'
import { getContract } from 'thirdweb'
import { client } from '@/lib/thirdweb'
import { baseSepolia } from 'thirdweb/chains'

// $CSTAKE token address on Base Sepolia (deployed in Phase 5)
const CSTAKE_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_CSTAKE_TOKEN_ADDRESS || '0xa746381E05aE069846726Eb053788D4879B458DA'

/**
 * Hook to read $CSTAKE token balance for connected wallet
 * @returns balance data, loading state, and error state
 */
export function useTokenBalance() {
  // Get active connected wallet
  const account = useActiveAccount()
  
  // Create contract instance
  const contract = getContract({
    client,
    chain: baseSepolia,
    address: CSTAKE_TOKEN_ADDRESS,
  })
  
  // Read balance from contract
  const { data, isLoading, error, refetch } = useReadContract({
    contract,
    method: 'function balanceOf(address) view returns (uint256)',
    params: [account?.address || '0x0000000000000000000000000000000000000000'] as const,
  })
  
  // Convert BigInt to string for safe manipulation
  const balanceRaw = data ? data.toString() : '0'
  
  // Format balance from wei (18 decimals) to human-readable
  // Use string manipulation to avoid BigInt conversion errors
  const balance = data 
    ? (parseInt(balanceRaw) / 1e18).toString()
    : '0'
  
  // Format with commas and 2 decimals for display
  const balanceFormatted = Number(balance).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  
  return {
    balance, // Raw number as string (e.g., "1234.56")
    balanceFormatted, // Formatted string (e.g., "1,234.56")
    balanceRaw, // Raw BigInt as string (e.g., "1234560000000000000000")
    isLoading,
    error,
    refetch, // Function to manually refetch balance
    hasWallet: !!account?.address,
    walletAddress: account?.address,
  }
}

