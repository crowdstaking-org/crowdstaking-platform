import { FileText, Shield, Rocket } from 'lucide-react'
import { ScrollReveal } from '../ScrollReveal'

/**
 * Three steps section explaining the mission creation process
 * Server Component with alternating left/right layout
 */
export function ThreeStepsSection() {
  const steps = [
    {
      icon: FileText,
      number: '1',
      title: 'Define the "Mission"',
      headline: 'Describe your vision.',
      description:
        'You don\'t write "job tickets". You define the big goal, the "Mission". What is the vision? What problem are you solving? This is the North Star for all your future co-founders.',
      delay: 0,
    },
    {
      icon: Shield,
      number: '2',
      title: 'The "Legal & Token Wrapper"',
      headline: 'We incorporate your "digital company".',
      description:
        'This is our magic. You click, we generate: A secure token contract (for your project equity). A "Legal Wrapper-as-a-Service" that connects your on-chain DAO with a real legal entity (e.g., Swiss Foundation), so you can issue invoices and sign contracts.',
      delay: 150,
    },
    {
      icon: Rocket,
      number: '3',
      title: 'Launch!',
      headline: 'Invite the world to build with you.',
      description:
        'Your mission is now live. Our community of global top developers (the "Bens" and "Marias") can discover your mission and submit their first proposals to become co-founders.',
      delay: 300,
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal direction="up" duration={700}>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              From Vision to Decentralized Company in 3 Steps.
            </h2>
          </div>
        </ScrollReveal>

        <div className="space-y-12">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isEven = index % 2 === 0
            return (
              <ScrollReveal
                key={index}
                direction={isEven ? 'right' : 'left'}
                delay={step.delay}
                distance={60}
                duration={800}
              >
                <div
                  className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-12`}
                >
                  {/* Icon & Number */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 rounded-2xl flex items-center justify-center shadow-xl">
                        <Icon className="w-16 h-16 text-white" />
                      </div>
                      <div className="absolute -top-3 -right-3 w-12 h-12 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center shadow-lg border-4 border-blue-500 dark:border-blue-400">
                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {step.number}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {step.headline}
                    </h3>
                    <p className="text-lg text-blue-600 dark:text-blue-400 font-semibold mb-4">
                      {step.title}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                      {step.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

