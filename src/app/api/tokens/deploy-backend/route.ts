import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { waitForTransactionConfirmation, transferTokens, getGasMode, callThirdWebAPI } from '@/lib/thirdweb-backend'

/**
 * POST /api/tokens/deploy-backend
 * 
 * Deploys ERC20 token via ThirdWeb backend with hybrid gas payment
 * - Server pays gas fees (either via server wallet or sponsored transactions)
 * - User receives 98% of tokens
 * - DAO receives 2% of tokens
 * - User only needs to sign legal message (no ETH required!)
 * 
 * Request Body:
 * {
 *   tokenName: string,
 *   tokenSymbol: string,
 *   projectName: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const userWallet = requireAuth(request)
    const body = await request.json()
    const { tokenName, tokenSymbol, projectName } = body
    
    // Validation
    if (!tokenName || tokenName.length < 2) {
      return Response.json(
        { error: 'Token name must be at least 2 characters' },
        { status: 400 }
      )
    }
    
    if (!tokenSymbol || tokenSymbol.length < 2 || tokenSymbol.length > 10) {
      return Response.json(
        { error: 'Token symbol must be 2-10 characters' },
        { status: 400 }
      )
    }
    
    // Double-check symbol availability (race condition protection)
    const { data: existingProjects } = await supabase
      .from('projects')
      .select('token_symbol, name')
      .eq('token_symbol', tokenSymbol.toUpperCase())
      .limit(1)
    
    if (existingProjects && existingProjects.length > 0) {
      return Response.json(
        { 
          error: `Symbol ${tokenSymbol} is already used by "${existingProjects[0].name}"` 
        },
        { status: 400 }
      )
    }
    
    const gasMode = getGasMode()
    const chainId = 84532 // Base Sepolia for testing
    
    console.log(`\n🚀 Starting token deployment for ${projectName}`)
    console.log(`Token: ${tokenName} (${tokenSymbol})`)
    console.log(`User wallet: ${userWallet}`)
    console.log(`Gas mode: ${gasMode}`)
    
    // Step 1: Deploy Token via ThirdWeb HTTP API
    console.log('\n📝 Step 1: Deploying token contract...')
    
    const deployPayload: any = {
      chain_id: chainId,
      contract_type: 'token',
      contract_metadata: {
        name: tokenName,
        symbol: tokenSymbol,
        description: `Project token for ${projectName}`,
        image: `https://ui-avatars.com/api/?name=${encodeURIComponent(tokenName)}&background=4F46E5&color=fff&size=200`,
      },
      constructor_params: {
        name: tokenName,
        symbol: tokenSymbol,
        default_admin: userWallet, // User owns the token contract
        primary_sale_recipient: process.env.NEXT_PUBLIC_DAO_WALLET_ADDRESS, // Temporary - will transfer later
        platform_fee_recipient: process.env.NEXT_PUBLIC_DAO_WALLET_ADDRESS,
        platform_fee_bps: 0,
      },
    }
    
    if (gasMode === 'sponsored') {
      deployPayload.tx_overrides = { mode: 'sponsored' }
    }
    
    const deployResult = await callThirdWebAPI('/v1/deploy', {
      method: 'POST',
      body: JSON.stringify(deployPayload),
    })
    const tokenAddress = deployResult.contractAddress || deployResult.result?.contractAddress
    const deployTxId = deployResult.queueId || deployResult.transactionId
    
    if (!tokenAddress) {
      throw new Error('Token address not returned from deployment')
    }
    
    console.log(`✅ Token deployed: ${tokenAddress}`)
    console.log(`Deploy TX ID: ${deployTxId}`)
    
    // Step 2: Wait for deployment confirmation
    if (deployTxId) {
      console.log('\n⏳ Step 2: Waiting for deployment confirmation...')
      await waitForTransactionConfirmation(deployTxId)
      console.log('✅ Deployment confirmed on blockchain')
    }
    
    // Step 3: Transfer 98% to User
    console.log(`\n💸 Step 3: Transferring 98% to user (${userWallet})...`)
    const totalSupply = 1_000_000_000n * 10n ** 18n
    const userAmount = (totalSupply * 98n) / 100n
    
    const userTransfer = await transferTokens({
      tokenAddress,
      to: userWallet,
      amount: userAmount.toString(),
      chainId,
      gasMode,
    })
    
    console.log(`User transfer TX ID: ${userTransfer.transactionId}`)
    
    if (userTransfer.transactionId) {
      await waitForTransactionConfirmation(userTransfer.transactionId)
      console.log('✅ User received 98% tokens')
    }
    
    // Step 4: Transfer 2% to DAO
    console.log(`\n💸 Step 4: Transferring 2% to DAO...`)
    const daoAmount = (totalSupply * 2n) / 100n
    const daoWallet = process.env.NEXT_PUBLIC_DAO_WALLET_ADDRESS!
    
    const daoTransfer = await transferTokens({
      tokenAddress,
      to: daoWallet,
      amount: daoAmount.toString(),
      chainId,
      gasMode,
    })
    
    console.log(`DAO transfer TX ID: ${daoTransfer.transactionId}`)
    
    if (daoTransfer.transactionId) {
      await waitForTransactionConfirmation(daoTransfer.transactionId)
      console.log('✅ DAO received 2% tokens')
    }
    
    console.log(`\n🎉 Token deployment complete!`)
    console.log(`Token: ${tokenAddress}`)
    console.log(`View on Basescan: https://sepolia.basescan.org/address/${tokenAddress}`)
    
    return Response.json({
      success: true,
      tokenAddress,
      tokenSymbol,
      gasMode,
    })
    
  } catch (error: any) {
    console.error('\n❌ Backend deployment error:', error)
    
    return Response.json(
      { 
        error: error.message || 'Token deployment failed',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}

