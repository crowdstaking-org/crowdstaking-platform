import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'

// Layer 1: Reserved symbols (top cryptocurrencies - instant block)
const RESERVED_SYMBOLS = [
  // Major Coins
  'ETH', 'BTC', 'USDC', 'USDT', 'DAI', 'WETH', 'WBTC', 'BUSD',
  // DeFi Blue Chips
  'UNI', 'LINK', 'AAVE', 'COMP', 'MKR', 'SNX', 'CRV', 'SUSHI', 'YFI',
  // Layer 1 / Layer 2
  'MATIC', 'BNB', 'SOL', 'ADA', 'DOT', 'AVAX', 'ATOM', 'OP', 'ARB', 'MATIC',
  // Stablecoins
  'FRAX', 'LUSD', 'TUSD', 'USDD', 'GUSD', 'PAX',
  // Base Ecosystem
  'BASE', 'BALD', 'TOSHI',
  // Other Popular
  'DOGE', 'SHIB', 'PEPE', 'APE', 'LDO', 'SAND', 'MANA', 'AXS',
]

/**
 * GET /api/tokens/validate-symbol?symbol=CSTAKE
 * 
 * Multi-layer token symbol validation:
 * 1. Reserved symbols (instant block)
 * 2. CrowdStaking database (our own tokens)
 * 3. CoinGecko API (top ~14,000 tokens globally)
 * 
 * Returns:
 * - available: boolean
 * - severity: 'error' | 'warning' | 'success'
 * - message/reason: User-friendly explanation
 * - suggestion?: Alternative symbol
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')?.toUpperCase()
    
    // Basic validation
    if (!symbol) {
      return Response.json(
        { available: false, reason: 'Symbol required', severity: 'error' },
        { status: 400 }
      )
    }
    
    if (symbol.length < 2) {
      return Response.json({
        available: false,
        reason: 'Symbol must be at least 2 characters',
        severity: 'error',
      })
    }
    
    if (symbol.length > 10) {
      return Response.json({
        available: false,
        reason: 'Symbol must be maximum 10 characters',
        severity: 'error',
      })
    }
    
    // Layer 1: Check against reserved symbols (instant)
    if (RESERVED_SYMBOLS.includes(symbol)) {
      return Response.json({
        available: false,
        reason: `${symbol} is a well-known cryptocurrency symbol and cannot be used`,
        severity: 'error',
        suggestion: `Try ${symbol}X, ${symbol}2, or ${symbol}TOKEN instead`,
      })
    }
    
    // Layer 2: Check CrowdStaking database (our own tokens)
    const { data: existingProjects, error: dbError } = await supabase
      .from('projects')
      .select('token_symbol, name')
      .eq('token_symbol', symbol)
      .limit(1)
    
    if (dbError) {
      console.error('Database check error:', dbError)
      // Continue with other checks even if DB fails
    }
    
    if (existingProjects && existingProjects.length > 0) {
      return Response.json({
        available: false,
        reason: `${symbol} is already used by "${existingProjects[0].name}" on CrowdStaking`,
        severity: 'error',
      })
    }
    
    // Layer 3: Check CoinGecko (top tokens globally - free API, no key needed!)
    try {
      const coinGeckoResponse = await fetch(
        'https://api.coingecko.com/api/v3/coins/list',
        { 
          next: { revalidate: 86400 }, // Cache for 24 hours
          signal: AbortSignal.timeout(5000), // 5 second timeout
        }
      )
      
      if (coinGeckoResponse.ok) {
        const coins = await coinGeckoResponse.json()
        
        // Search for matching symbol (case-insensitive)
        const match = coins.find((coin: any) => 
          coin.symbol?.toUpperCase() === symbol
        )
        
        if (match) {
          // Symbol exists on CoinGecko but not in our reserved list
          // This is a WARNING, not an error - user can proceed
          return Response.json({
            available: true,
            symbol,
            warning: `⚠️ Symbol ${symbol} is used by "${match.name}" on other blockchains. Your token will be unique via its contract address.`,
            severity: 'warning',
          })
        }
      }
    } catch (error) {
      // CoinGecko check failed - not critical, continue
      console.debug('CoinGecko check skipped:', error)
    }
    
    // All checks passed - symbol is available!
    return Response.json({
      available: true,
      symbol,
      message: `✅ ${symbol} is available!`,
      severity: 'success',
    })
    
  } catch (error: any) {
    console.error('Symbol validation error:', error)
    return Response.json(
      { 
        available: false, 
        reason: 'Validation service temporarily unavailable',
        severity: 'error' 
      },
      { status: 500 }
    )
  }
}

