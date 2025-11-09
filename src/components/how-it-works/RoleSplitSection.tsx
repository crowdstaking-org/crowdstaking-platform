'use client'

import { Rocket, Code, ArrowDown } from 'lucide-react'
import { ScrollReveal } from '../ScrollReveal'

/**
 * Section showing the two different user paths
 * Client Component - needs scrollToSection functionality
 */
export function RoleSplitSection() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
      })
    }
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal direction="up" duration={700}>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Two Roles. One Goal.
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Founder Path */}
          <ScrollReveal direction="right" distance={60} duration={800}>
            <div className="group bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800 rounded-xl p-10 shadow-lg border-2 border-blue-200 dark:border-blue-700 card-hover card-shadow-grow">
              <div className="flex items-center justify-center w-20 h-20 bg-blue-600 dark:bg-blue-500 rounded-full mb-6 mx-auto">
                <Rocket className="w-10 h-10 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                The Founder's Path
              </h3>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold mb-4 text-center">
                The "Mission"
              </p>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 text-center">
                <span className="font-semibold">For:</span> Visionaries,
                Entrepreneurs (Sarah, Alex)
              </p>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                You have the idea. You set the "Mission" and are the first
                owner. Your goal: Find the world's best talent to build your
                vision.
              </p>

              <button
                onClick={() => scrollToSection('founder-process')}
                className="w-full group/btn flex items-center justify-center space-x-2 bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-semibold btn-hover-lift btn-primary-glow"
              >
                <span>The Founder Process</span>
                <ArrowDown className="w-4 h-4 group-hover/btn:translate-y-1 transition-transform" />
              </button>
            </div>
          </ScrollReveal>

          {/* Co-Founder Path */}
          <ScrollReveal direction="left" distance={60} duration={800}>
            <div className="group bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800 rounded-xl p-10 shadow-lg border-2 border-purple-200 dark:border-purple-700 card-hover card-shadow-grow">
              <div className="flex items-center justify-center w-20 h-20 bg-purple-600 dark:bg-purple-500 rounded-full mb-6 mx-auto">
                <Code className="w-10 h-10 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                The Co-Founder's Path
              </h3>
              <p className="text-sm text-purple-600 dark:text-purple-400 font-semibold mb-4 text-center">
                The "Proposal"
              </p>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 text-center">
                <span className="font-semibold">For:</span> Developers,
                Designers, Marketers (Maria, Ben)
              </p>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                You have the talent. You don't "apply". You find missions, make
                proactive proposals, and become a co-owner for your work.
              </p>

              <button
                onClick={() => scrollToSection('cofounder-process')}
                className="w-full group/btn flex items-center justify-center space-x-2 bg-purple-600 dark:bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors font-semibold btn-hover-lift btn-primary-glow"
              >
                <span>The Co-Founder Process</span>
                <ArrowDown className="w-4 h-4 group-hover/btn:translate-y-1 transition-transform" />
              </button>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

