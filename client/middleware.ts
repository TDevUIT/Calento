import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  isProtectedRoute,
  isGuestOnlyRoute,
  isApiRoute,
  PROTECTED_ROUTES,
  getLoginRedirectUrl,
} from '@/constants/routes';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  
  if (isApiRoute(pathname)) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get('access_token')?.value;
  const isAuthenticated = !!accessToken;

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
