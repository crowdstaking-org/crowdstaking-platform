'use client'

import React from 'react'

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

/**
 * ErrorBoundary Component
 * 
 * Catches all React rendering errors and displays a user-friendly error page.
 * In development, shows detailed error information for debugging.
 * In production, shows a clean error page with reload option.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details for debugging
    console.error('Error caught by boundary:', error, errorInfo)
    
    // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
    // Example: Sentry.captureException(error, { extra: errorInfo })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
          <div className="max-w-md w-full text-center">
            {/* Error Icon */}
            <div className="text-6xl mb-4">😞</div>
            
            {/* Error Message */}
            <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
              Etwas ist schiefgelaufen
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Es tut uns leid für die Unannehmlichkeiten. Bitte versuchen Sie, die Seite neu zu laden.
            </p>
            
            {/* Reload Button */}
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              Seite neu laden
            </button>
            
            {/* Development Error Details */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left text-sm text-gray-600 dark:text-gray-400">
                <summary className="cursor-pointer font-medium hover:text-gray-900 dark:hover:text-gray-200">
                  Error Details (Development Only)
                </summary>
                <pre className="mt-2 p-4 bg-red-50 dark:bg-red-900/20 rounded overflow-auto text-xs text-red-600 dark:text-red-400">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}


