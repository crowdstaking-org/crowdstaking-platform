import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware to redirect /wizard to /wizard/v4
 * This prevents the infinite loop issue with client-side redirects
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Redirect /wizard to /wizard/v4 (but not /wizard/v4 itself)
  if (pathname === '/wizard') {
    const url = request.nextUrl.clone()
    url.pathname = '/wizard/v4'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/wizard',
}


