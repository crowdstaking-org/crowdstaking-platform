/**
 * Portfolio Grid Component
 * Completed missions and founded projects
 */

'use client'

import { useState, useEffect } from 'react'

interface PortfolioGridProps {
  walletAddress: string
}

export function PortfolioGrid({ walletAddress }: PortfolioGridProps) {
  const [portfolio, setPortfolio] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPortfolio()
  }, [walletAddress])

  async function fetchPortfolio() {
    try {
      const response = await fetch(`/api/profiles/${walletAddress}/portfolio`)
      if (response.ok) {
        const data = await response.json()
        setPortfolio(data)
      }
    } catch (error) {
      console.error('Failed to fetch portfolio:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    )
  }

  if (!portfolio) {
    return <div className="text-gray-400">Portfolio konnte nicht geladen werden</div>
  }

  return (
    <div className="space-y-8">
      {/* Completed Missions */}
      {portfolio.completedMissions && portfolio.completedMissions.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Abgeschlossene Missions ({portfolio.completedMissions.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {portfolio.completedMissions.map((mission: any) => (
              <div
                key={mission.id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <h3 className="font-bold text-white mb-2">{mission.title}</h3>
                <p className="text-sm text-gray-400 mb-3 line-clamp-2">{mission.description}</p>
                {mission.requested_cstake_amount && (
                  <p className="text-sm text-green-400 mb-2">
                    💰 {mission.requested_cstake_amount} CSTAKE
                  </p>
                )}
                {mission.deliverable && (
                  <div className="text-xs text-gray-400 mb-2 line-clamp-2">
                    Deliverable: {mission.deliverable}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Founded Projects */}
      {portfolio.foundedProjects && portfolio.foundedProjects.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Gegründete Projekte ({portfolio.foundedProjects.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {portfolio.foundedProjects.map((project: any) => (
              <div
                key={project.id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-white">{project.name}</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      project.status === 'active'
                        ? 'bg-green-600/30 text-green-300'
                        : 'bg-gray-600/30 text-gray-300'
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-3 line-clamp-2">{project.description}</p>
                <p className="text-xs text-purple-400">Token: ${project.token_symbol}</p>
                {project.token_status && (
                  <p className="text-xs text-gray-500 mt-1">
                    Status: {project.token_status}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {(!portfolio.completedMissions || portfolio.completedMissions.length === 0) &&
        (!portfolio.foundedProjects || portfolio.foundedProjects.length === 0) && (
          <div className="text-center py-12">
            <p className="text-gray-400">Noch keine abgeschlossenen Projekte oder Missions</p>
          </div>
        )}
    </div>
  )
}

