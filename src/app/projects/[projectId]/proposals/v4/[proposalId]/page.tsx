'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useActiveAccount } from 'thirdweb/react'
import { ConnectButton } from 'thirdweb/react'
import { client, wallets } from '@/lib/thirdweb'
import { LoadingButton } from '@/components/ui/LoadingButton'
import { showSuccess, showError, showLoading, dismissToast } from '@/lib/toast'
import { ENABLE_V4_PROTOCOL } from '@/lib/features'
import type { GovernanceProposal, GovernanceVote, ProposalType } from '@/types/v4'
import { ArrowLeft, CheckCircle, XCircle, Clock, FileText, DollarSign, TrendingUp, X, AlertCircle, Users } from 'lucide-react'

/**
 * v4 Governance Proposal Detail Page
 * Shows proposal details, voting interface, and execution
 */
export default function V4ProposalDetailPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params?.projectId as string
  const proposalId = params?.proposalId as string
  const account = useActiveAccount()

  const [proposal, setProposal] = useState<GovernanceProposal | null>(null)
  const [votes, setVotes] = useState<GovernanceVote[]>([])
  const [userVote, setUserVote] = useState<GovernanceVote | null>(null)
  const [loading, setLoading] = useState(true)
  const [isVoting, setIsVoting] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const [votingPower, setVotingPower] = useState(0)

  if (!ENABLE_V4_PROTOCOL) {
    router.push(`/projects/${projectId}`)
    return null
  }

  useEffect(() => {
    if (projectId && proposalId) {
      fetchProposal()
      fetchVotes()
      if (account?.address) {
        fetchVotingPower()
      }
    }
  }, [projectId, proposalId, account?.address])

  const fetchProposal = async () => {
    try {
      const response = await fetch(`/api/v4/proposals/${proposalId}`)
      if (!response.ok) {
        if (response.status === 404) {
          setProposal(null)
          setLoading(false)
          return
        }
        throw new Error('Failed to fetch proposal')
      }
      const data = await response.json()
      setProposal(data.proposal)
    } catch (error) {
      console.error('Failed to fetch proposal:', error)
      showError('Failed to load proposal')
    } finally {
      setLoading(false)
    }
  }

  const fetchVotes = async () => {
    try {
      const response = await fetch(`/api/v4/proposals/${proposalId}/votes`)
      if (!response.ok) {
        throw new Error('Failed to fetch votes')
      }
      const data = await response.json()
      setVotes(data.votes || [])
      
      // Check if user has already voted
      if (account?.address) {
        const userVote = data.votes?.find((v: GovernanceVote) => v.voter_address.toLowerCase() === account.address.toLowerCase())
        if (userVote) {
          setUserVote(userVote)
        }
      }
    } catch (error) {
      console.error('Failed to fetch votes:', error)
    }
  }

  const fetchVotingPower = async () => {
    if (!account?.address || !projectId) return
    
    try {
      const response = await fetch(`/api/v4/partners/voting-power?projectId=${projectId}&wallet=${account.address}`)
      if (!response.ok) {
        throw new Error('Failed to fetch voting power')
      }
      const data = await response.json()
      setVotingPower(data.votingPower || 0)
    } catch (error) {
      console.error('Failed to fetch voting power:', error)
      setVotingPower(0)
    }
  }

  const handleVote = async (support: boolean) => {
    if (!account?.address) {
      showError('Please connect your wallet first')
      return
    }

    if (votingPower === 0) {
      showError('You have no voting power (not a partner)')
      return
    }

    setIsVoting(true)
    const loadingToast = showLoading('Submitting vote...')

    try {
      const response = await fetch(`/api/v4/proposals/${proposalId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voter: account.address,
          support,
          votingPowerBps: votingPower,
        }),
      })

      dismissToast(loadingToast)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to vote')
      }

      const result = await response.json()
      setUserVote(result.vote)
      setVotes([...votes, result.vote])
      showSuccess(support ? 'Voted YES' : 'Voted NO')
    } catch (error: any) {
      showError(error.message || 'Failed to vote')
    } finally {
      setIsVoting(false)
    }
  }

  const handleExecute = async () => {
    if (!account?.address) {
      showError('Please connect your wallet first')
      return
    }

    setIsExecuting(true)
    const loadingToast = showLoading('Executing proposal on-chain...')

    try {
      // Convert proposal ID to number/bigint
      const proposalIdNum = parseInt(proposalId, 10)
      if (isNaN(proposalIdNum)) {
        throw new Error('Invalid proposal ID')
      }

      const response = await fetch(`/api/v4/proposals/${proposalId}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
        }),
      })

      dismissToast(loadingToast)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to execute proposal')
      }

      const result = await response.json()
      showSuccess('Proposal executed successfully!')
      
      // Refresh proposal data
      fetchProposal()
    } catch (error: any) {
      showError(error.message || 'Failed to execute proposal')
    } finally {
      setIsExecuting(false)
    }
  }

  const getProposalTypeInfo = (type: ProposalType) => {
    switch (type) {
      case 'WORK':
        return { label: 'Work Proposal', icon: FileText, color: 'blue' }
      case 'CAPITAL':
        return { label: 'Capital Proposal', icon: DollarSign, color: 'green' }
      case 'PAYOUT':
        return { label: 'Payout Proposal', icon: TrendingUp, color: 'purple' }
      case 'BOUNTY':
        return { label: 'Bounty Proposal', icon: DollarSign, color: 'yellow' }
      case 'REVOKE':
        return { label: 'Revoke Proposal', icon: X, color: 'red' }
      default:
        return { label: 'Proposal', icon: FileText, color: 'gray' }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading proposal...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!proposal) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Proposal Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The proposal you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => router.push(`/projects/${projectId}`)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Back to Project
            </button>
          </div>
        </div>
      </div>
    )
  }

  const typeInfo = getProposalTypeInfo(proposal.type)
  const totalVotes = votes.reduce((sum, v) => sum + v.voting_power_bps, 0)
  const forVotes = votes.filter((v) => v.support).reduce((sum, v) => sum + v.voting_power_bps, 0)
  const againstVotes = totalVotes - forVotes
  const forPercentage = totalVotes > 0 ? (forVotes / totalVotes) * 100 : 0
  const isVotingActive = proposal.status === 'pending_review' || proposal.status === 'active'
  const canExecute = proposal.status === 'pending_review' && totalVotes > 0 && forVotes > againstVotes

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.push(`/projects/${projectId}`)}
          className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Project
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {(() => {
                  const getIconClasses = (c: string) => {
                    switch (c) {
                      case 'blue':
                        return { bg: 'bg-blue-100 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400' }
                      case 'green':
                        return { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-600 dark:text-green-400' }
                      case 'purple':
                        return { bg: 'bg-purple-100 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400' }
                      case 'yellow':
                        return { bg: 'bg-yellow-100 dark:bg-yellow-900/20', text: 'text-yellow-600 dark:text-yellow-400' }
                      case 'red':
                        return { bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400' }
                      default:
                        return { bg: 'bg-gray-100 dark:bg-gray-900/20', text: 'text-gray-600 dark:text-gray-400' }
                    }
                  }
                  const iconClasses = getIconClasses(typeInfo.color)
                  return (
                    <div className={`w-10 h-10 rounded-lg ${iconClasses.bg} flex items-center justify-center`}>
                      <typeInfo.icon className={`w-5 h-5 ${iconClasses.text}`} />
                    </div>
                  )
                })()}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {typeInfo.label}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Created {new Date(proposal.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              proposal.status === 'approved' ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' :
              proposal.status === 'rejected' ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400' :
              'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
            }`}>
              {proposal.status}
            </span>
          </div>

          {/* Proposal Payload */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Proposal Details
            </h3>
            <pre className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap font-mono">
              {JSON.stringify(proposal.payload, null, 2)}
            </pre>
          </div>

          {/* Voting Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">For</span>
              </div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {forVotes / 100}%
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {forVotes} basis points
              </div>
            </div>
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Against</span>
              </div>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {againstVotes / 100}%
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {againstVotes} basis points
              </div>
            </div>
          </div>

          {/* Voting Progress Bar */}
          {totalVotes > 0 && (
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>Voting Progress</span>
                <span>{totalVotes / 100}% of total shares</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all"
                  style={{ width: `${forPercentage}%` }}
                />
              </div>
            </div>
          )}

          {/* Voting Interface */}
          {isVotingActive && !userVote && (
            <div className="mb-6 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              {!account ? (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Connect your wallet to vote on this proposal
                  </p>
                  <ConnectButton client={client} wallets={wallets} />
                </div>
              ) : votingPower === 0 ? (
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      You don't have voting power. Only project partners can vote.
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                    Your Voting Power: {votingPower / 100}%
                  </p>
                  <div className="flex gap-4">
                    <LoadingButton
                      onClick={() => handleVote(true)}
                      isLoading={isVoting}
                      disabled={isVoting}
                      className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Vote YES
                    </LoadingButton>
                    <LoadingButton
                      onClick={() => handleVote(false)}
                      isLoading={isVoting}
                      disabled={isVoting}
                      className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      <XCircle className="w-5 h-5 mr-2" />
                      Vote NO
                    </LoadingButton>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User's Vote Display */}
          {userVote && (
            <div className={`mb-6 p-4 rounded-lg ${
              userVote.support
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
            }`}>
              <div className="flex items-center gap-2">
                {userVote.support ? (
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                )}
                <span className="font-semibold text-gray-900 dark:text-white">
                  You voted {userVote.support ? 'YES' : 'NO'} with {userVote.voting_power_bps / 100}% voting power
                </span>
              </div>
            </div>
          )}

          {/* Execute Button */}
          {canExecute && account && (
            <div className="mb-6">
              <LoadingButton
                onClick={handleExecute}
                isLoading={isExecuting}
                disabled={isExecuting}
                className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Execute Proposal
              </LoadingButton>
            </div>
          )}

          {/* Votes List */}
          {votes.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Votes ({votes.length})
              </h3>
              <div className="space-y-2">
                {votes.map((vote) => (
                  <div
                    key={vote.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {vote.support ? (
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      )}
                      <span className="font-mono text-sm text-gray-900 dark:text-white">
                        {vote.voter_address.slice(0, 6)}...{vote.voter_address.slice(-4)}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {vote.voting_power_bps / 100}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

