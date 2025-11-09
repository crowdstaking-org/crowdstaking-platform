import React from 'react'
import { Target } from 'lucide-react'
import { ScrollReveal } from '../ScrollReveal'

/**
 * Mission statement section for About page
 * Server Component
 */
export function AboutMissionSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal direction="up" duration={700}>
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <Target className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Our Mission: Decouple Ideas from Capital.
          </h2>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={100} duration={700}>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-6 text-lg">
              <p>
                The world's most valuable resource – the pure, creative idea –
                is trapped in a system that blocks it. The biggest bottleneck
                for a brilliant vision is capital. The traditional venture model
                forces visionaries to become salespeople instead of builders. It
                treats talent as contractors, not creators.
              </p>

              <p className="font-semibold text-2xl text-gray-900 dark:text-white">
                We're changing that.
              </p>

              <p>
                Our mission is to create the infrastructure for a world where
                ideas matter more than money. We're building a "factory" where
                co-founders meet and creative initiative is directly transformed
                into liquid, tradable ownership.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}


