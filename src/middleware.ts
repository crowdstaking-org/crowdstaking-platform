import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware to handle legacy /wizard redirects and v4 conditions
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isV4Enabled = (process.env.ENABLE_V4_PROTOCOL ?? '').toLowerCase() === 'true'

  // 1. Redirect legacy /wizard to /v4-wizard
  if (pathname === '/wizard') {
    const url = request.nextUrl.clone()
    url.pathname = isV4Enabled ? '/v4-wizard' : '/'
    return NextResponse.redirect(url)
  }

  // 2. Protect /v4-wizard if disabled
  if (pathname === '/v4-wizard' && !isV4Enabled) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/wizard', '/v4-wizard'],
}


