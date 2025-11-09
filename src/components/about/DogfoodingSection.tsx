import React from 'react'
import { CheckCircle, Code } from 'lucide-react'
import { ScrollReveal } from '../ScrollReveal'
import Link from 'next/link'

/**
 * Dogfooding section explaining how CrowdStaking builds itself
 * Server Component
 */
export function DogfoodingSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal direction="up" duration={700}>
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            We Prove the Thesis by Living It.
          </h2>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={100} duration={700}>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-6 text-lg">
              <p>
                We don't ask for trust in an idea. We prove the idea live in the
                market.
              </p>

              <p className="font-semibold text-xl text-gray-900 dark:text-white">
                The CrowdStaking platform is itself being built on CrowdStaking.
              </p>

              <p>
                This "dogfooding" approach isn't just marketing – it's the
                living proof of our thesis.
              </p>

              <ul className="space-y-4 my-8">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      It's authentic:
                    </span>{' '}
                    We use exactly the tools we offer to others.
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      It's a filter:
                    </span>{' '}
                    It attracts the pioneers (the "Bens" and "Alexes") who are
                    crazy enough to work on a project that's building itself in
                    flight. They are our "1000 True Fans".
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={200} duration={700}>
          <div className="text-center mt-12">
            <Link
              href="/discover-projects"
              className="inline-flex items-center space-x-2 bg-green-600 dark:bg-green-500 text-white px-8 py-4 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors font-semibold text-lg btn-hover-lift btn-primary-glow ripple"
            >
              <Code className="w-5 h-5" />
              <span>View the "Building CrowdStaking" Mission</span>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}


