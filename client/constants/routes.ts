export const BASE_FE_URL = process.env.NEXT_PUBLIC_APP_FE_URL || 'http://localhost:3000';

export const PUBLIC_ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  PRICING: '/pricing',
  FEATURES: '/features',
  BLOG: '/blog',
} as const;


export const AUTH_ROUTES = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_EMAIL: '/auth/verify-email',
} as const;

export const PROTECTED_ROUTES = {
  // Dashboard
  DASHBOARD: '/dashboard',
  DASHBOARD_CALENDAR: '/dashboard/calendar',
  DASHBOARD_SCHEDULE: '/dashboard/schedule',
  DASHBOARD_CALENDAR_SYNC: '/dashboard/calendar-sync',
  DASHBOARD_MEETINGS: '/dashboard/meetings',
  DASHBOARD_ANALYTICS: '/dashboard/analytics',
  DASHBOARD_SETTINGS: '/dashboard/settings',
  DASHBOARD_HELP: '/dashboard/help',
  DASHBOARD_PROFILE: '/dashboard/profile',
  DASHBOARD_PRIORITIES: '/dashboard/priorities',
  DASHBOARD_SCHEDULING: '/dashboard/scheduling-links',
  // Booking
  DASHBOARD_BOOKINGS: '/dashboard/bookings',
  BOOKING_DETAIL: (id: string) => `/dashboard/bookings/${id}`,
  
  // Events
  EVENTS: '/events',
  EVENT_CREATE: '/events/create',
  EVENT_DETAIL: (id: string) => `/events/${id}`,
  EVENT_EDIT: (id: string) => `/events/${id}/edit`,
  
  // Calendar
  CALENDAR: '/calendar',
  
  // User
  PROFILE: '/profile',
  BILLING: '/billing',
  
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
  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/register',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_REFRESH: '/auth/refresh',
  AUTH_ME: '/auth/me',
  AUTH_GOOGLE_LOGIN: '/auth/google/login',
  
  // Events
  EVENTS: '/events',
  EVENT_CREATE: '/events',
  EVENT_DETAIL: (id: string) => `/events/${id}`,
  EVENT_UPDATE: (id: string) => `/events/${id}`,
  EVENT_DELETE: (id: string) => `/events/${id}`,
  EVENT_RECURRING_EXPAND: '/events/recurring/expand',
  
  // Calendars (containers)
  CALENDARS: '/calendars',
  CALENDAR_CREATE: '/calendars',
  CALENDAR_DETAIL: (id: string) => `/calendars/${id}`,
  CALENDAR_UPDATE: (id: string) => `/calendars/${id}`,
  CALENDAR_DELETE: (id: string) => `/calendars/${id}`,
  CALENDAR_PRIMARY: '/calendars/primary',
  CALENDAR_SEARCH: '/calendars/search',
  CALENDAR_SYNC: '/calendar/sync',
  
  // Google Integration
  GOOGLE_AUTH_URL: '/auth/google/url',
  GOOGLE_STATUS: '/google/status',
  GOOGLE_DISCONNECT: '/google/disconnect',
  GOOGLE_CALENDARS_SYNC: '/google/calendars/sync',
  GOOGLE_CALENDARS_LIST: '/google/calendars/list',
  GOOGLE_TOKEN_REFRESH: '/google/token/refresh',
  GOOGLE_MEET_CREATE: '/google/meet/create',
  
  // Booking Links
  BOOKING_LINKS: '/booking-links',
  BOOKING_LINK_DETAIL: (id: string) => `/booking-links/${id}`,
  BOOKING_LINK_TOGGLE: (id: string) => `/booking-links/${id}/toggle`,
  BOOKING_LINK_STATS: (id: string) => `/booking-links/${id}/stats`,
  
  // Bookings Management
  BOOKINGS: '/bookings',
  BOOKING_DETAIL: (id: string) => `/bookings/${id}`,
  BOOKING_CANCEL: (id: string) => `/bookings/${id}/cancel`,
  BOOKING_RESCHEDULE: (id: string) => `/bookings/${id}/reschedule`,
  BOOKING_COMPLETE: (id: string) => `/bookings/${id}/complete`,
  BOOKING_STATS: '/bookings/stats',
  
  // Public Booking APIs
  PUBLIC_BOOKING_LINK: (slug: string) => `/bookings/public/${slug}`,
  PUBLIC_BOOKING_SLOTS: (slug: string) => `/bookings/public/${slug}/slots`,
  PUBLIC_BOOKING_CREATE: (slug: string) => `/bookings/${slug}`,
  PUBLIC_BOOKING_CANCEL: (token: string) => `/bookings/public/cancel/${token}`,
  PUBLIC_BOOKING_RESCHEDULE: (token: string) => `/bookings/public/reschedule/${token}`,
  
  // Invitation APIs
  SEND_INVITATIONS: (eventId: string) => `/events/${eventId}/invitations/send`,
  SEND_REMINDERS: (eventId: string) => `/events/${eventId}/invitations/remind`,
  INVITATION_DETAILS: (token: string) => `/events/invitation/${token}`,
  RESPOND_TO_INVITATION: (token: string) => `/events/invitation/${token}/respond`,
  
  // Analytics APIs
  ANALYTICS_OVERVIEW: '/analytics/overview',
  ANALYTICS_DETAILED: '/analytics/detailed',
  ANALYTICS_EVENTS: '/analytics/events',
  ANALYTICS_TIME_UTILIZATION: '/analytics/time-utilization',
  ANALYTICS_CATEGORIES: '/analytics/categories',
  ANALYTICS_TIME_DISTRIBUTION: '/analytics/time-distribution',
  ANALYTICS_ATTENDEES: '/analytics/attendees',
  ANALYTICS_BOOKINGS: '/analytics/bookings',
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
  '/book/*', // Public booking pages
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


export const DEFAULT_LOGIN_REDIRECT = PROTECTED_ROUTES.DASHBOARD_CALENDAR;


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

export const isBookingRoute = (pathname: string): boolean => {
  return pathname.startsWith('/book/');
};

export const isInvitationRoute = (pathname: string): boolean => {
  return pathname.startsWith('/invitation');
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
    description: 'Welcome to Tcalento',
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
  isBookingRoute,
  isInvitationRoute,
  getLoginRedirectUrl,
  extractReturnUrl,
};
