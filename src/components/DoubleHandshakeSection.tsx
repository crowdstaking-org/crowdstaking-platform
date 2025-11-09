import { Lightbulb, FileText, Bot, Handshake } from 'lucide-react'

/**
 * Double Handshake Section - explains the core process
 * 4-step flow: Mission → Proposal → AI Mediation → Double Handshake
 */
export function DoubleHandshakeSection() {
  const steps = [
    {
      icon: Lightbulb,
      number: 1,
      title: 'The Mission',
      description:
        'A founder (owner) posts their vision and project goals (e.g., "We\'re building the best AI travel tool").',
    },
    {
      icon: FileText,
      number: 2,
      title: 'The Proposal',
      description:
        'A contributor (e.g., a developer) has their own idea to advance the project (e.g., "I\'ll build Feature X that finds flights 30% cheaper").',
    },
    {
      icon: Bot,
      number: 3,
      title: 'AI Mediation',
      description:
        'The AI analyzes the proposal and suggests a fair share: "Based on complexity and impact on the mission, we suggest 0.5% of project tokens".',
    },
    {
      icon: Handshake,
      number: 4,
      title: 'The "Double Handshake"',
      description:
        'Founder and contributor both agree. The work is completed. The protocol transfers the 0.5% tokens. The contributor is now a co-owner.',
    },
  ]

  return (
    <section className="py-24 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            The &quot;Double Handshake&quot;
          </h2>
          <p className="text-2xl text-gray-700 dark:text-gray-300 mb-4 font-semibold">
            How an Idea Becomes Fair Ownership
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-4xl mx-auto">
            No salary negotiations. No unfair &quot;bounty&quot; prices. Our process is
            transparent, fair, and supported by a neutral AI mediator that
            objectively assesses the value of creative work.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="relative">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 h-full">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-4 mx-auto">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-center mb-4">
                    <span className="text-4xl font-bold text-gray-300 dark:text-gray-700">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 text-center">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <div className="w-8 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

