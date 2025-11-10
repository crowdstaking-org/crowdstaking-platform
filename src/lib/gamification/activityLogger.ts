/**
 * Activity Logger
 * Creates activity events for user timelines
 */

import { supabase } from '@/lib/supabase'

export type ActivityEventType =
  | 'profile_created'
  | 'proposal_submitted'
  | 'proposal_accepted'
  | 'proposal_completed'
  | 'project_created'
  | 'project_launched'
  | 'mission_created'
  | 'mission_completed'
  | 'badge_earned'
  | 'endorsement_received'
  | 'milestone_reached'

/**
 * Create an activity event
 */
export async function createActivityEvent(
  walletAddress: string,
  eventType: ActivityEventType,
  eventData: Record<string, any>,
  isPublic: boolean = true
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('activity_events')
      .insert({
        wallet_address: walletAddress,
        event_type: eventType,
        event_data: eventData,
        is_public: isPublic,
      })
      .select('id')
      .single()

    if (error) {
      console.error('Error creating activity event:', error)
      return null
    }

    return data.id
  } catch (error) {
    console.error('Error creating activity event:', error)
    return null
  }
}

/**
 * Get activity timeline for a user
 */
export async function getActivityTimeline(
  walletAddress: string,
  options: {
    limit?: number
    offset?: number
    includePrivate?: boolean
  } = {}
) {
  const { limit = 20, offset = 0, includePrivate = false } = options

  let query = supabase
    .from('activity_events')
    .select('*')
    .eq('wallet_address', walletAddress)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (!includePrivate) {
    query = query.eq('is_public', true)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching activity timeline:', error)
    return []
  }

  return data || []
}

/**
 * Get public activity feed (for homepage/discovery)
 */
export async function getPublicActivityFeed(options: {
  limit?: number
  offset?: number
} = {}) {
  const { limit = 50, offset = 0 } = options

  const { data, error } = await supabase
    .from('activity_events')
    .select(
      `
      id,
      wallet_address,
      event_type,
      event_data,
      created_at,
      profiles (
        wallet_address,
        display_name,
        avatar_url
      )
    `
    )
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('Error fetching public activity feed:', error)
    return []
  }

  return data || []
}

/**
 * Delete old activity events (cleanup for cron job)
 */
export async function cleanupOldActivityEvents(daysToKeep: number = 90) {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

  const { error } = await supabase
    .from('activity_events')
    .delete()
    .lt('created_at', cutoffDate.toISOString())

  if (error) {
    console.error('Error cleaning up old activity events:', error)
    return false
  }

  return true
}

