import React from 'react'
import { Users } from 'lucide-react'
import type { Project } from '@/types/project'

interface TeamTabProps {
  project: Project | null
}

/**
 * Team Tab for Founder Dashboard
 * Shows co-founders list and stats
 * Server Component
 */
export function TeamTab({ project }: TeamTabProps) {
  const isEmpty = true // TODO: Load actual team members from completed proposals

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Active Co-Founders
          </p>
          <p className="text-4xl font-bold text-gray-900 dark:text-white">0</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Community Tokens Distributed
          </p>
          <p className="text-4xl font-bold text-gray-900 dark:text-white">0%</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Co-Founder List
        </h3>

        {isEmpty ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Your team is still empty. Accept the first proposal to welcome
              your first team member (co-founder).
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* This will be populated after accepting proposals */}
          </div>
        )}
      </div>
    </div>
  )
}

