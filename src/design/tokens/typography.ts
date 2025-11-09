/**
 * CrowdStaking Typography Tokens
 * 
 * Defines the typographic scale, weights, and line heights used throughout
 * the application. All values follow Tailwind CSS conventions for consistency.
 * 
 * Typography Hierarchy:
 * - H1: Hero titles (text-5xl to text-7xl)
 * - H2: Section headings (text-4xl to text-5xl)
 * - H3: Card titles, subsections (text-2xl to text-3xl)
 * - Body Large: Introductory text (text-xl)
 * - Body: Standard content (text-lg)
 * - Small: Labels, captions (text-sm)
 */

import type { Typography } from './types'

/**
 * Font size scale
 * Maps to Tailwind's text-* utilities
 */
export const fontSizes = {
  /** text-xs: 0.75rem / 12px - Very small labels */
  xs: 'text-xs',
  
  /** text-sm: 0.875rem / 14px - Small text, labels, badges */
  sm: 'text-sm',
  
  /** text-base: 1rem / 16px - Base body text */
  base: 'text-base',
  
  /** text-lg: 1.125rem / 18px - Large body text, card content */
  lg: 'text-lg',
  
  /** text-xl: 1.25rem / 20px - Intro text, lead paragraphs */
  xl: 'text-xl',
  
  /** text-2xl: 1.5rem / 24px - Subtitles, H3 headings, card titles */
  '2xl': 'text-2xl',
  
  /** text-3xl: 1.875rem / 30px - Large subtitles, mobile H2 */
  '3xl': 'text-3xl',
  
  /** text-4xl: 2.25rem / 36px - Section headings (mobile), large H2 */
  '4xl': 'text-4xl',
  
  /** text-5xl: 3rem / 48px - Section headings (desktop), mobile H1 */
  '5xl': 'text-5xl',
  
  /** text-6xl: 3.75rem / 60px - Hero titles (tablet) */
  '6xl': 'text-6xl',
  
  /** text-7xl: 4.5rem / 72px - Hero titles (desktop) */
  '7xl': 'text-7xl',
} as const

/**
 * Font weight definitions
 * Maps to Tailwind's font-* utilities
 */
export const fontWeights = {
  /** font-normal: 400 - Regular text */
  normal: 'font-normal',
  
  /** font-medium: 500 - Slightly emphasized text, badges */
  medium: 'font-medium',
  
  /** font-semibold: 600 - Emphasized text, subtitles, buttons */
  semibold: 'font-semibold',
  
  /** font-bold: 700 - Headings, strong emphasis, primary CTAs */
  bold: 'font-bold',
} as const

/**
 * Line height definitions
 * Maps to Tailwind's leading-* utilities
 */
export const lineHeights = {
  /** leading-tight: 1.25 - Headings, compact text */
  tight: 'leading-tight',
  
  /** leading-normal: 1.5 - Default line height */
  normal: 'leading-normal',
  
  /** leading-relaxed: 1.625 - Body text, comfortable reading */
  relaxed: 'leading-relaxed',
} as const

/**
 * Responsive heading patterns
 * Pre-configured responsive text sizes for common heading levels
 */
export const headings = {
  /**
   * H1 - Hero/Page Titles
   * Mobile: 3rem (48px)
   * Tablet: 3.75rem (60px)
   * Desktop: 4.5rem (72px)
   * 
   * @example
   * <h1 className={`${typography.heading.h1} ${typography.weights.bold} ${typography.lineHeights.tight}`}>
   *   Where Ideas Become Startups
   * </h1>
   */
  h1: 'text-5xl sm:text-6xl lg:text-7xl',
  
  /**
   * H2 - Section Headings
   * Mobile: 2.25rem (36px)
   * Desktop: 3rem (48px)
   * 
   * @example
   * <h2 className={`${typography.heading.h2} ${typography.weights.bold}`}>
   *   Live Missions
   * </h2>
   */
  h2: 'text-4xl sm:text-5xl',
  
  /**
   * H3 - Card Titles, Subsections
   * Standard: 1.5rem (24px)
   * Large variant: 1.875rem (30px)
   * 
   * @example
   * <h3 className={`${typography.heading.h3} ${typography.weights.bold}`}>
   *   For Founders
   * </h3>
   */
  h3: 'text-2xl',
  
  /**
   * H3 Large variant
   * Standard: 1.875rem (30px)
   */
  h3Large: 'text-3xl',
} as const

