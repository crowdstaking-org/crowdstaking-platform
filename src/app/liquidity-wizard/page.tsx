'use client'

import { useState } from 'react'
import { WizardProgress } from '@/components/wizard/WizardProgress'
import { LiquidityStep1 } from '@/components/liquidity/LiquidityStep1'
import { LiquidityStep2 } from '@/components/liquidity/LiquidityStep2'
import { LiquidityStep3 } from '@/components/liquidity/LiquidityStep3'
import { LiquiditySuccess } from '@/components/liquidity/LiquiditySuccess'

interface LiquidityData {
  agreedToRequirement: boolean
  platform: string
  tokenAmount: string
  stableAmount: string
  stableCoin: string
}

/**
 * Liquidity Wizard page - 3-step process to create liquidity pool
 * Client Component - has multi-step state management
 */
export default function LiquidityWizardPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [liquidityData, setLiquidityData] = useState<LiquidityData>({
    agreedToRequirement: false,
    platform: 'Uniswap V3 (Recommended)',
    tokenAmount: '10000000',
    stableAmount: '10000',
    stableCoin: 'USDC',
  })

  const updateLiquidityData = (updates: Partial<LiquidityData>) => {
    setLiquidityData((prev) => ({
      ...prev,
      ...updates,
    }))
  }

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 4))
    window.scrollTo(0, 0)
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
    window.scrollTo(0, 0)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <LiquidityStep1
            data={liquidityData}
            onUpdate={updateLiquidityData}
            onNext={nextStep}
          />
        )
      case 2:
        return (
          <LiquidityStep2
            data={liquidityData}
            onUpdate={updateLiquidityData}
            onNext={nextStep}
            onBack={prevStep}
          />
        )
      case 3:
        return (
          <LiquidityStep3
            data={liquidityData}
            onNext={nextStep}
            onBack={prevStep}
          />
        )
      case 4:
        return <LiquiditySuccess />
      default:
        return null
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      {currentStep < 4 && (
        <WizardProgress currentStep={currentStep} totalSteps={3} />
      )}
      {renderStep()}
    </main>
  )
}

