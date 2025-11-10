'use client'

import { Search, Filter } from 'lucide-react'
import { ScrollReveal } from '../ScrollReveal'
import { ProjectCard } from './ProjectCard'
import { useEffect, useRef, useState } from 'react'
import type { Project } from '@/types/project'

/**
 * Project marketplace with search and filter functionality
 * Client Component - has form inputs and state management
 */
export function ProjectMarketplace() {
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [onlyLiquid, setOnlyLiquid] = useState(false)

  // Focus search input when user navigates via anchor link
  useEffect(() => {
    const focusSearchInput = () => {
      const hash = window.location.hash
      if (hash === '#missionen' && searchInputRef.current) {
        // Small delay to ensure smooth scroll completes first
        setTimeout(() => {
          searchInputRef.current?.focus()
        }, 500)
      }
    }

    // Check on initial load
    focusSearchInput()

    // Listen for hash changes (when clicking link from same page)
    window.addEventListener('hashchange', focusSearchInput)

    return () => {
      window.removeEventListener('hashchange', focusSearchInput)
    }
  }, [])

  // Load projects from API
  useEffect(() => {
    console.log('[ProjectMarketplace] Starting to load projects...')
    setLoading(true)
    fetch('/api/projects')
      .then((res) => {
        console.log('[ProjectMarketplace] Fetch response status:', res.status)
        return res.json()
      })
      .then((response) => {
        console.log('[ProjectMarketplace] API response:', response)
        // API returns { success: true, data: { projects: [...], count: N } }
        if (response.success && response.data) {
          console.log('[ProjectMarketplace] Setting projects:', response.data.projects)
          setProjects(response.data.projects || [])
        } else {
          console.error('[ProjectMarketplace] Unexpected API response:', response)
          setProjects([])
        }
        setLoading(false)
        console.log('[ProjectMarketplace] Loading complete, projects count:', response.data?.projects?.length || 0)
      })
      .catch((err) => {
        console.error('[ProjectMarketplace] Failed to load projects:', err)
        setLoading(false)
      })
  }, [])

  // Apply filters to projects
  const filteredProjects = projects.filter((project) => {
    // Search filter - search in name and description (case-insensitive)
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      const matchesName = project.name.toLowerCase().includes(term)
      const matchesDescription = project.description?.toLowerCase().includes(term) || false
      console.log('[Filter Debug]', {
        projectName: project.name,
        searchTerm: term,
        matchesName,
        matchesDescription,
        willShow: matchesName || matchesDescription
      })
      if (!matchesName && !matchesDescription) {
        return false
      }
    }

    // Liquidity filter - show only projects with live tokens
    if (onlyLiquid && project.token_status !== 'live') {
      return false
    }

    return true
  })
  
  console.log('[ProjectMarketplace] Filter results:', {
    searchTerm,
    onlyLiquid,
    totalProjects: projects.length,
    filteredCount: filteredProjects.length
  })

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('')
    setOnlyLiquid(false)
  }

  return (
    <section id="missionen" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal direction="up" duration={700}>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Active Missions
            </h2>
          </div>
        </ScrollReveal>

        {/* Search & Filter Bar */}
        <ScrollReveal direction="up" delay={100} duration={700}>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 mb-12 border border-gray-200 dark:border-gray-700">
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search missions, tech stack..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Tech Stack Filter */}
              <div className="relative">
                <select className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 appearance-none cursor-pointer">
                  <option>Tech Stack</option>
                  <option>Rust</option>
                  <option>Solidity</option>
                  <option>Go</option>
                  <option>AI/ML</option>
                  <option>Python</option>
                </select>
                <Filter className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <select className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 appearance-none cursor-pointer">
                  <option>Category</option>
                  <option>DeFi</option>
                  <option>SaaS</option>
                  <option>Infrastructure</option>
                </select>
                <Filter className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 appearance-none cursor-pointer">
                  <option>Status</option>
                  <option>New</option>
                  <option>Trending</option>
                  <option>Seeking Co-Founders</option>
                </select>
                <Filter className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Liquidity Checkbox */}
              <div className="flex items-center space-x-3 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg">
                <input
                  type="checkbox"
                  id="liquid-tokens"
                  checked={onlyLiquid}
                  onChange={(e) => setOnlyLiquid(e.target.checked)}
                  className="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-400 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
                />
                <label
                  htmlFor="liquid-tokens"
                  className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer"
                >
                  Only Liquid Tokens
                </label>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Project Cards */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 dark:border-purple-400 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-xl p-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
              No projects available yet.
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-sm">
              Be the first founder to launch a project!
            </p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-xl p-12 border-2 border-dashed border-gray-300 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
              No projects match your filters.
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mb-6">
              Try adjusting your search criteria or clearing filters.
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div>
            {/* Filter Count Badge */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing <span className="font-semibold text-purple-600 dark:text-purple-400">{filteredProjects.length}</span> of <span className="font-semibold">{projects.length}</span> projects
              </p>
              {(searchTerm || onlyLiquid) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors underline"
                >
                  Clear filters
                </button>
              )}
            </div>

            {/* Project Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <ScrollReveal
                  key={project.id}
                  direction="up"
                  delay={index * 150}
                  scale={true}
                  duration={800}
                >
                  <ProjectCard
                    projectId={project.id}
                    title={project.name}
                    mission={project.description || 'No description available'}
                    tags={['Active']} // TODO: Add proper tags from project metadata
                    coFounders={0} // TODO: Calculate from completed proposals
                    proposals={0} // TODO: Fetch from stats API
                    tokenStatus={project.token_status === 'live' ? 'live' : 'pending'}
                    tokenSymbol={`$${project.token_symbol}`}
                    featured={index === 0} // First project is featured for now
                  />
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

