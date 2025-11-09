/**
 * ProposalsModule Component
 * Phase 6: Enhanced proposals list with earned amounts and portfolio stats
 * Shows all proposals with status, earned tokens, and total statistics
 */

'use client'

import { useEffect, useState } from 'react'
import type { Proposal } from '@/types/proposal'
import Link from 'next/link'
import { ExternalLink, TrendingUp, CheckCircle, Clock, XCircle } from 'lucide-react'

export function ProposalsModule() {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProposals()
  }, [])

  const fetchProposals = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/proposals/me')
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to fetch proposals')
      }
      
      const data = await response.json()
      setProposals(data.proposals || [])
    } catch (err: any) {
      console.error('Failed to fetch proposals:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Calculate statistics
  const completedProposals = proposals.filter(p => p.status === 'completed')
  const totalEarned = completedProposals.reduce((sum, p) => 
    sum + (p.foundation_offer_cstake_amount || p.requested_cstake_amount), 
    0
  )
  
  const inProgressCount = proposals.filter(p => p.status === 'work_in_progress').length
  const pendingCount = proposals.filter(p => 
    ['pending_review', 'counter_offer_pending', 'approved'].includes(p.status)
  ).length

  // Loading state
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-red-800 dark:text-red-400 mb-2">Fehler</h3>
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <button
          onClick={fetchProposals}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Erneut versuchen
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header with Stats */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Meine Beiträge
          </h3>
          {completedProposals.length > 0 && (
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total verdient</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {totalEarned.toLocaleString()} $CSTAKE
              </p>
            </div>
          )}
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {completedProposals.length}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Abgeschlossen</p>
          </div>
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {inProgressCount}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">In Arbeit</p>
          </div>
          <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {pendingCount}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Ausstehend</p>
          </div>
        </div>
      </div>

      {/* Proposals List */}
      <div className="p-6">
        {proposals.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-4">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Noch keine Proposals eingereicht
            </p>
            <Link
              href="/dashboard/propose"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Erste Proposal einreichen
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {proposals.map(proposal => (
              <ProposalCard key={proposal.id} proposal={proposal} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Individual Proposal Card Component
 */
function ProposalCard({ proposal }: { proposal: Proposal }) {
  // Determine earned amount
  const amount = proposal.status === 'completed'
    ? (proposal.foundation_offer_cstake_amount || proposal.requested_cstake_amount)
    : proposal.requested_cstake_amount

  // Status configuration
  const statusConfig: Record<string, { icon: any; color: string; bg: string; label: string }> = {
    pending_review: {
      icon: Clock,
      color: 'text-yellow-600 dark:text-yellow-400',
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      label: 'Pending Review'
    },
    counter_offer_pending: {
      icon: Clock,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      label: 'Counter-Offer'
    },
    approved: {
      icon: CheckCircle,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-900/20',
      label: 'Genehmigt'
    },
    accepted: {
      icon: CheckCircle,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      label: 'Akzeptiert'
    },
    work_in_progress: {
      icon: Clock,
      color: 'text-orange-600 dark:text-orange-400',
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      label: 'In Arbeit'
    },
    completed: {
      icon: CheckCircle,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-900/20',
      label: 'Abgeschlossen'
    },
    rejected: {
      icon: XCircle,
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-900/20',
      label: 'Abgelehnt'
    },
  }

  const config = statusConfig[proposal.status] || statusConfig.pending_review
  const StatusIcon = config.icon

  return (
    <div className={`border rounded-lg p-4 transition-all hover:shadow-md ${config.bg} border-gray-200 dark:border-gray-700`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
            {proposal.title}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 mb-2">
            {proposal.description}
          </p>
          <div className="flex items-center gap-4 text-sm">
            <span className="font-semibold text-gray-900 dark:text-white">
              {amount.toLocaleString()} $CSTAKE
            </span>
            {proposal.status === 'completed' && proposal.contract_release_tx && (
              <a
                href={`https://sepolia.basescan.org/tx/${proposal.contract_release_tx}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
              >
                <ExternalLink className="w-3 h-3" />
                <span className="text-xs">Transaktion</span>
              </a>
            )}
          </div>
        </div>
        
        {/* Status Badge */}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${config.bg}`}>
          <StatusIcon className={`w-4 h-4 ${config.color}`} />
          <span className={`text-xs font-semibold ${config.color}`}>
            {config.label}
          </span>
        </div>
      </div>
    </div>
  )
}

