import React from 'react'
import { ArrowRight, AlertTriangle } from 'lucide-react'

interface LiquidityStep1Props {
  data: {
    agreedToRequirement: boolean
  }
  onUpdate: (updates: any) => void
  onNext: () => void
}

/**
 * Step 1: Explain liquidity requirements and get user agreement
 * Client Component
 */
export function LiquidityStep1({
  data,
  onUpdate,
  onNext,
}: LiquidityStep1Props) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 sm:p-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Make Your Project Tokens "Liquid from Day 1"
        </h2>

        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          This is the strongest incentive to attract top talent ("Maria") to
          your project. When your tokens have a real market value, co-founders
          can immediately sell their earned shares to pay their rent.
        </p>

        {/* Warning Box */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 border-2 border-yellow-600 dark:border-yellow-400 mb-8">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                ⚠️ REQUIREMENT: OWN CAPITAL NEEDED
              </h3>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <p>
                  To create a "liquidity pool", you must provide TWO assets:
                </p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>
                    A portion of your project tokens (e.g., 5% of your
                    $PROJECT-A)
                  </li>
                  <li>
                    A "stable" value token (e.g., USDC or ETH) from your own
                    holdings
                  </li>
                </ul>
                <p className="font-semibold">
                  The price mechanism: The ratio of these two assets sets the
                  starting price for your token. This step is for advanced users
                  and cannot be undone.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Checkbox Agreement */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 mb-8">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={data.agreedToRequirement}
              onChange={(e) =>
                onUpdate({
                  agreedToRequirement: e.target.checked,
                })
              }
              className="mt-1 w-5 h-5 text-blue-600 focus:ring-blue-500 rounded"
            />
            <span className="text-gray-900 dark:text-white">
              I understand that I must provide my own capital (e.g., USDC) to
              create liquidity.
            </span>
          </label>
        </div>

        {/* Navigation */}
        <div className="flex justify-end">
          <button
            onClick={onNext}
            disabled={!data.agreedToRequirement}
            className="inline-flex items-center space-x-2 bg-blue-600 dark:bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed btn-hover-lift btn-primary-glow"
          >
            <span>Continue to Step 2</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}


