import { Users, FileCheck, Coins, ArrowRight } from 'lucide-react'
import { ScrollReveal } from './ScrollReveal'

/**
 * Section showcasing current missions/projects
 * Features a highlighted CrowdStaking project card and secondary example
 */
export function MissionsSection() {
  return (
    <section
      id="missions"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800"
    >
      <div className="max-w-6xl mx-auto">
        <ScrollReveal direction="up" duration={700}>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Current Missions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              These aren't job offers. These are invitations to become a
              co-founder.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-8 mb-12 items-stretch">
          <ScrollReveal
            direction="up"
            scale={true}
            duration={900}
            distance={50}
          >
            <div className="h-full flex flex-col group bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800 border-2 border-blue-600 dark:border-blue-500 rounded-xl p-8 shadow-lg card-hover card-shadow-grow card-border-glow cursor-pointer">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xl scale-hover">
                  CS
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    CrowdStaking: The Factory
                  </h3>
                  <span className="inline-block bg-blue-600 dark:bg-blue-500 text-white text-xs px-2 py-1 rounded mt-1 badge-pulse">
                    FEATURED
                  </span>
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg">
                "Building the infrastructure for the next generation of
                decentralized startups."
              </p>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-gray-900 dark:text-white font-bold text-xl mb-1 stat-number">
                    <Users className="w-5 h-5 icon-bounce" />
                    <span>12</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Co-Founders
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-gray-900 dark:text-white font-bold text-xl mb-1 stat-number">
                    <FileCheck className="w-5 h-5 icon-bounce" />
                    <span>45</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Proposals
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-gray-900 dark:text-white font-bold text-xl mb-1 stat-number">
                    <Coins className="w-5 h-5 icon-bounce" />
                    <span>1.2M</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    $CSTAKE
                  </p>
                </div>
              </div>

              <button className="w-full bg-blue-600 dark:bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-semibold flex items-center justify-center space-x-2 btn-hover-lift btn-primary-glow group mt-auto">
                <span>View Mission & Build</span>
                <ArrowRight className="w-4 h-4 icon-slide" />
              </button>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={200} duration={700}>
            <div className="h-full flex flex-col group bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-8 card-hover card-shadow-grow card-border-glow cursor-pointer">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold text-xl scale-hover">
                  TA
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Project "Travel AI"
                  </h3>
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg">
                "Building the world's smartest travel tool."
              </p>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-gray-900 dark:text-white font-bold text-xl mb-1 stat-number">
                    <Users className="w-5 h-5 icon-bounce" />
                    <span>3</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Co-Founders
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-gray-900 dark:text-white font-bold text-xl mb-1 stat-number">
                    <FileCheck className="w-5 h-5 icon-bounce" />
                    <span>8</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Proposals
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-gray-900 dark:text-white font-bold text-xl mb-1 stat-number">
                    <Coins className="w-5 h-5 icon-bounce" />
                    <span>...</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Tokens
                  </p>
                </div>
              </div>

              <button className="w-full bg-gray-900 dark:bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors font-semibold flex items-center justify-center space-x-2 btn-hover-lift btn-secondary-glow group mt-auto">
                <span>View Mission</span>
                <ArrowRight className="w-4 h-4 icon-slide" />
              </button>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal direction="up" delay={400}>
          <div className="text-center">
            <button className="group inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-lg link-slide">
              <span>Discover All Missions</span>
              <ArrowRight className="w-5 h-5 icon-slide" />
            </button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

