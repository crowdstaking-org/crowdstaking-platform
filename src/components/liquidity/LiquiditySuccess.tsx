import React from 'react'
import { CheckCircle, BarChart3 } from 'lucide-react'
import Link from 'next/link'

interface LiquiditySuccessProps {
  onComplete?: () => void
}

/**
 * Success state after pool creation
 * Client Component
 */
export function LiquiditySuccess({ onComplete }: LiquiditySuccessProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 sm:p-12 text-center">
        <div className="flex items-center justify-center w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          ✅ Your Token is Now LIVE and Liquid!
        </h1>

        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">
          Your $PROJ-A token is now tradable. Your project will now display with
          the "✅ Liquid" badge on the "Discover" page. Prepare for more (and
          better) proposals.
        </p>

        <Link
          href="/dashboard"
          className="inline-flex items-center space-x-2 bg-purple-600 dark:bg-purple-500 text-white px-10 py-4 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors text-lg font-semibold btn-hover-lift btn-primary-glow ripple"
        >
          <BarChart3 className="w-6 h-6" />
          <span>🥳 Back to Dashboard</span>
        </Link>
      </div>
    </div>
  )
}


