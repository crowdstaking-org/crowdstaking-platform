/**
 * CrowdStaking Design System
 * Central export for all design tokens and utilities
 * 
 * This file provides a single entry point for importing design system tokens
 * throughout the application, ensuring consistency and type safety.
 * 
 * @example
 * // Import all tokens
 * import { colors, typography, spacing, animations } from '@/design'
 * 
 * @example
 * // Import specific exports
 * import { textColors, fontSizes, spacingPresets } from '@/design'
 * 
 * @example
 * // Use in components
 * const MyComponent = () => (
 *   <div className={`${colors.brand.blue[600]} ${typography.heading.h1}`}>
 *     Hello World
 *   </div>
 * )
 */

// ============================================================================
// Color Tokens
// ============================================================================

export { default as colors } from './tokens/colors'
export {
  brandColors,
  semanticColors,
  neutralColors,
  textColors,
  borderColors,
  gradients,
} from './tokens/colors'

// ============================================================================
// Typography Tokens
// ============================================================================

export { default as typography } from './tokens/typography'
export {
  fontSizes,
  fontWeights,
  lineHeights,
  headings,
  bodyText,
  textStyles,
  fontFamilies,
  typographyPresets,
} from './tokens/typography'

// ============================================================================
// Spacing & Layout Tokens
// ============================================================================

export { default as spacing } from './tokens/spacing'
export {
  containers,
  containerPadding,
  sections,
  components,
  marginBottom,
  gaps,
  flexSpacing,
  radius,
  shadows,
  borderWidths,
  spacingPresets,
} from './tokens/spacing'

// ============================================================================
// Animation Utilities
// ============================================================================

export { default as animations } from './utils/animations'
export {
  buttonAnimations,
  cardAnimations,
  iconAnimations,
  miscAnimations,
  animationPresets,
  combineAnimations,
} from './utils/animations'

// ============================================================================
// Type Definitions
// ============================================================================

export type {
  ColorScale,
  SemanticColors,
  BrandColors,
  ColorPalette,
  FontSizes,
  FontWeights,
  LineHeights,
  Typography,
  Containers,
  SectionSpacing,
  ComponentSpacing,
  GridGaps,
  BorderRadius,
  Spacing,
  Animations,
  Shadows,
} from './tokens/types'

// ============================================================================
// Design System Version
// ============================================================================

/**
 * Current design system version
 * Update when making breaking changes to tokens or utilities
 */
export const DESIGN_SYSTEM_VERSION = '1.0.0'

/**
 * Design system metadata
 */
export const designSystemMeta = {
  version: DESIGN_SYSTEM_VERSION,
  name: 'CrowdStaking Design System',
  description: 'Type-safe design tokens for the CrowdStaking platform',
  documentation: '/dev-docs/design-system.md',
} as const

