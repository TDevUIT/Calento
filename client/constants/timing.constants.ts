/**
 * Timing Constants
 * Centralized timeout and duration values for consistent timing
 */

// Toast Durations (milliseconds)
export const TOAST_DURATION = {
  SUCCESS: 3000,
  ERROR: 5000,
  INFO: 3000,
  WARNING: 4000,
  DEFAULT: 3000,
} as const;

// Animation Durations (milliseconds)
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
} as const;

// Debounce Delays (milliseconds)
export const DEBOUNCE_DELAY = {
  SEARCH: 300,
  INPUT: 500,
  RESIZE: 150,
  SCROLL: 100,
} as const;

// Cache Times (milliseconds)
export const CACHE_TIME = {
  SHORT: 5 * 60 * 1000,      // 5 minutes
  MEDIUM: 30 * 60 * 1000,    // 30 minutes
  LONG: 60 * 60 * 1000,      // 1 hour
  VERY_LONG: 24 * 60 * 60 * 1000,  // 24 hours
} as const;

// Redirect Delays (milliseconds)
export const REDIRECT_DELAY = {
  IMMEDIATE: 0,
  SHORT: 1000,
  NORMAL: 2000,
  LONG: 3000,
} as const;

// Retry Delays (milliseconds)
export const RETRY_DELAY = {
  FIRST: 1000,
  SECOND: 2000,
  THIRD: 3000,
  MAX: 5000,
} as const;

// Thinking Process Animation Delays (milliseconds)
export const THINKING_ANIMATION = {
  STEP_DELAY: 1000,
  STEP_TRANSITION: 800,
  COMPLETE_DELAY: 800,
  CLEANUP_DELAY: 500,
} as const;

// Hover Delays (milliseconds)
export const HOVER_DELAY = {
  TOOLTIP: 500,
  PREVIEW: 300,
  MENU: 200,
} as const;

// Polling Intervals (milliseconds)
export const POLLING_INTERVAL = {
  FAST: 5000,       // 5 seconds
  NORMAL: 30000,    // 30 seconds
  SLOW: 60000,      // 1 minute
} as const;

// Auto-save Delays (milliseconds)
export const AUTOSAVE_DELAY = {
  DRAFT: 3000,
  SETTINGS: 1000,
  FORM: 2000,
} as const;
