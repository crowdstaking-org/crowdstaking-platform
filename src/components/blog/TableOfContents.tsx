/**
 * TableOfContents Component
 * Auto-generates navigation from markdown headings
 * Features:
 * - Extracts H2 and H3 headings from markdown
 * - Sticky sidebar navigation
 * - Highlights active section based on scroll
 * - Smooth scroll to sections
 * - Responsive: Desktop sidebar, Mobile collapsible
 */

'use client'

import { useState, useMemo } from 'react'
import { useActiveHeading } from '@/hooks/useActiveHeading'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface Heading {
  id: string
  title: string
  level: number
}

interface TableOfContentsProps {
  content: string
  className?: string
}

/**
 * Generate URL-safe ID from heading text
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Spaces to hyphens
    .replace(/-+/g, '-') // Collapse multiple hyphens
}

/**
 * Extract headings from markdown content
 */
function extractHeadings(markdown: string): Heading[] {
  const headings: Heading[] = []
  const lines = markdown.split('\n')

  for (const line of lines) {
    // Match ## or ### at start of line
    const match = line.match(/^(#{2,3})\s+(.+)$/)
    if (match) {
      const level = match[1].length
      const title = match[2].trim()
      const id = slugify(title)
      
      headings.push({ id, title, level })
    }
  }

  return headings
}

export function TableOfContents({ content, className = '' }: TableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  // Extract headings from markdown
  const headings = useMemo(() => extractHeadings(content), [content])
  
  // Get active heading ID
  const headingIds = useMemo(() => headings.map((h) => h.id), [headings])
  const activeId = useActiveHeading(headingIds)

  // Don't render if no headings
  if (headings.length === 0) {
    return null
  }

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      // Smooth scroll with offset for header
      const offset = 100
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
    }
    
    // Close mobile menu after click
    setIsOpen(false)
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-20 right-4 z-40 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        aria-label="Toggle table of contents"
      >
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        )}
      </button>

      {/* TOC Content */}
      <nav
        className={`
          ${className}
          fixed lg:relative top-24 lg:top-auto h-fit
          lg:block ${isOpen ? 'block' : 'hidden'}
          bg-white dark:bg-gray-800 lg:bg-transparent
          border border-gray-200 dark:border-gray-700 lg:border-0
          rounded-lg lg:rounded-none
          shadow-xl lg:shadow-none
          p-4 lg:p-0
          right-4 lg:right-auto
          w-72 lg:w-auto
          z-30
          max-h-[70vh] lg:max-h-none overflow-y-auto lg:overflow-visible
        `}
        aria-label="Table of contents"
      >
        <div className="mb-3 pb-3 border-b border-gray-200 dark:border-gray-700 lg:border-b-0">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
            On This Page
          </h2>
        </div>

        <ul className="space-y-2 text-sm">
          {headings.map((heading) => {
            const isActive = activeId === heading.id
            const isH3 = heading.level === 3

            return (
              <li key={heading.id} className={isH3 ? 'ml-4' : ''}>
                <button
                  onClick={() => scrollToHeading(heading.id)}
                  className={`
                    text-left w-full px-2 py-1.5 rounded transition-all
                    ${isActive
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 font-medium'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }
                  `}
                >
                  {heading.title}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    </>
  )
}

