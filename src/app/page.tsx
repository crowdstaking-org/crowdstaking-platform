'use client'

import { Layout } from '@/components/Layout'
import { NewHeroSection } from '@/components/NewHeroSection'
import { MarketplaceShowcase } from '@/components/MarketplaceShowcase'
import { DoubleHandshakeSection } from '@/components/DoubleHandshakeSection'
import { OldVsNewSection } from '@/components/OldVsNewSection'
import { MovementSection } from '@/components/MovementSection'
import { FinalCTASection } from '@/components/FinalCTASection'
import { useTheme } from '@/hooks/useTheme'

/**
 * Home page - renders the main CrowdStaking landing page
 * New structure with full-screen hero and clear narrative flow
 */
export default function Home() {
  const { theme } = useTheme()
  
  return (
    <Layout>
      <main>
        {/* 1. New Hero Section - The Fork (Founders vs Contributors) */}
        <NewHeroSection theme={theme} />
        
        {/* 2. Marketplace Showcase - Live Missions */}
        <MarketplaceShowcase />
        
        {/* 3. Double Handshake - How it Works */}
        <DoubleHandshakeSection />
        
        {/* 4. Old vs New - The Why */}
        <OldVsNewSection />
        
        {/* 5. Movement Section - Community & Philosophy */}
        <MovementSection />
        
        {/* 6. Final CTA */}
        <FinalCTASection />
      </main>
    </Layout>
  )
}