/**
 * Body text patterns
 * Pre-configured text sizes for different body text contexts
 */
export const bodyText = {
  /**
   * Large body text - Hero descriptions, intro text
   * Size: 1.25rem (20px)
   * 
   * @example
   * <p className={`${typography.bodyText.large} ${typography.lineHeights.relaxed}`}>
   *   CrowdStaking is a decentralized venture studio...
   * </p>
   */
  large: 'text-xl',
  
  /**
   * Standard body text - Card content, descriptions
   * Size: 1.125rem (18px)
   * 
   * @example
   * <p className={`${typography.bodyText.standard} ${typography.lineHeights.relaxed}`}>
   *   Standard content text
   * </p>
   */
  standard: 'text-lg',
  
  /**
   * Base body text - Default text size
   * Size: 1rem (16px)
   */
  base: 'text-base',
  
  /**
   * Small text - Labels, captions, metadata
   * Size: 0.875rem (14px)
   * 
   * @example
   * <span className={`${typography.bodyText.small} ${typography.weights.semibold}`}>
   *   The Philosopher
   * </span>
   */
  small: 'text-sm',
} as const

/**
 * Special text styles
 * Common text style combinations
 */
export const textStyles = {
  /**
   * Subtitle style - Emphasized secondary headings
   * 
   * @example
   * <p className={typography.textStyles.subtitle}>
   *   Funded by Talent, Not VCs
   * </p>
   */
  subtitle: 'text-2xl sm:text-3xl font-semibold',
  
  /**
   * Label style - Uppercase labels with tracking
   * 
   * @example
   * <span className={typography.textStyles.label}>
   *   The "Why"
   * </span>
   */
  label: 'text-sm font-semibold uppercase tracking-wide',
  
  /**
   * Badge text style
   */
  badge: 'text-sm font-semibold',
  
  /**
   * Badge small text style
   */
  badgeSmall: 'text-xs font-semibold',
} as const

/**
 * Font family definitions
 * References CSS custom properties from globals.css
 */
export const fontFamilies = {
  /** Geist Sans - Default sans-serif font */
  sans: 'font-sans',
  
  /** Geist Mono - Monospace font for code */
  mono: 'font-mono',
} as const

/**
 * Complete typography configuration
 */
const typography: Typography = {
  sizes: fontSizes,
  weights: fontWeights,
  lineHeights: lineHeights,
  heading: {
    h1: headings.h1,
    h2: headings.h2,
    h3: headings.h3,
  },
}

export default typography

/**
 * Commonly used typography combinations
 * Pre-composed class strings for frequent patterns
 */
export const typographyPresets = {
  /**
   * Hero title - Full responsive H1 with bold weight and tight line height
   */
  heroTitle: `${headings.h1} ${fontWeights.bold} ${lineHeights.tight}`,
  
  /**
   * Section heading - Responsive H2 with bold weight
   */
  sectionHeading: `${headings.h2} ${fontWeights.bold}`,
  
  /**
   * Card title - H3 with bold weight
   */
  cardTitle: `${headings.h3} ${fontWeights.bold}`,
  
  /**
   * Body intro - Large body text with relaxed line height
   */
  bodyIntro: `${bodyText.large} ${lineHeights.relaxed}`,
  
  /**
   * Body standard - Standard body with relaxed line height
   */
  bodyStandard: `${bodyText.standard} ${lineHeights.relaxed}`,
  
  /**
   * Label - Small uppercase label
   */
  label: textStyles.label,
} as const

