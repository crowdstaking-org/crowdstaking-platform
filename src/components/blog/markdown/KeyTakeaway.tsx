/**
 * KeyTakeaway Component
 * Highlighted box for main learnings from a section
 */

'use client'

import { Target } from 'lucide-react'

interface KeyTakeawayProps {
  children: React.ReactNode
}

export function KeyTakeaway({ children }: KeyTakeawayProps) {
  return (
    <div className="my-6 p-5 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-600 dark:border-green-400 rounded-r-lg">
      <div className="flex items-start gap-3">
        <Target className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
        <div>
          <div className="text-sm font-semibold text-green-900 dark:text-green-100 uppercase tracking-wide mb-2">
            Key Takeaway
          </div>
          <div className="text-sm text-green-800 dark:text-green-200 leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

