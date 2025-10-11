/**
 * Common constants used throughout the application
 * Centralized configuration for magic numbers, timeouts, limits, etc.
 */

export * from './time.constants';
export * from './external-api.constants';

// Re-export commonly used constants for convenience
export {
  TIME_CONSTANTS,
  SECURITY_CONSTANTS,
  BUSINESS_CONSTANTS,
  ENV_CONSTANTS,
} from './time.constants';

export {
  GOOGLE_API_CONSTANTS,
  APP_URL_CONSTANTS,
  SERVER_URL_CONSTANTS,
  EMAIL_URL_CONSTANTS,
  WEBHOOK_CONSTANTS,
  HTTP_STATUS_CONSTANTS,
  OAUTH_CONSTANTS,
} from './external-api.constants';
