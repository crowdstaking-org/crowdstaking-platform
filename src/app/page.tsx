'use client'

import { Layout } from '@/components/Layout'
import { HeroSection } from '@/components/HeroSection'
import { ProblemSolutionSection } from '@/components/ProblemSolutionSection'
import { HowItWorksSection } from '@/components/HowItWorksSection'
import { MissionsSection } from '@/components/MissionsSection'
import { PersonaBenefitsSection } from '@/components/PersonaBenefitsSection'
import { FlywheelSection } from '@/components/FlywheelSection'
import { FinalCTASection } from '@/components/FinalCTASection'
import { useTheme } from '@/hooks/useTheme'

/**
 * Home page - renders the main CrowdStaking landing page
 * Client Component to access theme hook for HeroSection
 */
export default function Home() {
  const { theme } = useTheme()
  
  return (
    <Layout>
      <main>
        <HeroSection theme={theme} />
        <ProblemSolutionSection />
        <HowItWorksSection />
        <MissionsSection />
        <PersonaBenefitsSection />
        <FlywheelSection />
        <FinalCTASection />
      </main>
    </Layout>
  )
}
