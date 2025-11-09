'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { Rocket, Code } from 'lucide-react'
import { ScrollReveal } from './ScrollReveal'
import { HeroBackground } from './backgrounds/HeroBackground'
import { useInViewport } from '../hooks/useInViewport'

interface HeroSectionProps {
  theme: 'light' | 'dark'
}

/**
 * Hero section with animated background and scroll reveal effects
 * @param theme Current theme for background adaptation
 */
export function HeroSection({ theme }: HeroSectionProps) {
  const heroRef = useRef<HTMLElement>(null)
  const isHeroVisible = useInViewport(heroRef, 0.3)

  return (
    <section
      ref={heroRef}
      className="relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{
        zIndex: 1,
      }}
    >
      {/* Animated Background */}
      <HeroBackground theme={theme} isHeroVisible={isHeroVisible} />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <ScrollReveal direction="up" scale={true} duration={800}>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Launch Your Startup Without Capital. Pay Top Talent with Liquid
            Equity.
          </h1>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={100} duration={800}>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
            CrowdStaking is a decentralized venture studio. We connect
            visionaries with global co-founders and transform creative
            initiative into tradable assets – from day 1.
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={200} duration={800}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/wizard" className="group flex items-center space-x-3 bg-blue-600 dark:bg-blue-500 text-white px-8 py-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-lg font-semibold w-full sm:w-auto justify-center btn-hover-lift btn-primary-glow ripple">
              <Rocket className="w-5 h-5 icon-slide" />
              <span>Start Mission</span>
            </Link>

            <Link href="/discover-projects" className="group flex items-center space-x-3 bg-gray-900 dark:bg-gray-700 text-white px-8 py-4 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors text-lg font-semibold w-full sm:w-auto justify-center btn-hover-lift btn-secondary-glow ripple">
              <Code className="w-5 h-5 icon-slide" />
              <span>Discover Projects</span>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
