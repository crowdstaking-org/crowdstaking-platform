/**
 * TldrBox Component
 * Summary box at article start with key points
 */

'use client'

import { Zap } from 'lucide-react'

interface TldrBoxProps {
  children: React.ReactNode
}

export function TldrBox({ children }: TldrBoxProps) {
  return (
    <div className="my-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <div className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wide">
          TL;DR
        </div>
      </div>
      <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
        {children}
      </div>
    </div>
  )
}

