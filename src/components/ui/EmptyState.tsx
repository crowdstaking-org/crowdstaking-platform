/**
 * Empty State Component
 * Phase 7: Improved UX for empty data states
 * 
 * Provides helpful messaging and CTAs when no data is available
 */

import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'
import Link from 'next/link'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    href: string
  }
  children?: ReactNode
}

/**
 * Reusable Empty State Component
 * Use when displaying lists/grids with no data
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  children,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {/* Icon */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 dark:text-gray-500" />
      </div>

      {/* Title */}
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">
        {description}
      </p>

      {/* Action Button */}
      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center space-x-2 bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-semibold"
        >
          <span>{action.label}</span>
        </Link>
      )}

      {/* Custom Children */}
      {children && <div className="mt-6">{children}</div>}
    </div>
  )
}


