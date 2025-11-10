/**
 * Toast Notification Utilities
 * 
 * Centralized toast notification helpers for consistent user feedback.
 * Uses react-hot-toast for beautiful, customizable notifications.
 */

import toast from 'react-hot-toast'

/**
 * Show a success toast notification
 * @param message - Success message to display
 * @param duration - Optional duration in milliseconds (default: 4000)
 */
export const showSuccess = (message: string, duration = 4000) => {
  toast.success(message, {
    duration,
    position: 'top-right',
    style: {
      background: '#10B981',
      color: '#fff',
      fontWeight: '500',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#10B981',
    },
  })
}

/**
 * Show an error toast notification
 * @param message - Error message to display
 * @param error - Optional error object for additional context
 * @param duration - Optional duration in milliseconds (default: 6000)
 */
export const showError = (message: string, error?: unknown, duration = 6000) => {
  const errorMessage = error instanceof Error 
    ? `${message}: ${error.message}` 
    : message
  
  toast.error(errorMessage, {
    duration,
    position: 'top-right',
    style: {
      background: '#EF4444',
      color: '#fff',
      fontWeight: '500',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#EF4444',
    },
  })
}

/**
 * Show a loading toast notification
 * Returns toast ID that can be used to dismiss the toast
 * @param message - Loading message to display
 */
export const showLoading = (message: string) => {
  return toast.loading(message, {
    position: 'top-right',
    style: {
      background: '#3B82F6',
      color: '#fff',
      fontWeight: '500',
    },
  })
}

/**
 * Show an info toast notification
 * @param message - Info message to display
 * @param duration - Optional duration in milliseconds (default: 4000)
 */
export const showInfo = (message: string, duration = 4000) => {
  toast(message, {
    duration,
    position: 'top-right',
    icon: 'ℹ️',
    style: {
      background: '#3B82F6',
      color: '#fff',
      fontWeight: '500',
    },
  })
}

/**
 * Show a warning toast notification
 * @param message - Warning message to display
 * @param duration - Optional duration in milliseconds (default: 5000)
 */
export const showWarning = (message: string, duration = 5000) => {
  toast(message, {
    duration,
    position: 'top-right',
    icon: '⚠️',
    style: {
      background: '#F59E0B',
      color: '#fff',
      fontWeight: '500',
    },
  })
}

/**
 * Dismiss a specific toast by ID
 * @param toastId - ID of the toast to dismiss
 */
export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId)
}

/**
 * Dismiss all active toasts
 */
export const dismissAllToasts = () => {
  toast.dismiss()
}

/**
 * Generic toast notification with type parameter
 * @param message - Message to display
 * @param type - Type of toast: 'success', 'error', 'info', 'warning'
 * @param duration - Optional duration in milliseconds
 */
export const showToast = (
  message: string,
  type: 'success' | 'error' | 'info' | 'warning' = 'info',
  duration?: number
) => {
  switch (type) {
    case 'success':
      return showSuccess(message, duration)
    case 'error':
      return showError(message, undefined, duration)
    case 'warning':
      return showWarning(message, duration)
    case 'info':
    default:
      return showInfo(message, duration)
  }
}

/**
 * Show a promise-based toast that updates based on promise state
 * @param promise - Promise to track
 * @param messages - Messages for loading, success, and error states
 */
export const showPromise = <T,>(
  promise: Promise<T>,
  messages: {
    loading: string
    success: string | ((data: T) => string)
    error: string | ((error: Error) => string)
  }
) => {
  return toast.promise(
    promise,
    {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    },
    {
      position: 'top-right',
      style: {
        fontWeight: '500',
      },
    }
  )
}

