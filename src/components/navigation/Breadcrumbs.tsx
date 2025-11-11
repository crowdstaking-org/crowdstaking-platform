/**
 * Breadcrumbs Component
 * Shows navigation path with links
 */

'use client'

import Link from 'next/link'
import { 
  ChevronRight, 
  Home, 
  FolderOpen, 
  Rocket, 
  Users, 
  Briefcase, 
  Settings, 
  FileText,
  Target,
  Sparkles,
  User,
  Newspaper,
  Trophy
} from 'lucide-react'

// Map of icon names to Lucide components
const iconMap = {
  'folder-open': FolderOpen,
  'rocket': Rocket,
  'users': Users,
  'briefcase': Briefcase,
  'settings': Settings,
  'file-text': FileText,
  'target': Target,
  'sparkles': Sparkles,
  'user': User,
  'newspaper': Newspaper,
  'trophy': Trophy,
} as const

export type IconName = keyof typeof iconMap

export interface BreadcrumbItem {
  label: string
  href?: string // Optional - if not provided, it's just text (current page)
  icon?: IconName // Icon name as string instead of component
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Breadcrumb">
      {/* Home Icon */}
      <Link
        href="/"
        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        title="Home"
      >
        <Home className="w-4 h-4" />
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1
        const Icon = item.icon ? iconMap[item.icon] : null

        return (
          <div key={index} className="flex items-center space-x-2">
            {/* Separator */}
            <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />

            {/* Breadcrumb Item */}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span>{item.label}</span>
              </Link>
            ) : (
              <span className="flex items-center gap-1.5 text-gray-900 dark:text-white font-medium">
                {Icon && <Icon className="w-4 h-4" />}
                <span>{item.label}</span>
              </span>
            )}
          </div>
        )
      })}
    </nav>
  )
}

