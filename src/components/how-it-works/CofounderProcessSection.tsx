import { Search, MessageSquare, Brain, Handshake } from 'lucide-react'
import { ScrollReveal } from '../ScrollReveal'

/**
 * Co-founder process section with vertical timeline layout
 * Server Component
 */
export function CofounderProcessSection() {
  const steps = [
    {
      icon: Search,
      number: '1',
      title: 'Find Your Mission',
      subtitle: 'Discover & Select',
      description:
        'You browse the "Discover Projects" marketplace. You filter for projects that intellectually challenge you (for Ben) or already have liquid tokens (for Maria).',
    },
    {
      icon: MessageSquare,
      number: '2',
      title: 'Make a Proactive Proposal',
      subtitle: 'The "Permissionless" Proposal',
      description:
        'You don\'t ask for a job. You see a mission and say: "I have an idea. I\'ll build Feature X that advances the mission." You define the scope of your work yourself.',
    },
    {
      icon: Brain,
      number: '3',
      title: 'Receive a Fair Offer',
      subtitle: 'The "AI Mediator" (The Fair Deal)',
      description:
        "This is the core innovation. You don't haggle. An AI, trained on the founder's mission, analyzes your proposal. It provides a neutral, transparent price estimate (e.g., \"This contribution is worth 0.5% of the project\"). This isn't a dictate, but a fair mediation proposal.",
    },
    {
      icon: Handshake,
      number: '4',
      title: 'The "Double Handshake" & Transfer',
      subtitle: 'The "Double Handshake" & Payment',
      description:
        'Both you (the co-founder) and the project owners (the DAO) must agree to the AI proposal. After agreement ("handshake"), you complete the work. Once the owners confirm "work completed", the protocol transfers the agreed token shares (the 0.5%) to your wallet. You are now a co-owner.',
    },
  ]

  return (
    <section
      id="cofounder-process"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800"
    >
      <div className="max-w-4xl mx-auto">
        <ScrollReveal direction="up" duration={700}>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              How You Earn Ownership as a Co-Founder.
            </h2>
          </div>
        </ScrollReveal>

        <div className="relative">
          {/* Vertical Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-purple-200 dark:bg-purple-800 hidden md:block" />

          <div className="space-y-12">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <ScrollReveal
                  key={index}
                  direction="up"
                  delay={index * 100}
                  duration={700}
                >
                  <div className="relative flex flex-col md:flex-row gap-6">
                    {/* Icon Circle */}
                    <div className="flex-shrink-0 relative">
                      <div className="w-16 h-16 bg-purple-600 dark:bg-purple-500 rounded-full flex items-center justify-center shadow-lg z-10 relative">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center shadow-md border-2 border-purple-500 dark:border-purple-400 z-20">
                        <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                          {step.number}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
                      <p className="text-sm text-purple-600 dark:text-purple-400 font-semibold mb-2">
                        {step.subtitle}
                      </p>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        {step.title}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

