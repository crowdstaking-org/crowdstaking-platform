import React from 'react'
import { ArrowLeft, ArrowRight, TrendingUp } from 'lucide-react'

interface LiquidityStep2Props {
  data: {
    platform: string
    tokenAmount: string
    stableAmount: string
    stableCoin: string
  }
  onUpdate: (updates: any) => void
  onNext: () => void
  onBack: () => void
}

/**
 * Step 2: Configure pool amounts and platform
 * Client Component
 */
export function LiquidityStep2({
  data,
  onUpdate,
  onNext,
  onBack,
}: LiquidityStep2Props) {
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
          Configure Your Initial Pool
        </h2>

        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Choose the exchange and amounts. The ratio determines the price.
        </p>

        <div className="space-y-6">
          {/* Platform */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Platform
            </label>
            <select
              value={data.platform}
              onChange={(e) =>
                onUpdate({
                  platform: e.target.value,
                })
              }
              className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Uniswap V3 (Recommended)</option>
              <option>Uniswap V2</option>
              <option>SushiSwap</option>
            </select>
          </div>

          {/* Asset 1: Project Tokens */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Asset 1 (Your Project Tokens)
            </label>
            <div className="relative">
              <input
                type="number"
                value={data.tokenAmount}
                onChange={(e) =>
                  onUpdate({
                    tokenAmount: e.target.value,
                  })
                }
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                $PROJECT-A
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              (You hold: 980,000,000)
            </p>
          </div>

          {/* Asset 2: Stable Coin */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Asset 2 (Your Capital)
            </label>
            <div className="flex gap-3">
              <input
                type="number"
                value={data.stableAmount}
                onChange={(e) =>
                  onUpdate({
                    stableAmount: e.target.value,
                  })
                }
                className="flex-1 px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={data.stableCoin}
                onChange={(e) =>
                  onUpdate({
                    stableCoin: e.target.value,
                  })
                }
                className="px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>USDC</option>
                <option>USDT</option>
                <option>DAI</option>
                <option>ETH</option>
              </select>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              (Wallet balance: 12,500 {data.stableCoin})
            </p>
          </div>

          {/* Price Calculation */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border-2 border-blue-200 dark:border-blue-700">
            <div className="flex items-start space-x-3">
              <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  📈 Your Initial Starting Price
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  If you pair {parseFloat(data.tokenAmount).toLocaleString()}{' '}
                  $PROJECT-A with{' '}
                  {parseFloat(data.stableAmount).toLocaleString()}{' '}
                  {data.stableCoin}, your token's starting price will be set at{' '}
                  <span className="font-bold">
                    ${calculatePrice()} per token
                  </span>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
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
            <span>Review & Confirm Setup</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}


