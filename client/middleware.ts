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
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 
                   (process.env.NODE_ENV === 'production' 
                     ? `https://api.${request.nextUrl.hostname.replace('www.', '')}`
                     : 'http://localhost:8000');
    
    const verifyUrl = `${apiUrl}/api/v1/auth/verify`;
    
    console.log('[Middleware] Verifying auth with:', verifyUrl);
    
    const cookieHeader = request.headers.get('cookie') || '';
    
    if (!cookieHeader) {
      console.log('[Middleware] No cookies found in request');
      return false;
    }
    
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
  
  if (isApiRoute(pathname)) {
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
