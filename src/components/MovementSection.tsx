import { Mic, Play } from 'lucide-react'

/**
 * Movement Section - emphasizes the community-driven nature
 * Features testimonials from philosophers and creators
 */
export function MovementSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            This Isn&apos;t a Company. This Is a Movement.
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto">
            We follow the &quot;Satoshi Principle&quot;: The idea and the code are the
            star. The protocol is the marketing. The token is the acquisition
            budget.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* The Philosopher */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <Mic className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                The Philosopher (The &quot;Why&quot;)
              </span>
            </div>
            <blockquote className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4 italic">
              &quot;CrowdStaking is OS 3.0. It decouples creative initiative from
              capital. This is the revolution of the venture model.&quot;
            </blockquote>
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
              – The &quot;Web3 Philosopher&quot; (e.g., Bankless)
            </p>
          </div>

          {/* The Creator */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Play className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                The Creator (The &quot;Proof&quot;)
              </span>
            </div>
            <blockquote className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4 italic">
              &quot;Day 1: Mission posted. Day 8: First feature live and my first
              project tokens sold. Wow. This actually works.&quot;
            </blockquote>
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
              – The &quot;Build-in-Public Creator&quot; (e.g., Tech YouTuber)
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

