'use client'

import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react'

interface SetupStepProps {
  data: {
    legalWrapper: boolean
  }
  onUpdate: (updates: any) => void
  onNext: () => void
  onBack: () => void
}

/**
 * Setup configuration step for wizard
 * Client Component - has radio inputs
 */
export function SetupStep({ data, onUpdate, onNext, onBack }: SetupStepProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 sm:p-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          We're Now Incorporating Your "Digital Company".
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          To remove complexity, all projects start with our audited "Factory"
          setup. You don't need to code or design anything yourself. This is our
          "all-inclusive" package.
        </p>

        {/* What We Do For You */}
        <div className="space-y-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            What We Do For You:
          </h3>

          {/* Token */}
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border-2 border-green-200 dark:border-green-700">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Your Project Token (Your "Equity")
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  We deploy a standard token contract for you (e.g.,
                  $PROJECT-A). This represents 100% ownership of your project.
                  We recommend a hard cap of 1 billion tokens, analogous to
                  Bitcoin.
                </p>
              </div>
            </div>
          </div>

          {/* Legal Wrapper */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border-2 border-blue-200 dark:border-blue-700">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  The "Legal-Wrapper-as-a-Service"
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  This is your bridge to the real world. We provide a legal
                  shell (e.g., a Wyoming DAO LLC, managed by our Swiss
                  Foundation) so you can invoice B2B customers and sign
                  contracts.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Your Choice */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Your Only Choice (Important for Sarah):
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Do you want to use the "Legal-Wrapper-as-a-Service"?
          </p>

          <div className="space-y-3">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                checked={data.legalWrapper === true}
                onChange={() =>
                  onUpdate({
                    legalWrapper: true,
                  })
                }
                className="mt-1 w-5 h-5 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="font-semibold text-gray-900 dark:text-white">
                  Yes, please activate.
                </span>
                <span className="text-green-600 dark:text-green-400 ml-2">
                  (Recommended. Required for invoicing and contracts)
                </span>
              </div>
            </label>

            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                checked={data.legalWrapper === false}
                onChange={() =>
                  onUpdate({
                    legalWrapper: false,
                  })
                }
                className="mt-1 w-5 h-5 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="font-semibold text-gray-900 dark:text-white">
                  No, I'm starting as a purely decentralized on-chain protocol.
                </span>
                <span className="text-gray-500 dark:text-gray-400 ml-2">
                  (Only for Web3 pros like "Alex")
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-8 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onBack}
            className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <button
            onClick={onNext}
            className="inline-flex items-center space-x-2 bg-blue-600 dark:bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-semibold btn-hover-lift btn-primary-glow"
          >
            <span>Continue to Step 3</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

