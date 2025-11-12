/**
 * Team Tab for Founder Dashboard
 * Shows co-founders list and stats based on accepted proposals
 * Client Component - fetches team data from API
 */

'use client'

import { useState, useEffect } from 'react'
import type { Project } from '@/types/project'
import { Users } from 'lucide-react'
import { TeamMemberCard } from './TeamMemberCard'

interface TeamTabProps {
  project: Project | null
}

interface TeamMember {
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

export function TeamTab({ project }: TeamTabProps) {
  const [team, setTeam] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (project?.id) {
      fetchTeam()
    } else {
      setLoading(false)
    }
  }, [project?.id])

  const fetchTeam = async () => {
    if (!project?.id) return
    
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/projects/${project.id}/team`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch team')
      }
      
      const data = await response.json()
      setTeam(data.team || [])
    } catch (err: any) {
      console.error('Failed to fetch team:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Calculate stats
  const totalDistributed = team.reduce((sum, member) => 
    sum + member.contributions.totalCstakeEarned, 0
  )

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Active Co-Founders
          </p>
          <p className="text-4xl font-bold text-gray-900 dark:text-white">
            {team.length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Community Tokens Distributed
          </p>
          <p className="text-4xl font-bold text-gray-900 dark:text-white">
            {(totalDistributed / 10000000).toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Co-Founder List
        </h3>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading team...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={fetchTeam}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : team.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Your team is still empty. Accept the first proposal to welcome
              your first team member (co-founder).
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member) => (
              <TeamMemberCard key={member.walletAddress} member={member} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
