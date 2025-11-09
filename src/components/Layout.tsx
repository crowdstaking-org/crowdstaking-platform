'use client'

import { Navigation } from './Navigation'
import { Footer } from './Footer'
import { useTheme } from '../hooks/useTheme'
import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

/**
 * Shared layout component wrapping all pages
 * Provides consistent Navigation, Footer, and Theme management
 */
export function Layout({ children }: LayoutProps) {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navigation theme={theme} onToggleTheme={toggleTheme} />
      {children}
      <Footer />
    </div>
  )
}

