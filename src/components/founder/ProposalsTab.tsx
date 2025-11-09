'use client'

import React, { useState } from 'react'
import { ProposalCard } from '../dashboard/ProposalCard'

/**
 * Proposals Tab for Founder Dashboard
 * Multi-level tabs for different proposal states
 * Client Component - has sub-tab state
 */
export function ProposalsTab() {
  const [activeSubTab, setActiveSubTab] = useState('new')

  const subTabs = [
    { id: 'new', label: 'New', count: 1 },
    { id: 'negotiation', label: 'In Negotiation', count: 0 },
    { id: 'active', label: 'Active (In Progress)', count: 0 },
    { id: 'completed', label: 'Completed', count: 0 },
    { id: 'rejected', label: 'Rejected', count: 0 },
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
      {activeSubTab === 'new' && (
        <div className="space-y-4">
          <ProposalCard
            from="Ben (Berlin, DE)"
            mission="Logo & Brand Identity Design"
            excerpt="Hello, I'm a Senior Brand Designer and would take on this task for 0.15% of the tokens..."
            aiRecommendation="0.1% - 0.2%"
            status="fair"
          />
        </div>
      )}

      {activeSubTab !== 'new' && (
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

