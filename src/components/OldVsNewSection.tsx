import { X, Check } from 'lucide-react'

/**
 * Old vs New Section - contrast between traditional and CrowdStaking model
 * Side-by-side comparison highlighting the problems and solutions
 */
export function OldVsNewSection() {
  return (
    <section className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            The Why
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            The old model is broken. Here&apos;s the new way.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Old Model */}
          <div className="bg-gradient-to-br from-red-50 to-white dark:from-red-900/10 dark:to-gray-800 rounded-xl p-8 border-2 border-red-200 dark:border-red-900/30">
            <div className="flex items-center space-x-3 mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full">
                <X className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                The Old Model (VC & Freelancer)
              </h3>
            </div>

            <div className="space-y-6">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white mb-2">
                  For Founders:
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Chase VCs for months or years. Give away 30% equity for €250k.
                  Hire expensive employees you can&apos;t afford.
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-900 dark:text-white mb-2">
                  For Contributors:
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  The &quot;10-year prison&quot;. &quot;Sweat equity&quot; is an illiquid promise
                  trapped in a filing cabinet. Hope for an &quot;exit&quot; that may never
                  come.
                </p>
              </div>
            </div>
          </div>

          {/* New Model */}
          <div className="bg-gradient-to-br from-green-50 to-white dark:from-green-900/10 dark:to-gray-800 rounded-xl p-8 border-2 border-green-200 dark:border-green-900/30">
            <div className="flex items-center space-x-3 mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full">
                <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                The New Model (CrowdStaking)
              </h3>
            </div>

            <div className="space-y-6">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white mb-2">
                  For Founders:
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Find global top talent in days. Create equity &quot;from nothing&quot;
                  to pay them. Use your own cash for marketing and growth.
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-900 dark:text-white mb-2">
                  For Contributors:
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  The &quot;real-time market&quot;. Don&apos;t wait for the &quot;exit&quot;. Sell 50% of
                  your tokens immediately to pay rent, and keep 50% as a
                  &quot;lottery ticket&quot;.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

