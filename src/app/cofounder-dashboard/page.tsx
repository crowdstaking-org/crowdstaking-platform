'use client'

import { useState } from 'react'
import { Layout } from '@/components/Layout'
import { Search, Lightbulb, Wallet, Vote } from 'lucide-react'
import { DiscoverTab } from '@/components/cofounder/DiscoverTab'
import { MyContributionsTab } from '@/components/cofounder/MyContributionsTab'
import { ContextSwitcher } from '@/components/dashboard/ContextSwitcher'
import { useRouter } from 'next/navigation'

/**
 * Cofounder Dashboard page - Discover missions and manage contributions
 * Client Component - has tab state management
 */
export default function CofounderDashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('discover')
  const [currentContext, setCurrentContext] = useState('cofounder')

  const handleContextChange = (context: string) => {
    setCurrentContext(context)
    if (context === 'cofounder') {
      // Already here, do nothing
    } else if (context === 'new-project') {
      router.push('/wizard')
    } else {
      // Switch to project-specific founder dashboard
      router.push('/dashboard')
    }
  }

  const tabs = [
    {
      id: 'discover',
      label: 'Discover',
      icon: Search,
    },
    {
      id: 'contributions',
      label: 'My Contributions',
      icon: Lightbulb,
    },
    {
      id: 'portfolio',
      label: 'Portfolio',
      icon: Wallet,
    },
    {
      id: 'governance',
      label: 'Governance',
      icon: Vote,
    },
  ]

  const handleViewProject = (projectId: string) => {
    // Navigate to project-specific founder dashboard
    router.push('/dashboard')
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
            />
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Co-Founder Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Discover missions, manage your work, and grow your portfolio
            </p>
          </div>

          {/* Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-8 overflow-x-auto">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'discover' && (
            <DiscoverTab onViewProject={handleViewProject} />
          )}
          {activeTab === 'contributions' && <MyContributionsTab />}
          {activeTab === 'portfolio' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Portfolio view coming soon...
              </p>
            </div>
          )}
          {activeTab === 'governance' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Governance view coming soon...
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

