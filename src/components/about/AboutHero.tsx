import React from 'react'
import { ScrollReveal } from '../ScrollReveal'

/**
 * Hero section for About page
 * Server Component
 */
export function AboutHero() {
  return (
    <section className="relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <ScrollReveal direction="up" scale={true} duration={800}>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            We Are a Movement, Not a Company.
          </h1>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={100} duration={800}>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
            CrowdStaking is our answer to a fundamental shift in the world. In
            an era where AI takes over mechanical work, human creativity becomes
            the last, irreplaceable resource. We're building the infrastructure
            for this new economy.
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}


