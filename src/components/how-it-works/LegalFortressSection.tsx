import { Shield, FileCheck } from 'lucide-react'
import { ScrollReveal } from '../ScrollReveal'

/**
 * Section explaining legal structure and enforcement
 * Server Component
 */
export function LegalFortressSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal direction="up" duration={700}>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              The "Legal-Tech" Bridge: Secure in Two Worlds.
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              A decentralized idea needs an unassailable structure in the real
              world.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Swiss Foundation */}
          <ScrollReveal direction="right" distance={60} duration={800}>
            <div className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800 rounded-xl p-8 shadow-lg border-2 border-blue-200 dark:border-blue-700">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-600 dark:bg-blue-500 rounded-full mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Part 1: The Swiss Foundation
              </h3>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold mb-4">
                The "Honest Foundation" (The Firewall)
              </p>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                The CrowdStaking protocol isn't left to "just anyone". It's
                protected by a professional, independent Swiss Foundation. The
                Foundation Council isn't a "slave to the DAO", but a legal
                firewall.
              </p>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                It only reviews DAO decisions for legality and protects the
                protocol from illegal actions. This creates trust and global
                operability (bank accounts, contracts).
              </p>
            </div>
          </ScrollReveal>

          {/* Legal Wrapper */}
          <ScrollReveal direction="left" distance={60} duration={800}>
            <div className="bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-gray-800 rounded-xl p-8 shadow-lg border-2 border-green-200 dark:border-green-700">
              <div className="flex items-center justify-center w-16 h-16 bg-green-600 dark:bg-green-500 rounded-full mb-6">
                <FileCheck className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Part 2: The Hook for Founders
              </h3>
              <p className="text-sm text-green-600 dark:text-green-400 font-semibold mb-4">
                The "Legal-Wrapper-as-a-Service" (The Hook)
              </p>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                How do we enforce the "Index Effect" (the 1-2%)?
              </p>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                <span className="font-semibold">Technically:</span> Founders
                must use our "Factory Smart Contract". This programs the 1-2%
                allocation to the DAO treasury from the start.
              </p>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                <span className="font-semibold">Legally:</span> The Foundation
                offers founders a "Legal-Wrapper-as-a-Service". To use this
                service, the founder signs a contract that mirrors the on-chain
                split (the 1-2%) in the real world.
              </p>

              <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-4 border-l-4 border-green-600 dark:border-green-400">
                <p className="text-gray-900 dark:text-white font-semibold">
                  The 1-2% isn't a "tax". It's the price for using the entire
                  technical and legal infrastructure. This is an unbeatable
                  offer.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

