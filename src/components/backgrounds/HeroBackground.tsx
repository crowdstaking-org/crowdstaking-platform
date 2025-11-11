'use client'

import { GravityMesh } from './GravityMesh'
import { ParticleNetwork } from './ParticleNetwork'

interface HeroBackgroundProps {
  theme: 'light' | 'dark'
  isHeroVisible: boolean
}

/**
 * Combined background effect for hero section
 * Layers particle network with gravity mesh effect
 * @param theme Current theme (light/dark)
 * @param isHeroVisible Controls visibility of background effects
 */
export function HeroBackground({ theme, isHeroVisible }: HeroBackgroundProps) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Particle Network - stays within Hero section */}
      <ParticleNetwork theme={theme} />

      {/* Gradient Overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/50 dark:to-gray-800/50 pointer-events-none" />

      {/* Gravity Mesh - animated undulating grid effect */}
      <GravityMesh theme={theme} />
    </div>
  )
}

