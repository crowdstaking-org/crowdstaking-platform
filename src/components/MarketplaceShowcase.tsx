'use client'

import { useState, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { Project } from '@/types/project'

/**
 * Marketplace Showcase Section - displays live projects
 * Client Component - fetches real project data from API
 */
export function MarketplaceShowcase() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch real projects from API
  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        const allProjects = data.data?.projects || []
        // Show first 3 projects
        setProjects(allProjects.slice(0, 3))
        setLoading(false)
      })
      .catch(error => {
        console.error('Failed to fetch showcase projects:', error)
        setLoading(false)
      })
  }, [])

  return (
    <section className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Live Missions
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            This isn&apos;t a test. This is the marketplace. Find a mission that
            inspires you, or post your own.
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-xl p-8 animate-pulse h-96" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">No projects available yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {projects.map((project, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all card-hover flex flex-col"
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                PROJECT: {project.name}
              </h3>

              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  MISSION:
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  &quot;{project.description || 'No description available'}&quot;
                </p>
              </div>

              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  TOKEN:
                </p>
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm font-semibold">
                    ${project.token_symbol}
                  </span>
                  <span className={`text-xs font-semibold ${
                    project.token_status === 'live' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-yellow-600 dark:text-yellow-400'
                  }`}>
                    {project.token_status === 'live' ? '🟢 Live' : '🟡 Launching Soon'}
                  </span>
                </div>
              </div>

              <div className="mb-6 flex-grow">
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  TOTAL SUPPLY:
                </p>
                <p className="text-lg font-bold text-green-600 dark:text-green-400">
                  {(project.total_supply / 1_000_000_000).toFixed(1)}B tokens
                </p>
              </div>

              <Link
                href={project.id ? `/projects/${project.id}` : "/discover-projects"}
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-semibold mt-auto"
              >
                <span>View Details</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            ))}
          </div>
        )}

        {/* Browse All Projects Link */}
        <div className="text-center mt-12">
          <Link
            href="/discover-projects#missionen"
            className="inline-flex items-center space-x-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold text-lg transition-colors group"
          >
            <span>Browse All Projects</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Discover more missions and find your perfect match
          </p>
        </div>
      </div>
    </section>
  )
}

