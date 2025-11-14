'use client'

import { useState } from 'react'
import { useActiveAccount } from 'thirdweb/react'
import toast from 'react-hot-toast'
import { deployToken } from '@/lib/contracts/deployToken'

export interface LaunchMissionData {
  projectName: string
  mission: string
  vision: string
  tags: string
  tokenName: string
  tokenSymbol: string
}

export interface LaunchResult {
  success: boolean
  projectId?: string
  tokenAddress?: string
  projectWalletAddress?: string
  error?: string
}

/**
 * Hook for launching a new mission with token deployment
 * 
 * Flow:
 * 1. Create project in database
 * 2. Deploy token via Smart Account (SPONSORED GAS - user pays $0!)
 * 3. Update project with token info
 * 4. Create initial mission
 * 
 * User signs transactions but pays NO GAS!
 * ThirdWeb Paymaster sponsors all gas fees via Smart Account.
 */
export function useLaunchMission() {
  const [isLaunching, setIsLaunching] = useState(false)
  const [currentPhase, setCurrentPhase] = useState<string>('')
  const account = useActiveAccount()
  
  async function launchMission(data: LaunchMissionData): Promise<LaunchResult> {
    if (!account) {
      toast.error('Please connect your wallet to launch mission')
      return { success: false, error: 'Wallet not connected' }
    }
    
    setIsLaunching(true)
    let projectId: string | null = null
    let tokenAddress: string | undefined = undefined
    
    try {
      // Phase 1: Create Project in Database
      setCurrentPhase('Creating project in database...')
      const tagsArray = data.tags.split(',').map(t => t.trim()).filter(Boolean)
      
      const projectResponse = await fetch('/api/projects', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-wallet-address': account.address, // Send wallet address for auth
        },
        body: JSON.stringify({
          name: data.projectName,
          description: data.vision,
          tags: tagsArray,
          founder_wallet_address: account.address,
          token_name: data.projectName,
          token_symbol: `$${data.projectName.substring(0, 6).toUpperCase()}`,
          total_supply: 1000000000, // 1 Billion
          token_status: 'illiquid',
          status: 'active',
        }),
      })
      
      if (!projectResponse.ok) {
        const errorData = await projectResponse.json()
        throw new Error(errorData.error || 'Failed to create project')
      }
      
      const responseData = await projectResponse.json()
      const project = responseData.data.project
      projectId = project.id
      
      // Phase 2: Deploy Token via Smart Account (SPONSORED GAS!)
      setCurrentPhase('🚀 Deploying token...')
      toast('Deploying token - gas is sponsored by CrowdStaking! You pay $0!', {
        icon: '⚡',
        duration: 8000,
      })
      
      // Deploy token via frontend with Smart Account + Sponsored Gas
      const deployResult = await deployToken({
        tokenName: data.tokenName,
        tokenSymbol: data.tokenSymbol,
        projectName: data.projectName,
        userAccount: account, // Smart Account with sponsorGas: true!
        onStatusUpdate: setCurrentPhase,
      })
      
      if (!deployResult.success || !deployResult.tokenAddress) {
        throw new Error(deployResult.error || 'Token deployment failed')
      }
      
      tokenAddress = deployResult.tokenAddress
      
      const shortAddress = `${tokenAddress.slice(0, 6)}...${tokenAddress.slice(-4)}`
      toast.success(
        `${data.tokenSymbol} deployed at ${shortAddress}! Gas was sponsored - you paid $0!`,
        { duration: 15000 }
      )
      console.log('\n🎉 Token Deployment Success!')
      console.log('Token Address:', tokenAddress)
      console.log('Token Symbol:', data.tokenSymbol)
      console.log('Basescan:', `https://sepolia.basescan.org/address/${tokenAddress}`)
      console.log('💰 Gas: SPONSORED by ThirdWeb - User paid $0!')
      
      // Phase 3: Update Project with Token Info
      setCurrentPhase('Finalizing project setup...')
      await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-wallet-address': account.address,
        },
        body: JSON.stringify({
          token_address: tokenAddress,
          token_name: data.tokenName,
          token_symbol: data.tokenSymbol,
          project_wallet_address: account.address, // For MVP, founder wallet = project wallet
          token_status: 'illiquid',
        }),
      })
      
      // Phase 4: Create Initial Mission
      setCurrentPhase('Creating initial mission...')
      await fetch('/api/missions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-wallet-address': account.address,
        },
        body: JSON.stringify({
          project_id: projectId,
          title: data.mission,
          description: data.vision,
          status: 'active',
        }),
      })
      
      toast.success('🎉 Mission launched successfully!')
      
      return {
        success: true,
        projectId,
        tokenAddress: tokenAddress!,
        projectWalletAddress: account.address,
      }
      
    } catch (error: any) {
      console.error('Launch failed:', error)
      
      // Blockchain-specific error handling
      if (error.message?.includes('User rejected') || 
          error.message?.includes('user denied') ||
          error.message?.includes('cancelled by user') ||
          error.code === 4001) {
        toast.error('Transaction cancelled. Please try again when ready.')
      } else if (error.message?.includes('insufficient funds') ||
                 error.message?.includes('insufficient balance')) {
        toast.error('Insufficient ETH for gas fees. Get testnet ETH from Alchemy faucet.', { duration: 10000 })
        console.log('Faucet:', 'https://www.alchemy.com/faucets/base-sepolia')
      } else if (error.message?.includes('nonce')) {
        toast.error('Transaction nonce error. Please refresh and try again.')
      } else if (error.message?.includes('gas required exceeds')) {
        toast.error('Transaction would fail. Please check your wallet balance.')
      } else if (error.message?.includes('network') || 
                 error.message?.includes('connection')) {
        toast.error('Network error. Please check your connection and try again.')
      } else if (error.message?.includes('Token deployment')) {
        toast.error('Token deployment failed. No changes made to blockchain.')
      } else if (error.message?.includes('2% transfer')) {
        toast.error('Token deployed but 2% transfer failed. Check console for token address.', { duration: 15000 })
        if (tokenAddress) {
          console.log('Token address:', tokenAddress)
          console.log('View on Basescan:', `https://sepolia.basescan.org/address/${tokenAddress}`)
        }
      } else {
        toast.error(error.message || 'Failed to launch mission. Please try again.')
      }
      
      return { success: false, error: error.message, projectId: projectId || undefined }
      
    } finally {
      setIsLaunching(false)
      setCurrentPhase('')
    }
  }
  
  return {
    launchMission,
    isLaunching,
    currentPhase,
  }
}

