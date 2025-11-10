/**
 * Leaderboards Page
 * 
 * Shows top contributors, founders, and rising stars
 * with their profiles, trust scores, and achievements.
 * 
 * Public page - no authentication required
 */

'use client'

import { useState, useEffect } from 'react'
import { Layout } from '@/components/Layout'
import { UserProfileLink } from '@/components/profile/UserProfileLink'
import { Trophy, TrendingUp, Rocket, Target, Award } from 'lucide-react'

type LeaderboardType = 'contributors' | 'founders' | 'rising'
type TimePeriod = 'week' | 'month' | 'all'

interface LeaderboardEntry {
  wallet_address: string
  display_name?: string
  avatar_url?: string
  trust_score?: number
  bio?: string
  // Contributor-specific
  missions_completed?: number
  proposals_completed?: number
  completion_rate?: number
  // Founder-specific
  projects_created?: number
  projects_live?: number
  missions_created?: number
  total_missions_payout?: number
}

export default function LeaderboardsPage() {
  const [activeTab, setActiveTab] = useState<LeaderboardType>('contributors')
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('all')
  const [data, setData] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchLeaderboard()
  }, [activeTab, timePeriod])

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/leaderboards?type=${activeTab}&period=${timePeriod}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard')
      }
      
      const result = await response.json()
      setData(result.data || [])
    } catch (err: any) {
      console.error('Failed to fetch leaderboard:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'contributors' as const, label: 'Top Contributors', icon: Target },
    { id: 'founders' as const, label: 'Top Founders', icon: Rocket },
    { id: 'rising' as const, label: 'Rising Stars', icon: TrendingUp },
  ]

  const periods = [
    { id: 'week' as const, label: 'This Week' },
    { id: 'month' as const, label: 'This Month' },
    { id: 'all' as const, label: 'All Time' },
  ]

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="w-10 h-10 text-yellow-500" />
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Leaderboards
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Entdecke die Top-Performer in der CrowdStaking-Community
            </p>
          </div>

          {/* Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-6">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors ${
                      activeTab === tab.id
                        ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Period Filter */}
            <div className="p-4 flex gap-2">
              {periods.map((period) => (
                <button
                  key={period.id}
                  onClick={() => setTimePeriod(period.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    timePeriod === period.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Lade Leaderboard...</p>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                <button
                  onClick={fetchLeaderboard}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Erneut versuchen
                </button>
              </div>
            ) : data.length === 0 ? (
              <div className="text-center py-16">
                <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Noch keine Einträge für diesen Zeitraum
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {data.map((entry, index) => (
                  <LeaderboardRow
                    key={entry.wallet_address}
                    entry={entry}
                    rank={index + 1}
                    type={activeTab}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

/**
 * Individual Leaderboard Row Component
 */
interface LeaderboardRowProps {
  entry: LeaderboardEntry
  rank: number
  type: LeaderboardType
}

function LeaderboardRow({ entry, rank, type }: LeaderboardRowProps) {
  // Medal colors for top 3
  const getMedalColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-500'
    if (rank === 2) return 'text-gray-400'
    if (rank === 3) return 'text-orange-600'
    return 'text-gray-600 dark:text-gray-400'
  }

  // Get primary metric based on type
  const getPrimaryMetric = () => {
    switch (type) {
      case 'contributors':
        return {
          value: entry.missions_completed || 0,
          label: 'Missions',
          sublabel: `${entry.completion_rate?.toFixed(1) || 0}% Erfolgsrate`
        }
      case 'founders':
        return {
          value: entry.projects_live || 0,
          label: 'Live Projects',
          sublabel: `${entry.missions_created || 0} Missions erstellt`
        }
      case 'rising':
        return {
          value: entry.missions_completed || 0,
          label: 'Missions',
          sublabel: 'Neues Talent'
        }
    }
  }

  const metric = getPrimaryMetric()

  return (
    <div className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <div className="flex items-center gap-4">
        {/* Rank */}
        <div className={`w-12 flex items-center justify-center font-bold text-2xl ${getMedalColor(rank)}`}>
          {rank <= 3 ? '🏆' : `#${rank}`}
        </div>

        {/* Profile */}
        <div className="flex-1">
          <UserProfileLink
            walletAddress={entry.wallet_address}
            displayName={entry.display_name}
            avatarUrl={entry.avatar_url}
            trustScore={entry.trust_score}
            showTrustScore={true}
            size="md"
            showAvatar={true}
          />
          
          {entry.bio && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
              {entry.bio}
            </p>
          )}
        </div>

        {/* Metrics */}
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {metric.value}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {metric.label}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500">
            {metric.sublabel}
          </div>
        </div>
      </div>
    </div>
  )
}

