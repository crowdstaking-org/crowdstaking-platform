'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, User, Briefcase, Plus } from 'lucide-react'
import type { Project } from '@/types/project'

interface ContextSwitcherProps {
  currentContext: string
  onContextChange: (context: string) => void
  projects?: Project[]
}

/**
 * Context Switcher for Dashboard
 * Allows switching between Cofounder view, Founder projects, or creating new project
 * Client Component - has dropdown state
 */
export function ContextSwitcher({
  currentContext,
  onContextChange,
  projects = [],
}: ContextSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Build dynamic context list from actual projects
  const contexts = [
    {
      id: 'cofounder',
      label: 'As Co-Founder',
      icon: User,
    },
    ...(projects.length > 0
      ? [
          {
            id: 'divider',
            label: '---',
            icon: null as any,
          },
          ...projects.map((project) => ({
            id: `project-${project.id}`,
            label: project.name,
            icon: Briefcase,
          })),
        ]
      : []),
    {
      id: 'new-project',
      label: '+ New Project',
      icon: Plus,
    },
  ]

  const currentLabel =
    contexts.find((c) => c.id === currentContext)?.label ||
    (projects.length > 0 ? projects[0].name : 'Dashboard')

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
      >
        <span className="font-semibold text-gray-900 dark:text-white">
          {currentLabel}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20">
          {contexts.map((context, index) => {
            if (context.id === 'divider') {
              return (
                <div
                  key={index}
                  className="border-t border-gray-200 dark:border-gray-700 my-1"
                />
              )
            }
            const Icon = context.icon
            return (
              <button
                key={context.id}
                onClick={() => {
                  onContextChange(context.id)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                  currentContext === context.id
                    ? 'bg-blue-50 dark:bg-blue-900/20'
                    : ''
                }`}
              >
                {Icon && (
                  <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
                <span
                  className={`text-left ${
                    currentContext === context.id
                      ? 'font-semibold text-blue-600 dark:text-blue-400'
                      : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {context.label}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

