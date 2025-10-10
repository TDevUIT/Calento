/**
 * Application Routes Configuration
 * Centralized route management for the application
 */

// ============================================
// PUBLIC ROUTES (No authentication required)
// ============================================
export const PUBLIC_ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  PRICING: '/pricing',
  FEATURES: '/features',
} as const;

// ============================================
// AUTH ROUTES (Guest only - redirects if authenticated)
// ============================================
export const AUTH_ROUTES = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_EMAIL: '/auth/verify-email',
} as const;

// ============================================
// PROTECTED ROUTES (Authentication required)
// ============================================
export const PROTECTED_ROUTES = {
  DASHBOARD: '/dashboard',
  
  // Events
  EVENTS: '/events',
  EVENT_CREATE: '/events/create',
  EVENT_DETAIL: (id: string) => `/events/${id}`,
  EVENT_EDIT: (id: string) => `/events/${id}/edit`,
  
  // Calendar
  CALENDAR: '/calendar',
  
  // Settings
  SETTINGS: '/settings',
  SETTINGS_PROFILE: '/settings/profile',
  SETTINGS_ACCOUNT: '/settings/account',
  SETTINGS_INTEGRATIONS: '/settings/integrations',
  SETTINGS_NOTIFICATIONS: '/settings/notifications',
  SETTINGS_SECURITY: '/settings/security',
  
  // Integrations
  INTEGRATIONS: '/integrations',
  GOOGLE_CALLBACK: '/integrations/google/callback',
  
  // Admin (if needed)
  ADMIN: '/admin',
} as const;

// ============================================
// API ROUTES
// ============================================
export const API_ROUTES = {
  // Auth
  AUTH_LOGIN: '/api/auth/login',
  AUTH_REGISTER: '/api/auth/register',
  AUTH_LOGOUT: '/api/auth/logout',
  AUTH_REFRESH: '/api/auth/refresh',
  AUTH_ME: '/api/auth/me',
  
  // Events
  EVENTS: '/api/events',
  EVENT_DETAIL: (id: string) => `/api/events/${id}`,
  
  // Calendar
  CALENDAR_SYNC: '/api/calendar/sync',
  
  // Google
  GOOGLE_AUTH: '/api/google/auth',
  GOOGLE_CALENDARS: '/api/google/calendars',
} as const;

// ============================================
// ROUTE PATTERNS (for middleware matching)
// ============================================

/**
 * Routes that don't require authentication
 */
export const PUBLIC_ROUTE_PATTERNS = [
  '/',
  '/about',
  '/contact',
  '/pricing',
  '/features',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-email',
] as const;

/**
 * Routes that require authentication
 * Use patterns for dynamic routes
 */
export const PROTECTED_ROUTE_PATTERNS = [
  '/dashboard',
  '/events',
  '/calendar',
  '/settings',
  '/integrations',
  '/admin',
] as const;

/**
 * Auth routes that should redirect to dashboard if already authenticated
 */
export const GUEST_ONLY_ROUTE_PATTERNS = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
] as const;

/**
 * API routes that should be excluded from middleware redirect
 */
export const API_ROUTE_PATTERNS = [
  '/api',
  '/_next',
  '/static',
] as const;

// ============================================
// REDIRECT ROUTES
// ============================================

/**
 * Default redirect after login
 */
export const DEFAULT_LOGIN_REDIRECT = PROTECTED_ROUTES.DASHBOARD;

/**
 * Default redirect after logout
 */
export const DEFAULT_LOGOUT_REDIRECT = AUTH_ROUTES.LOGIN;

/**
 * Default redirect for unauthenticated users
 */
export const DEFAULT_UNAUTHENTICATED_REDIRECT = AUTH_ROUTES.LOGIN;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Check if a route is public (doesn't require auth)
 */
export const isPublicRoute = (pathname: string): boolean => {
  return PUBLIC_ROUTE_PATTERNS.some(pattern => 
    pathname === pattern || pathname.startsWith(pattern)
  );
};

/**
 * Check if a route is protected (requires auth)
 */
export const isProtectedRoute = (pathname: string): boolean => {
  return PROTECTED_ROUTE_PATTERNS.some(pattern => 
    pathname.startsWith(pattern)
  );
};

/**
 * Check if a route is guest only (redirects if authenticated)
 */
export const isGuestOnlyRoute = (pathname: string): boolean => {
  return GUEST_ONLY_ROUTE_PATTERNS.some(pattern => 
    pathname === pattern || pathname.startsWith(pattern)
  );
};

/**
 * Check if a route is an API route
 */
export const isApiRoute = (pathname: string): boolean => {
  return API_ROUTE_PATTERNS.some(pattern => 
    pathname.startsWith(pattern)
  );
};

/**
 * Get return URL for login redirect
 */
export const getLoginRedirectUrl = (returnUrl?: string): string => {
  if (!returnUrl || returnUrl === '/') {
    return AUTH_ROUTES.LOGIN;
  }
  return `${AUTH_ROUTES.LOGIN}?returnUrl=${encodeURIComponent(returnUrl)}`;
};

/**
 * Extract return URL from query params
 */
export const extractReturnUrl = (searchParams: URLSearchParams): string => {
  const returnUrl = searchParams.get('returnUrl');
  if (returnUrl && isProtectedRoute(returnUrl)) {
    return returnUrl;
  }
  return DEFAULT_LOGIN_REDIRECT;
};

// ============================================
// TYPE EXPORTS
// ============================================

export type PublicRoute = typeof PUBLIC_ROUTES[keyof typeof PUBLIC_ROUTES];
export type AuthRoute = typeof AUTH_ROUTES[keyof typeof AUTH_ROUTES];
export type ProtectedRoute = typeof PROTECTED_ROUTES[keyof typeof PROTECTED_ROUTES];
export type ApiRoute = typeof API_ROUTES[keyof typeof API_ROUTES];

// ============================================
// ROUTE METADATA (for navigation menus, breadcrumbs, etc.)
// ============================================

export interface RouteMetadata {
  path: string;
  title: string;
  description?: string;
  icon?: string;
  requiresAuth: boolean;
  showInNav?: boolean;
}

export const ROUTE_METADATA: Record<string, RouteMetadata> = {
  home: {
    path: PUBLIC_ROUTES.HOME,
    title: 'Home',
    description: 'Welcome to Tempra',
    requiresAuth: false,
    showInNav: true,
  },
  dashboard: {
    path: PROTECTED_ROUTES.DASHBOARD,
    title: 'Dashboard',
    description: 'Your dashboard overview',
    requiresAuth: true,
    showInNav: true,
  },
  events: {
    path: PROTECTED_ROUTES.EVENTS,
    title: 'Events',
    description: 'Manage your events',
    requiresAuth: true,
    showInNav: true,
  },
  calendar: {
    path: PROTECTED_ROUTES.CALENDAR,
    title: 'Calendar',
    description: 'View your calendar',
    requiresAuth: true,
    showInNav: true,
  },
  settings: {
    path: PROTECTED_ROUTES.SETTINGS,
    title: 'Settings',
    description: 'Manage your settings',
    requiresAuth: true,
    showInNav: true,
  },
};

export default {
  PUBLIC_ROUTES,
  AUTH_ROUTES,
  PROTECTED_ROUTES,
  API_ROUTES,
  isPublicRoute,
  isProtectedRoute,
  isGuestOnlyRoute,
  isApiRoute,
  getLoginRedirectUrl,
  extractReturnUrl,
};
