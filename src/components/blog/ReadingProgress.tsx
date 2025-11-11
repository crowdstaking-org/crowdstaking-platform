/**
 * ReadingProgress Component
 * Fixed progress bar at top of page showing article read percentage
 * 
 * Features:
 * - Smooth animation
 * - Minimal performance impact (debounced)
 * - Supports dark mode
 */

'use client'

import { useScrollProgress } from '@/hooks/useScrollProgress'

interface ReadingProgressProps {
  className?: string
  color?: string
}

export function ReadingProgress({ 
  className = '', 
  color = 'bg-blue-600 dark:bg-blue-400' 
}: ReadingProgressProps) {
  const progress = useScrollProgress()

  return (
    <div 
      className={`fixed top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 z-50 ${className}`}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    >
      <div
        className={`h-full ${color} transition-all duration-150 ease-out`}
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

