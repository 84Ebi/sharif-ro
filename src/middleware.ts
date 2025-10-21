/**
 * Middleware for authentication and route protection
 * Validates user sessions and redirects unauthorized users
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const PROTECTED_ROUTES = [
  '/role',
  '/customer',
  '/delivery',
  '/courier',
  '/account',
  '/service',
  '/grocery',
  '/order',
  '/waiting'
];

// Routes only accessible when NOT authenticated
const AUTH_ROUTES = ['/auth'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
  
  // Get session cookie
  const sessionCookie = request.cookies.get(`a_session_${projectId}`);
  const hasSession = !!sessionCookie?.value;

  // Allow root page to handle its own routing logic
  // The page component will check authentication and redirect appropriately
  if (pathname === '/') {
    const response = NextResponse.next();
    // Add security headers
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    return response;
  }

  // Check if route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route));

  // Redirect to auth if trying to access protected route without session
  if (isProtectedRoute && !hasSession) {
    const url = new URL('/auth', request.url);
    // Store the original URL to redirect back after login
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Redirect to role selection if trying to access auth route with active session
  if (isAuthRoute && hasSession) {
    const redirect = request.nextUrl.searchParams.get('redirect');
    const targetUrl = redirect && redirect.startsWith('/') ? redirect : '/role';
    return NextResponse.redirect(new URL(targetUrl, request.url));
  }

  // Allow the request to continue
  const response = NextResponse.next();

  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (images, fonts, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
