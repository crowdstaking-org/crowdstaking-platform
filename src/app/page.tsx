'use client'

import dynamic from 'next/dynamic'
import { Layout } from '@/components/Layout'
import { NewHeroSection } from '@/components/NewHeroSection'
import { useTheme } from '@/hooks/useTheme'

/**
 * Performance Optimization: Dynamic imports for below-the-fold components
 * These components are lazy-loaded to reduce initial bundle size
 */
const MarketplaceShowcase = dynamic(
  () => import('@/components/MarketplaceShowcase').then(mod => ({ default: mod.MarketplaceShowcase })),
  { ssr: true }
)

const DoubleHandshakeSection = dynamic(
  () => import('@/components/DoubleHandshakeSection').then(mod => ({ default: mod.DoubleHandshakeSection })),
  { ssr: true }
)

const OldVsNewSection = dynamic(
  () => import('@/components/OldVsNewSection').then(mod => ({ default: mod.OldVsNewSection })),
  { ssr: true }
)

const MovementSection = dynamic(
  () => import('@/components/MovementSection').then(mod => ({ default: mod.MovementSection })),
  { ssr: true }
)

const FinalCTASection = dynamic(
  () => import('@/components/FinalCTASection').then(mod => ({ default: mod.FinalCTASection })),
  { ssr: true }
)

/**
 * Home page - renders the main CrowdStaking landing page
 * New structure with full-screen hero and clear narrative flow
 * 
 * PERFORMANCE: Below-the-fold sections are dynamically imported
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
