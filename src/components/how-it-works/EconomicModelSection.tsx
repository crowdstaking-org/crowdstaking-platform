import { RefreshCw, FileText } from 'lucide-react'
import { ScrollReveal } from '../ScrollReveal'

/**
 * Section explaining the flywheel economic model
 * Server Component
 */
export function EconomicModelSection() {
  const flywheelSteps = [
    {
      number: '1',
      title: 'Traction',
      description: 'Founders come: Sarah launches Project A on CrowdStaking.',
    },
    {
      number: '2',
      title: 'Network Effect',
      description: 'Talent follows: Maria & Ben build for $PROJECT-A tokens.',
    },
    {
      number: '3',
      title: 'The "Index Effect"',
      description:
        'The protocol automatically receives 1-2% of all $PROJECT-A tokens and deposits them in the DAO treasury.',
    },
    {
      number: '4',
      title: 'Acceleration',
      description:
        'The treasury holds stakes in 1,000 startups. The $CSTAKE platform token, which controls this treasury, becomes a "startup index fund".',
    },
    {
      number: '5',
      title: 'Singularity',
      description:
        'The value of $CSTAKE rises, attracting the best pioneers (like Ben) to build the core platform itself... which in turn attracts the best founders (like Sarah). The cycle begins anew.',
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal direction="up" duration={700}>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              The Machine That Drives Itself.
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={100} scale={true} duration={800}>
          <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-10 mb-12 border-2 border-green-200 dark:border-green-800">
            <div className="flex items-center justify-center mb-8">
              <div className="group-hover:rotate-slow">
                <RefreshCw className="w-20 h-20 text-green-600 dark:text-green-400" />
              </div>
            </div>

            <div className="space-y-6">
              {flywheelSteps.map((step, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 bg-white dark:bg-gray-800 rounded-lg p-4"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-green-600 dark:bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{step.number}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      {step.title}
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={200}>
          <div className="text-center">
            <button className="group inline-flex items-center space-x-2 bg-green-600 dark:bg-green-500 text-white px-8 py-4 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors font-semibold text-lg btn-hover-lift btn-primary-glow ripple">
              <FileText className="w-5 h-5 icon-slide" />
              <span>Read the Full Investment Thesis</span>
            </button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

