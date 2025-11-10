'use client'

import React, { useState, useEffect } from 'react'
import { AlertTriangle, FileText } from 'lucide-react'
import { ProtectedButton } from '@/components/auth/ProtectedButton'
import { useAuth } from '@/hooks/useAuth'
import type { Project } from '@/types/project'

interface SettingsTabProps {
  project: Project | null
}

/**
 * Settings Tab for Founder Dashboard
 * Project settings and danger zone
 * Client Component - has form state
 */
export function SettingsTab({ project }: SettingsTabProps) {
  const { isAuthenticated } = useAuth()
  const [projectName, setProjectName] = useState('')
  const [mission, setMission] = useState('')
  const [tags, setTags] = useState('AI, SaaS, Travel')

  // Update form when project changes
  useEffect(() => {
    if (project) {
      setProjectName(project.name)
      setMission(project.description || '')
    }
  }, [project])

  const handleSave = () => {
    // TODO: Save to backend
    console.log('Saving project settings...')
  }

  return (
    <div className="space-y-8">
      {/* Info Banner for non-authenticated users */}
      {!isAuthenticated && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border-l-4 border-yellow-600 dark:border-yellow-400">
          <p className="text-yellow-800 dark:text-yellow-200 font-semibold">
            Connect your wallet to edit project settings
          </p>
        </div>
      )}

      {/* Project Details */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Project Details
        </h3>
        <div className="space-y-4">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Project Name
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              disabled={!isAuthenticated}
              className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Mission Statement */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Mission Statement
            </label>
            <textarea
              rows={4}
              value={mission}
              onChange={(e) => setMission(e.target.value)}
              disabled={!isAuthenticated}
              className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Tags
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              disabled={!isAuthenticated}
              className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <ProtectedButton
            onClick={handleSave}
            actionName="Save Settings"
            className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-semibold"
          >
            Save Changes
          </ProtectedButton>
        </div>
      </div>

      {/* Legal Wrapper */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Legal-Wrapper-as-a-Service
        </h3>

        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-sm font-semibold">
            Not Set Up
          </span>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border-l-4 border-blue-600 dark:border-blue-400 mb-6">
          <div className="flex items-start space-x-3">
            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
            <p className="text-gray-700 dark:text-gray-300">
              Your project is "On-Chain Only". To write invoices, open bank
              accounts, or hold IP rights, you need a legal shell. Use our
              service to establish a "Wyoming DAO LLC" or "Swiss Foundation"
              managed by the CrowdStaking Foundation.
            </p>
          </div>
        </div>

        <ProtectedButton
          onClick={() => {
            // TODO: Implement legal wrapper process
            console.log('Starting legal wrapper process...')
          }}
          actionName="Start Legal Wrapper Process"
          className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-semibold"
        >
          Start Legal Wrapper Process
        </ProtectedButton>
      </div>

      {/* Danger Zone */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border-2 border-red-200 dark:border-red-900">
        <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4 flex items-center space-x-2">
          <AlertTriangle className="w-6 h-6" />
          <span>Danger Zone</span>
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Archiving your project will make it invisible to co-founders. This
          action can be reversed.
        </p>
        <ProtectedButton
          onClick={() => {
            // TODO: Implement archive project logic with confirmation
            console.log('Archiving project...')
          }}
          actionName="Archive Project"
          className="bg-red-600 dark:bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors font-semibold"
        >
          Archive Project
        </ProtectedButton>
      </div>
    </div>
  )
}

