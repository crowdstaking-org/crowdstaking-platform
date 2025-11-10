'use client'

import { useState, useEffect } from 'react'
import { Rocket, Briefcase } from 'lucide-react'
import Link from 'next/link'
import { HeroBackground } from './backgrounds/HeroBackground'

interface NewHeroSectionProps {
  theme: 'light' | 'dark'
}

/**
 * New Hero Section with "fork" design - showcasing two paths
 * Founders vs Contributors with full-screen impact
 * Flying rockets appear/disappear based on scroll position
 */
export function NewHeroSection({ theme }: NewHeroSectionProps) {
  const [isHeroVisible, setIsHeroVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      // Hero is visible when scroll position is near the top
      const heroHeight = window.innerHeight
      const scrollPosition = window.scrollY
      
      // Consider hero visible if we're in the top 80% of the hero section
      setIsHeroVisible(scrollPosition < heroHeight * 0.8)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <HeroBackground theme={theme} isHeroVisible={isHeroVisible} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight">
            Where Ideas Become Startups
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-gray-700 dark:text-gray-300 mb-3 sm:mb-4 font-semibold">
            Funded by Talent, Not VCs
          </p>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto px-2">
            CrowdStaking is a decentralized venture studio that transforms
            creative initiative directly into liquid, tradeable ownership.
          </p>
        </div>

        {/* The Fork */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto items-stretch">
          {/* For Founders */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-xl border-2 border-blue-200 dark:border-blue-700 hover:shadow-2xl transition-all card-hover flex flex-col h-full">
            <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4 sm:mb-6 mx-auto">
              <Rocket className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 text-center">
              For Founders
            </h3>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-4 sm:mb-6 text-center leading-relaxed flex-grow">
              <span className="font-semibold">
                Launch your project without capital.
              </span>{' '}
              Hire a world-class team. Pay with equity you create now—not with
              your cash.
            </p>
            <Link
              href="/wizard"
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 dark:bg-blue-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-base sm:text-lg font-bold btn-hover-lift btn-primary-glow mt-auto"
            >
              <Rocket className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Start Your Mission</span>
            </Link>
          </div>

          {/* For Contributors */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-xl border-2 border-purple-200 dark:border-purple-700 hover:shadow-2xl transition-all card-hover flex flex-col h-full">
            <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4 sm:mb-6 mx-auto">
              <Briefcase className="w-7 h-7 sm:w-8 sm:h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 text-center">
              For Contributors
            </h3>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-4 sm:mb-6 text-center leading-relaxed flex-grow">
              <span className="font-semibold">
                Earn equity instead of salary.
              </span>{' '}
              Work on tomorrow&apos;s projects. Become a co-owner and liquidate your
              sweat equity whenever you want. Not in 10 years.
            </p>
            <Link
              href="/discover-projects"
              className="w-full flex items-center justify-center space-x-2 bg-purple-600 dark:bg-purple-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors text-base sm:text-lg font-bold btn-hover-lift btn-primary-glow mt-auto"
            >
              <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Find Your Mission</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

