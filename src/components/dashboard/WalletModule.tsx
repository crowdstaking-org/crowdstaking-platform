/**
 * WalletModule Component
 * Phase 6: Displays $CSTAKE balance, token price, and USD value
 * The "aha moment" - showing pioneers their liquid, tradeable ownership
 */

'use client'

import { useActiveAccount } from 'thirdweb/react'
import { useTokenBalance } from '@/hooks/useTokenBalance'
import { useTokenPrice, useFormattedPrice } from '@/hooks/useTokenPrice'
import { Wallet, TrendingUp, DollarSign, RefreshCw } from 'lucide-react'

export function WalletModule() {
  const account = useActiveAccount()
  const { 
    balanceFormatted, 
    balance, 
    isLoading: balanceLoading,
    error: balanceError,
    refetch: refetchBalance 
  } = useTokenBalance()
  
  const { 
    price, 
    isLoading: priceLoading,
    error: priceError,
    refetch: refetchPrice 
  } = useTokenPrice()
  
  const formattedPrice = useFormattedPrice(price)
  
  const usdValue = Number(balance) * price
  const usdValueFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(usdValue)
  
  const handleRefresh = () => {
    refetchBalance()
    refetchPrice()
  }
  
  if (!account) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Wallet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Dein Wallet</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-center py-8">
          Verbinde dein Wallet um dein $CSTAKE Balance zu sehen
        </p>
      </div>
    )
  }
  
  if (balanceError || priceError) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-red-200 dark:border-red-800">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
            <Wallet className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Dein Wallet</h3>
        </div>
        <p className="text-red-600 dark:text-red-400 text-sm mb-3">
          Fehler beim Laden der Wallet-Daten
        </p>
        <button
          onClick={handleRefresh}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          Erneut versuchen
        </button>
      </div>
    )
  }
  
  return (
    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
            <Wallet className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold">Dein Wallet</h3>
        </div>
        <button
          onClick={handleRefresh}
          disabled={balanceLoading || priceLoading}
          className="p-2 rounded-full text-white/70 hover:text-white transition-colors duration-200"
          title="Daten aktualisieren"
        >
          <RefreshCw className={`w-5 h-5 ${balanceLoading || priceLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-white/10 rounded-md backdrop-blur-sm">
          <p className="text-sm text-white/80">Dein Balance</p>
          {balanceLoading ? (
            <div className="h-6 bg-white/20 rounded w-3/4 mx-auto mt-1 animate-pulse"></div>
          ) : (
            <p className="text-xl font-bold mt-1">{balanceFormatted} $CSTAKE</p>
          )}
        </div>

        <div className="p-4 bg-white/10 rounded-md backdrop-blur-sm">
          <p className="text-sm text-white/80">Aktueller Preis</p>
          {priceLoading ? (
            <div className="h-6 bg-white/20 rounded w-3/4 mx-auto mt-1 animate-pulse"></div>
          ) : (
            <p className="text-xl font-bold mt-1 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 mr-1 text-green-300" /> {formattedPrice}
            </p>
          )}
        </div>

        <div className="p-4 bg-white/10 rounded-md backdrop-blur-sm">
          <p className="text-sm text-white/80">USD Wert</p>
          {balanceLoading || priceLoading ? (
            <div className="h-6 bg-white/20 rounded w-3/4 mx-auto mt-1 animate-pulse"></div>
          ) : (
            <p className="text-xl font-bold mt-1 flex items-center justify-center">
              <DollarSign className="h-4 w-4 mr-1 text-yellow-300" /> {usdValueFormatted}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
