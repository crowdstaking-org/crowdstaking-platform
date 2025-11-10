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

  const scoreColor =
    trustScore >= 80
      ? 'text-green-400'
      : trustScore >= 60
      ? 'text-blue-400'
      : trustScore >= 40
      ? 'text-yellow-400'
      : 'text-orange-400'

  const progressColor =
    trustScore >= 80
      ? 'bg-green-500'
      : trustScore >= 60
      ? 'bg-blue-500'
      : trustScore >= 40
      ? 'bg-yellow-500'
      : 'bg-orange-500'

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">Trust Score</h2>
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className={`text-5xl font-bold ${scoreColor}`}>{trustScore}</span>
              <span className="text-2xl text-gray-500">/100</span>
            </div>
            <p className="text-gray-400 mt-2">
              {trustScore >= 80
                ? 'Exzellente Reputation'
                : trustScore >= 60
                ? 'Gute Reputation'
                : trustScore >= 40
                ? 'Solide Reputation'
                : 'Reputation aufbauen'}
            </p>
          </div>
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            {showBreakdown ? 'Verbergen' : 'Details anzeigen'}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div
            className={`${progressColor} h-3 rounded-full transition-all duration-500`}
            style={{ width: `${trustScore}%` }}
          />
        </div>

        {/* Breakdown (if shown) */}
        {showBreakdown && (
          <div className="mt-6 space-y-3">
            <p className="text-sm text-gray-400 mb-4">
              Der Trust Score wird aus mehreren Faktoren berechnet:
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Erfolgsrate (30%)</span>
                <span className="text-gray-300">Basierend auf abgeschlossenen Missions</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Reaktionszeit (20%)</span>
                <span className="text-gray-300">Schnelligkeit bei Proposals</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Empfehlungen (25%)</span>
                <span className="text-gray-300">Community Endorsements</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Token Holdings (15%)</span>
                <span className="text-gray-300">Skin in the game</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Zeit auf Plattform (10%)</span>
                <span className="text-gray-300">Account-Alter</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

