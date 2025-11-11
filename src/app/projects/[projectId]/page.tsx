import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { Layout } from '@/components/Layout'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'
import { BackButton } from '@/components/navigation/BackButton'
import { Users, Lightbulb, TrendingUp, CheckCircle, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { Project, ProjectStats } from '@/types/project'
import type { MissionWithStats } from '@/types/mission'

/**
 * Public Project Detail Page
 * Server Component for SEO optimization
 * Shows project information, missions, team, tokenomics
 */

interface PageProps {
  params: {
    projectId: string
  }
}

/**
 * Get base URL for server-side API calls
 */
async function getBaseUrl(): Promise<string> {
  // Check for explicit environment variable
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }
  
  // On Vercel, use the deployment URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  
  // Try to get from headers (works in server components)
  try {
    const headersList = await headers()
    const host = headersList.get('host')
    const protocol = headersList.get('x-forwarded-proto') || 'https'
    if (host) {
      return `${protocol}://${host}`
    }
  } catch (e) {
    // headers() might fail in some contexts
  }
  
  // Fallback to localhost for development
  return 'http://localhost:3000'
}

/**
 * Fetch project data (server-side)
 */
async function fetchProject(projectId: string): Promise<Project | null> {
  try {
    const baseUrl = await getBaseUrl()
    const response = await fetch(`${baseUrl}/api/projects/${projectId}`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`Failed to fetch project: ${response.statusText}`)
    }
    
    const result = await response.json()
    return result.data?.project || null
  } catch (error) {
    console.error('Failed to fetch project:', error)
    return null
  }
}

/**
 * Fetch project stats (server-side)
 */
async function fetchProjectStats(projectId: string): Promise<ProjectStats | null> {
  try {
    const baseUrl = await getBaseUrl()
    const response = await fetch(`${baseUrl}/api/projects/${projectId}/stats`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`Failed to fetch project stats: ${response.statusText}`)
    }
    
    const result = await response.json()
    return result.data?.stats || null
  } catch (error) {
    console.error('Failed to fetch project stats:', error)
    return null
  }
}

/**
 * Fetch missions for a project (server-side)
 */
async function fetchProjectMissions(projectId: string): Promise<MissionWithStats[]> {
  try {
    const baseUrl = await getBaseUrl()
    const response = await fetch(`${baseUrl}/api/projects/${projectId}/missions?include_stats=true`, {
      cache: 'no-store' // Always fetch fresh data
    })
    
    if (!response.ok) {
      return []
    }
    
    const result = await response.json()
    return result.data?.missions || []
  } catch (error) {
    console.error('Failed to fetch missions:', error)
    return []
  }
}

export default async function ProjectDetailPage({ params }: PageProps) {
  // In Next.js 15+, params is a Promise and must be awaited
  const { projectId } = await params
  
  // Fetch project data server-side
  const project = await fetchProject(projectId)
  
  // If project doesn't exist, show 404
  if (!project) {
    notFound()
  }
  
  // Fetch project stats and missions in parallel
  const [stats, missions] = await Promise.all([
    fetchProjectStats(projectId),
    fetchProjectMissions(projectId)
  ])

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Navigation: Breadcrumbs + Back Button */}
          <div className="flex items-center justify-between mb-6">
            <Breadcrumbs 
              items={[
                { label: 'Discover Projects', href: '/discover-projects', icon: 'folder-open' },
                { label: project.name, icon: 'rocket' }
              ]} 
            />
            <BackButton 
              fallbackUrl="/discover-projects"
              label="Back"
            />
          </div>

          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {project.name}
                </h1>
                
                {project.description && (
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                    {project.description}
                  </p>
                )}

                {/* Token Info */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center space-x-2">
                    {project.token_status === 'live' ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                          Token Live
                        </span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                        <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                          Token Launch After Next Mission
                        </span>
                      </>
                    )}
                  </div>
                  
                  <div className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <span className="text-sm font-semibold text-purple-900 dark:text-purple-200">
                      {project.token_symbol}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">Co-Founders</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats?.team_members_count || 0}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Lightbulb className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">Active Missions</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats?.active_missions_count || 0}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Supply</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {(project.total_supply / 1_000_000_000).toFixed(0)}B
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">Distributed</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats?.distributed_tokens_percentage.toFixed(2) || 0}%
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="lg:w-64">
                <Link
                  href={`/submit-proposal?project=${project.id}`}
                  className="w-full inline-flex items-center justify-center space-x-2 bg-purple-600 dark:bg-purple-500 text-white px-6 py-4 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors font-semibold text-lg shadow-lg"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
                  Join as Co-Founder and earn tokens
                </p>
              </div>
            </div>
          </div>

          {/* Missions Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Open Missions
              </h2>
              <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold">
                {missions.filter(m => m.status === 'active').length} Active
              </span>
            </div>

            {missions.length === 0 ? (
              <div className="text-center py-12">
                <Lightbulb className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  No missions yet. Check back soon!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {missions.map((mission) => (
                  <div
                    key={mission.id}
                    className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-purple-500 dark:hover:border-purple-400 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {mission.title}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              mission.status === 'active'
                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                : 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400'
                            }`}
                          >
                            {mission.status.charAt(0).toUpperCase() + mission.status.slice(1)}
                          </span>
                        </div>

                        {mission.description && (
                          <p className="text-gray-700 dark:text-gray-300 mb-4">
                            {mission.description}
                          </p>
                        )}

                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                          <span>
                            {mission.proposals_count} {mission.proposals_count === 1 ? 'Proposal' : 'Proposals'}
                          </span>
                          {mission.pending_proposals_count > 0 && (
                            <span className="text-yellow-600 dark:text-yellow-400">
                              {mission.pending_proposals_count} Pending Review
                            </span>
                          )}
                        </div>
                      </div>

                      <Link
                        href={`/projects/${project.id}/missions/${mission.id}`}
                        className="px-6 py-3 bg-purple-600 dark:bg-purple-500 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors font-semibold whitespace-nowrap"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

