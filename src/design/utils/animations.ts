/**
 * CrowdStaking Animation Utilities
 * 
 * All animation classes are defined in src/app/globals.css
 * This file provides type-safe constants for using these animations
 * throughout the application.
 * 
 * Performance Note:
 * All animations respect the user's prefers-reduced-motion preference
 * and are optimized for smooth 60fps performance.
 */

import type { Animations } from '../tokens/types'

/**
 * Button animation classes
 * Applied to button elements for interactive feedback
 */
export const buttonAnimations = {
  /**
   * btn-hover-lift
   * Lifts button 2px on hover, returns on active
   * 
   * @example
   * <button className={`bg-blue-600 ${animations.buttons.hoverLift}`}>
   *   Click Me
   * </button>
   */
  hoverLift: 'btn-hover-lift',
  
  /**
   * btn-primary-glow
   * Blue glow shadow on hover for primary buttons
   * Use with: bg-blue-600 or bg-purple-600
   * 
   * @example
   * <button className={`bg-blue-600 ${animations.buttons.hoverLift} ${animations.buttons.primaryGlow}`}>
   *   Primary CTA
   * </button>
   */
  primaryGlow: 'btn-primary-glow',
  
  /**
   * btn-secondary-glow
   * Gray glow shadow on hover for secondary buttons
   * Use with: bg-gray-900
   * 
   * @example
   * <button className={`bg-gray-900 ${animations.buttons.hoverLift} ${animations.buttons.secondaryGlow}`}>
   *   Secondary CTA
   * </button>
   */
  secondaryGlow: 'btn-secondary-glow',
  
  /**
   * ripple
   * Click ripple effect from center
   * Requires: position: relative on element
   * 
   * @example
   * <button className={`bg-blue-600 ${animations.buttons.ripple}`}>
   *   Click Me
   * </button>
   */
  ripple: 'ripple',
} as const

/**
 * Card animation classes
 * Applied to card containers for hover effects
 */
export const cardAnimations = {
  /**
   * card-hover
   * Lifts card 4px on hover with smooth transition
   * 
   * @example
   * <div className={`bg-white rounded-xl p-8 ${animations.cards.hover}`}>
   *   Card Content
   * </div>
   */
  hover: 'card-hover',
  
  /**
   * card-shadow-grow
   * Increases shadow size on hover
   * 
   * @example
   * <div className={`bg-white rounded-xl shadow-lg ${animations.cards.shadowGrow}`}>
   *   Card Content
   * </div>
   */
  shadowGrow: 'card-shadow-grow',
  
  /**
   * card-border-glow
   * Changes border to blue glow on hover
   * Use with: border-2 border-gray-200
   * 
   * @example
   * <div className={`border-2 border-gray-200 ${animations.cards.borderGlow}`}>
   *   Card Content
   * </div>
   */
  borderGlow: 'card-border-glow',
} as const

/**
 * Icon animation classes
 * Applied to icon elements, typically with parent group
 */
export const iconAnimations = {
  /**
   * icon-slide
   * Slides icon 3px to the right on parent hover
   * Requires: parent element with "group" class
   * 
   * @example
   * <button className="group">
   *   <span>Click Me</span>
   *   <ArrowRight className={animations.icons.slide} />
   * </button>
   */
  slide: 'icon-slide',
  
  /**
   * icon-bounce
   * Bounces icon up 6px on parent hover
   * Requires: parent element with "group" class
   * 
   * @example
   * <button className="group">
   *   <LogIn className={animations.icons.bounce} />
   *   <span>Login</span>
   * </button>
   */
  bounce: 'icon-bounce',
  
  /**
   * icon-rotate
   * Rotates icon 5 degrees on parent hover
   * Requires: parent element with "group" class
   * 
   * @example
   * <button className="group">
   *   <Moon className={animations.icons.rotate} />
   * </button>
   */
  rotate: 'icon-rotate',
} as const

/**
 * Miscellaneous animation classes
 * For special use cases and specific components
 */
