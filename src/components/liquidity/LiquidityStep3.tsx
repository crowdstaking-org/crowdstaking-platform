import React from 'react'
import { ArrowLeft, Droplets, AlertTriangle } from 'lucide-react'

interface LiquidityStep3Props {
  data: {
    platform: string
    tokenAmount: string
    stableAmount: string
    stableCoin: string
  }
  onNext: () => void
  onBack: () => void
}

/**
 * Step 3: Review and confirm pool creation
 * Client Component
 */
export function LiquidityStep3({ data, onNext, onBack }: LiquidityStep3Props) {
  const calculatePrice = () => {
    const tokens = parseFloat(data.tokenAmount) || 0
    const stable = parseFloat(data.stableAmount) || 0
    if (tokens === 0) return '0'
    return (stable / tokens).toFixed(6)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 sm:p-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Ready to Make Your Token LIQUID?
        </h2>

        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Confirm the details. You'll need to approve two transactions in your
          wallet to create the pool.
        </p>

        {/* Summary */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 mb-8 space-y-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Summary:
          </h3>

          <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Exchange:</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {data.platform}
            </span>
          </div>

          <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">
              You deposit:
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {parseFloat(data.tokenAmount).toLocaleString()} $PROJECT-A
            </span>
          </div>

          <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">
              You deposit:
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {parseFloat(data.stableAmount).toLocaleString()} {data.stableCoin}
            </span>
          </div>

          <div className="flex justify-between py-3">
            <span className="text-gray-600 dark:text-gray-400">
              Resulting starting price:
            </span>
            <span className="font-semibold text-blue-600 dark:text-blue-400 text-lg">
              ${calculatePrice()} per token
            </span>
          </div>
        </div>

        {/* Wallet Notice */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 border-l-4 border-yellow-600 dark:border-yellow-400 mb-8">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                Important: The "Wallet Moment"
              </h4>
              <p className="text-gray-700 dark:text-gray-300">
                You'll need to confirm two transactions in your wallet to create
                the pool. Make sure you have enough ETH for gas fees.
              </p>
            </div>
          </div>
        </div>

        {/* Launch Button */}
        <button
          onClick={onNext}
          className="w-full group flex items-center justify-center space-x-3 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 text-white px-10 py-5 rounded-lg hover:from-purple-700 hover:to-blue-700 dark:hover:from-purple-600 dark:hover:to-blue-600 transition-all text-xl font-bold shadow-lg btn-hover-lift btn-primary-glow ripple"
        >
          <Droplets className="w-6 h-6" />
          <span>💧 Create Pool & Confirm Transactions</span>
        </button>

        {/* Back Button */}
        <button
          onClick={onBack}
          className="w-full mt-4 inline-flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors py-3"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Edit</span>
        </button>
      </div>
    </div>
  )
}


