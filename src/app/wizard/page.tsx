'use client'

import { useState } from 'react'
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
  legalWrapper: boolean
  agreedToFee: boolean
}

/**
 * Mission Setup Wizard page
 * Client Component - manages wizard state flow
 * NO Navigation/Footer - full-screen wizard experience
 */
export default function WizardPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [missionData, setMissionData] = useState<MissionData>({
    projectName: '',
    mission: '',
    vision: '',
    tags: '',
    legalWrapper: true,
    agreedToFee: false,
  })

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

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      {/* Progress bar only shown on steps 1-4 */}
      {currentStep > 0 && currentStep < 5 && (
        <WizardProgress currentStep={currentStep} totalSteps={4} />
      )}
      {renderStep()}
    </main>
  )
}

