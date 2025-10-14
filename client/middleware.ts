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
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const verifyUrl = `${apiUrl}/auth/verify`;
    
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
      return false;
    }

    const data = await response.json();
    return data?.data?.authenticated === true;
  } catch (error) {
    console.error('Auth verification failed:', error);
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
