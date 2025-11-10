/**
 * Badges Grid Component
 * Displays earned badges with hover tooltips
 */

'use client'

interface BadgesGridProps {
  badges: any[]
  walletAddress: string
}

export function BadgesGrid({ badges, walletAddress }: BadgesGridProps) {
  const rarityColors = {
    common: 'border-gray-500 bg-gray-800/50',
    rare: 'border-blue-500 bg-blue-900/20',
    epic: 'border-purple-500 bg-purple-900/20',
    legendary: 'border-yellow-500 bg-yellow-900/20',
  }

  if (!badges || badges.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Badges</h2>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 text-center">
          <p className="text-gray-400">Noch keine Badges verdient</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        Badges <span className="text-gray-400 text-lg">({badges.length})</span>
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {badges.map((badge) => {
          const definition = badge.badge_definitions
          const rarityClass =
            rarityColors[definition.rarity as keyof typeof rarityColors] || rarityColors.common

          return (
            <div
              key={badge.id}
              className={`${rarityClass} border-2 rounded-xl p-4 hover:scale-105 transition-transform cursor-pointer group relative`}
              title={definition.description}
            >
              <div className="text-center">
                <div className="text-5xl mb-2">{definition.icon_emoji || '🏆'}</div>
                <h3 className="font-bold text-white mb-1">{definition.name}</h3>
                <p className="text-xs text-gray-400 mb-2">{definition.description}</p>
                <div className="flex items-center justify-center gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      definition.rarity === 'legendary'
                        ? 'bg-yellow-600/30 text-yellow-300'
                        : definition.rarity === 'epic'
                        ? 'bg-purple-600/30 text-purple-300'
                        : definition.rarity === 'rare'
                        ? 'bg-blue-600/30 text-blue-300'
                        : 'bg-gray-600/30 text-gray-300'
                    }`}
                  >
                    {definition.rarity}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(badge.earned_at).toLocaleDateString('de-DE')}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

