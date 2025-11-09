'use client'

import React, { useState } from 'react'
import { Search, Filter } from 'lucide-react'
import { MissionCard } from './MissionCard'

interface DiscoverTabProps {
  onViewProject?: (projectId: string) => void
}

/**
 * Discover Tab for Cofounder Dashboard
 * Browse and filter available missions
 * Client Component - has search state
 */
export function DiscoverTab({ onViewProject }: DiscoverTabProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const missions = [
    {
      id: 'flight-ai',
      name: 'Project Flight-AI',
      founder: 'Sarah_Berlin',
      tags: ['AI', 'SaaS', 'Travel'],
      tokenStatus: 'illiquid' as const,
      coFounders: 1,
      distributed: 0.15,
      activeMissions: ['Logo & Brand Identity', 'Landing Page Development'],
    },
    {
      id: 'defi-llama',
      name: 'DeFi-Llama-Killer',
      founder: 'Alex.eth',
      tags: ['DeFi', 'Infra', 'Solidity'],
      tokenStatus: 'liquid' as const,
      coFounders: 12,
      distributed: 15,
      activeMissions: [
        'Develop v2-Analytics-Engine',
        'Optimize Subgraph-Performance',
      ],
    },
  ]

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search missions (e.g., 'AI', 'Rust', 'Marketing')..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg font-semibold text-sm">
            Latest
          </button>
          <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold text-sm hover:bg-gray-200 dark:hover:bg-gray-600">
            Most Co-Founders
          </button>
          <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold text-sm hover:bg-gray-200 dark:hover:bg-gray-600">
            Liquid Tokens
          </button>
          <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold text-sm hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center space-x-1">
            <Filter className="w-4 h-4" />
            <span>Skills</span>
          </button>
        </div>
      </div>

      {/* Mission Cards Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {missions.map((mission) => (
          <MissionCard
            key={mission.id}
            {...mission}
            onViewProject={() => onViewProject?.(mission.id)}
          />
        ))}
      </div>
    </div>
  )
}

