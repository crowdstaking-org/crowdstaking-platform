import { Layout } from '@/components/Layout'
import { AboutHero } from '@/components/about/AboutHero'
import { AboutMissionSection } from '@/components/about/AboutMissionSection'
import { WhoWeAreSection } from '@/components/about/WhoWeAreSection'
import { DogfoodingSection } from '@/components/about/DogfoodingSection'
import { LegalStructureSection } from '@/components/about/LegalStructureSection'
import { AboutCTA } from '@/components/about/AboutCTA'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About | CrowdStaking',
  description:
    'We are a movement, not a company. Learn about our mission to decouple ideas from capital and build the infrastructure for the economy of pure ideas.',
  keywords: [
    'about crowdstaking',
    'mission',
    'decentralized founding',
    'open source 3.0',
    'satoshi principle',
  ],
  openGraph: {
    title: 'About | CrowdStaking',
    description:
      'We are a movement, not a company. Learn about our mission to decouple ideas from capital.',
    url: 'https://crowdstaking.com/about',
  },
}

/**
 * About page - Learn about CrowdStaking's mission and approach
 */
export default function AboutPage() {
  return (
    <Layout>
      <main>
        <AboutHero />
        <AboutMissionSection />
        <WhoWeAreSection />
        <DogfoodingSection />
        <LegalStructureSection />
        <AboutCTA />
      </main>
    </Layout>
  )
}


