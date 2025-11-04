export const TIME_CONSTANTS = {
  // Basic time units in milliseconds
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000,
  YEAR: 365 * 24 * 60 * 60 * 1000,

  // Authentication & Security
  AUTH: {
    PASSWORD_RESET_EXPIRY: 15 * 60 * 1000,
    REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60 * 1000,
    ACCESS_TOKEN_EXPIRY: 60 * 60 * 1000,
    SESSION_TIMEOUT: 2 * 60 * 60 * 1000,
  },

  // Google Calendar Integration
  GOOGLE: {
    TOKEN_DEFAULT_EXPIRY: 3600 * 1000,
    AUTH_CODE_EXPIRY: 10 * 60 * 1000,
    SYNC_INTERVAL: 5 * 60 * 1000,
  },

  // Webhook Configuration
  WEBHOOK: {
    DEFAULT_EXPIRY: 7 * 24 * 60 * 60 * 1000,
    MAX_EXPIRY: 7 * 24 * 60 * 60 * 1000,
    RENEWAL_THRESHOLD: 24 * 60 * 60 * 1000,
    HEALTH_CHECK_INTERVAL: 12 * 60 * 60 * 1000,
  },

  // Event Sync & Queue
  EVENT_SYNC: {
    FULL_SYNC_PAST_RANGE: 365 * 24 * 60 * 60 * 1000,
    FULL_SYNC_FUTURE_RANGE: 365 * 24 * 60 * 60 * 1000,
    BATCH_SYNC_PAST_RANGE: 7 * 24 * 60 * 60 * 1000,
    BATCH_SYNC_FUTURE_RANGE: 30 * 24 * 60 * 60 * 1000,
  },

  // Email & Notifications
  EMAIL: {
    TEST_REMINDER_DELAY: 60 * 60 * 1000,
    RATE_LIMIT_WINDOW: 60 * 60 * 1000,
    RETRY_DELAY: 5 * 60 * 1000,
  },

  // Booking & Availability
  BOOKING: {
    ADVANCE_NOTICE_MULTIPLIER: 60 * 60 * 1000,
    BOOKING_WINDOW_MULTIPLIER: 24 * 60 * 60 * 1000,
    MAX_DATE_RANGE_DAYS: 90,
    MILLISECONDS_PER_DAY: 24 * 60 * 60 * 1000,
  },

  // Database & Cleanup
  DATABASE: {
    CLEANUP_OLD_LOGS: 30 * 24 * 60 * 60 * 1000,
    CLEANUP_OLD_TOKENS: 7 * 24 * 60 * 60 * 1000,
    CONNECTION_TIMEOUT: 30 * 1000,
  },
} as const;

/**
 * Security-related constants
 */
export const SECURITY_CONSTANTS = {
  // Password & Hashing
  BCRYPT_SALT_ROUNDS: 12, // Increased from 10 for better security

  // Token lengths
  TOKEN_LENGTHS: {
    RESET_TOKEN_IDENTIFIER: 8,
    RESET_TOKEN_SECRET: 24,
    API_KEY: 32,
    WEBHOOK_TOKEN: 16,
  },

  // Password reset token expiry (1 hour)
  PASSWORD_RESET_TOKEN_EXPIRY: 60 * 60 * 1000,

  // Rate limiting
  RATE_LIMITS: {
    LOGIN_ATTEMPTS: 5,
    PASSWORD_RESET_ATTEMPTS: 3,
    API_REQUESTS_PER_HOUR: 1000,
    EMAIL_SENDS_PER_HOUR: 100,
  },
} as const;

/**
 * Business logic constants
 */
export const BUSINESS_CONSTANTS = {
  // Event constraints
  EVENT: {
    MAX_DURATION_MS: 24 * 60 * 60 * 1000,
    MIN_DURATION_MS: 15 * 60 * 1000,
    MAX_RECURRING_OCCURRENCES: 500,
    DEFAULT_RECURRING_OCCURRENCES: 100,
  },

  // Pagination
  PAGINATION: {
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
    DEFAULT_PAGE: 1,
  },

  // File uploads
  FILE: {
    MAX_SIZE_MB: 10,
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  },
} as const;

/**
 * Environment-specific constants
 */
export const ENV_CONSTANTS = {
  DEVELOPMENT: {
    LOG_LEVEL: 'debug',
    CACHE_TTL: 5 * 60 * 1000,
  },

  PRODUCTION: {
    LOG_LEVEL: 'warn',
    CACHE_TTL: 30 * 60 * 1000,
  },
} as const;
