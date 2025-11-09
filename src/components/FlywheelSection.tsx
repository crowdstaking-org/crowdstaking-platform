import { RefreshCw, FileText } from 'lucide-react'
import { ScrollReveal } from './ScrollReveal'

/**
 * Section explaining the self-reinforcing ecosystem and index fund effect
 * Features rotating flywheel icon on hover
 */
export function FlywheelSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal direction="up" duration={700}>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              More Than a Platform. A Self-Reinforcing Ecosystem.
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Every successful project makes the platform itself more valuable.
              This is our flywheel.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" scale={true} delay={200} duration={1000}>
          <div className="group bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-10 mb-8 border-2 border-blue-200 dark:border-blue-800 card-hover card-shadow-grow glow-on-hover">
            <div className="flex items-center justify-center mb-8">
              <div className="flywheel-icon group-hover:rotate-slow">
                <RefreshCw className="w-16 h-16 text-blue-600 dark:text-blue-400" />
              </div>
            </div>

            <div className="space-y-6 text-gray-800 dark:text-gray-200 text-lg leading-relaxed">
              <p>
                Every project that launches on CrowdStaking automatically
                transfers 1-2% of its tokens to the CrowdStaking DAO treasury.
                The platform token ($CSTAKE) represents the value of this
                treasury, which holds stakes in thousands of startups.
              </p>

              <p className="text-xl font-bold text-gray-900 dark:text-white text-center py-4">
                $CSTAKE becomes the world's first true startup index fund.
              </p>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={400}>
          <div className="text-center">
            <button className="group inline-flex items-center space-x-2 bg-gray-900 dark:bg-gray-700 text-white px-8 py-4 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors font-semibold text-lg btn-hover-lift btn-secondary-glow ripple">
              <FileText className="w-5 h-5 icon-slide" />
              <span>Read the Investment Memo</span>
            </button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

