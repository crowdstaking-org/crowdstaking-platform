'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Legacy Wizard Route - Redirects to v4 wizard
 * This page exists to handle direct navigation to /wizard
 * and immediately redirects to /wizard/v4
 */
export default function WizardPage() {
  const router = useRouter()

  useEffect(() => {
    // Immediately redirect to v4 wizard
    router.replace('/wizard/v4')
  }, [router])

  // Return null to prevent any rendering
  return null
}
