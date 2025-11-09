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
  
  // Calculate USD value
  const usdValue = Number(balance) * price
  const usdValueFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(usdValue)
  
  // Handle manual refresh
  const handleRefresh = () => {
    refetchBalance()
    refetchPrice()
  }
  
  // No wallet connected state
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
  
  // Error state
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
      {/* Header */}
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
          className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors disabled:opacity-50"
          title="Aktualisieren"
        >
          <RefreshCw 
            className={`w-4 h-4 ${(balanceLoading || priceLoading) ? 'animate-spin' : ''}`} 
          />
        </button>
      </div>
      
      {/* Balance */}
      <div className="mb-6">
        <p className="text-sm opacity-90 mb-2">$CSTAKE Balance</p>
        {balanceLoading ? (
          <div className="h-10 bg-white/20 rounded animate-pulse" />
        ) : (
          <p className="text-4xl font-bold tracking-tight">
            {balanceFormatted}
          </p>
        )}
      </div>
      
      {/* Price and Value Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Current Price */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 opacity-75" />
            <p className="text-xs opacity-90">Aktueller Preis</p>
          </div>
          {priceLoading ? (
            <div className="h-6 bg-white/20 rounded animate-pulse" />
          ) : (
            <p className="text-xl font-bold">{formattedPrice}</p>
          )}
        </div>
        
        {/* Total USD Value */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="w-4 h-4 opacity-75" />
            <p className="text-xs opacity-90">Gesamtwert</p>
          </div>
          {balanceLoading || priceLoading ? (
            <div className="h-6 bg-white/20 rounded animate-pulse" />
          ) : (
            <p className="text-xl font-bold">{usdValueFormatted}</p>
          )}
        </div>
      </div>
      
      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-white/20">
        <p className="text-xs opacity-75 text-center">
          Preis aktualisiert alle 60 Sekunden
        </p>
      </div>
    </div>
  )
}

