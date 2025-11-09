import { ScrollReveal } from '../ScrollReveal'

/**
 * Hero section for How It Works page
 * Green theme for differentiation
 */
export function HowItWorksHero() {
  return (
    <section className="relative bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-100/20 via-transparent to-blue-100/20 dark:from-green-900/10 dark:to-blue-900/10 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <ScrollReveal direction="up" scale={true} duration={800}>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            A Protocol for Fair, Decentralized Founding.
          </h1>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={100} duration={800}>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            CrowdStaking isn't just a platform, it's a new mechanism. It
            decouples creative ideas from capital and transforms contributions
            into liquid ownership. Here's how it works in detail.
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}

