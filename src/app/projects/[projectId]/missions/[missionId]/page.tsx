import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { Layout } from '@/components/Layout'
import { ArrowLeft, ArrowRight, Users, Clock, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import type { Mission } from '@/types/mission'
import type { Proposal } from '@/types/proposal'

/**
 * Public Mission Detail Page
 * Server Component for SEO optimization
 * Shows mission details and all proposals for this mission
 */

interface PageProps {
  params: {
    projectId: string
    missionId: string
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
 * Fetch single mission data (server-side)
 */
async function fetchMission(projectId: string, missionId: string): Promise<Mission | null> {
  try {
    const baseUrl = await getBaseUrl()
    const response = await fetch(`${baseUrl}/api/projects/${projectId}/missions?include_stats=true`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      return null
    }
    
    const result = await response.json()
    const missions = result.data?.missions || []
    
    // Find the specific mission
    return missions.find((m: Mission) => m.id === missionId) || null
  } catch (error) {
    console.error('Failed to fetch mission:', error)
    return null
  }
}

/**
 * Fetch proposals for a mission (server-side)
 */
async function fetchMissionProposals(missionId: string): Promise<Proposal[]> {
  try {
    const baseUrl = await getBaseUrl()
    const response = await fetch(`${baseUrl}/api/proposals?mission_id=${missionId}`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      return []
    }
    
    const result = await response.json()
    return result.data?.proposals || []
  } catch (error) {
    console.error('Failed to fetch proposals:', error)
    return []
  }
}

/**
 * Get status badge color
 */
function getStatusColor(status: string): string {
  switch (status) {
    case 'pending_review':
      return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
    case 'approved':
    case 'accepted':
      return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
    case 'work_in_progress':
      return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
    case 'completed':
      return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
    case 'rejected':
      return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
    default:
      return 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400'
  }
}

/**
 * Format proposal status for display
 */
function formatStatus(status: string): string {
  return status.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

export default async function MissionDetailPage({ params }: PageProps) {
  // In Next.js 15+, params is a Promise and must be awaited
  const { projectId, missionId } = await params
  
  // Fetch mission and proposals server-side
  const [mission, proposals] = await Promise.all([
    fetchMission(projectId, missionId),
    fetchMissionProposals(missionId)
  ])
  
  // If mission doesn't exist, show 404
  if (!mission) {
    notFound()
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back Navigation */}
          <Link
            href={`/projects/${projectId}`}
            className="inline-flex items-center space-x-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 mb-8 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Project</span>
          </Link>

          {/* Mission Header */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                    {mission.title}
                  </h1>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      mission.status === 'active'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : mission.status === 'completed'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                        : 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {formatStatus(mission.status)}
                  </span>
                </div>

                {mission.description && (
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                    {mission.description}
                  </p>
                )}

                {/* Mission Stats */}
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      <span className="font-bold text-gray-900 dark:text-white">
                        {proposals.length}
                      </span>{' '}
                      {proposals.length === 1 ? 'Proposal' : 'Proposals'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Created {new Date(mission.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* CTA Button - Only show if mission is active */}
              {mission.status === 'active' && (
                <div className="lg:w-64">
                  <Link
                    href={`/submit-proposal?mission=${mission.id}`}
                    className="w-full inline-flex items-center justify-center space-x-2 bg-purple-600 dark:bg-purple-500 text-white px-6 py-4 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors font-semibold text-lg shadow-lg"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
                    Submit your proposal for this mission
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Proposals Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Proposals
            </h2>

            {proposals.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
                  No proposals yet. Be the first to apply!
                </p>
                {mission.status === 'active' && (
                  <Link
                    href={`/submit-proposal?mission=${mission.id}`}
                    className="inline-flex items-center space-x-2 bg-purple-600 dark:bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors font-semibold"
                  >
                    <span>Submit Proposal</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {proposals.map((proposal) => (
                  <div
                    key={proposal.id}
                    className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-purple-500 dark:hover:border-purple-400 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          {proposal.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                          <span>
                            From: {proposal.creator_wallet_address.substring(0, 6)}...
                            {proposal.creator_wallet_address.substring(38)}
                          </span>
                          <span>•</span>
                          <span>
                            {new Date(proposal.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(proposal.status)}`}>
                          {formatStatus(proposal.status)}
                        </span>
                        <span className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-200 rounded-lg text-sm font-bold">
                          {(proposal.requested_cstake_amount / 10000000).toFixed(2)}%
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                      {proposal.description}
                    </p>

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-semibold">Deliverable:</span>{' '}
                        {proposal.deliverable.substring(0, 100)}
                        {proposal.deliverable.length > 100 && '...'}
                      </p>
                    </div>

                    {proposal.foundation_notes && (
                      <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-600 dark:border-yellow-400">
                        <p className="text-sm text-yellow-900 dark:text-yellow-200">
                          <span className="font-semibold">Foundation Notes:</span> {proposal.foundation_notes}
                        </p>
                        {proposal.foundation_offer_cstake_amount && (
                          <p className="text-sm text-yellow-900 dark:text-yellow-200 mt-2">
                            <span className="font-semibold">Counter-Offer:</span>{' '}
                            {(proposal.foundation_offer_cstake_amount / 10000000).toFixed(2)}%
                          </p>
                        )}
                      </div>
                    )}
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

