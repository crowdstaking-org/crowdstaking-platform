'use client'

import { ArrowLeft, Rocket, AlertTriangle } from 'lucide-react'

interface ReviewStepProps {
  data: {
    projectName: string
    mission: string
    vision: string
    tags: string
    legalWrapper: boolean
  }
  onNext: () => void
  onBack: () => void
}

/**
 * Review step before launching mission
 * Client Component
 */
export function ReviewStep({ data, onNext, onBack }: ReviewStepProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 sm:p-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Ready to Launch, Founder?
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Review everything one last time. Once you click "Launch Mission", your
          token contract will be deployed on the blockchain. This step is
          irreversible.
        </p>

        {/* Summary */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 mb-8 space-y-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Summary:
          </h3>

          <div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Project:
            </span>
            <p className="text-gray-900 dark:text-white">{data.projectName}</p>
          </div>

          <div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Mission:
            </span>
            <p className="text-gray-900 dark:text-white">{data.mission}</p>
          </div>

          <div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Vision:
            </span>
            <p className="text-gray-900 dark:text-white">{data.vision}</p>
          </div>

          <div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Tags:
            </span>
            <p className="text-gray-900 dark:text-white">
              {data.tags || 'None'}
            </p>
          </div>

          <div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Token Setup:
            </span>
            <p className="text-gray-900 dark:text-white">
              Factory Contract (1 Billion Tokens)
            </p>
          </div>

          <div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Legal Setup:
            </span>
            <p className="text-gray-900 dark:text-white">
              {data.legalWrapper
                ? 'Legal Wrapper (Wyoming DAO LLC) - Activated'
                : 'On-Chain Only'}
            </p>
          </div>

          <div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Protocol Contribution:
            </span>
            <p className="text-gray-900 dark:text-white">
              2% (20,000,000 tokens) to CrowdStaking DAO
            </p>
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
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                To incorporate your "Digital Company", you'll need to confirm
                two transactions in your wallet (e.g., MetaMask):
              </p>
              <ol className="list-decimal ml-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>
                  The deployment transaction (to create the smart contract)
                </li>
                <li>The legal signature (to initialize the legal wrapper)</li>
              </ol>
              <p className="text-gray-700 dark:text-gray-300 mt-3">
                Make sure you have a small amount of ETH for "gas fees" (network
                fees) in your wallet.
              </p>
            </div>
          </div>
        </div>

        {/* Launch Button */}
        <button
          onClick={onNext}
          className="w-full group flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white px-10 py-5 rounded-lg hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-600 dark:hover:to-purple-600 transition-all text-xl font-bold shadow-lg btn-hover-lift btn-primary-glow ripple"
        >
          <Rocket className="w-6 h-6" />
          <span>🚀 LAUNCH MISSION NOW & CONFIRM TRANSACTIONS</span>
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

