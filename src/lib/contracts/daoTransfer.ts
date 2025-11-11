/**
 * DAO Transfer Service
 * Handles automatic 2% token transfer to CrowdStaking DAO
 */

export interface DAOTransferParams {
  tokenAddress: string
  totalSupply: string // Total supply in wei (as string to handle BigInt)
  founderAddress: string
  chainId: number
}

/**
 * Calculate 2% of total supply
 * Returns amount as string (in wei) for BigInt compatibility
 */
export function calculate2Percent(totalSupply: string): string {
  const supply = BigInt(totalSupply)
  const twoPercent = (supply * 2n) / 100n
  return twoPercent.toString()
}

/**
 * Get DAO wallet address from environment
 */
export function getDAOWalletAddress(): string {
  const daoWallet = process.env.NEXT_PUBLIC_DAO_WALLET_ADDRESS || 
                    process.env.DAO_WALLET_ADDRESS
  
  if (!daoWallet) {
    throw new Error(
      'NEXT_PUBLIC_DAO_WALLET_ADDRESS not configured. Please set it in .env.local'
    )
  }
  
  // Validate Ethereum address format
  if (!daoWallet.match(/^0x[a-fA-F0-9]{40}$/)) {
    throw new Error(
      `Invalid DAO wallet address format: ${daoWallet}`
    )
  }
  
  return daoWallet
}

/**
 * Prepare 2% transfer transaction for ThirdWeb
 * Returns parameters ready for ThirdWeb's sendTokens function
 * 
 * This does NOT execute the transaction - that's done by the frontend hook
 */
export function prepare2PercentTransfer(params: DAOTransferParams) {
  const daoWallet = getDAOWalletAddress()
  const twoPercentAmount = calculate2Percent(params.totalSupply)
  
  return {
    from: params.founderAddress,
    chainId: params.chainId,
    tokenAddress: params.tokenAddress,
    recipients: [{
      address: daoWallet,
      quantity: twoPercentAmount
    }]
  }
}

/**
 * Validate that 2% transfer completed successfully
 * Can be used to check blockchain state after transfer
 */
export function validate2PercentTransfer(
  totalSupply: string,
  daoBalance: string
): boolean {
  const expected = calculate2Percent(totalSupply)
  return BigInt(daoBalance) >= BigInt(expected)
}

