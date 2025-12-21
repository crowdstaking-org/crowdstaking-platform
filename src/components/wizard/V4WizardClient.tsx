'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useActiveAccount } from 'thirdweb/react'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'
import { WizardProgress } from '@/components/wizard/WizardProgress'
import { LoadingButton } from '@/components/ui/LoadingButton'
import { showSuccess, showError, showLoading, dismissToast } from '@/lib/toast'
import { ENABLE_V4_PROTOCOL } from '@/lib/features'

interface V4ProjectData {
  name: string
  slug: string
  mission: string | null
}

export function V4WizardClient() {
  const router = useRouter()
  const account = useActiveAccount()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [projectData, setProjectData] = useState<V4ProjectData>({
    name: '',
    slug: '',
    mission: null,
  })

  useEffect(() => {
    if (!ENABLE_V4_PROTOCOL) {
      router.push('/')
    }
  }, [router])

  if (!ENABLE_V4_PROTOCOL) {
    return null
  }

  const updateProjectData = (updates: Partial<V4ProjectData>) => {
    setProjectData((prev) => ({
      ...prev,
      ...updates,
    }))
  }

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 2))
    window.scrollTo(0, 0)
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
    window.scrollTo(0, 0)
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleNameChange = (name: string) => {
    updateProjectData({ name })
    if (!projectData.slug || projectData.slug === generateSlug(projectData.name)) {
      updateProjectData({ slug: generateSlug(name) })
    }
  }

  const handleSubmit = async () => {
    if (!account?.address) {
      showError('Please connect your wallet first')
      return
    }

    if (!projectData.name || !projectData.slug) {
      showError('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    const loadingToast = showLoading('Creating project and deploying contracts...')

    try {
      const response = await fetch('/api/v4/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: projectData.name,
          slug: projectData.slug,
          mission: projectData.mission || null,
          founderWallet: account.address,
        }),
      })

      dismissToast(loadingToast)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create project')
      }

      const result = await response.json()
      showSuccess('Project created successfully!')
      
      setTimeout(() => {
        router.push(`/projects/${result.project.id}`)
      }, 1500)
    } catch (error: any) {
      showError(error.message || 'Failed to create project')
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep onNext={nextStep} account={account} />
      case 1:
        return (
          <ProjectDetailsStep
            data={projectData}
            onUpdate={updateProjectData}
            onNameChange={handleNameChange}
            onNext={nextStep}
            onBack={prevStep}
          />
        )
      case 2:
        return (
          <ReviewStep
            data={projectData}
            account={account}
            onSubmit={handleSubmit}
            onBack={prevStep}
            isSubmitting={isSubmitting}
          />
        )
      default:
        return null
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 relative">
      {currentStep < 2 && (
        <Link
          href="/"
          className="fixed top-6 right-6 z-[100] p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 group cursor-pointer"
          aria-label="Close wizard"
        >
          <X className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
        </Link>
      )}

      {currentStep < 2 && (
        <div className="max-w-4xl mx-auto px-4 mb-6">
          <Breadcrumbs
            items={[
              { label: 'Create v4 Project', href: '/wizard/v4', icon: 'sparkles' },
              { label: `Step ${currentStep + 1}: ${currentStep === 0 ? 'Welcome' : 'Project Details'}` },
            ]}
          />
        </div>
      )}

      {currentStep > 0 && currentStep < 2 && (
        <WizardProgress currentStep={currentStep} totalSteps={2} />
      )}

      {renderStep()}
    </main>
  )
}

function WelcomeStep({ onNext, account }: { onNext: () => void; account: any }) {
  const hasAccount = !!account && !!account.address
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Create Your v4 Project</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Set up a decentralized partnership project with Soulbound Tokens and Dividend Vaults</p>
        </div>
        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-blue-600 dark:text-blue-400 mt-1">✓</div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">On-Chain Contracts</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Deploy PartnerRegister, GovernanceModule, ProfitVault, and CapitalVault automatically</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-green-600 dark:text-green-400 mt-1">✓</div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Governance Ready</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Create proposals, vote, and manage partnerships through on-chain governance</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="text-purple-600 dark:text-purple-400 mt-1">✓</div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Dividend Distribution</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Automatically distribute profits to partners based on their share percentages</p>
            </div>
          </div>
        </div>
        {!hasAccount && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-3">Please log in first or create an account</p>
            <div className="flex justify-center">
              <Link href="/?login=true&returnUrl=/wizard/v4" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer inline-flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                Login / Register
              </Link>
            </div>
          </div>
        )}
        <div className="flex justify-end">
          <button onClick={onNext} disabled={!hasAccount} className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer">Get Started</button>
        </div>
      </div>
    </div>
  )
}

function ProjectDetailsStep({ data, onUpdate, onNameChange, onNext, onBack }: any) {
  const canProceed = data.name.trim().length > 0 && data.slug.trim().length > 0
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Project Details</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Project Name *</label>
            <input type="text" value={data.name} onChange={(e) => onNameChange(e.target.value)} placeholder="My Awesome Project" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Project Slug *</label>
            <input type="text" value={data.slug} onChange={(e) => onUpdate({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })} placeholder="my-awesome-project" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mission (Optional)</label>
            <textarea value={data.mission || ''} onChange={(e) => onUpdate({ mission: e.target.value || null })} placeholder="Describe your project's mission and goals..." rows={4} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
          </div>
        </div>
        <div className="flex justify-between mt-8">
          <button onClick={onBack} className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">Back</button>
          <button onClick={onNext} disabled={!canProceed} className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer">Review</button>
        </div>
      </div>
    </div>
  )
}

function ReviewStep({ data, account, onSubmit, onBack, isSubmitting }: any) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Review & Deploy</h2>
        <div className="space-y-4 mb-8">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"><div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Project Name</div><div className="text-lg font-semibold text-gray-900 dark:text-white">{data.name}</div></div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"><div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Slug</div><div className="text-lg font-mono text-gray-900 dark:text-white">{data.slug}</div></div>
          {data.mission && <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"><div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Mission</div><div className="text-gray-900 dark:text-white">{data.mission}</div></div>}
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"><div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Founder Wallet</div><div className="text-lg font-mono text-gray-900 dark:text-white">{account?.address || 'Not connected'}</div></div>
        </div>
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-6">
          <p className="text-sm text-blue-800 dark:text-blue-200"><strong>What happens next:</strong> Your project will be created and the following contracts will be deployed on-chain: PartnerRegister, GovernanceModule, ProfitVault, and CapitalVault.</p>
        </div>
        <div className="flex justify-between">
          <button onClick={onBack} disabled={isSubmitting} className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer">Back</button>
          <LoadingButton onClick={onSubmit} isLoading={isSubmitting} disabled={!account || isSubmitting} className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer">Deploy Project</LoadingButton>
        </div>
      </div>
    </div>
  )
}
