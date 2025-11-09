import { Search, MessageSquare, Hammer } from 'lucide-react'
import { ScrollReveal } from '../ScrollReveal'

/**
 * Section explaining the 3-step process to become a co-founder
 * Server Component with 3-column grid layout
 */
export function HowToBecomeCofounder() {
  const steps = [
    {
      icon: Search,
      number: '1',
      title: 'Discover',
      description:
        'Find a mission that intellectually challenges you. Quality projects that push boundaries, not "me-too" clones.',
      delay: 0,
    },
    {
      icon: MessageSquare,
      number: '2',
      title: 'Propose',
      description:
        "Don't \"apply\". Make a proactive proposal for how you'll advance the mission. You're your own boss.",
      delay: 150,
    },
    {
      icon: Hammer,
      number: '3',
      title: 'Build & Earn',
      description:
        'After the "Double Handshake" (fair, AI-mediated agreement), you build. Upon completion, you receive your project tokens. Sell them to pay rent, or HODL them as your "lottery ticket".',
      delay: 300,
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal direction="up" duration={700}>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              How You Become a Co-Founder.
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
                <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm text-center">
                  <div className="relative inline-block mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 dark:from-purple-600 dark:to-blue-700 rounded-full flex items-center justify-center">
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center shadow-lg border-2 border-purple-500 dark:border-purple-400">
                      <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {step.number}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {step.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
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

