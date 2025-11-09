import { CheckCircle, Plus, BarChart3, Droplets } from 'lucide-react'
import Link from 'next/link'

/**
 * Success step after mission launch
 * Server Component
 */
export function SuccessStep() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 sm:p-12 text-center">
        <div className="flex items-center justify-center w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          ✅ Congratulations! Your Mission is LIVE.
        </h1>

        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">
          Your digital company is incorporated and your mission is now visible
          on "Discover Projects".
        </p>

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

