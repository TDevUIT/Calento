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

export { EventPreview } from './views/EventPreview';
export { CalendarSidebar } from './sidebar';
export { EventDialog } from './dialogs/EventDialog';
export { EventSearch, type EventSearchFilters } from './search';
export { CalendarSettingsDialog } from './settings';
export { MiniCalendar } from './MiniCalendar';
export { KeyboardShortcuts } from './KeyboardShortcuts';

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
  formatEventTimeRange,
  getEventColorClass,
  generateHoursArray,
  formatHour,
  isWeekend,
  getWeekNumber,
} from './shared/utils';
