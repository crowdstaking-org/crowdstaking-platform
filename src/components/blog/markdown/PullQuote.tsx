/**
 * PullQuote Component
 * Large, centered quote for visual impact
 */

'use client'

interface PullQuoteProps {
  children: React.ReactNode
  author?: string
}

export function PullQuote({ children, author }: PullQuoteProps) {
  return (
    <div className="my-12 px-6 lg:px-12">
      <div className="text-center border-l-4 border-gray-300 dark:border-gray-600 pl-6">
        <div className="text-2xl lg:text-3xl font-serif italic text-gray-800 dark:text-gray-200 leading-relaxed">
          "{children}"
        </div>
        {author && (
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            — {author}
          </div>
        )}
      </div>
    </div>
  )
}

