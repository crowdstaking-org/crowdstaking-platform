/**
 * TeamMemberCard Component
 * 
 * Displays a team member (co-founder) with their profile info,
 * trust score, skills, and contribution statistics.
 * 
 * Used in the Founder Dashboard Team Tab.
 */

'use client'

import Link from 'next/link'
import { UserProfileLink } from '@/components/profile/UserProfileLink'
import { Trophy, Target, Clock } from 'lucide-react'

interface TeamMemberCardProps {
  member: {
    walletAddress: string
    profile?: {
      displayName: string
      avatarUrl?: string
      trustScore?: number
      bio?: string
      skills?: string[]
    }
    contributions: {
      missionsCompleted: number
      missionsInProgress: number
      totalCstakeEarned: number
      firstContribution: string
      latestContribution: string
    }
  }
}

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  const { profile, contributions } = member
  
  // Format dates
  const joinedDate = new Date(contributions.firstContribution).toLocaleDateString('de-DE', {
    month: 'short',
    year: 'numeric'
  })
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
      {/* Profile Header */}
      <div className="mb-4">
        <UserProfileLink
          walletAddress={member.walletAddress}
          displayName={profile?.displayName}
          avatarUrl={profile?.avatarUrl}
          trustScore={profile?.trustScore}
          showTrustScore={true}
          size="lg"
          showAvatar={true}
        />
      </div>
      
      {/* Bio */}
      {profile?.bio && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {profile.bio}
        </p>
      )}
      
      {/* Skills */}
      {profile?.skills && profile.skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {profile.skills.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs font-medium"
            >
              {skill}
            </span>
          ))}
          {profile.skills.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs font-medium">
              +{profile.skills.length - 3}
            </span>
          )}
        </div>
      )}
      
      {/* Contribution Stats */}
      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Trophy className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {contributions.missionsCompleted}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Completed
          </div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {contributions.missionsInProgress}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Active
          </div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {joinedDate}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Joined
          </div>
        </div>
      </div>
      
      {/* Total Earned */}
      {contributions.totalCstakeEarned > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
            Total Earned
          </div>
          <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
            {(contributions.totalCstakeEarned / 10000000).toFixed(2)}%
          </div>
        </div>
      )}
    </div>
  )
}

