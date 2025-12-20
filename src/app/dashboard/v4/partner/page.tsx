'use client'

import { useState, useEffect } from 'react'
import { useActiveAccount } from 'thirdweb/react'
import { ConnectButton } from 'thirdweb/react'
import { client, wallets, deploymentChain, supportedChains } from '@/lib/thirdweb'
import { sendTransaction, prepareContractCall, getContract } from 'thirdweb'
import { Layout } from '@/components/Layout'
import { LoadingButton } from '@/components/ui/LoadingButton'
import { showSuccess, showError, showLoading, dismissToast } from '@/lib/toast'
import { ENABLE_V4_PROTOCOL } from '@/lib/features'
import type { PartnerShare, DividendClaim, V4Project } from '@/types/v4'
import { 
  Wallet, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  ExternalLink,
  Coins,
  FileText,
  XCircle
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ShareWithProject extends PartnerShare {
  project: V4Project
}

/**
 * v4 Partner Dashboard
 * Shows partner shares, SBTs, and dividend claims
 */
export default function V4PartnerDashboardPage() {
  const router = useRouter()
  const account = useActiveAccount()
  const [shares, setShares] = useState<ShareWithProject[]>([])
  const [dividends, setDividends] = useState<DividendClaim[]>([])
  const [availablePeriods, setAvailablePeriods] = useState<Record<string, string[]>>({})
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState<Record<string, boolean>>({})
  const [activeTab, setActiveTab] = useState<'shares' | 'dividends'>('shares')

  if (!ENABLE_V4_PROTOCOL) {
    router.push('/cofounder-dashboard')
    return null
  }

  useEffect(() => {
    if (account?.address) {
      fetchShares()
      fetchDividends()
    } else {
      setLoading(false)
    }
  }, [account?.address])

  useEffect(() => {
    // Fetch available periods for each project
    if (shares.length > 0) {
      shares.forEach((share) => {
        if (share.status === 'active') {
          fetchAvailablePeriods(share.project.id)
        }
      })
    }
  }, [shares])

  const fetchShares = async () => {
    if (!account?.address) return

    try {
      const response = await fetch(`/api/v4/partners/shares?wallet=${account.address}`)
      if (!response.ok) {
        throw new Error('Failed to fetch shares')
      }
      const data = await response.json()
      setShares(data.shares || [])
    } catch (error) {
      console.error('Failed to fetch shares:', error)
      showError('Failed to load partner shares')
    } finally {
      setLoading(false)
    }
  }

  const fetchDividends = async () => {
    if (!account?.address) return

    try {
      const response = await fetch(`/api/v4/partners/dividends?wallet=${account.address}`)
      if (!response.ok) {
        throw new Error('Failed to fetch dividends')
      }
      const data = await response.json()
      setDividends(data.claims || [])
    } catch (error) {
      console.error('Failed to fetch dividends:', error)
    }
  }

  const fetchAvailablePeriods = async (projectId: string) => {
    try {
      const response = await fetch(`/api/v4/projects/${projectId}/dividends/periods`)
      if (!response.ok) {
        throw new Error('Failed to fetch periods')
      }
      const data = await response.json()
      setAvailablePeriods((prev) => ({
        ...prev,
        [projectId]: data.periods || [],
      }))
    } catch (error) {
      console.error('Failed to fetch available periods:', error)
    }
  }

  const handleClaimDividend = async (share: ShareWithProject, period: string) => {
    if (!account?.address) {
      showError('Please connect your wallet')
      return
    }

    const claimKey = `${share.id}-${period}`
    setClaiming((prev) => ({ ...prev, [claimKey]: true }))
    let loadingToast = showLoading('Validating claim...')

    try {
      // Step 1: Validate the claim is possible
      const validationResponse = await fetch('/api/v4/vaults/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: share.project.id,
          period,
          walletAddress: account.address,
        }),
      })

      if (!validationResponse.ok) {
        const error = await validationResponse.json()
        throw new Error(error.error || 'Cannot claim dividend')
      }

      dismissToast(loadingToast)
      loadingToast = showLoading('Preparing transaction...')

      // Step 2: Get ProfitVault contract address
      const contractResponse = await fetch(`/api/v4/projects/${share.project.id}/contracts?type=profit_vault`)
      if (!contractResponse.ok) {
        throw new Error('Failed to get contract address')
      }
      const { address: vaultAddress, chainId } = await contractResponse.json()

      // Step 3: Prepare contract call
      // Convert period string to bytes32 (same as ethers.encodeBytes32String)
      // ethers.encodeBytes32String pads with null bytes and ensures exactly 32 bytes
      const periodBytes = Buffer.from(period, 'utf8')
      if (periodBytes.length > 31) {
        throw new Error('Period string too long (max 31 bytes)')
      }
      const periodBytes32 = `0x${periodBytes.toString('hex').padEnd(64, '0')}` as `0x${string}`
      
      // Get chain from config (use deploymentChain as fallback)
      const chain = supportedChains.find(c => c.id === chainId) || deploymentChain
      
      const contract = getContract({
        client,
        chain,
        address: vaultAddress as `0x${string}`,
      })

      const claimTx = prepareContractCall({
        contract,
        method: 'function claim(bytes32 periodId)',
        params: [periodBytes32],
      })

      dismissToast(loadingToast)
      loadingToast = showLoading('Please sign the transaction in your wallet...')

      // Step 4: Send transaction (user signs with their wallet)
      const receipt = await sendTransaction({
        transaction: claimTx,
        account: account,
      })

      dismissToast(loadingToast)
      loadingToast = showLoading('Waiting for confirmation...')

      // Wait for transaction confirmation
      const txHash = receipt.transactionHash

      // Step 5: Calculate the claimed amount
      // Fetch the amount from the API (calculates based on share percentage and period total)
      let claimedAmount = '0'
      try {
        const amountResponse = await fetch(
          `/api/v4/vaults/claim/amount?projectId=${share.project.id}&period=${encodeURIComponent(period)}&wallet=${account.address}`
        )
        if (amountResponse.ok) {
          const amountData = await amountResponse.json()
          claimedAmount = amountData.amount || '0'
        }
      } catch (e) {
        console.warn('Could not fetch claim amount, will use 0', e)
      }

      dismissToast(loadingToast)
      loadingToast = showLoading('Recording claim in database...')

      // Step 6: Record claim in database
      const recordResponse = await fetch('/api/v4/dividends/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: share.project.id,
          partnerShareId: share.id,
          vaultPeriod: period,
          amount: claimedAmount, // Will be '0' if we couldn't parse it
          txHash,
        }),
      })

      dismissToast(loadingToast)

      if (!recordResponse.ok) {
        const error = await recordResponse.json()
        throw new Error(error.error || 'Failed to record claim')
      }

      showSuccess('Dividend claimed successfully!')
      fetchDividends() // Refresh the list
    } catch (error: any) {
      dismissToast(loadingToast)
      // Handle user rejection
      if (error?.message?.includes('User rejected') || 
          error?.message?.includes('user denied') ||
          error?.code === 4001) {
        showError('Transaction was rejected. Please try again.')
      } else {
        showError(error.message || 'Failed to claim dividend')
      }
    } finally {
      setClaiming((prev) => ({ ...prev, [claimKey]: false }))
    }
  }

  const getStatusBadge = (status: PartnerShare['status']) => {
    switch (status) {
      case 'active':
        return { label: 'Active', color: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400', icon: CheckCircle }
      case 'pending_work':
        return { label: 'Pending Work', color: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400', icon: Clock }
      case 'pending_capital':
        return { label: 'Pending Capital', color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400', icon: Clock }
      case 'pending':
        return { label: 'Pending', color: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400', icon: Clock }
      case 'revoked':
        return { label: 'Revoked', color: 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400', icon: XCircle }
      default:
        return { label: status, color: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400', icon: AlertCircle }
    }
  }

  const totalSharePercentage = shares
    .filter((s) => s.status === 'active')
    .reduce((sum, s) => sum + s.share_bps, 0) / 100

  if (!account) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center">
              <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Partner Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Connect your wallet to view your partner shares and dividends
              </p>
              <ConnectButton client={client} wallets={wallets} />
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Partner Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your partner shares, SBTs, and dividend claims
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Shares</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {totalSharePercentage.toFixed(2)}%
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Projects</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {shares.filter((s) => s.status === 'active').length}
                  </p>
                </div>
                <FileText className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Dividend Claims</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {dividends.length}
                  </p>
                </div>
                <Coins className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-6">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab('shares')}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'shares'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                } cursor-pointer`}
              >
                Partner Shares
              </button>
              <button
                onClick={() => setActiveTab('dividends')}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'dividends'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                } cursor-pointer`}
              >
                Dividend Claims
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
              ) : activeTab === 'shares' ? (
                shares.length === 0 ? (
                  <div className="text-center py-12">
                    <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      You don't have any partner shares yet
                    </p>
                    <button
                      onClick={() => router.push('/discover-projects')}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      Discover Projects
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {shares.map((share) => {
                      const statusBadge = getStatusBadge(share.status)
                      const StatusIcon = statusBadge.icon
                      return (
                        <div
                          key={share.id}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                {share.project.name}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {share.project.mission || 'No mission description'}
                              </p>
                              <div className="flex items-center gap-4 text-sm">
                                <span className="text-gray-600 dark:text-gray-400">
                                  Share: <span className="font-semibold text-gray-900 dark:text-white">{share.share_bps / 100}%</span>
                                </span>
                                {share.sbt_token_id && (
                                  <span className="text-gray-600 dark:text-gray-400">
                                    SBT: <span className="font-mono text-gray-900 dark:text-white">#{share.sbt_token_id}</span>
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusBadge.color}`}>
                              <StatusIcon className="w-4 h-4" />
                              <span className="text-sm font-semibold">{statusBadge.label}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 flex-wrap">
                            <button
                              onClick={() => router.push(`/projects/${share.project.id}`)}
                              className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                            >
                              View Project
                            </button>
                            {share.proposal_id && (
                              <button
                                onClick={() => router.push(`/projects/${share.project.id}/proposals/v4/${share.proposal_id}`)}
                                className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                              >
                                View Proposal
                              </button>
                            )}
                            {share.status === 'active' && availablePeriods[share.project.id] && availablePeriods[share.project.id].length > 0 && (
                              <div className="flex items-center gap-2">
                                {availablePeriods[share.project.id].map((period) => {
                                  const claimKey = `${share.id}-${period}`
                                  const alreadyClaimed = dividends.some(
                                    (d) => d.partner_share_id === share.id && d.vault_period === period
                                  )
                                  return (
                                    <LoadingButton
                                      key={period}
                                      onClick={() => handleClaimDividend(share, period)}
                                      isLoading={claiming[claimKey] || false}
                                      disabled={alreadyClaimed || claiming[claimKey]}
                                      className="px-3 py-1 text-xs bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                    >
                                      {alreadyClaimed ? 'Claimed' : `Claim ${period}`}
                                    </LoadingButton>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )
              ) : (
                dividends.length === 0 ? (
                  <div className="text-center py-12">
                    <Coins className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      No dividend claims yet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dividends.map((claim) => (
                      <div
                        key={claim.id}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-6"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                              Period: {claim.vault_period}
                            </h3>
                            {claim.amount && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                Amount: {claim.amount}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                              Claimed: {new Date(claim.claimed_at).toLocaleString()}
                            </p>
                          </div>
                          {claim.tx_hash && (
                            <a
                              href={`https://basescan.org/tx/${claim.tx_hash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              <ExternalLink className="w-4 h-4" />
                              View Transaction
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

