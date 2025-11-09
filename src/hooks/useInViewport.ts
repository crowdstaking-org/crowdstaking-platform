import { useEffect, useState, RefObject } from 'react'

/**
 * Custom hook to detect if an element is in the viewport
 * Simplified version of useScrollReveal for boolean visibility detection
 * @param ref React ref object attached to the element to observe
 * @param threshold Percentage of element that must be visible (0-1)
 * @returns {boolean} Whether the element is currently in viewport
 */
export function useInViewport(
  ref: RefObject<HTMLElement | null>,
  threshold: number = 0.1,
) {
  const [isInViewport, setIsInViewport] = useState(true)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting)
      },
      { threshold },
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [ref, threshold])

  return isInViewport
}

