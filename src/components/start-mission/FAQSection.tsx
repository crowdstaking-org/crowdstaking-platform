'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { ScrollReveal } from '../ScrollReveal'

interface FAQItem {
  question: string
  answer: string
}

/**
 * FAQ section with accordion functionality
 * Client Component - uses useState for accordion state
 */
export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs: FAQItem[] = [
    {
      question: 'Tokenomics? Do I have to design all of this myself?',
      answer:
        'No. We provide an audited "Factory Smart Contract". You start with a proven standard distribution that\'s fair for founders, early co-founders, and the community. You can focus on your product.',
    },
    {
      question: 'Is this legally secure? I need to invoice B2B customers!',
      answer:
        'Yes. This is the core of our service. The "Legal-Wrapper-as-a-Service" (based on the "Honest Foundation") is your bridge to the real world. It\'s the "firewall" and gives your digital project a physical address and banking capability.',
    },
    {
      question: 'What does using the platform "cost" me?',
      answer:
        'CrowdStaking takes no fees. Instead, your project automatically contributes 1-2% of its tokens to the CrowdStaking DAO treasury. This isn\'t a "cost item", but your contribution to the infrastructure (AI mediator, legal tech) that makes your success possible in the first place.',
    },
    {
      question: 'What stops someone from stealing my idea?',
      answer:
        'Nothing – just like in the traditional world. But CrowdStaking gives you an unfair advantage: speed. While others are still seeking capital, you can already recruit a global team of top talent working for (liquid!) equity. Your "moat" is the community you build.',
    },
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal direction="up" duration={700}>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Pragmatic Answers to Your Most Important Questions.
            </h2>
          </div>
        </ScrollReveal>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <ScrollReveal
              key={index}
              direction="up"
              delay={index * 100}
              duration={600}
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left group"
                >
                  <span className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'transform rotate-180' : ''}`}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96' : 'max-h-0'}`}
                >
                  <div className="px-6 pb-5 pt-2">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