export const miscAnimations = {
  /**
   * badge-pulse
   * Slow pulsing animation (scale + opacity)
   * Use for: Featured badges, live indicators
   * 
   * @example
   * <span className={`bg-purple-600 text-white px-2 py-1 rounded ${animations.misc.badgePulse}`}>
   *   FEATURED
   * </span>
   */
  badgePulse: 'badge-pulse',
  
  /**
   * logo-hover
   * Scales logo up 1.05x on hover
   * 
   * @example
   * <div className={animations.misc.logoHover}>
   *   CrowdStaking
   * </div>
   */
  logoHover: 'logo-hover',
  
  /**
   * nav-link
   * Animated underline on hover for navigation links
   * Creates underline from center expanding to full width
   * 
   * @example
   * <Link href="/about" className={animations.misc.navLink}>
   *   About
   * </Link>
   */
  navLink: 'nav-link',
  
  /**
   * link-slide
   * Slides link 2px to the right on hover
   * Use for: Text links with icons
   * 
   * @example
   * <Link href="/discover" className={`group ${animations.misc.linkSlide}`}>
   *   <span>Discover All Missions</span>
   *   <ArrowRight className={animations.icons.slide} />
   * </Link>
   */
  linkSlide: 'link-slide',
  
  /**
   * shimmer
   * Shimmer loading effect (gradient sweep)
   * Use for: Loading states, skeleton screens
   * 
   * @example
   * <div className={`h-20 bg-gray-200 ${animations.misc.shimmer}`} />
   */
  shimmer: 'shimmer',
  
  /**
   * theme-icon-rotate
   * Rotates and fades in theme toggle icon
   * Use for: Theme toggle button transitions
   * 
   * @example
   * <div className={animations.misc.themeIconRotate}>
   *   <Moon className="w-5 h-5" />
   * </div>
   */
  themeIconRotate: 'theme-icon-rotate',
  
  /**
   * flywheel-icon
   * One-time 360° rotation with fade-in on mount
   * Use for: Special icon entrances
   * 
   * @example
   * <div className={animations.misc.flywheelIcon}>
   *   <Icon className="w-8 h-8" />
   * </div>
   */
  flywheelIcon: 'flywheel-icon',
  
  /**
   * logo-float
   * Gentle infinite floating animation
   * Use for: Logos, decorative elements
   * 
   * @example
   * <div className={animations.misc.logoFloat}>
   *   <Logo />
   * </div>
   */
  logoFloat: 'logo-float',
  
  /**
   * rotate-slow
   * Continuous slow 20s rotation
   * Use for: Background decorative elements
   * 
   * @example
   * <div className={animations.misc.rotateSlow}>
   *   <DecorativeCircle />
   * </div>
   */
  rotateSlow: 'rotate-slow',
  
  /**
   * scale-hover
   * Scales element 1.02x on hover
   * Use for: Subtle hover effects
   * 
   * @example
   * <div className={animations.misc.scaleHover}>
   *   Content
   * </div>
   */
  scaleHover: 'scale-hover',
  
  /**
   * glow-on-hover
   * Increases brightness 1.1x on hover
   * Use for: Images, media elements
   * 
   * @example
   * <img className={animations.misc.glowOnHover} src="..." />
   */
  glowOnHover: 'glow-on-hover',
} as const

/**
 * Complete animations configuration
 */
const animations: Animations = {
  buttons: buttonAnimations,
  cards: cardAnimations,
  icons: iconAnimations,
  misc: miscAnimations,
}

export default animations

/**
 * Commonly used animation combinations
 * Pre-composed animation class strings for frequent patterns
 */
export const animationPresets = {
  /**
   * Primary button full animation set
   * Includes: hover lift, primary glow, ripple
   */
  primaryButton: `${buttonAnimations.hoverLift} ${buttonAnimations.primaryGlow} ${buttonAnimations.ripple}`,
  
  /**
   * Secondary button full animation set
   * Includes: hover lift, secondary glow, ripple
   */
  secondaryButton: `${buttonAnimations.hoverLift} ${buttonAnimations.secondaryGlow} ${buttonAnimations.ripple}`,
  
  /**
   * Standard card full animation set
   * Includes: hover, shadow grow, border glow
   */
  standardCard: `${cardAnimations.hover} ${cardAnimations.shadowGrow} ${cardAnimations.borderGlow}`,
  
  /**
   * Simple card hover
   * Just the hover lift effect
   */
  simpleCard: cardAnimations.hover,
  
  /**
   * Button with icon slide
   * For buttons with right-aligned arrow icons
   * Requires: parent "group" class on button
   */
  buttonWithIconSlide: `${buttonAnimations.hoverLift} ${buttonAnimations.primaryGlow}`,
  
  /**
   * Text link with icon
   * For text links with arrow icons
   * Requires: parent "group" class on link element
   */
  textLinkWithIcon: miscAnimations.linkSlide,
} as const

/**
 * Utility function to combine animation classes
 * 
 * @param animations - Array of animation class strings
 * @returns Combined class string
 * 
 * @example
 * const buttonClasses = combineAnimations([
 *   animations.buttons.hoverLift,
 *   animations.buttons.primaryGlow
 * ])
 * // Returns: "btn-hover-lift btn-primary-glow"
 */
export function combineAnimations(...animations: string[]): string {
  return animations.filter(Boolean).join(' ')
}

