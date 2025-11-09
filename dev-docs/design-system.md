# CrowdStaking Design System

> **Designphilosophie**: "Funded by Talent, Not VCs" - Unser Design kommuniziert Innovation, Fairness und Transparenz. Wir setzen auf klare Hierarchien, mutige Farbakzente und dynamische Animationen, um die Revolution des Venture-Modells visuell zu unterstreichen.

## Inhaltsverzeichnis

1. [Farbpalette](#farbpalette)
2. [Typografie](#typografie)
3. [Spacing & Layout](#spacing--layout)
4. [Component Patterns](#component-patterns)
5. [Animationen](#animationen)
6. [Dark Mode](#dark-mode)

---

## Farbpalette

### Brand Colors

#### Primary Blue
Die primäre Markenfarbe für Founder-CTAs, wichtige Aktionen und Hervorhebungen.

```css
/* Light Shades */
blue-50:  #eff6ff  /* Backgrounds, subtle highlights */
blue-100: #dbeafe  /* Hover states, icon backgrounds */
blue-200: #bfdbfe  /* Borders, dividers */

/* Main Brand Colors */
blue-400: #60a5fa  /* Dark mode primary */
blue-500: #3b82f6  /* Dark mode hover */
blue-600: #2563eb  /* Primary CTA, main brand */
blue-700: #1d4ed8  /* Hover state */

/* Usage Example */
bg-blue-600           /* Primary button background */
text-blue-600         /* Primary text/links */
border-blue-200       /* Card borders with blue accent */
dark:bg-blue-500      /* Dark mode button */
```

#### Secondary Purple
Für Contributor-CTAs, Akzente und sekundäre Aktionen.

```css
/* Light Shades */
purple-50:  #faf5ff  /* Backgrounds */
purple-100: #f3e8ff  /* Icon backgrounds */
purple-200: #e9d5ff  /* Borders */

/* Main Brand Colors */
purple-400: #c084fc  /* Dark mode secondary */
purple-500: #a855f7  /* Dark mode hover */
purple-600: #9333ea  /* Secondary CTA */
purple-700: #7e22ce  /* Hover state */

/* Usage Example */
bg-purple-600         /* Contributor button */
text-purple-600       /* Secondary highlights */
border-purple-200     /* Card borders with purple accent */
```

### Semantic Colors

#### Success Green
Für positive Bestätigungen, Live-Status, Erfolge.

```css
green-50:  #f0fdf4  /* Success backgrounds */
green-100: #dcfce7  /* Success badge backgrounds */
green-400: #4ade80  /* Dark mode success */
green-600: #16a34a  /* Success text, icons */

/* Usage Example */
text-green-600        /* "Token Live" status */
bg-green-50           /* Success card background */
border-green-200      /* Success card border */
```

#### Error Red
Für Fehler, alte Modelle (Old vs New), Warnungen.

```css
red-50:  #fef2f2   /* Error backgrounds */
red-100: #fee2e2   /* Error badge backgrounds */
red-400: #f87171   /* Dark mode errors */
red-600: #dc2626   /* Error text, icons */
red-900: #7f1d1d   /* Dark mode borders */

/* Usage Example */
text-red-600         /* Error messages */
bg-red-50            /* "Old Model" card */
border-red-200       /* Error card border */
```

#### Warning Yellow
Für Pending-Status, Hinweise.

```css
yellow-400: #facc15  /* Dark mode warning */
yellow-600: #ca8a04  /* Warning text, icons */

/* Usage Example */
text-yellow-600      /* "Token Launch Pending" */
```

### Neutral Colors

Für Texte, Hintergründe und strukturelle Elemente.

```css
/* Light Mode */
gray-50:  #f9fafb   /* Subtle backgrounds */
gray-100: #f3f4f6   /* Card backgrounds, section backgrounds */
gray-200: #e5e7eb   /* Borders, dividers */
gray-300: #d1d5db   /* Disabled states */
gray-400: #9ca3af   /* Placeholder text */
gray-600: #4b5563   /* Secondary text */
gray-700: #374151   /* Body text */
gray-900: #111827   /* Headings, primary text */

/* Dark Mode */
gray-700: #374151   /* Dark mode borders */
gray-800: #1f2937   /* Dark mode cards, sections */
gray-900: #111827   /* Dark mode background */

/* Usage Example */
bg-white dark:bg-gray-800        /* Card backgrounds */
text-gray-900 dark:text-white    /* Headings */
text-gray-600 dark:text-gray-300 /* Body text */
border-gray-200 dark:border-gray-700 /* Borders */
```

### Gradients

```css
/* Hero Gradients */
from-blue-50 via-white to-purple-50           /* Light hero */
dark:from-gray-900 dark:via-gray-900 dark:to-gray-800  /* Dark hero */

/* Card Gradients */
from-gray-50 to-white                         /* Subtle card gradient */
from-red-50 to-white                          /* Old model card */
from-green-50 to-white                        /* New model card */

/* Icon Gradients */
from-blue-600 to-purple-600                   /* Brand gradient for icons */
```

---

## Typografie

### Font Family
```css
/* Geist Sans (Standard) */
font-sans: var(--font-geist-sans)

/* Geist Mono (Code) */
font-mono: var(--font-geist-mono)
```

### Hierarchie

#### H1 - Page Title (Hero Sections)
```jsx
<h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
  Where Ideas Become Startups
</h1>
```
- Mobile: `text-5xl` (3rem / 48px)
- Tablet: `text-6xl` (3.75rem / 60px)
- Desktop: `text-7xl` (4.5rem / 72px)
- Weight: `font-bold` (700)
- Line Height: `leading-tight` (1.25)

#### H2 - Section Headings
```jsx
<h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
  Live Missions
</h2>
```
- Mobile: `text-4xl` (2.25rem / 36px)
- Desktop: `text-5xl` (3rem / 48px)
- Weight: `font-bold` (700)
- Margin Bottom: `mb-6` (1.5rem)

#### H3 - Card Titles, Subsections
```jsx
<h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
  For Founders
</h3>
```
- Size: `text-2xl` (1.5rem / 24px)
- Weight: `font-bold` (700)
- Margin Bottom: `mb-4` (1rem)

#### Subtitle / Lead Text
```jsx
<p className="text-2xl sm:text-3xl text-gray-700 dark:text-gray-300 font-semibold">
  Funded by Talent, Not VCs
</p>
```
- Mobile: `text-2xl` (1.5rem / 24px)
- Desktop: `text-3xl` (1.875rem / 30px)
- Weight: `font-semibold` (600)

#### Body Large
```jsx
<p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
  CrowdStaking is a decentralized venture studio...
</p>
```
- Size: `text-xl` (1.25rem / 20px)
- Color: `text-gray-600` / `dark:text-gray-400`
- Line Height: `leading-relaxed` (1.625)

#### Body Standard
```jsx
<p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
  Standard body text for cards and descriptions
</p>
```
- Size: `text-lg` (1.125rem / 18px)
- Color: `text-gray-700` / `dark:text-gray-300`
- Line Height: `leading-relaxed` (1.625)

#### Small Text / Labels
```jsx
<span className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
  The Philosopher (The "Why")
</span>
```
- Size: `text-sm` (0.875rem / 14px)
- Weight: `font-semibold` (600) or `font-medium` (500)
- Transform: `uppercase` (optional)
- Tracking: `tracking-wide` (optional)

---

## Spacing & Layout

### Container Sizes

```css
/* Maximum widths for content */
max-w-4xl    /* 56rem / 896px - Narrow content, CTAs */
max-w-5xl    /* 64rem / 1024px - Medium content, forms */
max-w-7xl    /* 80rem / 1280px - Standard sections */

/* Horizontal padding */
px-4 sm:px-6 lg:px-8   /* Responsive container padding */
```

### Section Spacing

```css
/* Standard sections */
py-20        /* 5rem / 80px - Standard section padding */
py-24        /* 6rem / 96px - Large section padding */
py-32        /* 8rem / 128px - Hero section padding */

/* Between elements */
mb-16        /* 4rem / 64px - Between section header and content */
mb-12        /* 3rem / 48px - Between major groups */
mb-8         /* 2rem / 32px - Between medium groups */
mb-6         /* 1.5rem / 24px - Between small groups */
mb-4         /* 1rem / 16px - Between related items */
```

### Component Spacing

```css
/* Card padding */
p-6          /* 1.5rem / 24px - Standard card */
p-8          /* 2rem / 32px - Large card */
p-12         /* 3rem / 48px - Hero card */

/* Grid gaps */
gap-4        /* 1rem / 16px - Tight grid */
gap-6        /* 1.5rem / 24px - Standard grid */
gap-8        /* 2rem / 32px - Spacious grid */

/* Flex spacing */
space-x-2    /* 0.5rem / 8px - Icon + text */
space-x-3    /* 0.75rem / 12px - Button content */
space-x-4    /* 1rem / 16px - Navigation items */
space-x-8    /* 2rem / 32px - Major nav sections */
```

### Border Radius

```css
rounded-lg   /* 0.5rem / 8px - Buttons, small cards */
rounded-xl   /* 0.75rem / 12px - Standard cards */
rounded-2xl  /* 1rem / 16px - Large cards, hero cards */
rounded-full /* 9999px - Badges, avatar, icon containers */
```

---

## Component Patterns

### 1. Primary Button (CTA)

```jsx
<Link 
  href="/wizard" 
  className="group flex items-center space-x-2 bg-blue-600 dark:bg-blue-500 text-white px-8 py-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-bold btn-hover-lift btn-primary-glow"
>
  <Rocket className="w-5 h-5 icon-slide" />
  <span>Start Your Mission</span>
</Link>
```

**Eigenschaften:**
- Background: `bg-blue-600` (primary) oder `bg-purple-600` (secondary)
- Text: `text-white`, `font-bold` oder `font-semibold`
- Padding: `px-8 py-4` (groß) oder `px-6 py-3` (standard)
- Radius: `rounded-lg`
- Animation: `btn-hover-lift btn-primary-glow`
- Icon: `w-5 h-5 icon-slide`

### 2. Secondary Button

```jsx
<Link 
  href="/discover-projects" 
  className="flex items-center space-x-3 bg-gray-900 dark:bg-gray-700 text-white px-8 py-4 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors font-semibold btn-hover-lift btn-secondary-glow"
>
  <Code className="w-5 h-5 icon-slide" />
  <span>Find Your Mission</span>
</Link>
```

**Eigenschaften:**
- Background: `bg-gray-900` / `dark:bg-gray-700`
- Gleiche Struktur wie Primary Button
- Animation: `btn-hover-lift btn-secondary-glow`

### 3. Card (Standard)

```jsx
<div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border-2 border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all card-hover">
  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
    Card Title
  </h3>
  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
    Card content...
  </p>
</div>
```

**Eigenschaften:**
- Background: `bg-white dark:bg-gray-800`
- Border: `border-2 border-gray-200 dark:border-gray-700`
- Shadow: `shadow-lg hover:shadow-2xl`
- Radius: `rounded-xl` (standard) oder `rounded-2xl` (hero)
- Padding: `p-6` (klein) oder `p-8` (standard)
- Animation: `card-hover`

### 4. Featured Card

```jsx
<div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-xl border-2 border-blue-200 dark:border-blue-700 hover:shadow-2xl transition-all card-hover">
  {/* Content */}
</div>
```

**Unterschied zu Standard Card:**
- Border: Farbig (`border-blue-200` oder `border-purple-200`)
- Shadow: `shadow-xl` (stärker)

### 5. Badge

```jsx
<span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold">
  SaaS
</span>
```

**Eigenschaften:**
- Background: Farbig mit 100/900 Schattierung
- Text: Kontrastfarbe (600/400)
- Radius: `rounded-full`
- Size: `text-sm`
- Weight: `font-semibold` oder `font-medium`

**Badge mit Animation (Featured):**
```jsx
<span className="inline-block bg-purple-600 dark:bg-purple-500 text-white text-xs px-2 py-1 rounded badge-pulse">
  FEATURED
</span>
```

### 6. Icon Container

```jsx
<div className="flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6 mx-auto">
  <Rocket className="w-8 h-8 text-blue-600 dark:text-blue-400" />
</div>
```

**Eigenschaften:**
- Size: `w-12 h-12` (klein), `w-16 h-16` (standard)
- Background: Farbig mit 100/900/30 opacity
- Icon: `w-6 h-6` (klein), `w-8 h-8` (standard)
- Radius: `rounded-full`

### 7. Text Link

```jsx
<Link 
  href="/discover-projects" 
  className="group inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold link-slide"
>
  <span>Discover All Missions</span>
  <ArrowRight className="w-5 h-5 icon-slide" />
</Link>
```

**Eigenschaften:**
- Color: `text-blue-600 dark:text-blue-400`
- Hover: Dunklere Schattierung
- Weight: `font-semibold`
- Animation: `link-slide`
- Icon: `icon-slide`

### 8. Input Field

```jsx
<input
  type="text"
  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
  placeholder="Enter project name..."
/>
```

**Eigenschaften:**
- Border: `border-2 border-gray-300`
- Focus: `focus:ring-2 focus:ring-blue-500`
- Background: `bg-white dark:bg-gray-800`
- Padding: `px-4 py-3`
- Radius: `rounded-lg`

---

## Animationen

Alle Animationen sind in `src/app/globals.css` definiert und über CSS-Klassen verfügbar.

### Button Animations

```css
/* Button Hover Lift */
.btn-hover-lift
/* Hebt Button um 2px beim Hover */

/* Primary Glow */
.btn-primary-glow
/* Blauer Glow-Effekt beim Hover */

/* Secondary Glow */
.btn-secondary-glow
/* Grauer Glow-Effekt beim Hover */

/* Ripple Effect */
.ripple
/* Klick-Ripple-Effekt */
```

**Verwendung:**
```jsx
<button className="bg-blue-600 text-white px-8 py-4 rounded-lg btn-hover-lift btn-primary-glow ripple">
  Click Me
</button>
```

### Card Animations

```css
/* Card Hover */
.card-hover
/* Hebt Card um 4px beim Hover */

/* Card Shadow Grow */
.card-shadow-grow
/* Vergrößert Shadow beim Hover */

/* Card Border Glow */
.card-border-glow
/* Lässt Border blau leuchten beim Hover */
```

**Verwendung:**
```jsx
<div className="bg-white rounded-xl p-8 shadow-lg card-hover card-shadow-grow card-border-glow">
  Card Content
</div>
```

### Icon Animations

```css
/* Icon Slide */
.icon-slide
/* Verschiebt Icon nach rechts beim Parent Hover */
/* Verwendung mit group/group-hover */

/* Icon Bounce */
.icon-bounce
/* Icon springt beim Parent Hover */

/* Icon Rotate */
.icon-rotate
/* Icon rotiert leicht beim Parent Hover */
```

**Verwendung:**
```jsx
<button className="group">
  <span>Click Me</span>
  <ArrowRight className="icon-slide" />
</button>
```

### Sonstige Animations

```css
/* Badge Pulse */
.badge-pulse
/* Pulsiert langsam (für Featured Badges) */

/* Logo Hover */
.logo-hover
/* Vergrößert Logo beim Hover */

/* Nav Link Underline */
.nav-link
/* Animierter Underline bei Navigation Links */

/* Link Slide */
.link-slide
/* Verschiebt Link leicht nach rechts beim Hover */

/* Theme Icon Rotate */
.theme-icon-rotate
/* Rotiert Theme-Icon bei Wechsel */

/* Shimmer Loading */
.shimmer
/* Shimmer-Effekt für Loading States */
```

### Performance & Accessibility

```css
/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  /* Alle Animationen werden minimal oder deaktiviert */
}
```

Alle Animationen respektieren die `prefers-reduced-motion` Einstellung des Browsers für Accessibility.

---

## Dark Mode

### Strategie

Dark Mode wird über die `dark:` Prefix in Tailwind implementiert. Die Klasse `dark` wird auf das `<html>` Element gesetzt und über den `useTheme` Hook verwaltet.

### Activation

```typescript
// via useTheme Hook
const { theme, toggleTheme } = useTheme()

// Aktiviert automatisch .dark Klasse auf <html>
```

### Color Mappings

| Element | Light Mode | Dark Mode |
|---------|-----------|-----------|
| Background | `bg-white` | `dark:bg-gray-900` |
| Card Background | `bg-white` | `dark:bg-gray-800` |
| Primary Text | `text-gray-900` | `dark:text-white` |
| Secondary Text | `text-gray-700` | `dark:text-gray-300` |
| Muted Text | `text-gray-600` | `dark:text-gray-400` |
| Borders | `border-gray-200` | `dark:border-gray-700` |
| Primary Button | `bg-blue-600` | `dark:bg-blue-500` |
| Secondary Button | `bg-gray-900` | `dark:bg-gray-700` |

### Pattern Example

```jsx
<div className="
  bg-white dark:bg-gray-800 
  text-gray-900 dark:text-white 
  border-gray-200 dark:border-gray-700
">
  <h2 className="text-gray-900 dark:text-white">Title</h2>
  <p className="text-gray-700 dark:text-gray-300">Body text</p>
  <span className="text-gray-600 dark:text-gray-400">Small text</span>
</div>
```

### Gradient Dark Mode

```css
/* Hero Gradient */
bg-gradient-to-br from-blue-50 via-white to-purple-50 
dark:from-gray-900 dark:via-gray-900 dark:to-gray-800

/* Card Gradients */
from-gray-50 to-white 
dark:from-gray-800 dark:to-gray-800
```

### Custom Properties

CSS Custom Properties für erweiterte Theming (bereits in globals.css):

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 47.4% 11.2%;
  /* ... weitere Properties */
}

:root[class~="dark"] {
  --background: 224 71% 4%;
  --foreground: 213 31% 91%;
  /* ... weitere Properties */
}
```

---

## Code Examples

### Complete Hero Section Pattern

```jsx
<section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
    <div className="text-center mb-16">
      <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
        Where Ideas Become Startups
      </h1>
      <p className="text-2xl sm:text-3xl text-gray-700 dark:text-gray-300 mb-4 font-semibold">
        Funded by Talent, Not VCs
      </p>
      <p className="text-xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto">
        CrowdStaking is a decentralized venture studio...
      </p>
    </div>
  </div>
</section>
```

### Complete Card Pattern (Project Card)

```jsx
<div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-purple-600 dark:border-purple-500 card-hover card-shadow-grow">
  {/* Header */}
  <div className="flex items-start justify-between mb-4">
    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
      QueryAI
    </h3>
    <span className="inline-block bg-purple-600 dark:bg-purple-500 text-white text-xs px-2 py-1 rounded badge-pulse">
      FEATURED
    </span>
  </div>

  {/* Mission */}
  <p className="text-gray-700 dark:text-gray-300 mb-4 text-lg leading-relaxed">
    "Building an AI-powered B2B SaaS tool..."
  </p>

  {/* Tags */}
  <div className="flex flex-wrap gap-2 mb-6">
    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
      SaaS
    </span>
  </div>

  {/* CTA */}
  <button className="w-full bg-purple-600 dark:bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors font-semibold btn-hover-lift btn-primary-glow">
    View Mission
  </button>
</div>
```

### Complete Section Pattern

```jsx
<section className="py-24 bg-white dark:bg-gray-900">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Section Header */}
    <div className="text-center mb-16">
      <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
        Live Missions
      </h2>
      <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
        These aren't job offers. These are invitations to become a co-founder.
      </p>
    </div>

    {/* Content Grid */}
    <div className="grid md:grid-cols-3 gap-8">
      {/* Card components here */}
    </div>
  </div>
</section>
```

---

## Best Practices

1. **Konsistenz**: Verwende immer die definierten Patterns und Spacing-Werte
2. **Dark Mode**: Füge immer `dark:` Varianten hinzu
3. **Responsive**: Nutze `sm:`, `md:`, `lg:` Breakpoints
4. **Accessibility**: 
   - Nutze semantisches HTML
   - Animationen respektieren `prefers-reduced-motion`
   - Ausreichender Kontrast (WCAG AA)
5. **Performance**: 
   - Nutze Tailwind's JIT-Compiler
   - Vermeide redundante Klassen
   - Nutze `transition-colors` statt `transition-all` wo möglich

---

## Verwendung mit TypeScript

Für type-safe Design Tokens, siehe `src/design/` Ordner:

```typescript
import { colors, typography, spacing } from '@/design'

// Type-safe color access
const primaryBlue = colors.brand.blue[600]

// Type-safe typography
const heading1 = typography.sizes.h1
```

---

## Maintenance

Bei Änderungen am Design System:
1. Aktualisiere diese Dokumentation
2. Aktualisiere die TypeScript Tokens in `src/design/`
3. Prüfe alle Komponenten auf Konsistenz
4. Teste Light & Dark Mode
5. Teste auf verschiedenen Bildschirmgrößen

---

**Letzte Aktualisierung**: November 2025  
**Version**: 1.0.0

