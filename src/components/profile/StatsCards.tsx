/**
 * Stats Cards Component
 * Key metrics displayed as cards
 */

'use client'

interface StatsCardsProps {
  stats: any
  privacy: any
}

export function StatsCards({ stats, privacy }: StatsCardsProps) {
  if (!stats) return null

  const contributorStats = [
    {
      label: 'Missions abgeschlossen',
      value: stats.missions_completed || 0,
      icon: '✓',
      color: 'blue',
    },
    {
      label: 'Erfolgsrate',
      value: stats.completion_rate ? `${Math.round(stats.completion_rate)}%` : '0%',
      icon: '📊',
      color: 'green',
    },
    {
      label: 'Empfehlungen',
      value: stats.endorsements_count || 0,
      icon: '⭐',
      color: 'purple',
    },
  ]

  const founderStats = [
    {
      label: 'Projekte erstellt',
      value: stats.projects_created || 0,
      icon: '🚀',
      color: 'indigo',
    },
    {
      label: 'Live Projekte',
      value: stats.projects_live || 0,
      icon: '🎯',
      color: 'pink',
    },
    {
      label: 'Missions erstellt',
      value: stats.missions_created || 0,
      icon: '📋',
      color: 'orange',
    },
  ]

  const activityStats = [
    {
      label: 'Streak',
      value: `${stats.streak_days || 0} Tage`,
      icon: '🔥',
      color: 'red',
    },
    {
      label: 'Aktive Tage',
      value: stats.total_activity_days || 0,
      icon: '📅',
      color: 'yellow',
    },
  ]

  const allStats = [
    ...contributorStats,
    ...(stats.projects_created > 0 ? founderStats : []),
    ...activityStats,
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">Statistiken</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {allStats.map((stat, index) => (
          <div
            key={index}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

