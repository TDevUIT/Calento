import { Eye, EyeOff, Lock } from 'lucide-react';

/**
 * Event color classes for calendar events
 * Maps color names to Tailwind CSS classes
 */
export const EVENT_COLORS: Record<string, string> = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  pink: 'bg-pink-500',
  purple: 'bg-purple-500',
  orange: 'bg-orange-500',
  red: 'bg-red-500',
} as const;

/**
 * Event color options for UI selectors
 */
export const EVENT_COLOR_OPTIONS = [
  { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
  { value: 'green', label: 'Green', class: 'bg-green-500' },
  { value: 'pink', label: 'Pink', class: 'bg-pink-500' },
  { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
  { value: 'orange', label: 'Orange', class: 'bg-orange-500' },
  { value: 'red', label: 'Red', class: 'bg-red-500' },
] as const;

/**
 * Visibility icon components
 */
export const VISIBILITY_ICONS = {
  public: Eye,
  private: EyeOff,
  confidential: Lock,
  default: null,
} as const;

/**
 * Recurrence frequency display names (Vietnamese)
 */
export const RECURRENCE_LABELS: Record<string, string> = {
  DAILY: 'Daily',
  WEEKLY: 'Weekly',
  MONTHLY: 'Monthly',
  YEARLY: 'Yearly',
} as const;

/**
 * Day names in Vietnamese
 */
export const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;
