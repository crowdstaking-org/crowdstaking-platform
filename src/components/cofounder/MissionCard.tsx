import React from 'react'
import { Users, TrendingUp, ArrowRight } from 'lucide-react'

interface MissionCardProps {
  name: string
  founder: string
  tags: string[]
  tokenStatus: 'liquid' | 'illiquid'
  coFounders: number
  distributed: number
  activeMissions: string[]
  onViewProject?: () => void
}

/**
 * Mission Card for Cofounder Dashboard
 * Shows mission details with liquid/illiquid status
 * Server Component
 */
export function MissionCard({
  name,
  founder,
  tags,
  tokenStatus,
  coFounders,
  distributed,
  activeMissions,
  onViewProject,
}: MissionCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Founder: <span className="font-semibold">{founder}</span>
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            tokenStatus === 'liquid'
              ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
              : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
          }`}
        >
          {tokenStatus === 'liquid' ? 'Liquid' : 'Illiquid'}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex items-center space-x-6 mb-4 text-sm">
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <span className="text-gray-700 dark:text-gray-300">
            {coFounders} Co-Founders
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <span className="text-gray-700 dark:text-gray-300">
            {distributed}% Distributed
          </span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Active Mini-Missions:
        </p>
        <ul className="space-y-1">
          {activeMissions.map((mission, index) => (
            <li
              key={index}
              className="text-sm text-gray-600 dark:text-gray-400 pl-4 relative before:content-['•'] before:absolute before:left-0"
            >
              {mission}
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={onViewProject}
        className="w-full flex items-center justify-center space-x-2 bg-blue-600 dark:bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-semibold"
      >
        <span>View Project & Propose</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  )
}

