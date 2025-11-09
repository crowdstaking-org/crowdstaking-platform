/**
 * CrowdStaking Spacing & Layout Tokens
 * 
 * Defines consistent spacing values for:
 * - Container max-widths
 * - Section padding
 * - Component spacing (cards, buttons)
 * - Grid gaps
 * - Border radius
 * 
 * All values follow Tailwind CSS conventions for consistency
 */

import type { Spacing } from './types'

/**
 * Container max-width definitions
 * Used for constraining content width on large screens
 */
export const containers = {
  /** max-w-sm: 24rem / 384px */
  sm: 'max-w-sm',
  
  /** max-w-md: 28rem / 448px */
  md: 'max-w-md',
  
  /** max-w-lg: 32rem / 512px */
  lg: 'max-w-lg',
  
  /** max-w-xl: 36rem / 576px */
  xl: 'max-w-xl',
  
  /** max-w-2xl: 42rem / 672px */
  '2xl': 'max-w-2xl',
  
  /** max-w-3xl: 48rem / 768px */
  '3xl': 'max-w-3xl',
  
  /**
   * max-w-4xl: 56rem / 896px
   * Usage: Narrow content sections, CTAs, focused content
   */
  '4xl': 'max-w-4xl',
  
  /**
   * max-w-5xl: 64rem / 1024px
   * Usage: Medium content sections, forms, "The Fork" cards
   */
  '5xl': 'max-w-5xl',
  
  /** max-w-6xl: 72rem / 1152px */
  '6xl': 'max-w-6xl',
  
  /**
   * max-w-7xl: 80rem / 1280px
   * Usage: Standard sections, main content areas (most common)
   */
  '7xl': 'max-w-7xl',
} as const

/**
 * Responsive horizontal padding for containers
 * Ensures consistent padding across breakpoints
 */
export const containerPadding = {
  /**
   * Standard responsive container padding
   * Mobile: 1rem (16px)
   * Tablet: 1.5rem (24px)
   * Desktop: 2rem (32px)
   */
  responsive: 'px-4 sm:px-6 lg:px-8',
} as const

/**
 * Section padding (vertical)
 * Used for spacing between major page sections
 */
export const sections = {
  /**
   * py-20: 5rem / 80px
   * Usage: Standard section padding
   */
  small: 'py-20',
  
  /**
   * py-24: 6rem / 96px
   * Usage: Large section padding (most common)
   */
  medium: 'py-24',
  
  /**
   * py-32: 8rem / 128px
   * Usage: Extra large section padding
   */
  large: 'py-32',
  
  /**
   * py-32: 8rem / 128px
   * Usage: Hero section padding
   */
  hero: 'py-32',
} as const

/**
 * Component-specific spacing
 */
export const components = {
  /**
   * Card padding variants
   */
  card: {
    /**
     * p-6: 1.5rem / 24px
     * Usage: Compact cards, list items
     */
    small: 'p-6',
    
    /**
     * p-8: 2rem / 32px
     * Usage: Standard cards (most common)
     */
    medium: 'p-8',
    
    /**
     * p-12: 3rem / 48px
     * Usage: Large featured cards, hero cards
     */
    large: 'p-12',
  },
  
  /**
   * Button padding variants
   */
  button: {
    /**
     * px-4 py-2: 1rem x 0.5rem
     * Usage: Small buttons, compact CTAs
     */
    small: 'px-4 py-2',
    
    /**
     * px-6 py-3: 1.5rem x 0.75rem
     * Usage: Standard buttons
     */
    medium: 'px-6 py-3',
    
    /**
     * px-8 py-4: 2rem x 1rem
     * Usage: Large primary CTAs (most common)
     */
    large: 'px-8 py-4',
  },
} as const

/**
 * Margin bottom spacing for content flow
 * Used to create vertical rhythm between elements
 */
export const marginBottom = {
  /** mb-2: 0.5rem / 8px */
  xs: 'mb-2',
  
  /** mb-4: 1rem / 16px - Between related items */
  sm: 'mb-4',
  
  /** mb-6: 1.5rem / 24px - Between small groups */
  md: 'mb-6',
  
  /** mb-8: 2rem / 32px - Between medium groups */
  lg: 'mb-8',
  
  /** mb-12: 3rem / 48px - Between major groups */
  xl: 'mb-12',
  
  /** mb-16: 4rem / 64px - Between section header and content */
  '2xl': 'mb-16',
} as const

/**
 * Grid gap definitions
 * Used for spacing in grid and flex layouts
 */
