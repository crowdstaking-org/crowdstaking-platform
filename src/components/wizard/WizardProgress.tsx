interface WizardProgressProps {
  currentStep: number
  totalSteps: number
}

/**
 * Progress bar for wizard steps
 * Server Component
 */
export function WizardProgress({
  currentStep,
  totalSteps,
}: WizardProgressProps) {
  const stepLabels = ['The Mission', 'The Setup', 'The Deal', 'Launch']

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
            Step {currentStep}/{totalSteps}: {stepLabels[currentStep - 1]}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {Math.round((currentStep / totalSteps) * 100)}% Complete
          </span>
        </div>

        <div className="relative">
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-500 ease-out"
              style={{
                width: `${(currentStep / totalSteps) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

