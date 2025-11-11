/**
 * Activity Timeline Component
 * 
 * Shows user's recent activities with smart rendering
 * - Links to mentioned users (endorsements, etc.)
 * - Links to related content (projects, proposals)
 * - Respects privacy settings
 */

'use client'

import { useState, useEffect } from 'react'
import { UserProfileLink } from './UserProfileLink'

interface ActivityTimelineProps {
  walletAddress: string
  showPrivate?: boolean
}

interface Activity {
  id: string
  event_type: string
  event_data: any
  is_public: boolean
  created_at: string
}

export function ActivityTimeline({ walletAddress, showPrivate = false }: ActivityTimelineProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchActivities()
  }, [walletAddress])

  async function fetchActivities() {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/profiles/${walletAddress}/activity?limit=20`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch activities')
      }
      
      const data = await response.json()
      setActivities(data.activities || [])
    } catch (err: any) {
      console.error('Failed to fetch activities:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const activityIcons: Record<string, string> = {
    profile_created: '🎨',
    proposal_submitted: '📝',
    proposal_accepted: '✅',
    proposal_completed: '🎉',
    project_created: '🚀',
    project_launched: '🎊',
    mission_created: '📋',
    mission_completed: '✨',
    badge_earned: '🏆',
    endorsement_received: '⭐',
    milestone_reached: '🎯',
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <button
          onClick={fetchActivities}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Erneut versuchen
        </button>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Activity</h2>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">No public activity yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <ActivityItem
                key={activity.id}
                activity={activity}
                icon={activityIcons[activity.event_type] || '📌'}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Individual Activity Item with smart rendering
 */
interface ActivityItemProps {
  activity: Activity
  icon: string
}

function ActivityItem({ activity, icon }: ActivityItemProps) {
  const { event_type, event_data, created_at } = activity

  // Render activity message with links
  const renderMessage = () => {
    switch (event_type) {
      case 'endorsement_received':
        if (event_data?.endorser_wallet_address) {
          return (
            <span>
              Endorsement received from{' '}
              <UserProfileLink
                walletAddress={event_data.endorser_wallet_address}
                displayName={event_data.endorser_display_name}
                size="xs"
                showAvatar={false}
                asLink={true}
                className="inline-flex items-center"
              />
              {event_data.skill && <> for <strong>{event_data.skill}</strong></>}
            </span>
          )
        }
        return 'Endorsement received'

      case 'badge_earned':
        return (
          <span>
            Badge earned: <strong>{event_data?.badge_name || 'Unknown Badge'}</strong>
          </span>
        )

      case 'proposal_submitted':
        return (
          <span>
            Proposal eingereicht: <strong>{event_data?.proposal_title || 'Untitled'}</strong>
          </span>
        )

      case 'proposal_accepted':
        return (
          <span>
            Proposal akzeptiert: <strong>{event_data?.proposal_title || 'Untitled'}</strong>
          </span>
        )

      case 'proposal_completed':
        return (
          <span>
            Mission completed: <strong>{event_data?.proposal_title || 'Untitled'}</strong>
            {event_data?.cstake_earned && (
              <> ({(event_data.cstake_earned / 10000000).toFixed(2)}% $CSTAKE)</>
            )}
          </span>
        )

      case 'project_created':
        return (
          <span>
            Project created: <strong>{event_data?.project_name || 'Untitled Project'}</strong>
          </span>
        )

      case 'project_launched':
        return (
          <span>
            Project launched: <strong>{event_data?.project_name || 'Untitled Project'}</strong>
          </span>
        )

      case 'mission_created':
        return (
          <span>
            Mission created: <strong>{event_data?.mission_title || 'Untitled Mission'}</strong>
          </span>
        )

      case 'milestone_reached':
        return (
          <span>
            Milestone reached: <strong>{event_data?.milestone || 'Unknown'}</strong>
          </span>
        )

      default:
        return event_type.replace(/_/g, ' ')
    }
  }

  return (
    <div className="flex gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
      <div className="text-2xl flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-gray-900 dark:text-white font-medium mb-1">
          {renderMessage()}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {new Date(created_at).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
    </div>
  )
}
