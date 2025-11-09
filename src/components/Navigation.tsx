'use client'

import Link from 'next/link'
import { Rocket, LogIn, Sun, Moon } from 'lucide-react'

interface NavigationProps {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

/**
 * Sticky navigation bar with theme toggle and Next.js Link navigation
 * @param theme Current theme state
 * @param onToggleTheme Function to toggle between light/dark theme
 */
export function Navigation({ theme, onToggleTheme }: NavigationProps) {
  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white logo-hover cursor-pointer">
              CrowdStaking
            </Link>

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
                href="/whitepaper"
                className="nav-link text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Whitepaper
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
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

            <button className="hidden sm:flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors group">
              <LogIn className="w-4 h-4 icon-bounce" />
              <span>Login</span>
            </button>

            <Link href="/wizard" className="group flex items-center space-x-2 bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors btn-hover-lift btn-primary-glow ripple">
              <Rocket className="w-4 h-4 icon-slide" />
              <span>Start Mission</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
