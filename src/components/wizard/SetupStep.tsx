'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, Loader2, AlertTriangle } from 'lucide-react'

interface SetupStepProps {
  data: {
    legalWrapper: boolean
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
    data.legalWrapper !== undefined &&
    data.tokenName.length >= 2 &&
    data.tokenSymbol.length >= 2 &&
    data.tokenSymbol.length <= 10 &&
    symbolStatus.severity !== 'error' &&
    !symbolStatus.checking
  
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 sm:p-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          We're Now Incorporating Your "Digital Company".
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          To remove complexity, all projects start with our audited "Factory"
          setup. You don't need to code or design anything yourself. This is our
          "all-inclusive" package.
        </p>

        {/* What We Do For You */}
        <div className="space-y-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            What We Do For You:
          </h3>

          {/* Token */}
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border-2 border-green-200 dark:border-green-700">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Your Project Token (Your "Equity")
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  We deploy a standard token contract for you (e.g.,
                  $PROJECT-A). This represents 100% ownership of your project.
                  We recommend a hard cap of 1 billion tokens, analogous to
                  Bitcoin.
                </p>
              </div>
            </div>
          </div>

          {/* Legal Wrapper */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border-2 border-blue-200 dark:border-blue-700">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  The "Legal-Wrapper-as-a-Service"
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  This is your bridge to the real world. We provide a legal
                  shell (e.g., a Wyoming DAO LLC, managed by our Swiss
                  Foundation) so you can invoice B2B customers and sign
                  contracts.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Your Choice */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Your Only Choice (Important for Sarah):
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Do you want to use the "Legal-Wrapper-as-a-Service"?
          </p>

          <div className="space-y-3">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                checked={data.legalWrapper === true}
                onChange={() =>
                  onUpdate({
                    legalWrapper: true,
                  })
                }
                className="mt-1 w-5 h-5 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="font-semibold text-gray-900 dark:text-white">
                  Yes, please activate.
                </span>
                <span className="text-green-600 dark:text-green-400 ml-2">
                  (Recommended. Required for invoicing and contracts)
                </span>
              </div>
            </label>

            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                checked={data.legalWrapper === false}
                onChange={() =>
                  onUpdate({
                    legalWrapper: false,
                  })
                }
                className="mt-1 w-5 h-5 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="font-semibold text-gray-900 dark:text-white">
                  No, I'm starting as a purely decentralized on-chain protocol.
                </span>
                <span className="text-gray-500 dark:text-gray-400 ml-2">
                  (Only for Web3 pros like "Alex")
                </span>
              </div>
            </label>
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

