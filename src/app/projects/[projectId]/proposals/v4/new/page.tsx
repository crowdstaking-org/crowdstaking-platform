'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useActiveAccount } from 'thirdweb/react'
import { ConnectButton } from 'thirdweb/react'
import { client, wallets } from '@/lib/thirdweb'
import { LoadingButton } from '@/components/ui/LoadingButton'
import { showSuccess, showError, showLoading, dismissToast } from '@/lib/toast'
import { ENABLE_V4_PROTOCOL } from '@/lib/features'
import type { ProposalType } from '@/types/v4'
import { ArrowLeft, FileText, DollarSign, TrendingUp, X, AlertCircle } from 'lucide-react'

interface ProposalFormData {
  type: ProposalType
  payload: Record<string, unknown>
  deadline?: string | null
}

/**
 * v4 Governance Proposal Creation Page
 * Creates proposals for WORK, CAPITAL, PAYOUT, BOUNTY, or REVOKE
 */
export default function NewV4ProposalPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params?.projectId as string
  const account = useActiveAccount()
  
  const [proposalType, setProposalType] = useState<ProposalType | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!ENABLE_V4_PROTOCOL) {
    router.push(`/projects/${projectId}`)
    return null
  }

  const proposalTypes: Array<{
    type: ProposalType
    label: string
    description: string
    icon: any
    color: string
  }> = [
    {
      type: 'WORK',
      label: 'Work Proposal',
      description: 'Propose adding a partner for work contribution',
      icon: FileText,
      color: 'blue',
    },
    {
      type: 'CAPITAL',
      label: 'Capital Proposal',
      description: 'Propose adding a partner for capital contribution',
      icon: DollarSign,
      color: 'green',
    },
    {
      type: 'PAYOUT',
      label: 'Payout Proposal',
      description: 'Propose starting a dividend distribution period',
      icon: TrendingUp,
      color: 'purple',
    },
    {
      type: 'BOUNTY',
      label: 'Bounty Proposal',
      description: 'Propose a one-time bounty payment',
      icon: DollarSign,
      color: 'yellow',
    },
    {
      type: 'REVOKE',
      label: 'Revoke Proposal',
      description: 'Propose revoking a partner\'s share',
      icon: X,
      color: 'red',
    },
  ]

  const handleTypeSelect = (type: ProposalType) => {
    setProposalType(type)
    setFormData({})
  }

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const buildPayload = (): Record<string, unknown> => {
    switch (proposalType) {
      case 'WORK':
        return {
          walletAddress: formData.walletAddress,
          shareBps: Number(formData.shareBps),
          description: formData.description || '',
        }
      case 'CAPITAL':
        return {
          walletAddress: formData.walletAddress,
          shareBps: Number(formData.shareBps),
          amount: formData.amount || '',
          description: formData.description || '',
        }
      case 'PAYOUT':
        return {
          type: 'payout',
          period: formData.period || '',
        }
      case 'BOUNTY':
        return {
          recipient: formData.recipient,
          amount: formData.amount || '',
          description: formData.description || '',
        }
      case 'REVOKE':
        return {
          walletAddress: formData.walletAddress,
          reason: formData.reason || '',
        }
      default:
        return {}
    }
  }

  const validateForm = (): boolean => {
    if (!proposalType) return false

    switch (proposalType) {
      case 'WORK':
      case 'CAPITAL':
        return !!(formData.walletAddress && formData.shareBps)
      case 'PAYOUT':
        return !!formData.period
      case 'BOUNTY':
        return !!(formData.recipient && formData.amount)
      case 'REVOKE':
        return !!formData.walletAddress
      default:
        return false
    }
  }

  const handleSubmit = async () => {
    if (!account?.address) {
      showError('Please connect your wallet first')
      return
    }

    if (!validateForm()) {
      showError('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    const loadingToast = showLoading('Creating proposal...')

    try {
      const payload = buildPayload()
      const deadline = formData.deadline ? new Date(formData.deadline).toISOString() : null

      const response = await fetch(`/api/v4/projects/${projectId}/proposals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          createdBy: account.address,
          type: proposalType,
          payload,
          deadline,
        }),
      })

      dismissToast(loadingToast)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create proposal')
      }

      const result = await response.json()
      showSuccess('Proposal created successfully!')
      
      setTimeout(() => {
        router.push(`/projects/${projectId}`)
      }, 1500)
    } catch (error: any) {
      showError(error.message || 'Failed to create proposal')
      setIsSubmitting(false)
    }
  }

  if (!proposalType) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Project
          </button>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Create Governance Proposal
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Choose the type of proposal you want to create
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {proposalTypes.map(({ type, label, description, icon: Icon, color }) => {
                const getColorClasses = (c: string) => {
                  switch (c) {
                    case 'blue':
                      return {
                        border: 'hover:border-blue-500 dark:hover:border-blue-400',
                        bg: 'bg-blue-100 dark:bg-blue-900/20',
                        text: 'text-blue-600 dark:text-blue-400',
                      }
                    case 'green':
                      return {
                        border: 'hover:border-green-500 dark:hover:border-green-400',
                        bg: 'bg-green-100 dark:bg-green-900/20',
                        text: 'text-green-600 dark:text-green-400',
                      }
                    case 'purple':
                      return {
                        border: 'hover:border-purple-500 dark:hover:border-purple-400',
                        bg: 'bg-purple-100 dark:bg-purple-900/20',
                        text: 'text-purple-600 dark:text-purple-400',
                      }
                    case 'yellow':
                      return {
                        border: 'hover:border-yellow-500 dark:hover:border-yellow-400',
                        bg: 'bg-yellow-100 dark:bg-yellow-900/20',
                        text: 'text-yellow-600 dark:text-yellow-400',
                      }
                    case 'red':
                      return {
                        border: 'hover:border-red-500 dark:hover:border-red-400',
                        bg: 'bg-red-100 dark:bg-red-900/20',
                        text: 'text-red-600 dark:text-red-400',
                      }
                    default:
                      return {
                        border: 'hover:border-blue-500 dark:hover:border-blue-400',
                        bg: 'bg-blue-100 dark:bg-blue-900/20',
                        text: 'text-blue-600 dark:text-blue-400',
                      }
                  }
                }
                const colors = getColorClasses(color)
                
                return (
                <button
                  key={type}
                  onClick={() => handleTypeSelect(type)}
                  className={`p-6 border-2 rounded-xl text-left transition-all cursor-pointer border-gray-200 dark:border-gray-700 ${colors.border}`}
                >
                  <div className={`w-12 h-12 rounded-lg ${colors.bg} flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${colors.text}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {label}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {description}
                  </p>
                </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const selectedType = proposalTypes.find((t) => t.type === proposalType)!

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => setProposalType(null)}
          className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Proposal Types
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              {(() => {
                const getIconClasses = (c: string) => {
                  switch (c) {
                    case 'blue':
                      return { bg: 'bg-blue-100 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400' }
                    case 'green':
                      return { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-600 dark:text-green-400' }
                    case 'purple':
                      return { bg: 'bg-purple-100 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400' }
                    case 'yellow':
                      return { bg: 'bg-yellow-100 dark:bg-yellow-900/20', text: 'text-yellow-600 dark:text-yellow-400' }
                    case 'red':
                      return { bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400' }
                    default:
                      return { bg: 'bg-blue-100 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400' }
                  }
                }
                const iconClasses = getIconClasses(selectedType.color)
                return (
                  <div className={`w-10 h-10 rounded-lg ${iconClasses.bg} flex items-center justify-center`}>
                    <selectedType.icon className={`w-5 h-5 ${iconClasses.text}`} />
                  </div>
                )
              })()}
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedType.label}
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {selectedType.description}
            </p>
          </div>

          {!account && (
            <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-2">
                    Please connect your wallet to create a proposal
                  </p>
                  <ConnectButton client={client} wallets={wallets} />
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {proposalType === 'WORK' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Partner Wallet Address *
                  </label>
                  <input
                    type="text"
                    value={formData.walletAddress || ''}
                    onChange={(e) => updateFormData('walletAddress', e.target.value)}
                    placeholder="0x..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Share Percentage (basis points) *
                  </label>
                  <input
                    type="number"
                    value={formData.shareBps || ''}
                    onChange={(e) => updateFormData('shareBps', e.target.value)}
                    placeholder="3000 (30%)"
                    min="0"
                    max="10000"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Enter in basis points (100 = 1%, 3000 = 30%)
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => updateFormData('description', e.target.value)}
                    placeholder="Describe the work contribution..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </>
            )}

            {proposalType === 'CAPITAL' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Partner Wallet Address *
                  </label>
                  <input
                    type="text"
                    value={formData.walletAddress || ''}
                    onChange={(e) => updateFormData('walletAddress', e.target.value)}
                    placeholder="0x..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Share Percentage (basis points) *
                  </label>
                  <input
                    type="number"
                    value={formData.shareBps || ''}
                    onChange={(e) => updateFormData('shareBps', e.target.value)}
                    placeholder="2000 (20%)"
                    min="0"
                    max="10000"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Capital Amount (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.amount || ''}
                    onChange={(e) => updateFormData('amount', e.target.value)}
                    placeholder="1000000"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => updateFormData('description', e.target.value)}
                    placeholder="Describe the capital contribution..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </>
            )}

            {proposalType === 'PAYOUT' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Distribution Period *
                  </label>
                  <input
                    type="text"
                    value={formData.period || ''}
                    onChange={(e) => updateFormData('period', e.target.value)}
                    placeholder="Q1-2024"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Identifier for this distribution period (e.g., "Q1-2024", "2024-01")
                  </p>
                </div>
              </>
            )}

            {proposalType === 'BOUNTY' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Recipient Wallet Address *
                  </label>
                  <input
                    type="text"
                    value={formData.recipient || ''}
                    onChange={(e) => updateFormData('recipient', e.target.value)}
                    placeholder="0x..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bounty Amount *
                  </label>
                  <input
                    type="text"
                    value={formData.amount || ''}
                    onChange={(e) => updateFormData('amount', e.target.value)}
                    placeholder="1000000"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => updateFormData('description', e.target.value)}
                    placeholder="Describe the bounty..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </>
            )}

            {proposalType === 'REVOKE' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Partner Wallet Address to Revoke *
                  </label>
                  <input
                    type="text"
                    value={formData.walletAddress || ''}
                    onChange={(e) => updateFormData('walletAddress', e.target.value)}
                    placeholder="0x..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Reason (Optional)
                  </label>
                  <textarea
                    value={formData.reason || ''}
                    onChange={(e) => updateFormData('reason', e.target.value)}
                    placeholder="Reason for revocation..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Voting Deadline (Optional)
              </label>
              <input
                type="datetime-local"
                value={formData.deadline || ''}
                onChange={(e) => updateFormData('deadline', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Leave empty to use default voting period (3 days)
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              onClick={() => setProposalType(null)}
              disabled={isSubmitting}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <LoadingButton
              onClick={handleSubmit}
              isLoading={isSubmitting}
              disabled={!account || !validateForm() || isSubmitting}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Create Proposal
            </LoadingButton>
          </div>
        </div>
      </div>
    </div>
  )
}

