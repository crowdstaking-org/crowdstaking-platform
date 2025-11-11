/**
 * useScrollProgress Hook
 * Tracks reading progress based on scroll position
 * Returns percentage (0-100) of article read
 */

'use client'

import { useEffect, useState } from 'react'

export function useScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const calculateProgress = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY

      // Calculate how much of the page has been scrolled
      const scrollableHeight = documentHeight - windowHeight
      const scrolled = (scrollTop / scrollableHeight) * 100

      // Clamp between 0 and 100
      const clampedProgress = Math.min(100, Math.max(0, scrolled))
      
      setProgress(clampedProgress)
    }

    // Calculate on mount
    calculateProgress()

    // Debounced scroll handler for performance
    let timeoutId: NodeJS.Timeout
    const handleScroll = () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      
      timeoutId = setTimeout(calculateProgress, 10)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', calculateProgress, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', calculateProgress)
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [])

  return progress
}

