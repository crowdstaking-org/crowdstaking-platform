'use client'

import { Users, FileCheck, ArrowRight, CheckCircle, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ProjectCardProps {
  projectId: string
  title: string
  mission: string
  tags: string[]
  coFounders: number
  proposals: number
  tokenStatus: 'live' | 'pending'
  tokenSymbol?: string
  featured?: boolean
}

/**
 * Project card component for marketplace
 * Client Component - displays project information and handles navigation
 */
export function ProjectCard({
  projectId,
  title,
  mission,
  tags,
  coFounders,
  proposals,
  tokenStatus,
  tokenSymbol,
  featured = false,
}: ProjectCardProps) {
  const router = useRouter()

  const handleViewProject = () => {
    // Navigate to public project detail page
    router.push(`/projects/${projectId}`)
  }

  return (
    <div
      onClick={handleViewProject}
      className={`group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 ${featured ? 'border-purple-600 dark:border-purple-500' : 'border-gray-200 dark:border-gray-700'} card-hover card-shadow-grow card-border-glow cursor-pointer transition-transform hover:scale-[1.02] flex flex-col relative overflow-hidden`}
    >
      {/* Featured Badge - Diagonal Corner */}
      {featured && (
        <div className="absolute top-0 right-0 z-10">
          <div className="relative w-32 h-32 overflow-hidden">
            <div className="absolute top-6 -right-10 rotate-45 bg-purple-600 dark:bg-purple-500 text-white text-xs font-bold px-12 py-1 shadow-lg badge-pulse">
              FEATURED
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {title}
          </h3>
        </div>
      </div>

      {/* Mission Statement - Fixed to exactly 2 lines */}
      <p className="text-gray-700 dark:text-gray-300 mb-4 text-lg leading-relaxed line-clamp-2 min-h-[3.625rem]">
        "{mission}"
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Co-Founders
            </p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {coFounders}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <FileCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Proposals
            </p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {proposals}
            </p>
          </div>
        </div>
      </div>

      {/* Liquidity Status */}
      <div className="mb-6 flex-grow">
        <div className="flex items-center space-x-2">
          {tokenStatus === 'live' ? (
            <>
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                Token Live {tokenSymbol && `(${tokenSymbol})`}
              </span>
            </>
          ) : (
            <>
              <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                Token Launch After Next Mission
              </span>
            </>
          )}
        </div>
      </div>

      {/* CTA */}
      <button 
        onClick={(e) => {
          e.stopPropagation()
          handleViewProject()
        }}
        className="w-full bg-purple-600 dark:bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors font-semibold flex items-center justify-center space-x-2 btn-hover-lift btn-primary-glow group cursor-pointer mt-auto"
      >
        <span>View Mission</span>
        <ArrowRight className="w-4 h-4 icon-slide" />
      </button>
    </div>
  )
}

