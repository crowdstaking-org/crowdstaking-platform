import { Code } from 'lucide-react'
import { ScrollReveal } from '../ScrollReveal'

/**
 * Final CTA section for Discover Projects page
 * Server Component with purple theme
 */
export function DiscoverProjectsCTA() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-purple-50 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto text-center">
        <ScrollReveal direction="up" scale={true} duration={800}>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Your Work. Your Ownership. Immediately.
          </h2>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={100} duration={800}>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">
            This is where you stop selling your time and start building your
            portfolio.
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

