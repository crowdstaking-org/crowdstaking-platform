'use client'

/**
 * Submit Proposal Page
 * Protected page where authenticated users can submit proposals
 * 
 * PHASE 2: Wrapped in ProtectedRoute for secure authentication
 */

import { useState } from 'react'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'

export default function SubmitProposalPage() {
  const { wallet } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deliverable: '',
    requested_cstake_amount: 1000,
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/proposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include', // Include session cookie
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'Proposal successfully submitted!' })
        // Reset form
        setFormData({
          title: '',
          description: '',
          deliverable: '',
          requested_cstake_amount: 1000,
        })
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to submit proposal' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error - please try again' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Submit Your Proposal
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Connected as: <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">{wallet?.slice(0, 6)}...{wallet?.slice(-4)}</code>
              </p>
            </div>

            {message && (
              <div className={`mb-6 p-4 rounded-lg ${
                message.type === 'success'
                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                  : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Proposal Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  minLength={5}
                  maxLength={200}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., AI-Powered DeFi Platform"
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Min 5, max 200 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  minLength={50}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                  placeholder="Describe your project vision, goals, and why you need funding..."
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Min 50 characters - be detailed
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Deliverable
                </label>
                <textarea
                  value={formData.deliverable}
                  onChange={(e) => setFormData({ ...formData, deliverable: e.target.value })}
                  required
                  minLength={20}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                  placeholder="What will you deliver? Be specific about timelines and outcomes..."
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Min 20 characters - describe what you will deliver
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Requested cSTAKE Amount
                </label>
                <input
                  type="number"
                  value={formData.requested_cstake_amount}
                  onChange={(e) => setFormData({ ...formData, requested_cstake_amount: Number(e.target.value) })}
                  required
                  min={100}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Minimum: 100 cSTAKE
                </p>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Submit Proposal'}
                </button>
              </div>
            </form>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
                ℹ️ What happens next?
              </h3>
              <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                <li>• Your proposal will be reviewed by the community</li>
                <li>• Admin can approve or reject your proposal</li>
                <li>• Approved proposals get published for co-founder matching</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

