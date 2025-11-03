/**
 * API Constants
 * Centralized API configuration values
 */

// API Base URLs
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
export const API_PREFIX = process.env.NEXT_PUBLIC_API_PREFIX || 'api/v1';
export const API_FULL_URL = `${API_BASE_URL}/${API_PREFIX}`;

// WebSocket URLs
export const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000';

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'tempra_auth_token',
  REFRESH_TOKEN: 'tempra_refresh_token',
  USER_DATA: 'tempra_user_data',
  RECENT_COLORS: 'tempra_recent_colors',
  CALENDAR_SETTINGS: 'tempra_calendar_settings',
  THEME_PREFERENCE: 'tempra_theme',
  SIDEBAR_STATE: 'tempra_sidebar_state',
} as const;

// API Limits
export const API_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_EVENTS_PER_PAGE: 100,
  MAX_TASKS_PER_PAGE: 50,
  MAX_BOOKING_LINKS: 20,
  MAX_RECENT_COLORS: 5,
} as const;

// Request Timeouts (milliseconds)
export const REQUEST_TIMEOUT = {
  DEFAULT: 30000,      // 30 seconds
  UPLOAD: 120000,      // 2 minutes
  DOWNLOAD: 60000,     // 1 minute
  QUERY: 10000,        // 10 seconds
} as const;

// Retry Configuration
export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  INITIAL_DELAY: 1000,
  MAX_DELAY: 5000,
  BACKOFF_MULTIPLIER: 2,
} as const;

// Cache Configuration
export const CACHE_CONFIG = {
  STALE_TIME: 5 * 60 * 1000,      // 5 minutes
  GC_TIME: 10 * 60 * 1000,        // 10 minutes
  RETRY: 2,
} as const;
