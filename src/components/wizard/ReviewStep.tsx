'use client'

import { ArrowLeft, Rocket, AlertTriangle } from 'lucide-react'
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
                THREE transactions in your wallet (e.g., MetaMask):
              </p>
              <ol className="list-decimal ml-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>
                  Token deployment (creates your ERC20 token)
                </li>
                <li>2% transfer to DAO (protocol contribution)</li>
                <li>Legal signature (Wyoming DAO LLC incorporation)</li>
              </ol>
              <p className="text-gray-700 dark:text-gray-300 mt-3">
                Make sure you have ~0.002 ETH for gas fees on Base Sepolia.
                Get testnet ETH from:{' '}
                <a 
                  href="https://www.alchemy.com/faucets/base-sepolia" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-600"
                >
                  Alchemy Faucet ↗
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Launch Button or Connect Wallet */}
        {!account ? (
          // Show connect wallet button if not connected
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border-2 border-blue-200 dark:border-blue-700">
              <p className="text-center text-gray-700 dark:text-gray-300 mb-4">
                <strong>Connect your wallet to launch your mission</strong>
              </p>
              <div className="flex justify-center">
                <ConnectButton
                  client={client}
                  wallets={wallets}
                  theme="dark"
                  connectButton={{
                    label: "Connect Wallet to Launch",
                    className: "!px-10 !py-5 !text-xl !font-bold !bg-gradient-to-r !from-blue-600 !to-purple-600 !text-white !shadow-lg",
                  }}
                  connectModal={{
                    title: "Connect Wallet to Launch Mission",
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
                : '🚀 LAUNCH MISSION NOW & CONFIRM TRANSACTIONS'
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

