import Link from 'next/link'
import { Rocket, Code } from 'lucide-react'
import { ScrollReveal } from './ScrollReveal'

/**
 * Final call-to-action section with urgent messaging
 * Dual CTAs for both user personas
 */
export function FinalCTASection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto text-center">
        <ScrollReveal direction="up" scale={true} duration={800}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            What Are You Waiting For?
          </h2>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={100} duration={800}>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">
            Build the next unicorn. Or become a co-owner of a unicorn.
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={200} duration={800} scale={true}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/wizard" className="group flex items-center space-x-3 bg-blue-600 dark:bg-blue-500 text-white px-8 py-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-lg font-semibold w-full sm:w-auto justify-center btn-hover-lift btn-primary-glow ripple">
              <Rocket className="w-5 h-5 icon-slide" />
              <span>Start Your Mission</span>
            </Link>

            <Link href="/discover-projects" className="group flex items-center space-x-3 bg-gray-900 dark:bg-gray-700 text-white px-8 py-4 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors text-lg font-semibold w-full sm:w-auto justify-center btn-hover-lift btn-secondary-glow ripple">
              <Code className="w-5 h-5 icon-slide" />
              <span>Find Your Mission</span>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
