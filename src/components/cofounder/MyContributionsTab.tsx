'use client'

import React, { useState } from 'react'
import { ContributionCard } from './ContributionCard'

/**
 * My Contributions Tab for Cofounder Dashboard
 * Shows user's proposals and their status
 * Client Component - has sub-tab state
 */
export function MyContributionsTab() {
  const [activeSubTab, setActiveSubTab] = useState('pending')

  const subTabs = [
    { id: 'drafts', label: 'Drafts', count: 0 },
    { id: 'pending', label: 'Pending', count: 2 },
    { id: 'active', label: 'Active', count: 0 },
    { id: 'completed', label: 'Completed', count: 0 },
  ]

  const pendingContributions = [
    {
      project: 'Project Flight-AI',
      title: 'Logo & Brand Identity Design',
      yourRequest: 0.15,
      status: 'waiting' as const,
      founderName: 'Sarah_Berlin',
    },
    {
      project: 'DeFi-Llama-Killer',
      title: 'Optimize Subgraph-Performance',
      yourRequest: 0.5,
      status: 'counter-offer' as const,
      counterOffer: 0.4,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          {subTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-colors whitespace-nowrap ${
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
      {activeSubTab === 'pending' && (
        <div className="space-y-4">
          {pendingContributions.map((contribution, index) => (
            <ContributionCard key={index} {...contribution} />
          ))}
        </div>
      )}

      {activeSubTab !== 'pending' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No {subTabs.find((t) => t.id === activeSubTab)?.label.toLowerCase()}{' '}
            contributions yet.
          </p>
        </div>
      )}
    </div>
  )
}

