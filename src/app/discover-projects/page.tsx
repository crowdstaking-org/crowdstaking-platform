import { Layout } from '@/components/Layout'
import { DiscoverProjectsHero } from '@/components/discover-projects/DiscoverProjectsHero'
import { ProjectMarketplace } from '@/components/discover-projects/ProjectMarketplace'
import { HowToBecomeCofounder } from '@/components/discover-projects/HowToBecomeCofounder'
import { DiscoverProjectsCTA } from '@/components/discover-projects/DiscoverProjectsCTA'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Discover Projects | CrowdStaking',
  description: 'Browse active missions and become a co-founder. Earn liquid ownership for your creative work.',
  keywords: ['discover projects', 'co-founder', 'missions', 'liquid ownership', 'Web3 jobs'],
  openGraph: {
    title: 'Discover Projects | CrowdStaking',
    description: 'Browse active missions and become a co-founder. Earn liquid ownership for your creative work.',
    url: 'https://crowdstaking.com/discover-projects',
  },
}

/**
 * Discover Projects page - Browse missions and become a co-founder
 */
export default function DiscoverProjectsPage() {
  return (
    <Layout>
      <main>
        <DiscoverProjectsHero />
        <ProjectMarketplace />
        <HowToBecomeCofounder />
        <DiscoverProjectsCTA />
      </main>
    </Layout>
  )
}

