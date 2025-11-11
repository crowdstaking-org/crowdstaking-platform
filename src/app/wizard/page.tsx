'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'
import { WizardProgress } from '@/components/wizard/WizardProgress'
import { WelcomeStep } from '@/components/wizard/WelcomeStep'
import { MissionStep } from '@/components/wizard/MissionStep'
import { SetupStep } from '@/components/wizard/SetupStep'
import { DealStep } from '@/components/wizard/DealStep'
import { ReviewStep } from '@/components/wizard/ReviewStep'
import { SuccessStep } from '@/components/wizard/SuccessStep'

interface MissionData {
  projectName: string
  mission: string
  vision: string
  tags: string
  tokenName: string
  tokenSymbol: string
  agreedToFee: boolean
}

/**
 * Mission Setup Wizard page
 * Client Component - manages wizard state flow
 * NO Navigation/Footer - full-screen wizard experience
 */
export default function WizardPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [missionData, setMissionData] = useState<MissionData>({
    projectName: '',
    mission: '',
    vision: '',
    tags: '',
    tokenName: '',
    tokenSymbol: '',
    agreedToFee: false,
  })
  
  const handleClose = () => {
    // Navigate back to homepage or previous page
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push('/')
    }
  }

  const updateMissionData = (updates: Partial<MissionData>) => {
    setMissionData((prev) => ({
      ...prev,
      ...updates,
    }))
  }

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 5))
    window.scrollTo(0, 0)
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
    window.scrollTo(0, 0)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep onNext={nextStep} />
      case 1:
        return (
          <MissionStep
            data={missionData}
            onUpdate={updateMissionData}
            onNext={nextStep}
            onBack={prevStep}
          />
        )
      case 2:
        return (
          <SetupStep
            data={missionData}
            onUpdate={updateMissionData}
            onNext={nextStep}
            onBack={prevStep}
          />
        )
      case 3:
        return (
          <DealStep
            data={missionData}
            onUpdate={updateMissionData}
            onNext={nextStep}
            onBack={prevStep}
          />
        )
      case 4:
        return (
          <ReviewStep data={missionData} onNext={nextStep} onBack={prevStep} />
        )
      case 5:
        return <SuccessStep />
      default:
        return <WelcomeStep onNext={nextStep} />
    }
  }

  // Get current step label
  const getStepLabel = () => {
    switch (currentStep) {
      case 0: return 'Welcome'
      case 1: return 'Define Mission'
      case 2: return 'Setup Project'
      case 3: return 'Token Deal'
      case 4: return 'Review'
      case 5: return 'Success'
      default: return 'Welcome'
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 relative">
      {/* Close Button - only shown on steps 0-4 (not on success page) */}
      {currentStep < 5 && (
        <button
          onClick={handleClose}
          className="fixed top-6 right-6 z-50 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 group cursor-pointer"
          aria-label="Close wizard"
        >
          <X className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
        </button>
      )}
      
      {/* Breadcrumbs - shown on all steps */}
      {currentStep < 5 && (
        <div className="max-w-4xl mx-auto px-4 mb-6">
          <Breadcrumbs 
            items={[
              { label: 'Create Mission', href: '/wizard', icon: 'sparkles' },
              { label: `Step ${currentStep + 1}: ${getStepLabel()}` }
            ]} 
          />
        </div>
      )}
      
      {/* Progress bar only shown on steps 1-4 */}
      {currentStep > 0 && currentStep < 5 && (
        <WizardProgress currentStep={currentStep} totalSteps={4} />
      )}
      {renderStep()}
    </main>
  )
}

