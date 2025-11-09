import React from 'react'
import { Clock, MessageSquare } from 'lucide-react'

interface ContributionCardProps {
  project: string
  title: string
  yourRequest: number
  status: 'waiting' | 'counter-offer'
  founderName?: string
  counterOffer?: number
}

/**
 * Contribution Card for Cofounder Dashboard
 * Shows proposal status and details
 * Server Component
 */
export function ContributionCard({
  project,
  title,
  yourRequest,
  status,
  founderName,
  counterOffer,
}: ContributionCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Project:{' '}
            <span className="font-semibold text-gray-900 dark:text-white">
              {project}
            </span>
          </p>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {title}
          </h3>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
          Your Request:
        </p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {yourRequest}%
        </p>
      </div>

      {status === 'waiting' && (
        <div className="flex items-center space-x-2 bg-yellow-50 dark:bg-yellow-900/20 px-4 py-3 rounded-lg">
          <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
            Waiting for acceptance by founder ({founderName})
          </span>
        </div>
      )}

      {status === 'counter-offer' && (
        <>
          <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-3 rounded-lg mb-4">
            <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              Counter-offer received: {counterOffer}%
            </span>
          </div>
          <button className="w-full bg-blue-600 dark:bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-semibold">
            Review Counter-Offer
          </button>
        </>
      )}
    </div>
  )
}

