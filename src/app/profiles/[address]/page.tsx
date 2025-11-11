/**
 * Profile Page
 * Displays user profile with stats, badges, portfolio, and activity
 */

'use client'

import { use, useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useSearchParams } from 'next/navigation'
import { Layout } from '@/components/Layout'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'
import { BackButton } from '@/components/navigation/BackButton'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { StatsCards } from '@/components/profile/StatsCards'
import { BadgesGrid } from '@/components/profile/BadgesGrid'
import { PortfolioGrid } from '@/components/profile/PortfolioGrid'
import { ActivityTimeline } from '@/components/profile/ActivityTimeline'
import { TrustScoreDisplay } from '@/components/profile/TrustScoreDisplay'
// Lucide icons imported in Breadcrumbs component

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
  const { wallet } = useAuth()
  const searchParams = useSearchParams()

  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'portfolio' | 'activity'>('overview')

  const isOwnProfile = wallet?.toLowerCase() === address.toLowerCase()
  
  // Determine where user came from for breadcrumbs
  const referrer = searchParams.get('from') || 'unknown'

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
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (error || !profileData) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Profile not found</h2>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
          </div>
        </div>
      </Layout>
    )
  }

  // Build breadcrumb items based on referrer
  const getBreadcrumbItems = () => {
    const items = []
    
    if (referrer === 'leaderboards') {
      items.push({ label: 'Leaderboards', href: '/leaderboards', icon: 'trophy' as const })
    } else if (referrer === 'bookmarks') {
      items.push({ label: 'Bookmarks', href: '/bookmarks' })
    } else if (referrer === 'project') {
      // Could add project-specific breadcrumb here if we had project context
      items.push({ label: 'Projects', href: '/discover-projects' })
    }
    
    items.push({ label: profileData.profile.display_name, icon: 'user' as const })
    
    return items
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Navigation: Breadcrumbs + Back Button */}
          <div className="flex items-center justify-between mb-6">
            <Breadcrumbs items={getBreadcrumbItems()} />
            <BackButton 
              fallbackUrl="/leaderboards"
              label="Back"
            />
          </div>

          {/* Profile Header */}
          <ProfileHeader
            profile={profileData.profile}
            stats={profileData.stats}
            isOwnProfile={isOwnProfile}
            onProfileUpdated={fetchProfile}
            fullWalletAddress={address}
          />

        {/* Tabs */}
        <div className="mt-8 border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-4 px-2 font-semibold transition-colors cursor-pointer ${
                activeTab === 'overview'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`pb-4 px-2 font-semibold transition-colors cursor-pointer ${
                activeTab === 'portfolio'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Portfolio
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`pb-4 px-2 font-semibold transition-colors cursor-pointer ${
                activeTab === 'activity'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Activity
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
    </Layout>
  )
}

