import { useEffect, useRef, useState } from 'react'

interface ScrollRevealOptions {
  threshold?: number
  delay?: number
  duration?: number
  distance?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  scale?: boolean
  once?: boolean
}

/**
 * Custom hook for scroll-triggered reveal animations
 * Uses IntersectionObserver to detect when element enters viewport
 * @param options Configuration options for the reveal animation
 * @returns {Object} Ref to attach to element, animated style object, and visibility state
 */
export function useScrollReveal(options: ScrollRevealOptions = {}) {
  const {
    threshold = 0.1,
    delay = 0,
    duration = 600,
    distance = 30,
    direction = 'up',
    scale = false,
    once = true,
  } = options

  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (prefersReducedMotion) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
          if (once) {
            observer.unobserve(element)
          }
        } else if (!once) {
          setIsVisible(false)
        }
      },
      { threshold },
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [threshold, delay, once])

  const getTransform = () => {
    if (isVisible) return 'translate(0, 0) scale(1)'

    let translate = ''
    switch (direction) {
      case 'up':
        translate = `translate(0, ${distance}px)`
        break
      case 'down':
        translate = `translate(0, -${distance}px)`
        break
      case 'left':
        translate = `translate(${distance}px, 0)`
        break
      case 'right':
        translate = `translate(-${distance}px, 0)`
        break
    }

    const scaleValue = scale ? ' scale(0.95)' : ''
    return translate + scaleValue
  }

  const style = {
    opacity: isVisible ? 1 : 0,
    transform: getTransform(),
    transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
  }

  return { ref, style, isVisible }
}

