'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Rocket, Sun, Moon, Menu, X } from 'lucide-react'
import { ConnectButton } from "thirdweb/react"
import { client } from "@/lib/thirdweb"
import { useAuth } from "@/hooks/useAuth"

interface NavigationProps {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

/**
 * Sticky navigation bar with theme toggle, mobile menu, and Next.js Link navigation
 * @param theme Current theme state
 * @param onToggleTheme Function to toggle between light/dark theme
 */
export function Navigation({ theme, onToggleTheme }: NavigationProps) {
  const { wallet, isAuthenticated, login } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen)
  const closeMobileMenu = () => setMobileMenuOpen(false)
  
  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white logo-hover cursor-pointer">
              CrowdStaking
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-6">
              <Link
                href="/discover-projects"
                className="nav-link text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Discover Projects
              </Link>
              <Link
                href="/how-it-works"
                className="nav-link text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                How It Works
              </Link>
              <Link
                href="/about"
                className="nav-link text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                About
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors group"
              aria-label="Toggle theme"
            >
              <div className="theme-icon theme-icon-rotate">
                {theme === 'light' ? (
                  <Moon className="w-5 h-5 icon-rotate" />
                ) : (
                  <Sun className="w-5 h-5 icon-rotate" />
                )}
              </div>
            </button>

            {/* Connect Wallet - Now visible on all screen sizes */}
            <div className="flex items-center space-x-2">
              <ConnectButton
                client={client}
                theme="dark"
                connectButton={{
                  label: "Connect",
                }}
                connectModal={{
                  title: "Join CrowdStaking",
                  showThirdwebBranding: false,
                }}
                onConnect={async () => {
                  // Auto-trigger login after wallet connection
                  if (!isAuthenticated) {
                    try {
                      await login()
                    } catch (error) {
                      console.error('Auto-login failed:', error)
                    }
                  }
                }}
              />
              
              {/* Show authentication status - hidden on very small screens */}
              {wallet && isAuthenticated && (
                <span className="hidden sm:inline-block text-xs text-green-500 dark:text-green-400">
                  ✓
                </span>
              )}
            </div>

            {/* Start Mission Button - Hidden on small screens to save space */}
            <Link href="/wizard" className="hidden sm:flex group items-center space-x-2 bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors btn-hover-lift btn-primary-glow ripple">
              <Rocket className="w-4 h-4 icon-slide" />
              <span>Start Mission</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-4">
              <Link
                href="/discover-projects"
                onClick={closeMobileMenu}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors px-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Discover Projects
              </Link>
              <Link
                href="/how-it-works"
                onClick={closeMobileMenu}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors px-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                How It Works
              </Link>
              <Link
                href="/about"
                onClick={closeMobileMenu}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors px-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                About
              </Link>
              <Link
                href="/wizard"
                onClick={closeMobileMenu}
                className="flex items-center justify-center space-x-2 bg-blue-600 dark:bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-semibold"
              >
                <Rocket className="w-5 h-5" />
                <span>Start Mission</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
