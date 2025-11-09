import React from 'react'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface ProposalCardProps {
  from: string
  mission: string
  excerpt: string
  aiRecommendation: string
  status: 'fair' | 'high' | 'low'
}

/**
 * Reusable card component for displaying proposal details
 * Server Component
 */
export function ProposalCard({
  from,
  mission,
  excerpt,
  aiRecommendation,
  status,
}: ProposalCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="space-y-3">
        <div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            From:
          </span>
          <p className="font-semibold text-gray-900 dark:text-white">{from}</p>
        </div>

        <div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            For Mission:
          </span>
          <p className="font-semibold text-gray-900 dark:text-white">
            {mission}
          </p>
        </div>

        <div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            His Proposal (Excerpt):
          </span>
          <p className="text-gray-700 dark:text-gray-300 italic">"{excerpt}"</p>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-700">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            🤖 AI Mediator: {aiRecommendation}
          </span>
          <span className="text-sm text-green-600 dark:text-green-400 ml-2">
            (
            {status === 'fair'
              ? 'Fair Proposal'
              : status === 'high'
                ? 'Above Range'
                : 'Below Range'}
            )
          </span>
        </div>

        <Link
          href="/proposal-review"
          className="w-full inline-flex items-center justify-center space-x-2 bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-semibold"
        >
          <span>Review Proposal Now</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  )
}


