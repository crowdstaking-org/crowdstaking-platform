'use client'

import { ReactNode } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'

interface ScrollRevealProps {
  children: ReactNode
  direction?: 'up' | 'down' | 'left' | 'right'
  delay?: number
  duration?: number
  distance?: number
  scale?: boolean
  threshold?: number
  className?: string
}

/**
 * Wrapper component for scroll-triggered reveal animations
 * Uses IntersectionObserver to animate elements as they enter viewport
 * @param props Configuration options and children to animate
 */
export function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 600,
  distance = 30,
  scale = false,
  threshold = 0.1,
  className = '',
}: ScrollRevealProps) {
  const { ref, style } = useScrollReveal({
    direction,
    delay,
    duration,
    distance,
    scale,
    threshold,
  })

  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  )
}

