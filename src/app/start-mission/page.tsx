import { Layout } from '@/components/Layout'
import { StartMissionHero } from '@/components/start-mission/StartMissionHero'
import { ThreeStepsSection } from '@/components/start-mission/ThreeStepsSection'
import { FAQSection } from '@/components/start-mission/FAQSection'
import { StartMissionCTA } from '@/components/start-mission/StartMissionCTA'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Start Your Mission | CrowdStaking',
  description: 'Launch your startup without capital. Skip VC rounds and build your decentralized company with liquid equity.',
  keywords: ['start mission', 'launch startup', 'no capital', 'liquid equity', 'decentralized company'],
  openGraph: {
    title: 'Start Your Mission | CrowdStaking',
    description: 'Launch your startup without capital. Skip VC rounds and build your decentralized company with liquid equity.',
    url: 'https://crowdstaking.com/start-mission',
  },
}

/**
 * Start Mission page - Guide founders to launch their missions
 */
export default function StartMissionPage() {
  return (
    <Layout>
      <main>
        <StartMissionHero />
        <ThreeStepsSection />
        <FAQSection />
        <StartMissionCTA />
      </main>
    </Layout>
  )
}

