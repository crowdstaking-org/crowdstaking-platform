'use client'

import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import type { Project } from '@/types/project'

interface TokenomicsTabProps {
  project: Project | null
}

/**
 * Tokenomics Tab for Founder Dashboard
 * Shows token distribution with pie chart
 * Client Component - uses recharts
 */
export function TokenomicsTab({ project }: TokenomicsTabProps) {
  // TODO: Calculate actual distribution from VestingContract
  const data = [
    {
      name: 'Founder',
      value: 100,
      color: '#3B82F6',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Total Supply
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {project?.total_supply.toLocaleString() || '1,000,000,000'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            ${project?.token_symbol || 'TOKEN'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Token Status
          </p>
          {project?.token_status === 'live' ? (
            <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-sm font-semibold">
              Live
            </span>
          ) : project?.token_status === 'pending' ? (
            <span className="inline-block px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full text-sm font-semibold">
              Pending
            </span>
          ) : (
            <span className="inline-block px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-sm font-semibold">
              Illiquid
            </span>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Distributed (Community)
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">0%</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Available for Founder (You)
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            100%
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Token Distribution
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border-l-4 border-blue-600 dark:border-blue-400">
        <h4 className="font-bold text-gray-900 dark:text-white mb-2">
          Treasury
        </h4>
        <p className="text-gray-700 dark:text-gray-300">
          The protocol charges a 1-2% fee (in project tokens) for using the
          platform infrastructure. This becomes due when setting up the "Legal
          Wrapper".
        </p>
      </div>
    </div>
  )
}

