import React from 'react'
import { Users } from 'lucide-react'
import { ScrollReveal } from '../ScrollReveal'

/**
 * Who We Are section explaining the Satoshi Principle
 * Server Component
 */
export function WhoWeAreSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal direction="up" duration={700}>
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Who Are "We"? The Protocol Is the Star.
          </h2>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={100} duration={700}>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-6 text-lg">
              <p>
                We – the initiators of the protocol – have deliberately chosen
                the "Satoshi Principle". Why? Because this idea is bigger than
                any founder.
              </p>

              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 border-l-4 border-purple-600 dark:border-purple-400 my-8">
                <p className="font-semibold text-xl text-gray-900 dark:text-white mb-2">
                  A "cult of personality" is a weakness. A movement is
                  unstoppable.
                </p>
              </div>

              <p>
                "We" are not two founders. "We" are the thousands of
                decentralized owners who build, use, and own this protocol.
              </p>

              <p>
                This is the Bitcoin parallel: Bitcoin had no CEO and no
                marketing budget. The protocol itself was the marketing. We
                follow this exact brilliant model.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}


