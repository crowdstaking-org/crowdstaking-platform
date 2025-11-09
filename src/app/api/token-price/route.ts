/**
 * Token Price API Endpoint
 * Phase 6: Public endpoint to fetch $CSTAKE token price
 * GET /api/token-price
 * 
 * Returns cached price or fetches from Uniswap if cache expired
 * No authentication required (public data)
 */

import { NextResponse } from 'next/server'
import { uniswapPriceService } from '@/lib/price/uniswapService'
import { getCachedPrice, setCachedPrice } from '@/lib/price/cache'

export async function GET() {
  try {
    // Check cache first
    let price = getCachedPrice()
    
    if (price === null) {
      // Cache miss or expired, fetch new price
      console.log('Cache miss, fetching fresh price...')
      price = await uniswapPriceService.getPrice()
      
      // Store in cache for next request
      setCachedPrice(price)
    } else {
      console.log('Cache hit, returning cached price:', price)
    }
    
    // Return successful response
    return NextResponse.json({
      success: true,
      price,
      currency: 'USD',
      timestamp: new Date().toISOString(),
      cached: getCachedPrice() !== null,
    })
    
  } catch (error) {
    console.error('Token price fetch failed:', error)
    
    // Return error response with fallback price
    return NextResponse.json({
      success: false,
      price: 0,
      currency: 'USD',
      error: error instanceof Error ? error.message : 'Failed to fetch price',
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}

// Next.js route segment config
// Revalidate every 60 seconds at the edge
export const revalidate = 60

