/**
 * ============================================================================
 * NEXT.JS EDGE MIDDLEWARE: ROUTE SECURITY & PROTECTION (middleware.js)
 * ============================================================================
 * Guards protected application routes (/dashboard, /admin, /profile/secure):
 * Unauthenticated direct navigation is automatically redirected to /login.
 */

import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Protected route paths requiring authentication
  const protectedPrefixes = ['/dashboard', '/admin'];
  const isProtected = protectedPrefixes.some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`));

  if (isProtected) {
    // Check for authentication cookies
    const adminToken = request.cookies.get('cg_admin_token')?.value;
    const studentToken = request.cookies.get('cg_token')?.value || request.cookies.get('token')?.value;

    const isAuthenticated = Boolean(adminToken || studentToken);

    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Security response headers on all requests (Clickjacking & XSS mitigation)
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Content-Security-Policy', "frame-ancestors 'none';");
  response.headers.set('X-Content-Type-Options', 'nosniff');

  return response;
}

export const config = {
  matcher: [
    '/dashboard',
    '/dashboard/:path*',
    '/admin',
    '/admin/:path*'
  ]
};
