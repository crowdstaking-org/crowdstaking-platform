/**
 * useActiveHeading Hook
 * Tracks which heading is currently visible using Intersection Observer
 * Used for highlighting active section in TableOfContents
 */

'use client'

import { useEffect, useState } from 'react'

export function useActiveHeading(headingIds: string[]) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    if (headingIds.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first heading that's intersecting and near the top
        const visibleHeadings = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visibleHeadings.length > 0) {
          setActiveId(visibleHeadings[0].target.id)
        }
      },
      {
        // Trigger when heading is in top 20% of viewport
        rootMargin: '-80px 0px -80% 0px',
        threshold: 0,
      }
    )

    // Observe all headings
    headingIds.forEach((id) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      observer.disconnect()
    }
  }, [headingIds])

  return activeId
}