export const gaps = {
  /**
   * gap-2: 0.5rem / 8px
   * Usage: Tag lists, tight badge groups
   */
  tight: 'gap-2',
  
  /**
   * gap-4: 1rem / 16px
   * Usage: Standard element spacing, icon + text
   */
  normal: 'gap-4',
  
  /**
   * gap-6: 1.5rem / 24px
   * Usage: Card grids, form fields
   */
  relaxed: 'gap-6',
  
  /**
   * gap-8: 2rem / 32px
   * Usage: Large card grids, spacious layouts (most common)
   */
  loose: 'gap-8',
} as const

/**
 * Flex spacing (space-between items)
 */
export const flexSpacing = {
  /** space-x-2 or space-y-2: 0.5rem / 8px */
  tight: 'space-2',
  
  /** space-x-3 or space-y-3: 0.75rem / 12px - Button icon + text */
  normal: 'space-3',
  
  /** space-x-4 or space-y-4: 1rem / 16px - Navigation items */
  relaxed: 'space-4',
  
  /** space-x-8 or space-y-8: 2rem / 32px - Major nav sections */
  loose: 'space-8',
} as const

/**
 * Border radius definitions
 * Used for rounding corners on UI elements
 */
export const radius = {
  /** rounded-sm: 0.125rem / 2px */
  sm: 'rounded-sm',
  
  /** rounded: 0.25rem / 4px */
  DEFAULT: 'rounded',
  
  /** rounded-md: 0.375rem / 6px */
  md: 'rounded-md',
  
  /**
   * rounded-lg: 0.5rem / 8px
   * Usage: Buttons, small cards, inputs
   */
  lg: 'rounded-lg',
  
  /**
   * rounded-xl: 0.75rem / 12px
   * Usage: Standard cards (most common)
   */
  xl: 'rounded-xl',
  
  /**
   * rounded-2xl: 1rem / 16px
   * Usage: Large cards, hero cards, featured elements
   */
  '2xl': 'rounded-2xl',
  
  /**
   * rounded-full: 9999px
   * Usage: Badges, pills, avatar containers, icon backgrounds
   */
  full: 'rounded-full',
} as const

/**
 * Shadow definitions
 * Used for elevation and depth
 */
export const shadows = {
  /** shadow-sm: Small subtle shadow */
  sm: 'shadow-sm',
  
  /** shadow: Default shadow */
  DEFAULT: 'shadow',
  
  /** shadow-md: Medium shadow */
  md: 'shadow-md',
  
  /**
   * shadow-lg: Large shadow
   * Usage: Standard cards
   */
  lg: 'shadow-lg',
  
  /**
   * shadow-xl: Extra large shadow
   * Usage: Featured cards, hover states
   */
  xl: 'shadow-xl',
  
  /**
   * shadow-2xl: 2x extra large shadow
   * Usage: Card hover states, emphasized elements
   */
  '2xl': 'shadow-2xl',
} as const

/**
 * Border width definitions
 */
export const borderWidths = {
  /** border: 1px */
  DEFAULT: 'border',
  
  /**
   * border-2: 2px
   * Usage: Cards, featured elements (most common)
   */
  '2': 'border-2',
  
  /** border-4: 4px */
  '4': 'border-4',
} as const

/**
 * Complete spacing configuration
 */
const spacing: Spacing = {
  containers: containers,
  sections: sections,
  components: components,
  gaps: gaps,
  radius: radius,
}

export default spacing

/**
 * Commonly used spacing combinations
 * Pre-composed class strings for frequent patterns
 */
export const spacingPresets = {
  /**
   * Standard section wrapper
   * Includes vertical padding and responsive horizontal padding
   */
  section: `${sections.medium} ${containerPadding.responsive}`,
  
  /**
   * Hero section wrapper
   */
  heroSection: `${sections.hero} ${containerPadding.responsive}`,
  
  /**
   * Standard card
   * Includes padding, radius, and shadow
   */
  card: `${components.card.medium} ${radius.xl} ${shadows.lg}`,
  
  /**
   * Large featured card
   */
  cardLarge: `${components.card.large} ${radius['2xl']} ${shadows.xl}`,
  
  /**
   * Primary button
   */
  buttonPrimary: `${components.button.large} ${radius.lg}`,
  
  /**
   * Standard button
   */
  buttonStandard: `${components.button.medium} ${radius.lg}`,
  
  /**
   * Standard content container
   * 7xl max-width with responsive padding
   */
  container: `${containers['7xl']} mx-auto ${containerPadding.responsive}`,
  
  /**
   * Medium content container
   * 5xl max-width with responsive padding
   */
  containerMedium: `${containers['5xl']} mx-auto ${containerPadding.responsive}`,
  
  /**
   * Narrow content container
   * 4xl max-width with responsive padding
   */
  containerNarrow: `${containers['4xl']} mx-auto ${containerPadding.responsive}`,
} as const

