import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

async function verifyAuthFromCookies(request: NextRequest): Promise<boolean> {
  try {
    const accessToken: string | undefined = request.cookies.get('access_token')?.value;
    const refreshToken: string | undefined = request.cookies.get('refresh_token')?.value;
    
    const allCookies = request.cookies.getAll();
    console.log('[Middleware] All cookies:', allCookies.map(c => ({ name: c.name, hasValue: Boolean(c.value) })));
    
    const isAuthenticated: boolean = Boolean(accessToken || refreshToken);
    
    if (!isAuthenticated) {
      console.log('[Middleware] No authentication tokens found in cookies');
      return false;
    }
    
    console.log('[Middleware] Authentication tokens found in cookies', {
      hasAccessToken: Boolean(accessToken),
      hasRefreshToken: Boolean(refreshToken),
      accessTokenLength: accessToken?.length || 0,
      refreshTokenLength: refreshToken?.length || 0
    });
    return true;
    
  } catch (error) {
    console.log('[Middleware] Cookie verification failed:', error);
    return false;
  }
}

async function verifyAuthFromAPI(request: NextRequest): Promise<boolean> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const apiPrefix = process.env.NEXT_PUBLIC_API_PREFIX || 'api/v1';
    const verifyUrl = `${apiUrl}/${apiPrefix}/auth/verify`;
    
    console.log('[Middleware] Attempting API verification:', verifyUrl);
    
    const cookieHeader = request.headers.get('cookie') || '';
    
    const response = await fetch(verifyUrl, {
      method: 'GET',
      headers: {
        'Cookie': cookieHeader,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    
    if (!response.ok) {
      console.log('[Middleware] API verification failed with status:', response.status);
      return false;
    }
    
    const data = await response.json();
    const isAuthenticated = data?.data?.authenticated === true;
    
    console.log('[Middleware] API verification result:', {
      authenticated: isAuthenticated,
      user: data?.data?.user?.email || 'unknown'
    });
    
    return isAuthenticated;
  } catch (error) {
    console.log('[Middleware] API verification error:', error instanceof Error ? error.message : 'Unknown error');
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
  
  let isAuthenticated = await verifyAuthFromCookies(request);
  
  if (!isAuthenticated) {
    console.log('[Middleware] Cookie auth failed, trying API verification...');
    isAuthenticated = await verifyAuthFromAPI(request);
  }
  
  const requiresAuth = protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + '/')
  );
  
  if (requiresAuth && !isAuthenticated) {
    console.log('[Middleware] Access denied - redirecting to login');
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('returnUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  if (guestOnlyRoutes.includes(pathname) && isAuthenticated) {
    console.log('[Middleware] Authenticated user accessing guest route - redirecting');
    const returnUrl = searchParams.get('returnUrl');
    const redirectTo = returnUrl && protectedPrefixes.some(prefix => 
      returnUrl === prefix || returnUrl.startsWith(prefix + '/')
    ) ? returnUrl : '/dashboard';
    
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  console.log('[Middleware] Access granted for:', pathname);
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
