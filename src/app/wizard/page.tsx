'use client'

import { useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'

/**
 * Legacy Wizard Route - Redirects to v4 wizard
 * This page exists to handle direct navigation to /wizard
 * and immediately redirects to /wizard/v4
 */
export default function WizardPage() {
  const router = useRouter()
  const pathname = usePathname()
  const hasRedirected = useRef(false)

  useEffect(() => {
    // Only redirect once and only if we're still on /wizard
    if (!hasRedirected.current && pathname === '/wizard') {
      hasRedirected.current = true
      router.replace('/wizard/v4')
    }
  }, [router, pathname])

  // Return null to prevent any rendering
  return null
}


