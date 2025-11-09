import { ScrollReveal } from '../ScrollReveal'

/**
 * Hero section for Whitepaper page
 * Indigo theme for differentiation
 */
export function WhitepaperHero() {
  return (
    <section className="relative bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal direction="up" scale={true} duration={800}>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            CROWDSTAKING: THE INVESTMENT THESIS (v.3.0)
          </h1>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={100} duration={800}>
          <div className="bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl p-8 border-2 border-indigo-300 dark:border-indigo-700 shadow-lg">
            <p className="text-xl leading-relaxed text-gray-900 dark:text-white font-medium">
              In a world where AI takes over mechanical work, human creativity
              becomes the most valuable resource. CrowdStaking is the protocol
              that decouples creative initiative from capital and transforms it
              into a liquid asset.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

