export const BASE_FE_URL = process.env.NEXT_PUBLIC_APP_FE_URL || 'http://localhost:3000';

export const PUBLIC_ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  PRICING: '/pricing',
  FEATURES: '/features',
} as const;


export const AUTH_ROUTES = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_EMAIL: '/auth/verify-email',
} as const;

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


export const API_ROUTES = {
  // Auth
  AUTH_LOGIN: '/api/v1/auth/login',
  AUTH_REGISTER: '/api/v1/auth/register',
  AUTH_LOGOUT: '/api/v1/auth/logout',
  AUTH_REFRESH: '/api/v1/auth/refresh',
  AUTH_ME: '/api/v1/auth/me',
  
  // Events
  EVENTS: '/api/v1/events',
  EVENT_DETAIL: (id: string) => `/api/v1/events/${id}`,
  
  // Calendar
  CALENDAR_SYNC: '/api/v1/calendar/sync',
  
  // Google Integration
  GOOGLE_AUTH_URL: '/api/google/auth/url',
  GOOGLE_STATUS: '/api/google/status',
  GOOGLE_DISCONNECT: '/api/google/disconnect',
  GOOGLE_CALENDARS_SYNC: '/api/google/calendars/sync',
  GOOGLE_CALENDARS_LIST: '/api/google/calendars/list',
  GOOGLE_TOKEN_REFRESH: '/api/google/token/refresh',
} as const;

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


export const PROTECTED_ROUTE_PATTERNS = [
  '/dashboard',
  '/events',
  '/calendar',
  '/settings',
  '/integrations',
  '/admin',
] as const;


export const GUEST_ONLY_ROUTE_PATTERNS = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
] as const;

export const DASHBOARD_ROUTE_PATTERNS = [
  '/dashboard',
] as const;


export const API_ROUTE_PATTERNS = [
  '/api',
  '/_next',
  '/static',
] as const;


export const DEFAULT_LOGIN_REDIRECT = PROTECTED_ROUTES.DASHBOARD;


export const DEFAULT_LOGOUT_REDIRECT = AUTH_ROUTES.LOGIN;


export const DEFAULT_UNAUTHENTICATED_REDIRECT = AUTH_ROUTES.LOGIN;


export const isPublicRoute = (pathname: string): boolean => {
  return PUBLIC_ROUTE_PATTERNS.some(pattern => 
    pathname === pattern || pathname.startsWith(pattern)
  );
};


export const isProtectedRoute = (pathname: string): boolean => {
  return PROTECTED_ROUTE_PATTERNS.some(pattern => 
    pathname.startsWith(pattern)
  );
};


export const isGuestOnlyRoute = (pathname: string): boolean => {
  return GUEST_ONLY_ROUTE_PATTERNS.some(pattern => 
    pathname === pattern || pathname.startsWith(pattern)
  );
};


export const isApiRoute = (pathname: string): boolean => {
  return API_ROUTE_PATTERNS.some(pattern => 
    pathname.startsWith(pattern)
  );
};

export const isDashboardRoute = (pathname: string): boolean => {
  return DASHBOARD_ROUTE_PATTERNS.some(pattern => 
    pathname.startsWith(pattern)
  );
};


export const getLoginRedirectUrl = (returnUrl?: string): string => {
  if (!returnUrl || returnUrl === '/') {
    return AUTH_ROUTES.LOGIN;
  }
  return `${AUTH_ROUTES.LOGIN}?returnUrl=${encodeURIComponent(returnUrl)}`;
};

export const extractReturnUrl = (searchParams: URLSearchParams): string => {
  const returnUrl = searchParams.get('returnUrl');
  if (returnUrl && isProtectedRoute(returnUrl)) {
    return returnUrl;
  }
  return DEFAULT_LOGIN_REDIRECT;
};


export type PublicRoute = typeof PUBLIC_ROUTES[keyof typeof PUBLIC_ROUTES];
export type AuthRoute = typeof AUTH_ROUTES[keyof typeof AUTH_ROUTES];
export type ProtectedRoute = typeof PROTECTED_ROUTES[keyof typeof PROTECTED_ROUTES];
export type ApiRoute = typeof API_ROUTES[keyof typeof API_ROUTES];

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
  isDashboardRoute,
  getLoginRedirectUrl,
  extractReturnUrl,
};
