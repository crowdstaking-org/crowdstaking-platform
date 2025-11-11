import { CheckCircle, Plus, BarChart3, Droplets, Wallet, Coins, Eye, ArrowRight, ExternalLink } from 'lucide-react'
import Link from 'next/link'

/**
 * Success step after mission launch
 * Server Component
 */
export function SuccessStep() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 sm:p-12">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            🎉 Congratulations! Your Mission is LIVE!
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
            Your project token has been deployed and your mission is now visible on the platform.
          </p>
        </div>

        {/* What Happened Section */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-6 mb-8 border-2 border-green-200 dark:border-green-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            What Just Happened?
          </h2>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <div className="flex items-start space-x-3">
              <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
              <p><strong>Token Deployed:</strong> Your project token was deployed on the Base blockchain (testnet for now)</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
              <p><strong>Tokens Distributed:</strong> 98% (980,000,000 tokens) were sent to your wallet, 2% (20,000,000 tokens) to CrowdStaking DAO</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
              <p><strong>Project Created:</strong> Your mission is now listed on the "Discover Projects" page</p>
            </div>
          </div>
        </div>

        {/* How to Access Your Wallet & Tokens */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8 border-2 border-blue-200 dark:border-blue-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Wallet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Where Is My Wallet?
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              <strong>Your wallet was automatically created when you logged in.</strong> It's embedded in your CrowdStaking account - you don't need a separate browser extension like MetaMask!
            </p>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-600">
              <p className="font-semibold mb-2">To access your wallet:</p>
              <ol className="list-decimal ml-5 space-y-2 text-sm">
                <li>Click the <strong>"Connect Wallet"</strong> button in the top-right corner</li>
                <li>Click <strong>"View Account Details"</strong> in the wallet popup</li>
                <li>Here you can see your wallet address and export your private key (keep it safe!)</li>
              </ol>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border-l-4 border-yellow-500">
              <p className="text-sm">
                <strong>⚠️ Important:</strong> Your wallet is secured by your email/Google login. Make sure to backup your private key if you want to use it in other wallets (like MetaMask)!
              </p>
            </div>
          </div>
        </div>

        {/* How to View Your Tokens */}
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 mb-8 border-2 border-purple-200 dark:border-purple-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Coins className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            Where Are My Tokens?
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              <strong>Your 980 million tokens are in your wallet right now!</strong> They're on the Base Sepolia testnet (a testing blockchain).
            </p>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-purple-200 dark:border-purple-600">
              <p className="font-semibold mb-2">To view your tokens:</p>
              <ol className="list-decimal ml-5 space-y-2 text-sm">
                <li>Go to your <Link href="/dashboard" className="text-blue-600 hover:underline">Founder Dashboard</Link></li>
                <li>You'll see your project and token details</li>
                <li>Click on the token address to view it on Basescan (blockchain explorer)</li>
              </ol>
            </div>

            <div className="bg-purple-100 dark:bg-purple-900/30 rounded-lg p-4">
              <p className="text-sm">
                <strong>💡 Pro Tip:</strong> To see your tokens in MetaMask or other wallets, you need to "import" the token using its contract address. You can find this address in your dashboard.
              </p>
            </div>
          </div>
        </div>

        {/* How to Use Your Tokens */}
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-6 mb-8 border-2 border-orange-200 dark:border-orange-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <ArrowRight className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            How Can I Use My Tokens?
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              <strong>Your tokens represent ownership of your project.</strong> Here's what you can do with them:
            </p>
            
            <div className="space-y-3">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-orange-200 dark:border-orange-600">
                <h3 className="font-semibold mb-2">1. Distribute to Co-Founders</h3>
                <p className="text-sm">When you add team members or contractors complete tasks, you can send them tokens as payment/equity.</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-orange-200 dark:border-orange-600">
                <h3 className="font-semibold mb-2">2. Create Vesting Schedules</h3>
                <p className="text-sm">Use our vesting contracts to lock tokens for team members with gradual release over time (prevents early sell-offs).</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-orange-200 dark:border-orange-600">
                <h3 className="font-semibold mb-2">3. Provide Liquidity (Advanced)</h3>
                <p className="text-sm">Create a liquidity pool on Uniswap/SushiSwap so your tokens can be traded. This makes them valuable for attracting top talent!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="text-left mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            What Now? (The Next Logical Steps):
          </h2>

          <div className="space-y-4">
            {/* CTA 1 */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border-2 border-blue-200 dark:border-blue-700">
              <Link
                href="/create-mini-mission"
                className="w-full group flex items-center justify-center space-x-3 bg-blue-600 dark:bg-blue-500 text-white px-6 py-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-semibold mb-3 btn-hover-lift btn-primary-glow"
              >
                <Plus className="w-5 h-5" />
                <span>Create First "Mini-Mission"</span>
              </Link>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-semibold">IMPORTANT:</span> Your mission
                is big. What's the first, small, achievable milestone? (e.g.,
                "Create the logo design", "Build the landing page"). This is the
                best way to find your first co-founders.
              </p>
            </div>

            {/* CTA 2 */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border-2 border-gray-200 dark:border-gray-700">
              <Link
                href="/dashboard"
                className="w-full group flex items-center justify-center space-x-3 bg-gray-900 dark:bg-gray-700 text-white px-6 py-4 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors font-semibold mb-3 btn-hover-lift btn-secondary-glow"
              >
                <BarChart3 className="w-5 h-5" />
                <span>Go to Founder Dashboard</span>
              </Link>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Manage your mission, review proposals, and see your growing
                team.
              </p>
            </div>

            {/* CTA 3 */}
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 border-2 border-purple-200 dark:border-purple-700">
              <Link
                href="/liquidity-wizard"
                className="w-full group flex items-center justify-center space-x-3 bg-purple-600 dark:bg-purple-500 text-white px-6 py-4 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors font-semibold mb-3 btn-hover-lift btn-primary-glow"
              >
                <Droplets className="w-5 h-5" />
                <span>Set Up Liquidity Pool</span>
              </Link>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-semibold">For Advanced Users:</span> Want
                to attract top talent like "Maria"? Set up a liquidity pool on a
                DEX. This makes your tokens "liquid from day 1" and is the
                strongest incentive of all.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

