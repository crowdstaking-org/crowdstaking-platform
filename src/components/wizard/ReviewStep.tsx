'use client'

import { ArrowLeft, Rocket, CheckCircle } from 'lucide-react'
import { useLaunchMission } from '@/hooks/useLaunchMission'
import { ConnectButton } from 'thirdweb/react'
import { client, wallets } from '@/lib/thirdweb'
import { useActiveAccount } from 'thirdweb/react'

interface ReviewStepProps {
  data: {
    projectName: string
    mission: string
    vision: string
    tags: string
    tokenName: string
    tokenSymbol: string
  }
  onNext: () => void
  onBack: () => void
}

/**
 * Review step before launching mission
 * Client Component
 */
export function ReviewStep({ data, onNext, onBack }: ReviewStepProps) {
  const { launchMission, isLaunching, currentPhase } = useLaunchMission()
  const account = useActiveAccount()
  
  const handleLaunch = async () => {
    const result = await launchMission(data)
    if (result.success) {
      // Navigate to success page
      onNext()
    }
    // Errors are handled by the hook with toast notifications
  }
  return (
    <>
      {/* Loading Overlay */}
      {isLaunching && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md mx-4 shadow-2xl">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
              <p className="text-center text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {currentPhase || 'Launching mission...'}
              </p>
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                This may take 30-60 seconds. Please don't close this window.
              </p>
            </div>
          </div>
        </div>
      )}
      
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
              Token Name:
            </span>
            <p className="text-gray-900 dark:text-white">{data.tokenName}</p>
          </div>

          <div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Token Symbol:
            </span>
            <p className="text-gray-900 dark:text-white">{data.tokenSymbol}</p>
          </div>

          <div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Token Distribution:
            </span>
            <p className="text-gray-900 dark:text-white">
              1 Billion {data.tokenSymbol} Tokens (98% to you, 2% to CrowdStaking DAO)
            </p>
          </div>
        </div>

        {/* Info Notice */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-6 border-2 border-green-200 dark:border-green-700 mb-8">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                100% Automatic Deployment
              </h4>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                When you click "Launch Mission", everything happens automatically via our infrastructure:
              </p>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-center space-x-2">
                  <span className="text-green-600 dark:text-green-400">✓</span>
                  <span>Token contract deployment on Base blockchain</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-600 dark:text-green-400">✓</span>
                  <span>98% of tokens sent to your wallet</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-600 dark:text-green-400">✓</span>
                  <span>2% platform contribution to CrowdStaking DAO</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                  <span className="font-semibold">You don't need any ETH - we pay all gas fees!</span>
                </li>
              </ul>
              <div className="mt-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  ⏱️ The entire process takes about 30-60 seconds. Please don't close this window during deployment.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Launch Button or Connect Wallet */}
        {!account ? (
          // Show connect wallet button if not connected
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border-2 border-blue-200 dark:border-blue-700">
              <p className="text-center text-gray-700 dark:text-gray-300 mb-4">
                <strong>Create your account to launch your mission</strong>
              </p>
              <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-6">
                You can login with email, Google, or connect your existing wallet
              </p>
              <div className="flex justify-center">
                <ConnectButton
                  client={client}
                  wallets={wallets}
                  theme="dark"
                  connectButton={{
                    label: "Login or Create Account",
                    className: "!px-10 !py-5 !text-xl !font-bold !bg-gradient-to-r !from-blue-600 !to-purple-600 !text-white !shadow-lg",
                  }}
                  connectModal={{
                    title: "Login or Create Your Account",
                    size: "wide",
                    showThirdwebBranding: false,
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          // Show launch button if wallet is connected
        <button
            onClick={handleLaunch}
            disabled={isLaunching}
            className="w-full group flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white px-10 py-5 rounded-lg hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-600 dark:hover:to-purple-600 transition-all text-xl font-bold shadow-lg btn-hover-lift btn-primary-glow ripple disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <Rocket className={`w-6 h-6 ${isLaunching ? 'animate-spin' : ''}`} />
            <span>
              {isLaunching 
                ? currentPhase || 'Launching...' 
                : '🚀 Launch Mission Now'
              }
            </span>
        </button>
        )}

        {/* Back Button */}
        <button
          onClick={onBack}
          disabled={isLaunching}
          className="w-full mt-4 inline-flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Edit</span>
        </button>
      </div>
    </div>
    </>
  )
}

