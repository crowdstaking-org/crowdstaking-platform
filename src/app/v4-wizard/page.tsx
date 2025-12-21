import { Metadata } from 'next'
import { V4WizardClient } from '@/components/wizard/V4WizardClient'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Create v4 Project | CrowdStaking',
  description: 'Set up a decentralized partnership project with Soulbound Tokens and Dividend Vaults.',
}

/**
 * v4 Project Creation Wizard (Server Component Entry Point)
 * Using the Client Component pattern for SSR compatibility
 */
export default function V4WizardPage() {
  return <V4WizardClient />
}
