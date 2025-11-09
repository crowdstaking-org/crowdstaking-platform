/**
 * TypeScript type definitions for CrowdStaking Design Tokens
 * Ensures type-safety when using design tokens throughout the application
 */

/**
 * Color shade scale from 50 (lightest) to 900 (darkest)
 * Follows Tailwind CSS color naming convention
 */
export interface ColorScale {
  50: string
  100: string
  200: string
  300: string
  400: string
  500: string
  600: string
  700: string
  800: string
  900: string
}

/**
 * Semantic color types for different UI states
 */
export interface SemanticColors {
  success: {
    light: string
    DEFAULT: string
    dark: string
  }
  error: {
    light: string
    DEFAULT: string
    dark: string
  }
  warning: {
    light: string
    DEFAULT: string
    dark: string
  }
}

/**
 * Brand color palette
 * Primary: Blue (Founders)
 * Secondary: Purple (Contributors)
 */
export interface BrandColors {
  blue: ColorScale
  purple: ColorScale
}

/**
 * Complete color palette including brand, semantic, and neutral colors
 */
export interface ColorPalette {
  brand: BrandColors
  semantic: SemanticColors
  neutral: ColorScale
}

/**
 * Font size scale with responsive variants
 */
export interface FontSizes {
  xs: string
  sm: string
  base: string
  lg: string
  xl: string
  '2xl': string
  '3xl': string
  '4xl': string
  '5xl': string
  '6xl': string
  '7xl': string
}

/**
 * Font weight definitions
 */
export interface FontWeights {
  normal: string
  medium: string
  semibold: string
  bold: string
}

/**
 * Line height definitions
 */
export interface LineHeights {
  tight: string
  normal: string
  relaxed: string
}

/**
 * Typography configuration
 */
export interface Typography {
  sizes: FontSizes
  weights: FontWeights
  lineHeights: LineHeights
  heading: {
    h1: string
    h2: string
    h3: string
  }
}

/**
 * Container max-width definitions
 */
export interface Containers {
  sm: string
  md: string
  lg: string
  xl: string
  '2xl': string
  '3xl': string
  '4xl': string
  '5xl': string
  '6xl': string
  '7xl': string
}

/**
 * Section padding definitions
 */
export interface SectionSpacing {
  small: string
  medium: string
  large: string
  hero: string
}

/**
 * Component padding definitions
 */
export interface ComponentSpacing {
  card: {
    small: string
    medium: string
    large: string
  }
  button: {
    small: string
    medium: string
    large: string
  }
}

/**
 * Grid gap definitions
 */
export interface GridGaps {
  tight: string
  normal: string
  relaxed: string
  loose: string
}

/**
 * Border radius definitions
 */
export interface BorderRadius {
  sm: string
  DEFAULT: string
  md: string
  lg: string
  xl: string
  '2xl': string
  full: string
}

/**
 * Complete spacing configuration
 */
export interface Spacing {
  containers: Containers
  sections: SectionSpacing
  components: ComponentSpacing
  gaps: GridGaps
  radius: BorderRadius
}

/**
 * Animation class name types
 */
export interface Animations {
  buttons: {
    hoverLift: string
    primaryGlow: string
    secondaryGlow: string
    ripple: string
  }
  cards: {
    hover: string
    shadowGrow: string
    borderGlow: string
  }
  icons: {
    slide: string
    bounce: string
    rotate: string
  }
  misc: {
    badgePulse: string
    logoHover: string
    navLink: string
    linkSlide: string
    shimmer: string
  }
}

/**
 * Shadow definitions for different elevations
 */
export interface Shadows {
  sm: string
  DEFAULT: string
  md: string
  lg: string
  xl: string
  '2xl': string
}

