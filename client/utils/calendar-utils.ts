import { format, isSameDay } from 'date-fns';

export type CalendarEvent = {
  id: string;
  start: Date;
  end: Date;
  title: string;
  color?: 'default' | 'blue' | 'green' | 'pink' | 'purple';
  description?: string;
  location?: string;
  attendees?: string[];
};

/**
 * Filter events for a specific date
 */
export function getEventsForDate(events: CalendarEvent[], date: Date): CalendarEvent[] {
  return events.filter(event => isSameDay(event.start, date));
}

/**
 * Format calendar event time range (for Date objects)
 */
export function formatCalendarEventTimeRange(start: Date, end: Date, use24Hour = true): string {
  const timeFormat = use24Hour ? 'HH:mm' : 'h:mm a';
  return `${format(start, timeFormat)} - ${format(end, timeFormat)}`;
}

/**
 * Get event color class
 */
export function getEventColorClass(color?: string): string {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    pink: 'bg-pink-500',
    purple: 'bg-purple-500',
    default: 'bg-primary',
  };
  return colorMap[color || 'default'] || colorMap.default;
}

/**
 * Generate hours array for day/week view
 */
export function generateHoursArray(): number[] {
  return Array.from({ length: 24 }, (_, i) => i);
}

/**
 * Format hour for display
 */
export function formatHour(hour: number, use24Hour = true): string {
  if (use24Hour) {
    return `${hour.toString().padStart(2, '0')}:00`;
  }
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:00 ${period}`;
}

/**
 * Check if date is weekend
 */
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

/**
 * Get week number
 */
export function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}
