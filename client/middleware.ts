import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  isProtectedRoute,
  isGuestOnlyRoute,
  isApiRoute,
  AUTH_ROUTES,
  PROTECTED_ROUTES,
  getLoginRedirectUrl,
} from '@/constants/routes';

/**
 * Authentication Middleware
 * 
 * Handles:
 * - Protected routes: Redirects to login if not authenticated
 * - Guest-only routes: Redirects to dashboard if authenticated
 * - Public routes: Allows access without authentication
 */
export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  
  // Skip middleware for API routes, static files, and Next.js internals
  if (isApiRoute(pathname)) {
    return NextResponse.next();
  }

  // Check for authentication token in cookies
  const accessToken = request.cookies.get('access_token')?.value;
  const isAuthenticated = !!accessToken;

  // Log for debugging (remove in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('🔐 Middleware:', {
      pathname,
      isAuthenticated,
      isProtected: isProtectedRoute(pathname),
      isGuestOnly: isGuestOnlyRoute(pathname),
    });
  }

  // ============================================
  // PROTECTED ROUTES - Require authentication
  // ============================================
  if (isProtectedRoute(pathname) && !isAuthenticated) {
    // Redirect to login with return URL
    const loginUrl = getLoginRedirectUrl(pathname);
    console.log('⚠️  Unauthorized access, redirecting to:', loginUrl);
    return NextResponse.redirect(new URL(loginUrl, request.url));
  }

  // ============================================
  // GUEST-ONLY ROUTES - Redirect if authenticated
  // ============================================
  if (isGuestOnlyRoute(pathname) && isAuthenticated) {
    // Check if there's a return URL
    const returnUrl = searchParams.get('returnUrl');
    const redirectTo = returnUrl && isProtectedRoute(returnUrl) 
      ? returnUrl 
      : PROTECTED_ROUTES.DASHBOARD;
    
    console.log('✅ Already authenticated, redirecting to:', redirectTo);
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  // ============================================
  // PUBLIC ROUTES - Allow access
  // ============================================
  return NextResponse.next();
}

/**
 * Middleware Configuration
 * 
 * Matcher patterns:
 * - Excludes: API routes, static files, Next.js internals
 * - Includes: All other routes for authentication check
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
