import React from 'react'
import { Rocket, Code } from 'lucide-react'
import { ScrollReveal } from '../ScrollReveal'
import Link from 'next/link'

/**
 * Final CTA section for About page
 * Server Component
 */
export function AboutCTA() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto text-center">
        <ScrollReveal direction="up" scale={true} duration={800}>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Don't Join a Company. Join a Movement.
          </h2>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={100} duration={800}>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">
            The next generation of unicorns won't be funded. They'll be built by
            people like you.
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={200} duration={800} scale={true}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/wizard"
              className="group flex items-center space-x-3 bg-blue-600 dark:bg-blue-500 text-white px-8 py-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-lg font-semibold w-full sm:w-auto justify-center btn-hover-lift btn-primary-glow ripple"
            >
              <Rocket className="w-5 h-5 icon-slide" />
              <span>Start Your Mission</span>
            </Link>

            <Link
              href="/discover-projects"
              className="group flex items-center space-x-3 bg-gray-900 dark:bg-gray-700 text-white px-8 py-4 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors text-lg font-semibold w-full sm:w-auto justify-center btn-hover-lift btn-secondary-glow ripple"
            >
              <Code className="w-5 h-5 icon-slide" />
              <span>Discover Projects</span>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}


