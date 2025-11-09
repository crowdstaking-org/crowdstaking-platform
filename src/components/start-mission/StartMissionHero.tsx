import { Rocket } from 'lucide-react'
import { ScrollReveal } from '../ScrollReveal'

/**
 * Hero section for Start Mission page
 * Server Component - no state or interactivity beyond button
 */
export function StartMissionHero() {
  return (
    <section className="relative bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 via-transparent to-purple-100/20 dark:from-blue-900/10 dark:to-purple-900/10 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <ScrollReveal direction="up" scale={true} duration={800}>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Your Idea Is All You Need. We Deliver the Infrastructure.
          </h1>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={100} duration={800}>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Skip the VC rounds. Launch your global startup, incorporate your
            digital company, and pay your team with liquid equity – all through
            a single, legally compliant protocol.
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={200} duration={800} scale={true}>
          <button className="group inline-flex items-center space-x-3 bg-blue-600 dark:bg-blue-500 text-white px-10 py-5 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-xl font-semibold btn-hover-lift btn-primary-glow ripple">
            <Rocket className="w-6 h-6 icon-slide" />
            <span>Start Mission Setup Wizard</span>
          </button>
        </ScrollReveal>
      </div>
    </section>
  )
}

