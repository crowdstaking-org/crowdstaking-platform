/**
 * Spinner Component
 * 
 * Reusable loading spinner with different sizes.
 * Used for loading states across the application.
 */

import React from 'react'

interface SpinnerProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Spinner({ className = '', size = 'md' }: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
  }

  return (
    <div
      className={`inline-block animate-spin rounded-full border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] ${sizeClasses[size]} ${className}`}
      role="status"
      aria-label="loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

/**
 * Full page loading spinner
 */
export function FullPageSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <Spinner size="lg" className="text-blue-600 dark:text-blue-400 mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Lädt...</p>
      </div>
    </div>
  )
}

/**
 * Skeleton loader for cards/content
 */
export function SkeletonLoader({ 
  lines = 3,
  className = ''
}: { 
  lines?: number
  className?: string 
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
          style={{
            width: i === lines - 1 ? '60%' : '100%',
          }}
        />
      ))}
    </div>
  )
}

/**
 * Skeleton card loader
 */
export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`p-6 bg-white dark:bg-gray-800 rounded-lg shadow ${className}`}>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4 w-3/4" />
      <SkeletonLoader lines={3} />
    </div>
  )
}



