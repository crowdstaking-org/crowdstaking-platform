import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

/**
 * Marketplace Showcase Section - displays live projects
 * Shows real example missions to demonstrate the platform
 */
export function MarketplaceShowcase() {
  const projects = [
    {
      name: 'QueryAI',
      mission:
        'Building an AI-powered B2B SaaS tool to automate 80% of all customer support inquiries via email.',
      seeking: ['Senior Frontend (React)', 'AI/LLM Specialist'],
      offering: 'Up to 8% of $QUERY tokens',
    },
    {
      name: 'Aura Protocol',
      mission:
        'A decentralized, censorship-resistant identity protocol on L2 that enables "Human Proof" without KYC.',
      seeking: ['Solidity Developer', 'Cryptography Expert'],
      offering: 'Up to 12% of $AURA tokens',
    },
    {
      name: 'VectorShift',
      mission:
        'Developing a new Rust-based vector database that is 10x faster than existing solutions for real-time AI applications.',
      seeking: ['Rust Developer', 'Database Architect'],
      offering: 'Up to 10% of $VEC tokens',
    },
  ]

  return (
    <section className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Live Missions
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            This isn&apos;t a test. This is the marketplace. Find a mission that
            inspires you, or post your own.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all card-hover"
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                PROJECT: {project.name}
              </h3>

              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  MISSION:
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  &quot;{project.mission}&quot;
                </p>
              </div>

              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  SEEKING:
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.seeking.map((role, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  OFFERING:
                </p>
                <p className="text-lg font-bold text-green-600 dark:text-green-400">
                  {project.offering}
                </p>
              </div>

              <Link
                href="/discover-projects"
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-semibold"
              >
                <span>View Details</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

