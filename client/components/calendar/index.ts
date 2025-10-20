export {
  Calendar,
  CalendarCurrentDate,
  CalendarDayView,
  CalendarMonthView,
  CalendarNextTrigger,
  CalendarPrevTrigger,
  CalendarTodayTrigger,
  CalendarViewTrigger,
  CalendarWeekView,
  CalendarYearView,
  useCalendar,
  type CalendarEvent,
} from './views/FullCalendar';

export * from './forms';
export * from './shared';
export * from './views';
export * from './header';
export * from './sidebar';
export * from './dialogs';
export * from './settings';
export * from './search';
export * from './chat';
export { MiniCalendar } from './MiniCalendar';
export { KeyboardShortcuts } from './KeyboardShortcuts';
export { KEYBOARD_SHORTCUTS } from './keyboard-shortcuts-data';

export type {
  CalendarSettings,
  CalendarView,
  CalendarItem,
  EventPriority,
  EventsCountMap,
} from './shared/types';

export {
  DEFAULT_CALENDAR_SETTINGS,
  TIME_FORMAT_OPTIONS,
  DATE_FORMAT_OPTIONS,
  REMINDER_TIME_OPTIONS,
  EVENT_DURATION_OPTIONS,
  WEEK_START_OPTIONS,
  VIEW_OPTIONS,
} from './shared/constants';

export {
  getEventsForDate,
  formatCalendarEventTimeRange as formatEventTimeRange,
  getEventColorClass,
  generateHoursArray,
  formatHour,
  isWeekend,
  getWeekNumber,
} from '@/utils/calendar-utils';
