'use client'

import { ReactNode, useState } from 'react'
import { ConnectWalletModal } from '../modals/ConnectWalletModal'
import { useAuth } from '@/hooks/useAuth'

interface ProtectedButtonProps {
  onClick: () => void
  children: ReactNode
  actionName: string
  className?: string
  disabled?: boolean
}

/**
 * ProtectedButton Component
 * 
 * A wrapper component that protects actions behind wallet authentication.
 * Shows ConnectWalletModal when clicked without auth, executes onClick when authenticated.
 * 
 * @param onClick - Function to execute when authenticated and button is clicked
 * @param children - Button content
 * @param actionName - Name of the action for the modal (e.g., "Create Mission")
 * @param className - Optional CSS classes to apply to the button
 * @param disabled - Optional disabled state
 * 
 * @example
 * <ProtectedButton
 *   onClick={() => setShowDialog(true)}
 *   actionName="Create Mission"
 *   className="bg-blue-600 text-white px-4 py-2"
 * >
 *   Create Mission
 * </ProtectedButton>
 */
export function ProtectedButton({
  onClick,
  children,
  actionName,
  className = '',
  disabled = false,
}: ProtectedButtonProps) {
  const { isAuthenticated } = useAuth()
  const [showModal, setShowModal] = useState(false)

  const handleClick = () => {
    if (isAuthenticated) {
      // User is authenticated, execute the action
      onClick()
    } else {
      // User is not authenticated, show connect wallet modal
      setShowModal(true)
    }
  }

  return (
    <>
      <button
        onClick={handleClick}
        className={className}
        disabled={disabled}
      >
        {children}
      </button>

      <ConnectWalletModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        actionName={actionName}
      />
    </>
  )
}

