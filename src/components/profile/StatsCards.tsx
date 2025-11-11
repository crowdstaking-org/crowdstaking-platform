/**
 * Stats Cards Component
 * Key metrics displayed as cards
 */

'use client'

import { CheckCircle2, BarChart3, Award, Rocket, Target, ClipboardList, Flame, Calendar } from 'lucide-react'

interface StatsCardsProps {
  stats: any
  privacy: any
}

export function StatsCards({ stats, privacy }: StatsCardsProps) {
  if (!stats) return null

  const contributorStats = [
    {
      label: 'Missions completed',
      value: stats.missions_completed || 0,
      icon: CheckCircle2,
    },
    {
      label: 'Success rate',
      value: stats.completion_rate ? `${Math.round(stats.completion_rate)}%` : '0%',
      icon: BarChart3,
    },
    {
      label: 'Endorsements',
      value: stats.endorsements_count || 0,
      icon: Award,
    },
  ]

  const founderStats = [
    {
      label: 'Projects created',
      value: stats.projects_created || 0,
      icon: Rocket,
    },
    {
      label: 'Live projects',
      value: stats.projects_live || 0,
      icon: Target,
    },
    {
      label: 'Missions created',
      value: stats.missions_created || 0,
      icon: ClipboardList,
    },
  ]

  const activityStats = [
    {
      label: 'Streak',
      value: `${stats.streak_days || 0} days`,
      icon: Flame,
    },
    {
      label: 'Active days',
      value: stats.total_activity_days || 0,
      icon: Calendar,
    },
  ]

  const allStats = [
    ...contributorStats,
    ...(stats.projects_created > 0 ? founderStats : []),
    ...activityStats,
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Statistics</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {allStats.map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors shadow-sm"
            >
              <IconComponent className="w-6 h-6 text-gray-600 dark:text-gray-400 mb-3" strokeWidth={1.5} />
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

