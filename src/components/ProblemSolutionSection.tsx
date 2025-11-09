import { Lock, TrendingUp } from 'lucide-react'
import { ScrollReveal } from './ScrollReveal'

/**
 * Section contrasting traditional equity model with CrowdStaking's liquid equity
 * Uses opposing scroll directions to emphasize the contrast
 */
export function ProblemSolutionSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal direction="up" duration={700}>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Your 10-Year Prison Is Now a Real-Time Market.
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Traditional "sweat equity" is an empty promise. We make it
              valuable.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          <ScrollReveal
            direction="right"
            delay={100}
            distance={60}
            duration={800}
          >
            <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Lock className="w-8 h-8 text-red-600 dark:text-red-500" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  The 10-Year Prison
                </h3>
              </div>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                You work for shares trapped in a filing cabinet. Your wage? An
                illiquid 10-year promise. You have to wait for an 'exit' or IPO
                just to pay your rent.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal
            direction="left"
            delay={100}
            distance={60}
            duration={800}
          >
            <div className="h-full flex flex-col bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-600 dark:border-blue-500 rounded-xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  The Real-Time Market
                </h3>
              </div>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                You receive tradable project tokens for your work. You have the
                choice: Hold them as an investment (HODL) or sell them
                immediately on the market to pay your bills. No permission, no
                waiting.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

