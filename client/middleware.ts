import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function verifyAuthFromToken(request: NextRequest): boolean {
  try {
    const accessToken: string | undefined = request.cookies.get('access_token')?.value;
    const refreshToken: string | undefined = request.cookies.get('refresh_token')?.value;
    
    const isAuthenticated: boolean = Boolean(accessToken || refreshToken);
    
    if (!isAuthenticated) {
      console.log('[Middleware] No authentication tokens found');
      return false;
    }
    
    console.log('[Middleware] Authentication tokens found', {
      hasAccessToken: Boolean(accessToken),
      hasRefreshToken: Boolean(refreshToken)
    });
    return true;
    
  } catch (error) {
    console.log('[Middleware] Token verification failed:', error);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  
  console.log('[Middleware] Running for pathname:', pathname);
  
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  const protectedPrefixes = ['/dashboard', '/calendar', '/events', '/profile', '/settings'];
  
  const guestOnlyRoutes = ['/login', '/register', '/forgot-password'];
  
  const isAuthenticated = verifyAuthFromToken(request);
  
  const requiresAuth = protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + '/')
  );
  
  if (requiresAuth && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('returnUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  if (guestOnlyRoutes.includes(pathname) && isAuthenticated) {
    const returnUrl = searchParams.get('returnUrl');
    const redirectTo = returnUrl && protectedPrefixes.some(prefix => 
      returnUrl === prefix || returnUrl.startsWith(prefix + '/')
    ) ? returnUrl : '/dashboard';
    
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  return NextResponse.next();
}


export const config = {
  matcher: [
    '/dashboard/:path*',
    '/calendar/:path*', 
    '/events/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/login',
    '/register',
    '/forgot-password'
  ],
};
