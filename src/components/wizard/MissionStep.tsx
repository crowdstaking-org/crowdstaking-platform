'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'

interface MissionStepProps {
  data: {
    projectName: string
    mission: string
    vision: string
    tags: string
  }
  onUpdate: (updates: any) => void
  onNext: () => void
  onBack: () => void
}

/**
 * Mission definition step for wizard
 * Client Component - has form inputs
 */
export function MissionStep({
  data,
  onUpdate,
  onNext,
  onBack,
}: MissionStepProps) {
  const canProceed = data.projectName && data.mission && data.vision

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 sm:p-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Tell Us About Your Mission.
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          This is your "North Star". Co-founders will read this to understand
          your vision. The AI mediator will use this to fairly evaluate
          proposals. Be clear and inspiring.
        </p>

        <div className="space-y-6">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Project Name
            </label>
            <input
              type="text"
              value={data.projectName}
              onChange={(e) =>
                onUpdate({
                  projectName: e.target.value,
                })
              }
              placeholder="e.g., Project Flight-AI"
              className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>

          {/* Mission */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              The Mission (Your Elevator Pitch)
            </label>
            <input
              type="text"
              value={data.mission}
              onChange={(e) =>
                onUpdate({
                  mission: e.target.value,
                })
              }
              placeholder="e.g., We're building the smartest AI tool for the travel industry."
              className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>

          {/* Vision */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              The Vision (The "Why"?)
            </label>
            <textarea
              value={data.vision}
              onChange={(e) =>
                onUpdate({
                  vision: e.target.value,
                })
              }
              rows={6}
              placeholder="Why is this important? What problem are you solving? Describe the end goal. The better the AI understands your mission, the better it can evaluate contributions."
              className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              The better the AI understands your mission, the better it can
              evaluate contributions.
            </p>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Categories / Tags (Helps with Discovery)
            </label>
            <input
              type="text"
              value={data.tags}
              onChange={(e) =>
                onUpdate({
                  tags: e.target.value,
                })
              }
              placeholder="e.g., SaaS, AI, B2B, Travel, Rust"
              className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
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
            disabled={!canProceed}
            className="inline-flex items-center space-x-2 bg-blue-600 dark:bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed btn-hover-lift btn-primary-glow"
          >
            <span>Continue to Step 2</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

