/**
 * Token Deployment with ThirdWeb SDK v5 + Smart Account
 * 
 * Deploys ERC20 tokens from the frontend using Smart Account
 * Gas is SPONSORED by ThirdWeb - user needs NO ETH!
 */

import { deployContract } from 'thirdweb/deploys'
import { sendTransaction, prepareContractCall, getContract } from 'thirdweb'
import { baseSepolia } from 'thirdweb/chains'
import { client } from '@/lib/thirdweb'
import type { Account } from 'thirdweb/wallets'

export interface DeployTokenParams {
  tokenName: string
  tokenSymbol: string
  projectName: string
  userAccount: Account // Smart Account with sponsorGas: true
  onStatusUpdate?: (status: string) => void
}

export interface DeployTokenResult {
  success: boolean
  tokenAddress?: string
  transactions?: string[]
  error?: string
}

/**
 * Deploy ERC20 token and distribute 98% to user, 2% to DAO
 * 
 * All gas fees are SPONSORED by ThirdWeb Paymaster
 * User needs NO ETH in their wallet!
 * 
 * @param params - Deployment parameters
 * @returns Deployment result with token address
 */
export async function deployToken(params: DeployTokenParams): Promise<DeployTokenResult> {
  const {
    tokenName,
    tokenSymbol,
    projectName,
    userAccount,
    onStatusUpdate
  } = params

  try {
    const daoWallet = process.env.NEXT_PUBLIC_DAO_WALLET_ADDRESS
    
    if (!daoWallet) {
      throw new Error('DAO wallet address not configured')
    }

    // Total supply: 1 Billion tokens (with 18 decimals)
    const totalSupply = BigInt(1_000_000_000) * BigInt(10 ** 18)
    const transactions: string[] = []
    
    onStatusUpdate?.('Deploying token contract (gas sponsored)...')
    console.log('\n🚀 Starting token deployment with SPONSORED GAS')
    console.log('Token:', tokenName, `(${tokenSymbol})`)
    console.log('Chain: Base Sepolia (Testnet)')
    console.log('Smart Account:', userAccount.address)
    console.log('💰 Gas: SPONSORED by ThirdWeb - User pays $0!')
    
    // Step 1: Deploy ERC20 token contract
    // Gas is SPONSORED - user pays nothing!
    const tokenAddress = await deployContract({
      client,
      chain: baseSepolia,
      account: userAccount, // Smart Account with sponsorGas: true
      type: 'TokenERC20',
      params: {
        name: tokenName,
        symbol: tokenSymbol,
        primarySaleRecipient: userAccount.address,
      },
    })

    console.log(`✅ Token deployed: ${tokenAddress}`)
    console.log(`View on Basescan: https://sepolia.basescan.org/address/${tokenAddress}`)

    // Step 2: Mint total supply to user's Smart Account
    onStatusUpdate?.('Minting initial supply (gas sponsored)...')
    console.log('\n💎 Minting 1 Billion tokens to Smart Account...')
    
    const contract = getContract({
      client,
      chain: baseSepolia,
      address: tokenAddress,
    })

    const mintTx = prepareContractCall({
      contract,
      method: 'function mintTo(address to, uint256 amount)',
      params: [userAccount.address as `0x${string}`, totalSupply],
    })

    const mintReceipt = await sendTransaction({
      transaction: mintTx,
      account: userAccount, // Smart Account - gas SPONSORED!
    })

    transactions.push(mintReceipt.transactionHash)
    console.log(`✅ Minted ${totalSupply.toString()} tokens`)
    console.log(`Mint TX: ${mintReceipt.transactionHash}`)

    // Step 3: Transfer 2% to DAO
    onStatusUpdate?.('Transferring 2% to DAO treasury (gas sponsored)...')
    console.log('\n💸 Transferring 2% to DAO...')
    
    const daoAmount = (totalSupply * BigInt(2)) / BigInt(100)

    const transferTx = prepareContractCall({
      contract,
      method: 'function transfer(address to, uint256 amount) returns (bool)',
      params: [daoWallet as `0x${string}`, daoAmount],
    })

    const transferReceipt = await sendTransaction({
      transaction: transferTx,
      account: userAccount, // Smart Account - gas SPONSORED!
    })

    transactions.push(transferReceipt.transactionHash)
    console.log(`✅ DAO received 2%: ${transferReceipt.transactionHash}`)
    
    console.log(`\n🎉 Token deployment complete!`)
    console.log(`💰 Total gas paid by user: $0 (SPONSORED)`)
    console.log(`💸 User has: 98% (${(totalSupply * BigInt(98)) / BigInt(100)} tokens)`)
    console.log(`💸 DAO has: 2% (${daoAmount} tokens)`)

    onStatusUpdate?.('Token deployment successful!')

    return {
      success: true,
      tokenAddress,
      transactions,
    }

  } catch (error: any) {
    console.error('\n❌ Token deployment error:', error)
    
    return {
      success: false,
      error: error.message || 'Token deployment failed',
    }
  }
}

/**
 * Estimate gas cost for token deployment
 * With sponsored transactions: $0 for user!
 */
export async function estimateDeploymentCost(): Promise<string> {
  return '$0 (Sponsored by ThirdWeb)'
}



