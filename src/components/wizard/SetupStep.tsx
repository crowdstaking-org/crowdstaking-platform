'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, Loader2, AlertTriangle } from 'lucide-react'

interface SetupStepProps {
  data: {
    tokenName: string
    tokenSymbol: string
  }
  onUpdate: (updates: any) => void
  onNext: () => void
  onBack: () => void
}

/**
 * Setup configuration step for wizard
 * Client Component - has radio inputs
 */
export function SetupStep({ data, onUpdate, onNext, onBack }: SetupStepProps) {
  const [symbolStatus, setSymbolStatus] = useState<{
    checking: boolean
    available: boolean | null
    message: string
    severity: 'error' | 'warning' | 'success' | null
  }>({ checking: false, available: null, message: '', severity: null })
  
  // Debounced symbol validation
  useEffect(() => {
    if (!data.tokenSymbol || data.tokenSymbol.length < 2) {
      setSymbolStatus({ checking: false, available: null, message: '', severity: null })
      return
    }
    
    setSymbolStatus(prev => ({ ...prev, checking: true, message: 'Checking availability...' }))
    
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/tokens/validate-symbol?symbol=${data.tokenSymbol}`)
        const result = await response.json()
        
        setSymbolStatus({
          checking: false,
          available: result.available,
          message: result.message || result.reason || result.warning || '',
          severity: result.severity,
        })
      } catch (error) {
        setSymbolStatus({ 
          checking: false, 
          available: null, 
          message: 'Validation temporarily unavailable', 
          severity: null 
        })
      }
    }, 500)
    
    return () => clearTimeout(timer)
  }, [data.tokenSymbol])
  
  const canProceed = 
    data.tokenName.length >= 2 &&
    data.tokenSymbol.length >= 2 &&
    data.tokenSymbol.length <= 10 &&
    symbolStatus.severity !== 'error' &&
    !symbolStatus.checking
  
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 sm:p-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Configure Your Project Token
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          To remove complexity, all projects start with our audited token deployment.
          You don't need to code or design anything yourself - we handle the technical implementation for you.
        </p>

        {/* What We Do For You */}
        <div className="space-y-6 mb-8">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-6 border-2 border-green-200 dark:border-green-700">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Your Project Token - Your Digital "Equity"
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  We'll automatically deploy a secure token contract for your project.
                  This represents 100% ownership and can be distributed to co-founders and contributors.
                </p>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-center space-x-2">
                    <span className="text-green-600 dark:text-green-400">✓</span>
                    <span>Total supply: 1 billion tokens (industry standard)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-green-600 dark:text-green-400">✓</span>
                    <span>98% allocated to you, 2% platform contribution</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-green-600 dark:text-green-400">✓</span>
                    <span>Deployed on Base (low gas fees, high security)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-green-600 dark:text-green-400">✓</span>
                    <span className="font-semibold">No ETH required - we pay all gas fees!</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Token Configuration */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 space-y-4 mt-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Your Project Token:
          </h3>
          
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Token Name
            </label>
            <input
              type="text"
              value={data.tokenName}
              onChange={(e) => onUpdate({ tokenName: e.target.value })}
              placeholder="e.g., CrowdStaking Token"
              className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Full name of your token (e.g., "Bitcoin", "Ethereum")
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Token Symbol (Ticker) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={data.tokenSymbol}
                onChange={(e) => {
                  const cleaned = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
                  onUpdate({ tokenSymbol: cleaned.substring(0, 10) })
                }}
                placeholder="e.g., CSTAKE"
                maxLength={10}
                className={`w-full px-4 py-3 pr-12 bg-white dark:bg-gray-700 border rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 uppercase ${
                  symbolStatus.severity === 'error'
                    ? 'border-red-500 focus:ring-red-500 dark:border-red-400'
                    : symbolStatus.severity === 'success'
                    ? 'border-green-500 focus:ring-green-500 dark:border-green-400'
                    : symbolStatus.severity === 'warning'
                    ? 'border-yellow-500 focus:ring-yellow-500 dark:border-yellow-400'
                    : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400'
                }`}
                required
              />
              
              {/* Status Icon */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {symbolStatus.checking && (
                  <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                )}
                {symbolStatus.severity === 'success' && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                {symbolStatus.severity === 'error' && (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                {symbolStatus.severity === 'warning' && (
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                )}
              </div>
            </div>
            
            {/* Status Message */}
            {symbolStatus.message && (
              <p className={`text-sm mt-2 ${
                symbolStatus.severity === 'error'
                  ? 'text-red-600 dark:text-red-400'
                  : symbolStatus.severity === 'success'
                  ? 'text-green-600 dark:text-green-400'
                  : symbolStatus.severity === 'warning'
                  ? 'text-yellow-600 dark:text-yellow-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                {symbolStatus.message}
              </p>
            )}
            
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              2-10 characters, letters and numbers only (e.g., "BTC", "ETH", "CSTAKE")
            </p>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border-l-4 border-blue-500 dark:border-blue-400">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              💡 <strong>Tip:</strong> Choose a unique, memorable symbol. 
              We'll validate it before deployment.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-8 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onBack}
            className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <button
            onClick={onNext}
            disabled={!canProceed}
            className="inline-flex items-center space-x-2 bg-blue-600 dark:bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-semibold btn-hover-lift btn-primary-glow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Continue to Step 3</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

