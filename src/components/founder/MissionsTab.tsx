'use client'

import React, { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ProtectedButton } from '@/components/auth/ProtectedButton'
import type { MissionWithStats } from '@/types/mission'

interface MissionsTabProps {
  projectId?: string
}

/**
 * Missions Tab for Founder Dashboard
 * Shows table of Mini-Missions with status, proposals count
 * Client Component
 */
export function MissionsTab({ projectId }: MissionsTabProps) {
  const router = useRouter()
  const [missions, setMissions] = useState<MissionWithStats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!projectId) {
      setLoading(false)
      return
    }

    setLoading(true)
    fetch(`/api/projects/${projectId}/missions?include_stats=true`)
      .then((res) => res.json())
      .then((response) => {
        // API returns { success: true, data: { missions: [...], count: N } }
        if (response.success && response.data) {
          setMissions(response.data.missions || [])
        } else {
          console.error('Unexpected API response:', response)
          setMissions([])
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load missions:', err)
        setLoading(false)
      })
  }, [projectId])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Mini-Missions
        </h2>
        <ProtectedButton
          onClick={() => router.push('/create-mini-mission')}
          actionName="Create Mission"
          className="inline-flex items-center space-x-2 bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-semibold"
        >
          <Plus className="w-5 h-5" />
          <span>Create New Mini-Mission</span>
        </ProtectedButton>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading missions...</p>
          </div>
        ) : missions.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No missions yet. Create your first mini-mission to get started!
            </p>
            <ProtectedButton
              onClick={() => router.push('/create-mini-mission')}
              actionName="Create Mission"
              className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Mission</span>
            </ProtectedButton>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Proposals
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {missions.map((mission) => (
                <tr
                  key={mission.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-900/50"
                >
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        mission.status === 'active'
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          : mission.status === 'completed'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                          : 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {mission.status.charAt(0).toUpperCase() + mission.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    {mission.title}
                  </td>
                  <td className="px-6 py-4">
                    {mission.proposals_count > 0 ? (
                      <div className="flex flex-col">
                        <span className="text-blue-600 dark:text-blue-400 font-semibold">
                          {mission.proposals_count} Total
                        </span>
                        {mission.pending_proposals_count > 0 && (
                          <span className="text-xs text-yellow-600 dark:text-yellow-400">
                            {mission.pending_proposals_count} Pending
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">0</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400 max-w-xs truncate">
                    {mission.description || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

