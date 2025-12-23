export const BASE_FE_URL = process.env.NEXT_PUBLIC_APP_FE_URL || 'http://localhost:3000';

export const PUBLIC_ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  PRICING: '/pricing',
  FEATURES: '/features',
  BLOG: '/blog',
  BLOG_POST: (slug: string) => `/blog/${slug}`,
  BLOG_CATEGORY: (categoryId: string) => `/blog/category/${categoryId}`,
  BLOG_TAG: (tagSlug: string) => `/blog/tag/${tagSlug}`,
  BLOG_AUTHOR: (authorId: string) => `/blog/author/${authorId}`,
  HELP: '/help',
  STATUS: '/status',
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
  DASHBOARD_CALENDAR: '/dashboard/calendar',
  DASHBOARD_SCHEDULE: '/dashboard/schedule',
  DASHBOARD_CALENDAR_SYNC: '/dashboard/calendar-sync',
  DASHBOARD_MEETINGS: '/dashboard/meetings',
  DASHBOARD_ANALYTICS: '/dashboard/analytics',
  DASHBOARD_SETTINGS: '/dashboard/settings',
  DASHBOARD_HELP: '/dashboard/help',
  DASHBOARD_PROFILE: '/dashboard/profile',
  DASHBOARD_PRIORITIES: '/dashboard/priorities',
  DASHBOARD_AI_CHAT: '/dashboard/ai-chat',
  DASHBOARD_SCHEDULING: '/dashboard/scheduling-links',
  DASHBOARD_TASKS: '/dashboard/tasks',
  DASHBOARD_BOOKINGS: '/dashboard/bookings',
  BOOKING_DETAIL: (id: string) => `/dashboard/bookings/${id}`,
  DASHBOARD_AVAILABILITY: '/dashboard/availability',
  DASHBOARD_TEAMS: '/dashboard/teams',
  TEAM_DETAIL: (id: string) => `/dashboard/teams/${id}`,
  TEAM_CREATE: '/dashboard/teams/create',
  TEAM_EDIT: (id: string) => `/dashboard/teams/${id}/edit`,
  
  EVENTS: '/events',
  EVENT_CREATE: '/events/create',
  EVENT_DETAIL: (id: string) => `/events/${id}`,
  EVENT_EDIT: (id: string) => `/events/${id}/edit`,
  
  CALENDAR: '/calendar',
  
  PROFILE: '/profile',
  BILLING: '/billing',
  
  SETTINGS: '/settings',
  SETTINGS_PROFILE: '/settings/profile',
  SETTINGS_ACCOUNT: '/settings/account',
  SETTINGS_INTEGRATIONS: '/settings/integrations',
  SETTINGS_NOTIFICATIONS: '/settings/notifications',
  SETTINGS_SECURITY: '/settings/security',
  
  INTEGRATIONS: '/integrations',
  GOOGLE_CALLBACK: '/integrations/google/callback',
  
  ADMIN: '/admin',
} as const;


