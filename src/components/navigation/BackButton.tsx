/**
 * BackButton Component
 * Returns to previous page or specified fallback URL
 */

'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

interface BackButtonProps {
  fallbackUrl?: string // Fallback URL if history is empty
  label?: string
  className?: string
}

export function BackButton({ 
  fallbackUrl = '/', 
  label = 'Back',
  className = '' 
}: BackButtonProps) {
  const router = useRouter()

  const handleBack = () => {
    // Check if there's history to go back to
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push(fallbackUrl)
    }
  }

  return (
    <button
      onClick={handleBack}
      className={`inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg transition-colors cursor-pointer ${className}`}
      aria-label={label}
    >
      <ArrowLeft className="w-4 h-4" />
      <span className="font-medium">{label}</span>
    </button>
  )
}

