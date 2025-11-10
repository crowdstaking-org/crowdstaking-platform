'use client'

/**
 * Complete Proposal Submission Page
 * Phase 3: Full-featured proposal form with validation, preview, and UX enhancements
 * 
 * Features:
 * - React Hook Form with Zod validation
 * - Markdown editor for rich content
 * - Real-time validation
 * - Preview modal
 * - Success/error handling
 * - Protected authentication
 */

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { proposalSchema, ProposalFormData } from '@/types/proposal'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { MarkdownEditor } from '@/components/forms/MarkdownEditor'
import { useAuth } from '@/hooks/useAuth'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { LoadingButton } from '@/components/ui/LoadingButton'
import { showSuccess, showError, showLoading, dismissToast } from '@/lib/toast'

export default function ProposePage() {
  const router = useRouter()
  const { wallet } = useAuth()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ProposalFormData>({
    resolver: zodResolver(proposalSchema),
    mode: 'onBlur',
    defaultValues: {
      title: '',
      description: '',
      deliverable: '',
      requested_cstake_amount: 0,
    },
  })

  const formValues = watch()

  const onSubmit = async (data: ProposalFormData) => {
    const loadingToast = showLoading('Proposal wird eingereicht...')
    
    try {
      setSubmitError(null)

      const response = await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Submission failed')
      }

      dismissToast(loadingToast)
      showSuccess('Proposal erfolgreich eingereicht!')
      setSubmitSuccess(true)
      // Redirect after 2 seconds
      setTimeout(() => router.push('/cofounder-dashboard'), 2000)
    } catch (error) {
      dismissToast(loadingToast)
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit proposal'
      setSubmitError(errorMessage)
      showError('Fehler beim Einreichen', error)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Submit Your Proposal
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Connected as: <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono">{wallet?.slice(0, 6)}...{wallet?.slice(-4)}</code>
            </p>
          </div>

          {/* Tips Section */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
            <h3 className="font-bold text-lg text-blue-900 dark:text-blue-200 mb-3">
              💡 Tips for a Great Proposal
            </h3>
            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
              <li>✅ Be specific about what you'll deliver and when</li>
              <li>✅ Include examples, portfolio links, or previous work</li>
              <li>✅ Explain why you're qualified for this task</li>
              <li>✅ Set a fair token amount based on complexity and time</li>
              <li>❌ Don't be vague or make unrealistic promises</li>
            </ul>
          </div>

          {/* Error Display */}
          {submitError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <p className="text-red-800 dark:text-red-200">{submitError}</p>
            </div>
          )}

          {/* Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Title Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Proposal Title *
                </label>
                <input
                  {...register('title')}
                  type="text"
                  placeholder="e.g., Logo & Brand Identity Design"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors ${
                    errors.title 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.title && (
                  <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  Keep it concise and descriptive (5-200 characters)
                </p>
              </div>

              {/* Description Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Description * <span className="text-gray-500 font-normal">(What will you do?)</span>
                </label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <MarkdownEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Describe your proposal in detail... What problem does it solve? How will you approach it?"
                      maxLength={5000}
                      minRows={8}
                      error={errors.description?.message}
                    />
                  )}
                />
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
                    📝 Markdown Formatting Guide
                  </summary>
                  <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 space-y-1 bg-gray-50 dark:bg-gray-700 p-3 rounded">
                    <p><code>**bold**</code> → <strong>bold</strong></p>
                    <p><code>*italic*</code> → <em>italic</em></p>
                    <p><code>[link text](url)</code> → link</p>
                    <p><code>- item</code> → • list item</p>
                    <p><code>## Heading</code> → section heading</p>
                  </div>
                </details>
              </div>

              {/* Deliverable Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Deliverable * <span className="text-gray-500 font-normal">(What's the concrete result?)</span>
                </label>
                <Controller
                  name="deliverable"
                  control={control}
                  render={({ field }) => (
                    <MarkdownEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="What exactly will you deliver? Include format, specifications, and delivery method..."
                      maxLength={2000}
                      minRows={6}
                      error={errors.deliverable?.message}
                    />
                  )}
                />
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  Be specific: file formats, links, quantities, timelines
                </p>
              </div>

              {/* Amount Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Requested $CSTAKE Amount *
                </label>
                <input
                  {...register('requested_cstake_amount', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  placeholder="e.g., 1500"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors ${
                    errors.requested_cstake_amount 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.requested_cstake_amount && (
                  <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                    {errors.requested_cstake_amount.message}
                  </p>
                )}
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  Base this on effort, complexity, and market rates
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 space-y-3">
                <LoadingButton
                  type="button"
                  onClick={() => setShowPreview(true)}
                  disabled={!isValid}
                  variant="secondary"
                  className="w-full"
                >
                  👁️ Preview Proposal
                </LoadingButton>
                
                <LoadingButton
                  type="submit"
                  disabled={!isValid}
                  isLoading={isSubmitting}
                  loadingText="Wird eingereicht..."
                  variant="primary"
                  className="w-full py-4"
                >
                  🚀 Submit Proposal
                </LoadingButton>
              </div>
            </form>

            {/* What Happens Next */}
            <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-200 mb-2">
                ℹ️ What happens next?
              </h3>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>• Your proposal will be reviewed by project founders</li>
                <li>• They can approve, negotiate, or reject your proposal</li>
                <li>• You'll receive notifications about status updates</li>
                <li>• Once approved, you can start working and earn $CSTAKE</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-auto p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Preview</h2>
                <button 
                  onClick={() => setShowPreview(false)} 
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {formValues.title || 'Untitled Proposal'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Requesting {formValues.requested_cstake_amount || 0} $CSTAKE
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h4>
                  <div className="prose dark:prose-invert max-w-none">
                    {formValues.description ? (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {formValues.description}
                      </ReactMarkdown>
                    ) : (
                      <p className="text-gray-400 italic">No description provided</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Deliverable</h4>
                  <div className="prose dark:prose-invert max-w-none">
                    {formValues.deliverable ? (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {formValues.deliverable}
                      </ReactMarkdown>
                    ) : (
                      <p className="text-gray-400 italic">No deliverable specified</p>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowPreview(false)}
                className="mt-6 w-full bg-gray-900 dark:bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {submitSuccess && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full">
              <div className="text-center">
                <div className="text-6xl mb-4">✅</div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Proposal Submitted!
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Your proposal is now pending review. We'll notify you when there's an update.
                </p>
                <button
                  onClick={() => router.push('/cofounder-dashboard')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}

