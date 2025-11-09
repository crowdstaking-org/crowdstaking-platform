/**
 * PortfolioStats Component
 * Phase 6: Displays portfolio statistics and completed work showcase
 * Shows key metrics: total earned, completion rate, success rate
 */

'use client'

import { useEffect, useState } from 'react'
import type { Proposal } from '@/types/proposal'
import { TrendingUp, CheckCircle, Target, Award, ExternalLink } from 'lucide-react'

export function PortfolioStats() {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProposals()
  }, [])

  const fetchProposals = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/proposals/me')
      
      if (!response.ok) {
        throw new Error('Failed to fetch proposals')
      }
      
      const data = await response.json()
      setProposals(data.proposals || [])
    } catch (error) {
      console.error('Failed to fetch proposals:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate statistics
  const completed = proposals.filter(p => p.status === 'completed')
  const inProgress = proposals.filter(p => p.status === 'work_in_progress')
  const accepted = proposals.filter(p => 
    ['approved', 'accepted', 'work_in_progress', 'completed'].includes(p.status)
  )
  const rejected = proposals.filter(p => p.status === 'rejected')
  const total = proposals.length

  const totalEarned = completed.reduce((sum, p) => 
    sum + (p.foundation_offer_cstake_amount || p.requested_cstake_amount), 
    0
  )

  const successRate = total > 0 ? ((accepted.length / total) * 100).toFixed(1) : '0'
  const completionRate = accepted.length > 0 
    ? ((completed.length / accepted.length) * 100).toFixed(1) 
    : '0'

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Portfolio Übersicht
          </h3>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={TrendingUp}
            label="Total Verdient"
            value={`${totalEarned.toLocaleString()} $CSTAKE`}
            color="green"
          />
          <StatCard
            icon={CheckCircle}
            label="Abgeschlossen"
            value={completed.length.toString()}
            color="blue"
          />
          <StatCard
            icon={Target}
            label="Erfolgsrate"
            value={`${successRate}%`}
            color="purple"
          />
          <StatCard
            icon={Award}
            label="Completion Rate"
            value={`${completionRate}%`}
            color="orange"
          />
        </div>

        {/* Detailed Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Proposals</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{total}</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">In Arbeit</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{inProgress.length}</p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Abgelehnt</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{rejected.length}</p>
          </div>
        </div>

        {/* Completed Work List */}
        {completed.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
              Abgeschlossene Arbeit
            </h4>
            <div className="space-y-2">
              {completed.map(proposal => (
                <CompletedWorkCard key={proposal.id} proposal={proposal} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {total === 0 && (
          <div className="text-center py-8">
            <Award className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Noch keine Proposals eingereicht
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Reiche deine erste Proposal ein, um dein Portfolio aufzubauen!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Stat Card Component
 */
function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  color 
}: { 
  icon: any
  label: string
  value: string
  color: 'green' | 'blue' | 'purple' | 'orange'
}) {
  const colorClasses = {
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
      <div className={`inline-flex items-center justify-center p-2 rounded-lg mb-2 ${colorClasses[color]}`}>
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        {value}
      </p>
      <p className="text-xs text-gray-600 dark:text-gray-400">
        {label}
      </p>
    </div>
  )
}

/**
 * Completed Work Card Component
 */
function CompletedWorkCard({ proposal }: { proposal: Proposal }) {
  const amount = proposal.foundation_offer_cstake_amount || proposal.requested_cstake_amount

  return (
    <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800">
      <div className="flex-1">
        <p className="font-medium text-gray-900 dark:text-white text-sm">
          {proposal.title}
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          {new Date(proposal.created_at).toLocaleDateString('de-DE')}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-green-600 dark:text-green-400 font-bold">
          +{amount.toLocaleString()} $CSTAKE
        </span>
        {proposal.contract_release_tx && (
          <a
            href={`https://sepolia.basescan.org/tx/${proposal.contract_release_tx}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
            title="View on Basescan"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  )
}

