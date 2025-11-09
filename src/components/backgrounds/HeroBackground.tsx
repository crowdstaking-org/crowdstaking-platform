'use client'

import { AnimatedBlobs } from './AnimatedBlobs'
import { ParticleNetwork } from './ParticleNetwork'

interface HeroBackgroundProps {
  theme: 'light' | 'dark'
  isHeroVisible: boolean
}

/**
 * Combined background effect for hero section
 * Layers particle network with animated blobs/rockets
 * @param theme Current theme (light/dark)
 * @param isHeroVisible Controls visibility of animated blobs
 */
export function HeroBackground({ theme, isHeroVisible }: HeroBackgroundProps) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Particle Network - stays within Hero section */}
      <ParticleNetwork theme={theme} />

      {/* Gradient Overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/50 dark:to-gray-800/50 pointer-events-none" />

      {/* Animated Blobs/Rockets - fade out when Hero not visible */}
      <AnimatedBlobs theme={theme} isVisible={isHeroVisible} />
    </div>
  )
}

