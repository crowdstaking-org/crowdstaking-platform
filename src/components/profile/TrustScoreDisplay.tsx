/**
 * Trust Score Display Component
 * Visual score with breakdown modal
 */

'use client'

import { useState } from 'react'

interface TrustScoreDisplayProps {
  walletAddress: string
  trustScore: number
}

export function TrustScoreDisplay({ walletAddress, trustScore }: TrustScoreDisplayProps) {
  const [showBreakdown, setShowBreakdown] = useState(false)

  // Unified professional color scheme - no flashy colors
  const scoreColor = 'text-gray-900 dark:text-white'
  const progressColor = 'bg-blue-600 dark:bg-blue-500'

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Trust Score</h2>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className={`text-5xl font-bold ${scoreColor}`}>{trustScore}</span>
              <span className="text-2xl text-gray-500">/100</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {trustScore >= 80
                ? 'Excellent reputation'
                : trustScore >= 60
                ? 'Good reputation'
                : trustScore >= 40
                ? 'Solid reputation'
                : 'Building reputation'}
            </p>
          </div>
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors cursor-pointer"
          >
            {showBreakdown ? 'Hide' : 'Show details'}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className={`${progressColor} h-3 rounded-full transition-all duration-500`}
            style={{ width: `${trustScore}%` }}
          />
        </div>

        {/* Breakdown (if shown) */}
        {showBreakdown && (
          <div className="mt-6 space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Trust Score is calculated from several factors:
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Success rate (30%)</span>
                <span className="text-gray-700 dark:text-gray-300">Based on completed missions</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Response time (20%)</span>
                <span className="text-gray-700 dark:text-gray-300">Speed with proposals</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Endorsements (25%)</span>
                <span className="text-gray-700 dark:text-gray-300">Community endorsements</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Token holdings (15%)</span>
                <span className="text-gray-700 dark:text-gray-300">Skin in the game</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Time on platform (10%)</span>
                <span className="text-gray-700 dark:text-gray-300">Account age</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