export const API_ROUTES = {
  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/register',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_REFRESH: '/auth/refresh',
  AUTH_ME: '/auth/me',
  AUTH_GOOGLE_LOGIN: '/auth/google/login',
  AUTH_FORGOT_PASSWORD: '/auth/forgot-password',
  AUTH_RESET_PASSWORD: '/auth/reset-password',
  
  NOTIFICATIONS_PENDING: '/notifications/pending',
  NOTIFICATIONS_SCHEDULE_REMINDERS: '/notifications/schedule-reminders',
  
  EVENTS: '/events',
  EVENT_CREATE: '/events',
  EVENT_DETAIL: (id: string) => `/events/${id}`,
  EVENT_UPDATE: (id: string) => `/events/${id}`,
  EVENT_DELETE: (id: string) => `/events/${id}`,
  EVENT_RECURRING_EXPAND: '/events/recurring/expand',
  
  CALENDARS: '/calendars',
  CALENDAR_CREATE: '/calendars',
  CALENDAR_DETAIL: (id: string) => `/calendars/${id}`,
  CALENDAR_UPDATE: (id: string) => `/calendars/${id}`,
  CALENDAR_DELETE: (id: string) => `/calendars/${id}`,
  CALENDAR_PRIMARY: '/calendars/primary',
  CALENDAR_SEARCH: '/calendars/search',
  CALENDAR_SYNC: '/calendar/sync',
  
  GOOGLE_AUTH_URL: '/auth/google/url',
  GOOGLE_STATUS: '/google/status',
  GOOGLE_DISCONNECT: '/google/disconnect',
  GOOGLE_CALENDARS_SYNC: '/google/calendars/sync',
  GOOGLE_CALENDARS_LIST: '/google/calendars/list',
  GOOGLE_TOKEN_REFRESH: '/google/token/refresh',
  GOOGLE_MEET_CREATE: '/google/meet/create',
  
  BOOKING_LINKS: '/booking-links',
  BOOKING_LINK_DETAIL: (id: string) => `/booking-links/${id}`,
  BOOKING_LINK_TOGGLE: (id: string) => `/booking-links/${id}/toggle`,
  BOOKING_LINK_STATS: (id: string) => `/booking-links/${id}/stats`,
  
  BOOKINGS: '/bookings',
  BOOKING_DETAIL: (id: string) => `/bookings/${id}`,
  BOOKING_CANCEL: (id: string) => `/bookings/${id}/cancel`,
  BOOKING_RESCHEDULE: (id: string) => `/bookings/${id}/reschedule`,
  BOOKING_COMPLETE: (id: string) => `/bookings/${id}/complete`,
  BOOKING_STATS: '/bookings/stats',
  
  PUBLIC_BOOKING_LINK: (slug: string) => `/bookings/public/${slug}`,
  PUBLIC_BOOKING_SLOTS: (slug: string) => `/bookings/public/${slug}/slots`,
  PUBLIC_BOOKING_CREATE: (slug: string) => `/bookings/${slug}`,
  PUBLIC_BOOKING_CANCEL: (token: string) => `/bookings/public/cancel/${token}`,
  PUBLIC_BOOKING_RESCHEDULE: (token: string) => `/bookings/public/reschedule/${token}`,
  
  SEND_INVITATIONS: (eventId: string) => `/events/${eventId}/invitations/send`,
  SEND_REMINDERS: (eventId: string) => `/events/${eventId}/invitations/remind`,
  INVITATION_DETAILS: (token: string) => `/events/invitation/${token}`,
  RESPOND_TO_INVITATION: (token: string) => `/events/invitation/${token}/respond`,
  
  ANALYTICS_OVERVIEW: '/analytics/overview',
  ANALYTICS_DETAILED: '/analytics/detailed',
  ANALYTICS_EVENTS: '/analytics/events',
  ANALYTICS_TIME_UTILIZATION: '/analytics/time-utilization',
  ANALYTICS_CATEGORIES: '/analytics/categories',
  ANALYTICS_TIME_DISTRIBUTION: '/analytics/time-distribution',
  ANALYTICS_ATTENDEES: '/analytics/attendees',
  ANALYTICS_BOOKINGS: '/analytics/bookings',
  
  TASKS: '/tasks',
  TASK_CREATE: '/tasks',
  TASK_DETAIL: (id: string) => `/tasks/${id}`,
  TASK_UPDATE: (id: string) => `/tasks/${id}`,
  TASK_DELETE: (id: string) => `/tasks/${id}`,
  TASK_RESTORE: (id: string) => `/tasks/${id}/restore`,
  TASK_UPDATE_STATUS: (id: string) => `/tasks/${id}/status`,
  TASK_OVERDUE: '/tasks/overdue',
  TASK_STATISTICS: '/tasks/statistics',
  
  PRIORITIES: '/priorities',
  PRIORITY_UPDATE: '/priorities/update',
  PRIORITY_BULK_UPDATE: '/priorities/bulk-update',
  PRIORITY_DELETE: (itemId: string, itemType: string) => `/priorities/item/${itemId}/${itemType}`,
  PRIORITY_RESET: '/priorities/reset',
  
  AI_CHAT: '/ai/chat',
  AI_CHAT_STREAM: '/ai/chat/stream',
  AI_FUNCTION_EXECUTE: '/ai/function/execute',
  AI_CONVERSATIONS: '/ai/conversations',
  AI_CONVERSATION_DETAIL: (id: string) => `/ai/conversations/${id}`,
  AI_CONVERSATION_DELETE: (id: string) => `/ai/conversations/${id}`,
  
  TEAMS: '/teams',
  TEAM_DETAIL: (id: string) => `/teams/${id}`,
  TEAM_CREATE: '/teams',
  TEAM_UPDATE: (id: string) => `/teams/${id}`,
  TEAM_DELETE: (id: string) => `/teams/${id}`,
  TEAM_MEMBERS: (id: string) => `/teams/${id}/members`,
  TEAM_INVITE_MEMBER: (id: string) => `/teams/${id}/members`,
  TEAM_REMOVE_MEMBER: (teamId: string, memberId: string) => `/teams/${teamId}/members/${memberId}`,
  TEAM_UPDATE_ROLE: (teamId: string, memberId: string) => `/teams/${teamId}/members/${memberId}/role`,
  TEAM_ACCEPT_INVITATION: (teamId: string, memberId: string) => `/teams/${teamId}/members/${memberId}/accept`,
  TEAM_DECLINE_INVITATION: (teamId: string, memberId: string) => `/teams/${teamId}/members/${memberId}/decline`,
  TEAM_LEAVE: (id: string) => `/teams/${id}/leave`,
  TEAM_RITUALS: (id: string) => `/teams/${id}/rituals`,
  TEAM_RITUAL_CREATE: (id: string) => `/teams/${id}/rituals`,
  TEAM_RITUAL_UPDATE: (teamId: string, ritualId: string) => `/teams/${teamId}/rituals/${ritualId}`,
  TEAM_RITUAL_DELETE: (teamId: string, ritualId: string) => `/teams/${teamId}/rituals/${ritualId}`,
  TEAM_ROTATION_HISTORY: (teamId: string, ritualId: string) => `/teams/${teamId}/rituals/${ritualId}/rotation`,
  TEAM_AVAILABILITY_HEATMAP: (id: string) => `/teams/${id}/availability/heatmap`,
  TEAM_OPTIMAL_TIMES: (id: string) => `/teams/${id}/availability/optimal`,
  
  BLOG_POSTS: '/blog',
  BLOG_PUBLISHED: '/blog/public/published',
  BLOG_FEATURED: '/blog/public/featured',
  BLOG_POPULAR: '/blog/public/popular',
  BLOG_DETAIL: (id: string) => `/blog/${id}`,
  BLOG_BY_SLUG: (slug: string) => `/blog/slug/${slug}`,
  BLOG_SEARCH: '/blog/search',
  BLOG_BY_CATEGORY: (categoryId: string) => `/blog/category/${categoryId}`,
  BLOG_BY_TAG: (tagId: string) => `/blog/tag/${tagId}`,
  BLOG_BY_AUTHOR: (authorId: string) => `/blog/author/${authorId}`,
  BLOG_RELATED: (id: string) => `/blog/${id}/related`,
  BLOG_CREATE: '/blog',
  BLOG_UPDATE: (id: string) => `/blog/${id}`,
  BLOG_DELETE: (id: string) => `/blog/${id}`,
  BLOG_PUBLISH: (id: string) => `/blog/${id}/publish`,
  BLOG_UNPUBLISH: (id: string) => `/blog/${id}/unpublish`,
  
  CONTACT_SUBMIT: '/contact',
  
  HEALTH: '/health',
  HEALTH_DB: '/health/db',
  HEALTH_OK: '/health/ok',
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
  '/book/*',
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

export const isAdminRoute = (pathname: string): boolean =>  {
  return pathname.startsWith('/admin')
} 

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
