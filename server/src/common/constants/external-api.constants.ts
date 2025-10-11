export const GOOGLE_API_CONSTANTS = {
  SCOPES: {
    CALENDAR: 'https://www.googleapis.com/auth/calendar',
    CALENDAR_EVENTS: 'https://www.googleapis.com/auth/calendar.events',
    CALENDAR_READONLY: 'https://www.googleapis.com/auth/calendar.readonly',
    USERINFO_EMAIL: 'https://www.googleapis.com/auth/userinfo.email',
    USERINFO_PROFILE: 'https://www.googleapis.com/auth/userinfo.profile',
  },

  SCOPE_SETS: {
    FULL_CALENDAR_ACCESS: [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
    READONLY_ACCESS: [
      'https://www.googleapis.com/auth/calendar.readonly',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  },

  BASE_URLS: {
    CALENDAR_V3: 'https://www.googleapis.com/calendar/v3',
    OAUTH2: 'https://accounts.google.com/o/oauth2/v2',
    USERINFO: 'https://www.googleapis.com/oauth2/v2/userinfo',
  },
} as const;

export const APP_URL_CONSTANTS = {
  DEFAULTS: {
    FRONTEND: 'http://localhost:3000',
    BACKEND: 'http://localhost:8000',
    API: 'http://localhost:8000/v1/api',
  },

  FRONTEND_ROUTES: {
    HOME: '/',
    DASHBOARD: '/dashboard',
    CALENDAR: '/calendar',
    EVENTS: '/events',
    SETTINGS: '/settings',
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    DOCS: '/docs',
    ABOUT: '/about',
    CONTACT: '/contact',
    PRICING: '/pricing',
  },

  BACKEND_ROUTES: {
    WEBHOOK_GOOGLE: '/api/webhook/google',
    API_DOCS: '/docs',
    HEALTH: '/health',
  },
} as const;

export const SERVER_URL_CONSTANTS = {
  DEVELOPMENT: {
    FRONTEND: 'http://localhost:3000',
    BACKEND: 'http://localhost:8000',
    API: 'http://localhost:8000/v1/api',
  },
  PRODUCTION: {
    FRONTEND: 'https://calento.space',
    BACKEND: 'https://api.calento.space',
    API: 'https://api.calento.space/v1/api',
  },
} as const;

export const EMAIL_URL_CONSTANTS = {
  FALLBACK_URLS: {
    DASHBOARD: '/dashboard',
    CALENDAR: '/calendar',
    DOCS: '/docs',
    SUPPORT: '/contact',
  },
} as const;

export const WEBHOOK_CONSTANTS = {
  ENDPOINTS: {
    GOOGLE_CALENDAR: '/webhook/google',
  },
  DEFAULT_BASE_URL: 'https://your-domain.com',
} as const;

export const HTTP_STATUS_CONSTANTS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export const OAUTH_CONSTANTS = {
  GOOGLE: {
    ACCESS_TYPE: 'offline',
    PROMPT: 'consent',
    RESPONSE_TYPE: 'code',
  },
} as const;
