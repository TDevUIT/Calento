import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  isProtectedRoute,
  isGuestOnlyRoute,
  isApiRoute,
  PROTECTED_ROUTES,
  getLoginRedirectUrl,
} from '@/constants/routes';

async function verifyAuthFromServer(request: NextRequest): Promise<boolean> {
  try {
    // Fix API URL for production
    let apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    if (!apiUrl) {
      if (process.env.NODE_ENV === 'production') {
        // For qa.calento.space -> api.calento.space
        const hostname = request.nextUrl.hostname;
        if (hostname.includes('calento.space')) {
          apiUrl = 'https://api.calento.space';
        } else {
          apiUrl = `https://api.${hostname.replace('www.', '').replace('qa.', '')}`;
        }
      } else {
        apiUrl = 'http://localhost:8000';
      }
    }
    
    const verifyUrl = `${apiUrl}/api/v1/auth/verify`;
    
    console.log('[Middleware] Verifying auth with:', verifyUrl);
    console.log('[Middleware] Hostname:', request.nextUrl.hostname);
    console.log('[Middleware] NODE_ENV:', process.env.NODE_ENV);
    console.log('[Middleware] NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
    
    const cookieHeader = request.headers.get('cookie') || '';
    
    if (!cookieHeader) {
      console.log('[Middleware] No cookies found in request');
      return false;
    }
    
    console.log('[Middleware] Cookies found:', cookieHeader.substring(0, 100) + '...');
    
    const response = await fetch(verifyUrl, {
      method: 'GET',
      headers: {
        'Cookie': cookieHeader,
        'Content-Type': 'application/json',
        'User-Agent': request.headers.get('user-agent') || 'Next.js Middleware',
      },
      credentials: 'include',
      cache: 'no-store',
    });

    if (!response.ok) {
      console.log('[Middleware] Auth verification response not OK:', response.status);
      return false;
    }

    const data = await response.json();
    const isAuthenticated = data?.data?.authenticated === true;
    console.log('[Middleware] Auth status:', isAuthenticated);
    
    return isAuthenticated;
  } catch (error) {
    console.error('[Middleware] Auth verification failed:', error);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  
  console.log('[Middleware] Running for pathname:', pathname);
  
  if (isApiRoute(pathname)) {
    console.log('[Middleware] Skipping API route:', pathname);
    return NextResponse.next();
  }

  const isAuthenticated = await verifyAuthFromServer(request);

  if (isProtectedRoute(pathname) && !isAuthenticated) {
    const loginUrl = getLoginRedirectUrl(pathname);
    return NextResponse.redirect(new URL(loginUrl, request.url));
  }

  if (isGuestOnlyRoute(pathname) && isAuthenticated) {
    const returnUrl = searchParams.get('returnUrl');
    const redirectTo = returnUrl && isProtectedRoute(returnUrl) 
      ? returnUrl 
      : PROTECTED_ROUTES.DASHBOARD;
    
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  return NextResponse.next();
}


export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
