import { Rocket } from 'lucide-react'

interface WelcomeStepProps {
  onNext: () => void
}

/**
 * Welcome step for wizard
 * Server Component
 */
export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 sm:p-12 text-center">
        <div className="flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full mx-auto mb-6">
          <Rocket className="w-10 h-10 text-blue-600 dark:text-blue-400" />
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Welcome, Founder. Let's Turn Your Idea Into a Company.
        </h1>

        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
          This 4-step wizard is the fastest path from vision to a running,
          decentralized startup. We handle the complex tech so you can focus on
          your product.
        </p>

        <button
          onClick={onNext}
          className="inline-flex items-center space-x-3 bg-blue-600 dark:bg-blue-500 text-white px-10 py-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-lg font-semibold btn-hover-lift btn-primary-glow ripple"
        >
          <span>Let's Get Started</span>
        </button>
      </div>
    </div>
  )
}

