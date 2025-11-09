'use client'

import { useState } from 'react'
import { Layout } from '@/components/Layout'
import { Lightbulb, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

/**
 * Create Mini-Mission page - Define first achievable milestone
 * Client Component - has form state management
 */
export default function CreateMiniMissionPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skills: '',
  })
  const [showSuccess, setShowSuccess] = useState(false)

  const canSubmit = formData.title && formData.description

  const handleSubmit = () => {
    setShowSuccess(true)
  }

  if (showSuccess) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 sm:p-12 text-center">
              <div className="flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                ✅ Your Mini-Mission is Live!
              </h2>

              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                It's now visible on your project page. Once a co-founder submits a
                proposal, we'll notify you and you can review it in your
                dashboard.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setShowSuccess(false)}
                  className="inline-flex items-center space-x-2 bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-semibold"
                >
                  <span>+ Create Another Mini-Mission</span>
                </button>

                <Link
                  href="/dashboard"
                  className="inline-flex items-center space-x-2 bg-gray-900 dark:bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors font-semibold"
                >
                  <span>📊 Go to Founder Dashboard</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 sm:p-12">
            <Link
              href="/dashboard"
              className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </Link>

            <div className="flex items-center space-x-3 mb-6">
              <Lightbulb className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                Define Your First Mini-Mission
              </h1>
            </div>

            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Your big vision is the North Star. A "Mini-Mission" is the first,
              small, achievable milestone on the way there. What's the first
              building block you need?
            </p>

            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Mini-Mission Title
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Keep it short and result-oriented.
                </p>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      title: e.target.value,
                    })
                  }
                  placeholder="e.g., Logo & Brand Identity Design or Landing Page Development"
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Description (The "Definition of Done")
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Be as clear as possible. What's the exact goal? What
                  "deliverables" do you expect? The AI mediator will use this to
                  evaluate proposals.
                </p>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  rows={6}
                  placeholder="e.g., We need a complete logo package (SVG, PNGs), a color palette, and font selection. It should feel modern, trustworthy, and minimalist..."
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Required Skills (Tags)
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Help co-founders find your mission.
                </p>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      skills: e.target.value,
                    })
                  }
                  placeholder="Figma, Brand Design, UX/UI, Marketing"
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border-l-4 border-blue-600 dark:border-blue-400">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  💡 How Payment Works
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  You don't set a price. You define the problem. Co-founders
                  (contributors) will submit proactive proposals that include a
                  solution and a token request (e.g., "I'll do this for 0.1% of
                  the project tokens").
                </p>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="w-full inline-flex items-center justify-center space-x-2 bg-blue-600 dark:bg-blue-500 text-white px-8 py-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed btn-hover-lift btn-primary-glow"
              >
                <span>🚀 Publish Mini-Mission</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}


