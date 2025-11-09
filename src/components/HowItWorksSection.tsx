import { FileText, MessageSquare, Handshake } from 'lucide-react'
import { ScrollReveal } from './ScrollReveal'

/**
 * Section explaining the 3-step process from proposal to co-ownership
 * Uses staggered scroll reveals for sequential emphasis
 */
export function HowItWorksSection() {
  const steps = [
    {
      icon: FileText,
      title: '1. Founder Posts "Mission"',
      description:
        'As a founder (Sarah), you post your vision – not rigid tasks. You define the goal (e.g., "Build the best AI travel tool"), the community delivers the solutions.',
      delay: 0,
    },
    {
      icon: MessageSquare,
      title: '2. Co-Founder Makes Proposal',
      description:
        "As a developer (Ben), you don't 'apply'. You see the mission and proactively propose a solution (e.g., \"I'll build the flight search API for 0.5% of the tokens\").",
      delay: 150,
    },
    {
      icon: Handshake,
      title: '3. The "Double Handshake"',
      description:
        'No haggling. An AI mediator suggests a fair value for the contribution. When founder and co-founder agree, the deal is sealed. After completion, the protocol transfers the tokens.',
      delay: 300,
    },
  ]

  return (
    <section
      id="how-it-works"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900"
    >
      <div className="max-w-6xl mx-auto">
        <ScrollReveal direction="up" duration={700}>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              From Proposal to Co-Owner in 3 Steps.
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <ScrollReveal
                key={index}
                direction="up"
                delay={step.delay}
                scale={true}
                duration={700}
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
                  <div className="flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6 mx-auto">
                    <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 text-center">
                    {step.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 text-center">
                    {step.description}
                  </p>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

