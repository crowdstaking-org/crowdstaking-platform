import React from 'react'
import { Shield, Scale, Lock } from 'lucide-react'
import { ScrollReveal } from '../ScrollReveal'

/**
 * Legal Structure section explaining the Swiss Foundation
 * Server Component
 */
export function LegalStructureSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal direction="up" duration={700}>
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Decentralized in Spirit. Robust in Reality.
          </h2>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={100} duration={700}>
          <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-6 text-lg">
              <p>
                A global movement needs a legally unassailable structure. Pure
                code isn't enough to operate in the real world (banks,
                contracts).
              </p>

              <p>
                That's why the CrowdStaking protocol is protected by an "Honest
                Foundation" (under Swiss/Liechtenstein law).
              </p>

              <p className="font-semibold text-xl text-gray-900 dark:text-white">
                This is the "grown-up" way:
              </p>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-6 items-stretch">
          <ScrollReveal direction="right" distance={60} duration={800}>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border-2 border-indigo-200 dark:border-indigo-700 h-full">
              <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-4">
                <Scale className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Professional & Independent
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                The Foundation Council is staffed by lawyers and financial
                experts.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="left" distance={60} duration={800}>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border-2 border-indigo-200 dark:border-indigo-700 h-full">
              <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-4">
                <Lock className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Not a Slave, But a Firewall
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                The Council doesn't blindly obey the DAO. It's a legal firewall
                that reviews DAO decisions for legality and protects the
                protocol from illegal actions.
              </p>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal direction="up" delay={200} duration={700}>
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-6 border-l-4 border-indigo-600 dark:border-indigo-400 mt-8">
            <p className="text-gray-900 dark:text-white text-lg">
              This structure gives us operability in the real world and protects
              the community's assets (the "DAO treasury").
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}


