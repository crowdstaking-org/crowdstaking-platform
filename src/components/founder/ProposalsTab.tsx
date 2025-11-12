'use client'

import React, { useState, useEffect } from 'react'
import { ProposalCard } from '../dashboard/ProposalCard'
import { UserProfileLink } from '@/components/profile/UserProfileLink'
import type { Proposal } from '@/types/proposal'

interface ProposalsTabProps {
  projectId?: string
}

/**
 * Proposals Tab for Founder Dashboard
 * Multi-level tabs for different proposal states
 * Client Component - has sub-tab state
 */
export function ProposalsTab({ projectId }: ProposalsTabProps) {
  const [activeSubTab, setActiveSubTab] = useState('new')
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!projectId) {
      setLoading(false)
      return
    }

    setLoading(true)
    fetch(`/api/proposals?project_id=${projectId}`)
      .then((res) => res.json())
      .then((response) => {
        // API returns { success: true, data: { proposals: [...], count: N } }
        if (response.success && response.data) {
          setProposals(response.data.proposals || [])
        } else {
          console.error('Unexpected API response:', response)
          setProposals([])
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load proposals:', err)
        setLoading(false)
      })
  }, [projectId])

  // Calculate counts dynamically
  const counts = {
    new: proposals.filter((p) => p.status === 'pending_review').length,
    negotiation: proposals.filter(
      (p) => p.status === 'counter_offer_pending' || p.status === 'approved'
    ).length,
    active: proposals.filter(
      (p) => p.status === 'accepted' || p.status === 'work_in_progress'
    ).length,
    completed: proposals.filter((p) => p.status === 'completed').length,
    rejected: proposals.filter((p) => p.status === 'rejected').length,
  }

  const subTabs = [
    { id: 'new', label: 'New', count: counts.new },
    { id: 'negotiation', label: 'In Negotiation', count: counts.negotiation },
    { id: 'active', label: 'Active (In Progress)', count: counts.active },
    { id: 'completed', label: 'Completed', count: counts.completed },
    { id: 'rejected', label: 'Rejected', count: counts.rejected },
  ]

  // Filter proposals based on active sub-tab
  const getFilteredProposals = () => {
    switch (activeSubTab) {
      case 'new':
        return proposals.filter((p) => p.status === 'pending_review')
      case 'negotiation':
        return proposals.filter(
          (p) => p.status === 'counter_offer_pending' || p.status === 'approved'
        )
      case 'active':
        return proposals.filter(
          (p) => p.status === 'accepted' || p.status === 'work_in_progress'
        )
      case 'completed':
        return proposals.filter((p) => p.status === 'completed')
      case 'rejected':
        return proposals.filter((p) => p.status === 'rejected')
      default:
        return []
    }
  }

  const filteredProposals = getFilteredProposals()

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          {subTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                activeSubTab === tab.id
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading proposals...</p>
        </div>
      ) : filteredProposals.length > 0 ? (
        <div className="space-y-4">
          {filteredProposals.map((proposal) => (
            <div
              key={proposal.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    {proposal.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">From:</span>
                    <UserProfileLink
                      walletAddress={proposal.creator_wallet_address}
                      displayName={proposal.creator?.display_name}
                      avatarUrl={proposal.creator?.avatar_url}
                      trustScore={proposal.creator?.trust_score}
                      showTrustScore={true}
                      size="sm"
                    />
                  </div>
                </div>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold">
                  {(proposal.requested_cstake_amount / 10000000).toFixed(2)}%
                </span>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                {proposal.description}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Deliverable: {proposal.deliverable.substring(0, 50)}...
                  </span>
                </div>
                <button
                  onClick={() => {
                    // TODO: Implement proposal review logic
                    console.log('Review proposal:', proposal.id)
                  }}
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-semibold cursor-pointer"
                >
                  Review
                </button>
              </div>

              {proposal.foundation_notes && (
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>Foundation Notes:</strong> {proposal.foundation_notes}
                  </p>
                  {proposal.foundation_offer_cstake_amount && (
                    <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                      <strong>Counter-Offer:</strong>{' '}
                      {(proposal.foundation_offer_cstake_amount / 10000000).toFixed(2)}%
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No {subTabs.find((t) => t.id === activeSubTab)?.label.toLowerCase()}{' '}
            proposals yet.
          </p>
        </div>
      )}
    </div>
  )
}

