import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

/**
 * POST /api/tokens/deploy-backend
 * 
 * @deprecated This route is no longer used as of 2025-11-12
 * 
 * Token deployment now happens in the frontend using Smart Account + Sponsored Gas.
 * See: src/lib/contracts/deployToken.ts and src/hooks/useLaunchMission.ts
 * 
 * This route is kept for backwards compatibility and symbol validation,
 * but the actual deployment logic has moved to the frontend.
 * 
 * Request Body:
 * {
 *   tokenName: string,
 *   tokenSymbol: string,
 *   projectName: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const userWallet = requireAuth(request)
    const body = await request.json()
    const { tokenName, tokenSymbol, projectName } = body
    
    // Validation
    if (!tokenName || tokenName.length < 2) {
      return Response.json(
        { error: 'Token name must be at least 2 characters' },
        { status: 400 }
      )
    }
    
    if (!tokenSymbol || tokenSymbol.length < 2 || tokenSymbol.length > 10) {
      return Response.json(
        { error: 'Token symbol must be 2-10 characters' },
        { status: 400 }
      )
    }
    
    // Double-check symbol availability (race condition protection)
    const { data: existingProjects } = await supabase
      .from('projects')
      .select('token_symbol, name')
      .eq('token_symbol', tokenSymbol.toUpperCase())
      .limit(1)
    
    if (existingProjects && existingProjects.length > 0) {
      return Response.json(
        { 
          error: `Symbol ${tokenSymbol} is already used by "${existingProjects[0].name}"` 
        },
        { status: 400 }
      )
    }
    
    // Symbol validation passed!
    // Actual token deployment happens in the frontend with Smart Account + Sponsored Gas
    console.log(`\n✅ Validation passed for ${tokenName} (${tokenSymbol})`)
    console.log(`User wallet: ${userWallet}`)
    console.log(`Frontend will deploy token with SPONSORED GAS`)
    
    return Response.json({
      success: true,
      message: 'Validation passed - proceed with frontend deployment',
      tokenSymbol,
    })
    
  } catch (error: any) {
    console.error('\n❌ Backend deployment error:', error)
    
    return Response.json(
      { 
        error: error.message || 'Token deployment failed',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}

