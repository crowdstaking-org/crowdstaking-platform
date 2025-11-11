/**
 * CalloutBox Component
 * Highlighted boxes for important information
 * Variants: info, warning, success, tip
 */

'use client'

import { Info, AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react'

type CalloutVariant = 'info' | 'warning' | 'success' | 'tip'

interface CalloutBoxProps {
  variant: CalloutVariant
  children: React.ReactNode
}

const variants = {
  info: {
    icon: Info,
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-900 dark:text-blue-100',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    border: 'border-yellow-200 dark:border-yellow-800',
    text: 'text-yellow-900 dark:text-yellow-100',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
  },
  success: {
    icon: CheckCircle,
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    text: 'text-green-900 dark:text-green-100',
    iconColor: 'text-green-600 dark:text-green-400',
  },
  tip: {
    icon: Lightbulb,
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    border: 'border-purple-200 dark:border-purple-800',
    text: 'text-purple-900 dark:text-purple-100',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
}

export function CalloutBox({ variant, children }: CalloutBoxProps) {
  const config = variants[variant]
  const Icon = config.icon

  return (
    <div
      className={`
        ${config.bg} ${config.border} ${config.text}
        border-l-4 p-4 my-6 rounded-r-lg
      `}
      role="note"
      aria-label={`${variant} callout`}
    >
      <div className="flex gap-3">
        <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1 text-sm leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  )
}

