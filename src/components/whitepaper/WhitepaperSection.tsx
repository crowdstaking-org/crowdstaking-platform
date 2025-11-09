import { ReactNode } from 'react'
import { ScrollReveal } from '../ScrollReveal'

interface WhitepaperSectionProps {
  number: string
  title: string
  content: ReactNode
}

/**
 * Reusable section component for whitepaper
 * Numbered sections with consistent styling
 */
export function WhitepaperSection({
  number,
  title,
  content,
}: WhitepaperSectionProps) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal direction="up" duration={700}>
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 dark:bg-indigo-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">{number}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white pt-1">
              {title}
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={100} duration={700}>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {content}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

