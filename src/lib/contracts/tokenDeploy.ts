/**
 * Token Deployment via ThirdWeb SDK v5
 * Handles ERC20 token creation and 2% DAO transfer
 * All transactions signed by user's wallet (no backend)
 */

import { deployERC20Contract } from 'thirdweb/deploys'
import { getContract, prepareContractCall, sendTransaction, waitForReceipt } from 'thirdweb'
import { transfer } from 'thirdweb/extensions/erc20'
import { client, deploymentChain } from '@/lib/thirdweb'

/**
 * Deploy ERC20 Token using ThirdWeb SDK
 * Transaction is signed by user's wallet in browser
 * 
 * @param account - ThirdWeb account from useActiveAccount()
 * @param name - Token name (e.g., "CrowdStaking Test Token")
 * @param symbol - Token symbol (e.g., "TEST")
 * @returns Contract address of deployed token
 */
export async function deployProjectToken(params: {
  account: any
  name: string
  symbol: string
}): Promise<string> {
  const { account, name, symbol } = params
  
  if (!account) {
    throw new Error('Wallet account not connected')
  }
  
  try {
    // Deploy ERC20 using ThirdWeb's built-in deployer
    // This creates a standard OpenZeppelin ERC20 token
    const contractAddress = await deployERC20Contract({
      client,
      chain: deploymentChain,
      account,
      type: 'TokenERC20',
      params: {
        name,
        symbol,
        primary_sale_recipient: account.address, // Founder gets all tokens initially
      },
    })
    
    return contractAddress
  } catch (error: any) {
    // Re-throw with more context
    if (error.message?.includes('User rejected')) {
      throw new Error('Token deployment cancelled by user')
    }
    throw new Error(`Token deployment failed: ${error.message}`)
  }
}

/**
 * Transfer 2% of tokens to CrowdStaking DAO
 * Separate transaction after token deployment
 * 
 * @param account - User's wallet account
 * @param tokenAddress - Deployed token contract address
 * @param totalSupply - Total token supply (with 18 decimals)
 * @param daoWallet - DAO wallet address
 * @returns Transaction hash and transferred amount
 */
export async function transfer2PercentToDAO(params: {
  account: any
  tokenAddress: string
  totalSupply: bigint
  daoWallet: string
}): Promise<{
  transactionHash: string
  amount: bigint
}> {
  const { account, tokenAddress, totalSupply, daoWallet } = params
  
  if (!account) {
    throw new Error('Wallet account not connected')
  }
  
  // Validate addresses
  if (!tokenAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
    throw new Error('Invalid token address')
  }
  
  if (!daoWallet.match(/^0x[a-fA-F0-9]{40}$/)) {
    throw new Error('Invalid DAO wallet address')
  }
  
  try {
    // Calculate 2% of total supply
    const twoPercent = (totalSupply * 2n) / 100n
    
    // Get token contract
    const contract = getContract({
      client,
      chain: deploymentChain,
      address: tokenAddress,
    })
    
    // Prepare transfer transaction
    const transaction = transfer({
      contract,
      to: daoWallet,
      amount: twoPercent,
    })
    
    // Send transaction (user signs in wallet)
    const result = await sendTransaction({
      transaction,
      account,
    })
    
    // Wait for blockchain confirmation
    const receipt = await waitForReceipt(result)
    
    return {
      transactionHash: receipt.transactionHash,
      amount: twoPercent,
    }
  } catch (error: any) {
    // Re-throw with more context
    if (error.message?.includes('User rejected')) {
      throw new Error('2% transfer cancelled by user')
    }
    throw new Error(`2% transfer failed: ${error.message}`)
  }
}

/**
 * Format token amount from wei to human-readable
 * Example: 1000000000000000000 → "1.0"
 */
export function formatTokenAmount(amount: bigint, decimals: number = 18): string {
  const divisor = 10n ** BigInt(decimals)
  const tokens = amount / divisor
  return tokens.toString()
}

