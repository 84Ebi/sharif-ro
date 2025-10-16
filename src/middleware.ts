import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED_ROUTES = ['/role', '/customer', '/delivery', '/account']
const AUTH_ROUTES = ['/auth']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = request.cookies.get('session')

  // If user is on the root page, redirect based on session
  if (pathname === '/') {
    return NextResponse.redirect(new URL(session ? '/role' : '/auth', request.url))
  }

  // If user is trying to access an auth page but is already logged in, redirect to /role
  if (session && AUTH_ROUTES.some(p => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL('/role', request.url))
  }

  // If user is trying to access a protected page and is not logged in, redirect to /auth
  if (!session && PROTECTED_ROUTES.some(p => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets in root
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
