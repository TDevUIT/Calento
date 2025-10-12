// ======================
// 📁 CALENDAR COMPONENTS
// ======================

// Core Calendar (FullCalendar Views)
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

// Views
export { EventPreview } from './views/EventPreview';

// Sidebar Components
export { CalendarSidebar } from './sidebar';

// Dialogs
export { EventDialog } from './dialogs/EventDialog';

// Search
export { EventSearch, type EventSearchFilters } from './search';

// Settings
export { CalendarSettingsDialog } from './settings';

// Shared Components
export { MiniCalendar } from './MiniCalendar';
export { KeyboardShortcuts } from './KeyboardShortcuts';

// Shared Types & Utils
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
