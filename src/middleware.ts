import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware to redirect /wizard to /wizard/v4
 * This prevents the infinite loop issue with client-side redirects
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Redirect /wizard to /wizard/v4 (but only if V4 is enabled)
  if (pathname === '/wizard') {
    const url = request.nextUrl.clone()
    const isV4Enabled = (process.env.ENABLE_V4_PROTOCOL ?? '').toLowerCase() === 'true'
    
    if (isV4Enabled) {
      url.pathname = '/wizard/v4'
    } else {
      url.pathname = '/'
    }
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/wizard'],
}


