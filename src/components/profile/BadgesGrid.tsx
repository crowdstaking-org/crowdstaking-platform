/**
 * Badges Grid Component
 * Displays earned badges with click-to-view details
 */

'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface BadgesGridProps {
  badges: any[]
  walletAddress: string
}

export function BadgesGrid({ badges, walletAddress }: BadgesGridProps) {
  const [selectedBadge, setSelectedBadge] = useState<any | null>(null)

  const rarityColors = {
    common: 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50',
    rare: 'border-gray-400 dark:border-gray-500 bg-gray-100 dark:bg-gray-800/70',
    epic: 'border-gray-500 dark:border-gray-400 bg-gray-150 dark:bg-gray-700/50',
    legendary: 'border-gray-600 dark:border-gray-300 bg-gray-200 dark:bg-gray-700',
  }

  if (!badges || badges.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Badges</h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 text-center shadow-sm">
          <p className="text-gray-600 dark:text-gray-400">No badges earned yet</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Badges <span className="text-gray-600 dark:text-gray-400 text-lg">({badges.length})</span>
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {badges.map((badge) => {
          const definition = badge.badge_definitions
          const rarityClass =
            rarityColors[definition.rarity as keyof typeof rarityColors] || rarityColors.common

          return (
            <div
              key={badge.id}
              onClick={() => setSelectedBadge(badge)}
              className={`${rarityClass} border rounded-xl p-4 hover:shadow-md transition-all cursor-pointer group relative`}
              title="Click to view details"
            >
              <div className="text-center">
                <div className="text-4xl mb-3 opacity-80">{definition.icon_emoji || '🏆'}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm">{definition.name}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">{definition.description}</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium">
                    {definition.rarity}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  {new Date(badge.earned_at).toLocaleDateString('en-US')}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedBadge(null)}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full border-2 border-gray-200 dark:border-gray-700 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedBadge(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Badge Icon */}
            <div className="text-center mb-6">
              <div className="text-8xl mb-4">
                {selectedBadge.badge_definitions.icon_emoji || '🏆'}
              </div>
              
              {/* Rarity Badge */}
              <span className="inline-block text-sm px-4 py-1 rounded-full font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600">
                {selectedBadge.badge_definitions.rarity.toUpperCase()}
              </span>
            </div>

            {/* Badge Info */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {selectedBadge.badge_definitions.name}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {selectedBadge.badge_definitions.description}
              </p>
              
              {/* Category */}
              <div className="inline-block bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                {selectedBadge.badge_definitions.category}
              </div>
            </div>

            {/* Earned Date */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Earned on{' '}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {new Date(selectedBadge.earned_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setSelectedBadge(null)}
              className="w-full mt-6 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

