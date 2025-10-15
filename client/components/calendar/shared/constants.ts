import { CalendarSettings } from './types';

/**
 * Default Calendar Settings
 */
export const DEFAULT_CALENDAR_SETTINGS: CalendarSettings = {
  defaultView: 'week',
  weekStartsOn: 'monday',
  timeFormat: '24h',
  dateFormat: 'DD/MM/YYYY',
  compactMode: false,
  showWeekNumbers: true,
  highlightWeekends: true,
  enableNotifications: true,
  eventReminders: true,
  reminderTime: '15',
  soundEnabled: false,
  autoSync: true,
  showDeclinedEvents: false,
  defaultEventDuration: '60',
  enableKeyboardShortcuts: true,
};

/**
 * Time format options
 */
export const TIME_FORMAT_OPTIONS = [
  { value: '12h', label: '12-hour' },
  { value: '24h', label: '24-hour' },
] as const;

/**
 * Date format options
 */
export const DATE_FORMAT_OPTIONS = [
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
] as const;

/**
 * Reminder time options
 */
export const REMINDER_TIME_OPTIONS = [
  { value: '5', label: '5 minutes' },
  { value: '15', label: '15 minutes' },
  { value: '30', label: '30 minutes' },
  { value: '60', label: '1 hour' },
  { value: '1440', label: '1 day' },
] as const;

/**
 * Event duration options
 */
export const EVENT_DURATION_OPTIONS = [
  { value: '15', label: '15 min' },
  { value: '30', label: '30 min' },
  { value: '60', label: '1 hour' },
  { value: '120', label: '2 hours' },
] as const;

/**
 * Week start options
 */
export const WEEK_START_OPTIONS = [
  { value: 'sunday', label: 'Sunday' },
  { value: 'monday', label: 'Monday' },
  { value: 'saturday', label: 'Saturday' },
] as const;

/**
 * View options
 */
export const VIEW_OPTIONS = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
] as const;
