import { logger } from './logger.utils';

const CALENDAR_VIEW_KEY = 'tempra_calendar_view';

export type CalendarView = 'day' | 'week' | 'month' | 'year';


export function getStoredCalendarView(): CalendarView {
  if (typeof window === 'undefined') {
    return 'day';
  }

  try {
    const stored = localStorage.getItem(CALENDAR_VIEW_KEY);
    if (stored && ['day', 'week', 'month', 'year'].includes(stored)) {
      return stored as CalendarView;
    }
  } catch (error) {
    logger.warn('Error reading calendar view from localStorage:', error);
  }

  return 'day'; // Default view
}


export function saveCalendarView(view: CalendarView): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(CALENDAR_VIEW_KEY, view);
  } catch (error) {
    logger.warn('Error saving calendar view to localStorage:', error);
  }
}

export function clearStoredCalendarView(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(CALENDAR_VIEW_KEY);
  } catch (error) {
    logger.warn('Error clearing calendar view from localStorage:', error);
  }
}
