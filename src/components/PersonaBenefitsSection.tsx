import Link from 'next/link'
import { Lightbulb, Rocket, Code, TrendingUp } from 'lucide-react'
import { ScrollReveal } from './ScrollReveal'

/**
 * Section highlighting benefits for the two main user personas
 * Uses opposing slide directions to emphasize the duality
 */
export function PersonaBenefitsSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal direction="up" duration={700}>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Built for the Two Pillars of Innovation.
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-8">
          <ScrollReveal direction="right" distance={60} duration={800}>
            <div className="group bg-white dark:bg-gray-800 rounded-xl p-10 shadow-lg card-hover card-shadow-grow">
              <div className="flex items-center space-x-3 mb-6">
                <Lightbulb className="w-10 h-10 text-yellow-500 dark:text-yellow-400 icon-bounce" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  FOR VISIONARIES
                </h3>
              </div>

              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                You have the idea.
              </h4>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                Forget VC pitching. Find global top talent that you pay with
                liquid equity you create "from nothing." Focus on your vision,
                not the funding round.
              </p>

              <Link href="/wizard" className="group/btn flex items-center space-x-2 bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-semibold btn-hover-lift btn-primary-glow ripple">
                <Rocket className="w-5 h-5 icon-slide" />
                <span>Start Mission</span>
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="left" distance={60} duration={800}>
            <div className="group bg-white dark:bg-gray-800 rounded-xl p-10 shadow-lg card-hover card-shadow-grow">
              <div className="flex items-center space-x-3 mb-6">
                <TrendingUp className="w-10 h-10 text-green-500 dark:text-green-400 icon-bounce" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  FOR PIONEERS
                </h3>
              </div>

              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                You have the talent.
              </h4>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                Stop selling your time for a salary. Become a co-founder. Work
                on what you want and receive real, liquid ownership for your
                creative work. This is Open Source 3.0.
              </p>

              <Link href="/discover-projects" className="group/btn flex items-center space-x-2 bg-gray-900 dark:bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors font-semibold btn-hover-lift btn-secondary-glow ripple">
                <Code className="w-5 h-5 icon-slide" />
                <span>Discover Projects</span>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
