/**
 * Profile Page
 * Displays user profile with stats, badges, portfolio, and activity
 */

'use client'

import { use, useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { StatsCards } from '@/components/profile/StatsCards'
import { BadgesGrid } from '@/components/profile/BadgesGrid'
import { PortfolioGrid } from '@/components/profile/PortfolioGrid'
import { ActivityTimeline } from '@/components/profile/ActivityTimeline'
import { TrustScoreDisplay } from '@/components/profile/TrustScoreDisplay'

interface ProfilePageProps {
  params: Promise<{ address: string }>
}

interface ProfileData {
  profile: any
  stats: any
  badges: any[]
  privacy: any
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const resolvedParams = use(params)
  const { address } = resolvedParams
  const { walletAddress } = useAuth()

  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'portfolio' | 'activity'>('overview')

  const isOwnProfile = walletAddress?.toLowerCase() === address.toLowerCase()

  useEffect(() => {
    fetchProfile()
  }, [address])

  async function fetchProfile() {
    try {
      setLoading(true)
      const response = await fetch(`/api/profiles/${address}`)

      if (!response.ok) {
        throw new Error('Failed to fetch profile')
      }

      const data = await response.json()
      setProfileData(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Profil wird geladen...</p>
        </div>
      </div>
    )
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Profil nicht gefunden</h2>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <ProfileHeader
          profile={profileData.profile}
          stats={profileData.stats}
          isOwnProfile={isOwnProfile}
          onProfileUpdated={fetchProfile}
          fullWalletAddress={address}
        />

        {/* Tabs */}
        <div className="mt-8 border-b border-gray-700">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-4 px-2 font-semibold transition-colors ${
                activeTab === 'overview'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Übersicht
            </button>
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`pb-4 px-2 font-semibold transition-colors ${
                activeTab === 'portfolio'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Portfolio
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`pb-4 px-2 font-semibold transition-colors ${
                activeTab === 'activity'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Aktivität
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <StatsCards stats={profileData.stats} privacy={profileData.privacy} />

              {/* Trust Score Breakdown */}
              <TrustScoreDisplay
                walletAddress={address}
                trustScore={profileData.profile.trust_score}
              />

              {/* Badges */}
              <BadgesGrid badges={profileData.badges} walletAddress={address} />
            </div>
          )}

          {activeTab === 'portfolio' && (
            <PortfolioGrid walletAddress={address} />
          )}

          {activeTab === 'activity' && (
            <ActivityTimeline
              walletAddress={address}
              showPrivate={isOwnProfile}
            />
          )}
        </div>
      </div>
    </div>
  )
}

