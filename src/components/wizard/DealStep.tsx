'use client'

import { ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react'

interface DealStepProps {
  data: {
    agreedToFee: boolean
  }
  onUpdate: (updates: any) => void
  onNext: () => void
  onBack: () => void
}

/**
 * Deal agreement step for wizard
 * Client Component - has checkbox state
 */
export function DealStep({ data, onUpdate, onNext, onBack }: DealStepProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 sm:p-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Our "Take-It-or-Leave-It" Offer.
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          We don't charge money. Instead, this is our unbeatable offer for using
          the entire technical AND legal infrastructure.
        </p>

        {/* The Deal */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-8 border-2 border-blue-200 dark:border-blue-700 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            The Deal (Plain Text, No Fine Print):
          </h3>

          <div className="space-y-4 text-gray-800 dark:text-gray-200">
            <p>
              In exchange for using the AI mediator, smart contracts, and legal
              wrapper,{' '}
              <span className="font-bold">2% of your project tokens</span>{' '}
              (e.g., 20,000,000 $PROJECT-A) will be automatically transferred to
              the CrowdStaking DAO treasury.
            </p>

            <p>
              This is the "technical hook" programmed into our "Factory Smart
              Contract".
            </p>

            <p className="font-semibold">
              This "Index Effect" makes the entire platform more valuable for
              everyone and ensures we're all pulling in the same direction: Your
              success.
            </p>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 border-l-4 border-yellow-600 dark:border-yellow-400 mb-8">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                Why This Matters:
              </h4>
              <p className="text-gray-700 dark:text-gray-300">
                This 2% isn't a "tax" – it's the price for accessing world-class
                infrastructure that would cost millions to build yourself. You
                get: AI-powered fair valuation, audited smart contracts, legal
                compliance, and a global talent network.
              </p>
            </div>
          </div>
        </div>

        {/* Agreement Checkbox */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 mb-8">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={data.agreedToFee}
              onChange={(e) =>
                onUpdate({
                  agreedToFee: e.target.checked,
                })
              }
              className="mt-1 w-5 h-5 text-blue-600 focus:ring-blue-500 rounded"
            />
            <span className="text-gray-900 dark:text-white">
              I understand and agree that 2% of my project tokens will be
              transferred to the DAO treasury as the price for using the
              CrowdStaking infrastructure.
            </span>
          </label>
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
            disabled={!data.agreedToFee}
            className="inline-flex items-center space-x-2 bg-blue-600 dark:bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed btn-hover-lift btn-primary-glow"
          >
            <span>Continue to Final Step</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

