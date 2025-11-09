'use client'

/**
 * Markdown Editor Component
 * Simple markdown editor with tabs for editing and preview
 * 
 * Features:
 * - Textarea for markdown input
 * - Live character counter
 * - Preview tab with rendered markdown
 * - Auto-resize textarea
 */

import { useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  maxLength?: number
  minRows?: number
  error?: string
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Write here...',
  maxLength = 5000,
  minRows = 6,
  error,
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write')
  const remaining = maxLength - value.length

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
        <button
          type="button"
          onClick={() => setActiveTab('write')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'write'
              ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          ✏️ Write
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'preview'
              ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          👁️ Preview
        </button>
      </div>

      {/* Content */}
      <div className="p-4 bg-white dark:bg-gray-700">
        {activeTab === 'write' ? (
          <TextareaAutosize
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
            minRows={minRows}
            className="w-full resize-none focus:outline-none dark:bg-gray-700 dark:text-white"
          />
        ) : (
          <div className="prose dark:prose-invert max-w-none min-h-[150px]">
            {value ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {value}
              </ReactMarkdown>
            ) : (
              <p className="text-gray-400 dark:text-gray-500 italic">
                Nothing to preview yet. Start writing to see the preview.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Footer with character counter */}
      <div className="flex justify-between items-center px-4 py-2 bg-gray-50 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-600">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          💡 Supports <strong>bold</strong>, <em>italic</em>, lists, and links
        </div>
        <div className={`text-sm ${remaining < 100 ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
          {remaining} characters remaining
        </div>
      </div>

      {error && (
        <div className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}
    </div>
  )
}

