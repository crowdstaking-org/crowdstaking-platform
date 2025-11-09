import { Layout } from '@/components/Layout'
import { HowItWorksHero } from '@/components/how-it-works/HowItWorksHero'
import { RoleSplitSection } from '@/components/how-it-works/RoleSplitSection'
import { FounderProcessSection } from '@/components/how-it-works/FounderProcessSection'
import { CofounderProcessSection } from '@/components/how-it-works/CofounderProcessSection'
import { EconomicModelSection } from '@/components/how-it-works/EconomicModelSection'
import { LegalFortressSection } from '@/components/how-it-works/LegalFortressSection'
import { HowItWorksCTA } from '@/components/how-it-works/HowItWorksCTA'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How It Works | CrowdStaking',
  description: 'Understand the mechanics of CrowdStaking: AI mediator, double handshake, and the flywheel effect that drives decentralized founding.',
  keywords: ['protocol mechanics', 'AI mediator', 'double handshake', 'flywheel effect', 'decentralized founding'],
  openGraph: {
    title: 'How It Works | CrowdStaking',
    description: 'Understand the mechanics of CrowdStaking: AI mediator, double handshake, and the flywheel effect.',
    url: 'https://crowdstaking.com/how-it-works',
  },
}

/**
 * How It Works page - Detailed explanation of the protocol mechanics
 */
export default function HowItWorksPage() {
  return (
    <Layout>
      <main>
        <HowItWorksHero />
        <RoleSplitSection />
        <FounderProcessSection />
        <CofounderProcessSection />
        <EconomicModelSection />
        <LegalFortressSection />
        <HowItWorksCTA />
      </main>
    </Layout>
  )
}

