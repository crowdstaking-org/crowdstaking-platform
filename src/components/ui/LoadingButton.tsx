/**
 * LoadingButton Component
 * 
 * Button component with built-in loading state handling.
 * Automatically disables and shows spinner when loading.
 */

import React from 'react'
import { Spinner } from './Spinner'

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
  loadingText?: string
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
}

export function LoadingButton({
  isLoading = false,
  loadingText,
  children,
  variant = 'primary',
  className = '',
  disabled,
  ...props
}: LoadingButtonProps) {
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
  }

  return (
    <button
      disabled={isLoading || disabled}
      className={`
        px-6 py-3 rounded-lg font-medium
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        ${variantClasses[variant]}
        ${className}
      `}
      {...props}
    >
      {isLoading && <Spinner size="sm" />}
      {isLoading ? (loadingText || children) : children}
    </button>
  )
}






