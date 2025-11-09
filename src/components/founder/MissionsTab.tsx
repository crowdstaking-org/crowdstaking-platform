import React from 'react'
import { Plus } from 'lucide-react'
import Link from 'next/link'

/**
 * Missions Tab for Founder Dashboard
 * Shows table of Mini-Missions with status, proposals count
 * Client Component
 */
export function MissionsTab() {
  const missions = [
    {
      status: 'active',
      title: 'Logo & Brand Identity Design',
      proposals: 1,
      assignedTo: null,
    },
    {
      status: 'draft',
      title: 'Landing Page Development',
      proposals: 0,
      assignedTo: null,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Mini-Missions
        </h2>
        <Link
          href="/create-mini-mission"
          className="inline-flex items-center space-x-2 bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-semibold"
        >
          <Plus className="w-5 h-5" />
          <span>Create New Mini-Mission</span>
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Proposals
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Assigned To
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {missions.map((mission, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 dark:hover:bg-gray-900/50"
              >
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      mission.status === 'active'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                    }`}
                  >
                    {mission.status === 'active' ? 'Active' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                  {mission.title}
                </td>
                <td className="px-6 py-4">
                  {mission.proposals > 0 ? (
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">
                      {mission.proposals} New
                    </span>
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400">0</span>
                  )}
                </td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                  {mission.assignedTo || '-'}
                </td>
                <td className="px-6 py-4">
                  <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold">
                    {mission.status === 'active'
                      ? 'View Details'
                      : 'Edit & Publish'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

