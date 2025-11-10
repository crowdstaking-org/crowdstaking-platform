/**
 * Activity Timeline Component
 * Recent activities timeline
 */

'use client'

import { useState, useEffect } from 'react'

interface ActivityTimelineProps {
  walletAddress: string
  showPrivate?: boolean
}

export function ActivityTimeline({ walletAddress, showPrivate = false }: ActivityTimelineProps) {
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchActivities()
  }, [walletAddress])

  async function fetchActivities() {
    try {
      // This would need a dedicated API endpoint
      // For now, show placeholder
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch activities:', error)
      setLoading(false)
    }
  }

  const activityIcons: Record<string, string> = {
    proposal_submitted: '📝',
    proposal_accepted: '✅',
    proposal_completed: '🎉',
    project_created: '🚀',
    mission_created: '📋',
    badge_earned: '🏆',
    endorsement_received: '⭐',
  }

  const activityLabels: Record<string, string> = {
    proposal_submitted: 'Proposal eingereicht',
    proposal_accepted: 'Proposal akzeptiert',
    proposal_completed: 'Mission abgeschlossen',
    project_created: 'Projekt erstellt',
    mission_created: 'Mission erstellt',
    badge_earned: 'Badge verdient',
    endorsement_received: 'Empfehlung erhalten',
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">Aktivitäten</h2>
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">Noch keine öffentlichen Aktivitäten</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex gap-4 pb-4 border-b border-gray-700 last:border-0">
                <div className="text-2xl">{activityIcons[activity.event_type] || '📌'}</div>
                <div className="flex-1">
                  <p className="text-white font-medium mb-1">
                    {activityLabels[activity.event_type] || activity.event_type}
                  </p>
                  <p className="text-sm text-gray-400">
                    {new Date(activity.created_at).toLocaleString('de-DE')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

