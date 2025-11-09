import { Code } from 'lucide-react'
import { ScrollReveal } from '../ScrollReveal'

/**
 * Hero section for Discover Projects page
 * Server Component with purple theme to differentiate from Start Mission
 */
export function DiscoverProjectsHero() {
  return (
    <section className="relative bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 via-transparent to-blue-100/20 dark:from-purple-900/10 dark:to-blue-900/10 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <ScrollReveal direction="up" scale={true} duration={800}>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Become a Co-Founder. Not a Freelancer.
          </h1>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={100} duration={800}>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Browse "missions" from verified founders. Contribute your own ideas.
            Earn real, liquid ownership for your work.
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={200} duration={800} scale={true}>
          <a 
            href="#missionen"
            className="group inline-flex items-center space-x-3 bg-purple-600 dark:bg-purple-500 text-white px-10 py-5 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors text-xl font-semibold btn-hover-lift btn-primary-glow ripple"
          >
            <Code className="w-6 h-6 icon-slide" />
            <span>Find Your Mission</span>
          </a>
        </ScrollReveal>
      </div>
    </section>
  )
}

