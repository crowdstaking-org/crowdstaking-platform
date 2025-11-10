import { ArrowRight } from 'lucide-react'
import { ScrollReveal } from './ScrollReveal'
import { ProjectCard } from './discover-projects/ProjectCard'
import Link from 'next/link'

/**
 * Section showcasing current missions/projects
 * Features a highlighted CrowdStaking project card and secondary example
 */
export function MissionsSection() {
  return (
    <section
      id="missions"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800"
    >
      <div className="max-w-7xl mx-auto">
        <ScrollReveal direction="up" duration={700}>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Live Missions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              These aren't job offers. These are invitations to become a co-founder.
            </p>
          </div>
        </ScrollReveal>

        {/* Ersetzt durch ProjectCard-Komponenten */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 items-stretch">
          
          <ScrollReveal direction="up" scale={true} duration={900} distance={50}>
            <ProjectCard
              projectId="1"
              title="QueryAI"
              mission="Building an AI-powered B2B SaaS tool to automate 80% of all customer support inquiries."
              tags={['SaaS', 'AI', 'B2B']}
              coFounders={5}
              proposals={12}
              tokenStatus="live"
              tokenSymbol="$QUERY"
              featured={true}
            />
          </ScrollReveal>

          <ScrollReveal direction="up" delay={150} scale={true} duration={900} distance={50}>
            <ProjectCard
              projectId="2"
              title="Aura Protocol"
              mission="A decentralized, censorship-resistant identity protocol that enables 'Human Proof' without KYC."
              tags={['Solidity', 'Web3', 'Identity']}
              coFounders={8}
              proposals={22}
              tokenStatus="live"
              tokenSymbol="$AURA"
            />
          </ScrollReveal>

          <ScrollReveal direction="up" delay={300} scale={true} duration={900} distance={50}>
            <ProjectCard
              projectId="3"
              title="VectorShift"
              mission="Developing a Rust-based vector database that is 10x faster for real-time AI applications."
              tags={['Rust', 'Database', 'AI', 'Infra']}
              coFounders={3}
              proposals={7}
              tokenStatus="pending"
            />
          </ScrollReveal>
        </div>

        <ScrollReveal direction="up" delay={400}>
          <div className="text-center">
            <Link
              href="/discover-projects"
              className="group inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-lg link-slide"
            >
              <span>Discover All Missions</span>
              <ArrowRight className="w-5 h-5 icon-slide" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

