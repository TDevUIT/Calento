/**
 * Theme Constants
 * Centralized color and theme values for consistent styling
 */

// Primary Colors
export const COLORS = {
  PRIMARY: '#3b82f6',
  SECONDARY: '#10b981',
  ACCENT: '#8b5cf6',
  
  // Status Colors
  SUCCESS: '#22c55e',
  WARNING: '#eab308',
  ERROR: '#ef4444',
  INFO: '#3b82f6',
  
  // Priority Colors
  PRIORITY_LOW: '#94a3b8',
  PRIORITY_MEDIUM: '#3b82f6',
  PRIORITY_HIGH: '#f59e0b',
  PRIORITY_CRITICAL: '#ef4444',
  
  // Calendar Event Colors
  BLUE: '#3b82f6',
  RED: '#ef4444',
  GREEN: '#22c55e',
  YELLOW: '#eab308',
  PURPLE: '#a855f7',
  PINK: '#ec4899',
  ORANGE: '#f97316',
  INDIGO: '#6366f1',
  CYAN: '#06b6d4',
  TEAL: '#14b8a6',
  VIOLET: '#8b5cf6',
  SKY: '#0ea5e9',
  
  // Default
  DEFAULT: '#3b82f6',
} as const;

// Default Color Sets
export const DEFAULT_RECENT_COLORS = [
  COLORS.BLUE,
  COLORS.RED,
  COLORS.GREEN,
  COLORS.YELLOW,
  COLORS.PURPLE,
];

export const DEFAULT_EVENT_COLOR = COLORS.BLUE;

export const BOOKING_LINK_COLORS = {
  blue: COLORS.BLUE,
  green: COLORS.GREEN,
  purple: COLORS.PURPLE,
  red: COLORS.RED,
  orange: COLORS.ORANGE,
  pink: COLORS.PINK,
  yellow: COLORS.YELLOW,
  indigo: COLORS.INDIGO,
} as const;

export const ANALYTICS_CHART_COLORS = [
  COLORS.BLUE,
  COLORS.GREEN,
  COLORS.ORANGE,
  COLORS.RED,
  COLORS.VIOLET,
  COLORS.PINK,
];

export type ColorValue = typeof COLORS[keyof typeof COLORS];
