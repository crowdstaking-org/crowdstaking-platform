import Link from 'next/link'
import { Rocket } from 'lucide-react'
import { ScrollReveal } from '../ScrollReveal'

/**
 * Final CTA section for Start Mission page
 * Server Component
 */
export function StartMissionCTA() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-blue-50 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto text-center">
        <ScrollReveal direction="up" scale={true} duration={800}>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Stop "Raising". Start Building.
          </h2>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={200} duration={800} scale={true}>
          <Link href="/wizard" className="group inline-flex items-center space-x-3 bg-blue-600 dark:bg-blue-500 text-white px-10 py-5 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-xl font-semibold btn-hover-lift btn-primary-glow ripple">
            <Rocket className="w-6 h-6 icon-slide" />
            <span>Start Mission Setup Wizard</span>
          </Link>
        </ScrollReveal>
      </div>
    </section>
  )
}

