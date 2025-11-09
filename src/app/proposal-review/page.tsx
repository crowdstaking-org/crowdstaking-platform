'use client'

import { useState } from 'react'
import { Layout } from '@/components/Layout'
import { ArrowLeft, CheckCircle, X, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

/**
 * Proposal Review page - Double Handshake interface
 * Client Component - has confirmation state management
 */
export default function ProposalReviewPage() {
  const router = useRouter()
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showCounterOfferModal, setShowCounterOfferModal] = useState(false)
  const [counterOfferPercent, setCounterOfferPercent] = useState('0.12')
  const [counterOfferReason, setCounterOfferReason] = useState('')

  const handleAccept = () => {
    setShowConfirmation(true)
    setTimeout(() => {
      router.push('/dashboard')
    }, 2000)
  }

  const handleReject = () => {
    router.push('/dashboard')
  }

  const handleSendCounterOffer = () => {
    setShowCounterOfferModal(false)
    // TODO: Send counter-offer to backend
    router.push('/dashboard')
  }

  if (showConfirmation) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12">
              <div className="flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                ✅ Double Handshake Complete!
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                The contract is created. Ben can now start working. Tokens will be
                held in escrow until you approve the completed work.
              </p>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/dashboard"
            className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </Link>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 sm:p-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 text-center">
              The "Double Handshake"
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-12 text-center">
              A proposal is only accepted when both sides agree.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Co-Founder's Proposal */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Ben's Proposal for "Logo & Brand Design"
                </h3>
                <div className="prose dark:prose-invert">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    "Hello, I'm Ben. I'll deliver a complete brand package (logo,
                    3 variants, color palette, fonts) in Figma. Here's my
                    portfolio: [link]. I propose doing this work for{' '}
                    <span className="font-bold">0.15% of the project tokens</span>{' '}
                    (1,500,000 $PROJECT-A)."
                  </p>
                </div>
              </div>

              {/* AI Mediation */}
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border-2 border-green-200 dark:border-green-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  🤖 AI Mediator Recommendation
                </h3>
                <div className="prose dark:prose-invert">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    "Based on your mission and the complexity of this task, we
                    estimate a fair share at{' '}
                    <span className="font-bold">0.1% - 0.2%</span>. Ben's proposal
                    of 0.15% is within this range."
                  </p>
                  <div className="inline-flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      Fair Proposal
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Decision Section */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-8 mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                Do you agree to this proposal?
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6 text-center">
                The contract will be created once both sides agree. Tokens will be
                held in escrow until you approve the completed work.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleAccept}
                  className="inline-flex items-center justify-center space-x-2 bg-green-600 dark:bg-green-500 text-white px-8 py-4 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors text-lg font-semibold btn-hover-lift"
                >
                  <CheckCircle className="w-6 h-6" />
                  <span>✅ Yes, I Agree to 0.15%</span>
                </button>

                <button
                  onClick={() => setShowCounterOfferModal(true)}
                  className="inline-flex items-center justify-center space-x-2 bg-blue-600 dark:bg-blue-500 text-white px-8 py-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-lg font-semibold btn-hover-lift"
                >
                  <MessageSquare className="w-6 h-6" />
                  <span>💬 Make Counter-Offer</span>
                </button>

                <button
                  onClick={handleReject}
                  className="inline-flex items-center justify-center space-x-2 bg-gray-600 dark:bg-gray-700 text-white px-8 py-4 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors text-lg font-semibold"
                >
                  <X className="w-6 h-6" />
                  <span>❌ No, Reject Proposal</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Counter-Offer Modal */}
        {showCounterOfferModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Counter-Offer for Ben
              </h2>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    New Percentage Proposal
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      value={counterOfferPercent}
                      onChange={(e) => setCounterOfferPercent(e.target.value)}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                      %
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Reason (Optional)
                  </label>
                  <textarea
                    rows={4}
                    value={counterOfferReason}
                    onChange={(e) => setCounterOfferReason(e.target.value)}
                    placeholder="e.g., Hey Ben, great portfolio! 0.15% is a bit high for us. Would you be okay with 0.12%?"
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleSendCounterOffer}
                  className="flex-1 bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-semibold"
                >
                  Send Counter-Offer
                </button>
                <button
                  onClick={() => setShowCounterOfferModal(false)}
                  className="flex-1 bg-gray-600 dark:bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}


