/**
 * CrowdStaking Color Tokens
 * 
 * Brand Colors:
 * - Blue: Primary brand color for Founders, CTAs, and primary actions
 * - Purple: Secondary brand color for Contributors and secondary actions
 * 
 * Semantic Colors:
 * - Success (Green): Positive states, live tokens, confirmations
 * - Error (Red): Errors, old model contrasts, warnings
 * - Warning (Yellow): Pending states, caution indicators
 * 
 * All colors support dark mode variants via Tailwind's dark: prefix
 */

import type { ColorPalette } from './types'

/**
 * Brand color palette
 * Blue = Founders | Purple = Contributors
 */
const brandColors = {
  /**
   * Primary Blue - Main brand color for Founder-focused elements
   * Usage: Primary buttons, founder CTAs, main brand elements
   */
  blue: {
    50: 'bg-blue-50',         // #eff6ff - Subtle backgrounds
    100: 'bg-blue-100',       // #dbeafe - Icon backgrounds, hover states
    200: 'bg-blue-200',       // #bfdbfe - Borders with blue accent
    300: 'bg-blue-300',       // #93c5fd
    400: 'bg-blue-400',       // #60a5fa - Dark mode primary
    500: 'bg-blue-500',       // #3b82f6 - Dark mode hover
    600: 'bg-blue-600',       // #2563eb - PRIMARY BRAND, main CTAs
    700: 'bg-blue-700',       // #1d4ed8 - Hover states
    800: 'bg-blue-800',       // #1e40af
    900: 'bg-blue-900',       // #1e3a8a - Dark mode backgrounds
  },
  
  /**
   * Secondary Purple - Brand color for Contributor-focused elements
   * Usage: Secondary buttons, contributor CTAs, featured elements
   */
  purple: {
    50: 'bg-purple-50',       // #faf5ff - Subtle backgrounds
    100: 'bg-purple-100',     // #f3e8ff - Icon backgrounds
    200: 'bg-purple-200',     // #e9d5ff - Borders with purple accent
    300: 'bg-purple-300',     // #d8b4fe
    400: 'bg-purple-400',     // #c084fc - Dark mode secondary
    500: 'bg-purple-500',     // #a855f7 - Dark mode hover
    600: 'bg-purple-600',     // #9333ea - SECONDARY BRAND, contributor CTAs
    700: 'bg-purple-700',     // #7e22ce - Hover states
    800: 'bg-purple-800',     // #6b21a8
    900: 'bg-purple-900',     // #581c87 - Dark mode backgrounds
  },
} as const

/**
 * Semantic colors for UI states
 */
const semanticColors = {
  /**
   * Success Green - Positive confirmations and live states
   * Usage: "Token Live" badges, success messages, new model cards
   */
  success: {
    light: 'bg-green-50',     // #f0fdf4 - Success backgrounds
    DEFAULT: 'bg-green-600',  // #16a34a - Success text/icons
    dark: 'bg-green-400',     // #4ade80 - Dark mode success
  },
  
  /**
   * Error Red - Errors and negative contrasts
   * Usage: Error messages, "Old Model" cards, destructive actions
   */
  error: {
    light: 'bg-red-50',       // #fef2f2 - Error backgrounds
    DEFAULT: 'bg-red-600',    // #dc2626 - Error text/icons
    dark: 'bg-red-400',       // #f87171 - Dark mode errors
  },
  
  /**
   * Warning Yellow - Pending states and cautions
   * Usage: "Token Pending" badges, warning messages
   */
  warning: {
    light: 'bg-yellow-50',    // #fefce8 - Warning backgrounds
    DEFAULT: 'bg-yellow-600', // #ca8a04 - Warning text/icons
    dark: 'bg-yellow-400',    // #facc15 - Dark mode warnings
  },
} as const

/**
 * Neutral gray scale for text, backgrounds, and structural elements
 * Usage: Text hierarchy, card backgrounds, borders, dividers
 */
const neutralColors = {
  50: 'bg-gray-50',           // #f9fafb - Subtle section backgrounds
  100: 'bg-gray-100',         // #f3f4f6 - Card backgrounds
  200: 'bg-gray-200',         // #e5e7eb - Borders, dividers
  300: 'bg-gray-300',         // #d1d5db - Disabled states
  400: 'bg-gray-400',         // #9ca3af - Placeholder text
  500: 'bg-gray-500',         // #6b7280
  600: 'bg-gray-600',         // #4b5563 - Secondary text
  700: 'bg-gray-700',         // #374151 - Body text, dark borders
  800: 'bg-gray-800',         // #1f2937 - Dark mode cards
  900: 'bg-gray-900',         // #111827 - Headings, dark backgrounds
} as const

/**
 * Text color utilities for easy access
 * These complement the background colors above
 */
export const textColors = {
  brand: {
    blue: {
      DEFAULT: 'text-blue-600 dark:text-blue-400',
      hover: 'hover:text-blue-700 dark:hover:text-blue-300',
    },
    purple: {
      DEFAULT: 'text-purple-600 dark:text-purple-400',
      hover: 'hover:text-purple-700 dark:hover:text-purple-300',
    },
  },
  semantic: {
    success: 'text-green-600 dark:text-green-400',
    error: 'text-red-600 dark:text-red-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
  },
  neutral: {
    heading: 'text-gray-900 dark:text-white',
    body: 'text-gray-700 dark:text-gray-300',
    muted: 'text-gray-600 dark:text-gray-400',
  },
} as const

/**
 * Border color utilities
 */
export const borderColors = {
  brand: {
    blue: 'border-blue-200 dark:border-blue-700',
    purple: 'border-purple-200 dark:border-purple-700',
  },
  semantic: {
    success: 'border-green-200 dark:border-green-700',
    error: 'border-red-200 dark:border-red-900/30',
    warning: 'border-yellow-200 dark:border-yellow-700',
  },
  neutral: {
    light: 'border-gray-200 dark:border-gray-700',
    DEFAULT: 'border-gray-300 dark:border-gray-600',
  },
} as const

/**
 * Gradient definitions for backgrounds
 */
export const gradients = {
  hero: {
    light: 'bg-gradient-to-br from-blue-50 via-white to-purple-50',
    dark: 'dark:from-gray-900 dark:via-gray-900 dark:to-gray-800',
    combined: 'bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800',
  },
  section: {
    blueLight: 'bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800',
    purpleLight: 'bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800',
  },
  card: {
    subtle: 'bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-800',
    success: 'bg-gradient-to-br from-green-50 to-white dark:from-green-900/10 dark:to-gray-800',
    error: 'bg-gradient-to-br from-red-50 to-white dark:from-red-900/10 dark:to-gray-800',
  },
  icon: 'bg-gradient-to-br from-blue-600 to-purple-600',
} as const

/**
 * Complete color palette export
 */
const colors: ColorPalette = {
  brand: brandColors,
  semantic: semanticColors,
  neutral: neutralColors,
}

export default colors

/**
 * Individual exports for convenience
 */
export { brandColors, semanticColors, neutralColors }

