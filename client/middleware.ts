import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { API_BASE_URL, API_PREFIX } from '@/constants/api.constants';

const isDev = process.env.NODE_ENV === 'development';
const log = (...args: unknown[]) => isDev && console.log('[Middleware]', ...args);

async function verifyAuthFromCookies(request: NextRequest): Promise<boolean> {
  try {
    const accessToken: string | undefined = request.cookies.get('access_token')?.value;
    const refreshToken: string | undefined = request.cookies.get('refresh_token')?.value;
    
    const allCookies = request.cookies.getAll();
    log('[Middleware] All cookies:', allCookies.map(c => ({ name: c.name, hasValue: Boolean(c.value) })));
    
    const isAuthenticated: boolean = Boolean(accessToken || refreshToken);
    
    if (!isAuthenticated) {
      log('[Middleware] No authentication tokens found in cookies');
      return false;
    }
    
    log('[Middleware] Authentication tokens found in cookies', {
      hasAccessToken: Boolean(accessToken),
      hasRefreshToken: Boolean(refreshToken)
    });
    return true;
    
  } catch (error) {
    log('[Middleware] Cookie verification failed:', error);
    return false;
  }
}

async function verifyAuthFromAPI(request: NextRequest): Promise<boolean> {
  try {
    const verifyUrl = `${API_BASE_URL}/${API_PREFIX}/auth/verify`;
    
    log('[Middleware] Attempting API verification:', verifyUrl);
    
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
      log('[Middleware] API verification failed with status:', response.status);
      return false;
    }
    
    const data = await response.json();
    const isAuthenticated = data?.data?.authenticated === true;
    
    log('[Middleware] API verification result:', {
      authenticated: isAuthenticated
    });
    
    return isAuthenticated;
  } catch (error) {
    log('[Middleware] API verification error:', error instanceof Error ? error.message : 'Unknown error');
    return false;
  }
}

export async function middleware(request: NextRequest) {
//   const { pathname, searchParams } = request.nextUrl;
  
//   log('[Middleware] Running for pathname:', pathname);
  
//   if (pathname.startsWith('/api/')) {
//     return NextResponse.next();
//   }

//   const protectedPrefixes = ['/dashboard', '/calendar', '/events', '/profile', '/settings'];
  
//   const guestOnlyRoutes = ['/login', '/register', '/forgot-password'];
  
//   let isAuthenticated = await verifyAuthFromCookies(request);
  
//   if (!isAuthenticated) {
//     log('[Middleware] Cookie auth failed, trying API verification...');
//     isAuthenticated = await verifyAuthFromAPI(request);
//   }
  
//   const requiresAuth = protectedPrefixes.some(
//     (prefix) => pathname === prefix || pathname.startsWith(prefix + '/')
//   );
  
//   if (requiresAuth && !isAuthenticated) {
//     log('[Middleware] Access denied - redirecting to login');
//     const loginUrl = new URL('/login', request.url);
//     loginUrl.searchParams.set('returnUrl', pathname);
//     return NextResponse.redirect(loginUrl);
//   }
  
//   if (guestOnlyRoutes.includes(pathname) && isAuthenticated) {
//     log('[Middleware] Authenticated user accessing guest route - redirecting');
//     const returnUrl = searchParams.get('returnUrl');
//     const redirectTo = returnUrl && protectedPrefixes.some(prefix => 
//       returnUrl === prefix || returnUrl.startsWith(prefix + '/')
//     ) ? returnUrl : '/dashboard';
    
//     return NextResponse.redirect(new URL(redirectTo, request.url));
//   }

//   log('[Middleware] Access granted for:', pathname);
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
