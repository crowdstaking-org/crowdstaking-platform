import { FileText, Zap, Globe, Droplets } from 'lucide-react'
import { ScrollReveal } from '../ScrollReveal'

/**
 * Founder process section with vertical timeline layout
 * Server Component
 */
export function FounderProcessSection() {
  const steps = [
    {
      icon: FileText,
      number: '1',
      title: 'Define Your Mission',
      subtitle: 'The "Mission Wizard"',
      description:
        'Instead of a business plan, you define your mission. This is your North Star. Our guided process helps you clearly articulate your vision, goals, and the "definition of done" for contributions.',
    },
    {
      icon: Zap,
      number: '2',
      title: 'We Deploy Your "Digital Company"',
      subtitle: 'The "Founding Magic"',
      description:
        'This is the core. You press a button and the CrowdStaking protocol automatically creates for you: Your project token (e.g., $PROJECT-A) - an ERC-20 token representing ownership in your project. A "Legal Wrapper" - a legal shell (e.g., Wyoming DAO LLC, managed by the Foundation) so you can sign contracts and issue invoices.',
    },
    {
      icon: Globe,
      number: '3',
      title: 'Publish the Mission',
      subtitle: 'The "Go-Live"',
      description:
        'Your mission is now live on the "Discover Projects" page. The CrowdStaking community can see it and submit their first proposals.',
    },
    {
      icon: Droplets,
      number: '4',
      title: 'Provide Liquidity (Optional, but Recommended)',
      subtitle: 'Ignite the "Flywheel"',
      description:
        'To attract top talent (like Maria), you set up an initial liquidity pool on a decentralized exchange (DEX). This gives your project tokens a real market price and makes them "liquid from day 1".',
    },
  ]

  return (
    <section
      id="founder-process"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900"
    >
      <div className="max-w-4xl mx-auto">
        <ScrollReveal direction="up" duration={700}>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              How You Start Your "Machine" as a Founder.
            </h2>
          </div>
        </ScrollReveal>

        <div className="relative">
          {/* Vertical Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-blue-200 dark:bg-blue-800 hidden md:block" />

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
                      <div className="w-16 h-16 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center shadow-lg z-10 relative">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center shadow-md border-2 border-blue-500 dark:border-blue-400 z-20">
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                          {step.number}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold mb-2">
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

