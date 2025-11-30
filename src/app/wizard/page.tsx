'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Legacy Wizard Route - Redirects to v4 wizard
 * This page exists to handle direct navigation to /wizard
 * and immediately redirects to /wizard/v4
 */
export default function WizardPage() {
  const router = useRouter()
  const hasRedirected = useRef(false)

  useEffect(() => {
    // Only redirect once
    if (!hasRedirected.current) {
      hasRedirected.current = true
      router.replace('/wizard/v4')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty dependency array - only run once on mount

  // Return null to prevent any rendering
  return null
}
