/**
 * Breadcrumbs Component
 * Shows navigation path with links
 */

'use client'

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

export interface BreadcrumbItem {
  label: string
  href?: string // Optional - if not provided, it's just text (current page)
  icon?: React.ComponentType<{ className?: string }>
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
        const Icon = item.icon

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

