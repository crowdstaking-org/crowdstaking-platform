'use client'

import { useState, useEffect } from 'react'
import { Layout } from '@/components/Layout'
import {
  Home,
  Lightbulb,
  Inbox,
  Users,
  TrendingUp,
  Settings,
  Plus,
  Droplets,
} from 'lucide-react'
import { ProposalCard } from '@/components/dashboard/ProposalCard'
import { MissionsTab } from '@/components/founder/MissionsTab'
import { ProposalsTab } from '@/components/founder/ProposalsTab'
import { TeamTab } from '@/components/founder/TeamTab'
import { TokenomicsTab } from '@/components/founder/TokenomicsTab'
import { SettingsTab } from '@/components/founder/SettingsTab'
import { ContextSwitcher } from '@/components/dashboard/ContextSwitcher'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useFounderProjects } from '@/hooks/useProject'
import type { Project, ProjectStats } from '@/types/project'

/**
 * Founder Dashboard page - Manage missions, review proposals, and track team
 * Client Component - has tab state management
 */
export default function FounderDashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { wallet, isAuthenticated, login } = useAuth()
  const { projects, loading: projectsLoading } = useFounderProjects(wallet || undefined)
  
  const [activeTab, setActiveTab] = useState('overview')
  const [currentContext, setCurrentContext] = useState('project-flight-ai')
  const [project, setProject] = useState<Project | null>(null)
  const [stats, setStats] = useState<ProjectStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(false)

  // Load project from URL parameter or first available project
  useEffect(() => {
    const projectId = searchParams.get('project')
    
    if (projectId && projects && projects.length > 0) {
      // Find the project with the matching ID
      const selectedProject = projects.find(p => p.id === projectId)
      if (selectedProject) {
        setProject(selectedProject)
        return
      }
    }
    
    // Fallback: Load first project when projects are available
    if (projects && projects.length > 0 && !project) {
      setProject(projects[0])
    }
  }, [projects, project, searchParams])

  // Load stats when project changes
  useEffect(() => {
    if (!project) return

    setStatsLoading(true)
    fetch(`/api/projects/${project.id}/stats`)
      .then(res => res.json())
      .then(data => {
        setStats(data.stats)
        setStatsLoading(false)
      })
      .catch(err => {
        console.error('Failed to load stats:', err)
        setStatsLoading(false)
      })
  }, [project])

  const handleContextChange = (context: string) => {
    setCurrentContext(context)
    if (context === 'cofounder') {
      router.push('/cofounder-dashboard')
    } else if (context === 'new-project') {
      router.push('/wizard')
    }
    // Stay on current page for project switches
  }

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: Home,
    },
    {
      id: 'missions',
      label: 'Missions',
      icon: Lightbulb,
    },
    {
      id: 'proposals',
      label: 'Proposals',
      icon: Inbox,
    },
    {
      id: 'team',
      label: 'Team',
      icon: Users,
    },
    {
      id: 'tokenomics',
      label: 'Tokenomics',
      icon: TrendingUp,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
    },
  ]

  // Show auth required if not connected
  if (!isAuthenticated || !wallet) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Connect Your Wallet
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Please connect your wallet to access your founder dashboard and manage your projects.
            </p>
            
            <button
              onClick={login}
              className="inline-flex items-center px-8 py-4 bg-blue-600 dark:bg-blue-500 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              Connect Wallet
            </button>

            <div className="mt-12 grid md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Manage Projects
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Create and manage your startup projects
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Review Proposals
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Accept proposals and build your team
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Track Growth
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Monitor tokenomics and team metrics
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Context Switcher */}
          <div className="mb-6">
            <ContextSwitcher
              currentContext={currentContext}
              onContextChange={handleContextChange}
              projects={projects}
            />
          </div>

          {/* Header */}
          <div className="mb-8">
            {projectsLoading ? (
              <div className="animate-pulse">
                <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-96 mb-2"></div>
                <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-64"></div>
              </div>
            ) : project ? (
              <>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  Dashboard: {project.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {project.description || 'Manage your mission, review proposals, and grow your team'}
                </p>
              </>
            ) : (
              <>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  Welcome to CrowdStaking
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  You don't have any projects yet. Create your first project to get started!
                </p>
                <button
                  onClick={() => router.push('/wizard')}
                  className="inline-flex items-center space-x-2 bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-semibold"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Your First Project</span>
                </button>
              </>
            )}
          </div>

          {/* Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-8 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
            <div className="flex border-b border-gray-200 dark:border-gray-700 min-w-max sm:min-w-0">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 sm:px-6 py-4 font-semibold transition-colors whitespace-nowrap ${activeTab === tab.id ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm sm:text-base">{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Overview Content */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Pending Proposals Alert */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  📥 1 New Proposal Waiting for You
                </h2>

                <ProposalCard
                  from="Ben (Berlin, DE)"
                  mission="Logo & Brand Identity Design"
                  excerpt="Hello, I'm a Senior Brand Designer and would take on this task for 0.15% of the tokens..."
                  aiRecommendation="0.1% - 0.2%"
                  status="fair"
                />
              </div>

              {/* Two Column Layout */}
              <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                {/* Active Mini-Missions */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Active Mini-Missions
                  </h3>

                  <div className="space-y-3 mb-4">
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          Logo & Brand Identity Design
                        </span>
                        <span className="text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">
                          1 Proposal
                        </span>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          Landing Page Development
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 px-2 py-1 rounded">
                          0 Proposals
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/create-mini-mission"
                    className="w-full inline-flex items-center justify-center space-x-2 bg-blue-600 dark:bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-semibold"
                  >
                    <Plus className="w-5 h-5" />
                    <span>New Mini-Mission</span>
                  </Link>
                </div>

                {/* Project Statistics */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Project Statistics
                  </h3>

                  {statsLoading ? (
                    <div className="space-y-4 mb-6 animate-pulse">
                      <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  ) : (
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-gray-600 dark:text-gray-400">
                          Co-Founders (Team)
                        </span>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          {stats?.team_members_count || 0}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-gray-600 dark:text-gray-400">
                          Distributed Tokens
                        </span>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          {stats?.distributed_tokens_percentage.toFixed(2) || 0}%
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-3">
                        <span className="text-gray-600 dark:text-gray-400">
                          Token Status
                        </span>
                        {project?.token_status === 'live' ? (
                          <span className="inline-flex items-center space-x-2 text-green-600 dark:text-green-400 font-semibold">
                            <span className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full"></span>
                            <span>Live</span>
                          </span>
                        ) : project?.token_status === 'pending' ? (
                          <span className="inline-flex items-center space-x-2 text-yellow-600 dark:text-yellow-400 font-semibold">
                            <span className="w-2 h-2 bg-yellow-600 dark:bg-yellow-400 rounded-full"></span>
                            <span>Pending</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-2 text-red-600 dark:text-red-400 font-semibold">
                            <span className="w-2 h-2 bg-red-600 dark:bg-red-400 rounded-full"></span>
                            <span>Illiquid</span>
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <Link
                    href="/liquidity-wizard"
                    className="w-full inline-flex items-center justify-center space-x-2 bg-purple-600 dark:bg-purple-500 text-white px-4 py-3 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors font-semibold"
                  >
                    <Droplets className="w-5 h-5" />
                    <span>Make Your Tokens Liquid Now</span>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs */}
          {activeTab === 'missions' && <MissionsTab projectId={project?.id} />}
          {activeTab === 'proposals' && <ProposalsTab projectId={project?.id} />}
          {activeTab === 'team' && <TeamTab project={project} />}
          {activeTab === 'tokenomics' && <TokenomicsTab project={project} />}
          {activeTab === 'settings' && <SettingsTab project={project} />}
        </div>
      </div>
    </Layout>
  )
}


