import { VariantProps } from 'class-variance-authority';

/**
 * Calendar Event Type
 */
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
 * Calendar View Types
 */
export type CalendarView = 'day' | 'week' | 'month' | 'year';

/**
 * Calendar Settings Interface
 */
export interface CalendarSettings {
  // General
  defaultView: 'day' | 'week' | 'month' | 'year';
  weekStartsOn: 'sunday' | 'monday' | 'saturday';
  timeFormat: '12h' | '24h';
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  
  // Appearance
  theme: 'light' | 'dark' | 'system';
  compactMode: boolean;
  showWeekNumbers: boolean;
  highlightWeekends: boolean;
  
  // Notifications
  enableNotifications: boolean;
  eventReminders: boolean;
  reminderTime: string;
  soundEnabled: boolean;
  
  // Behavior
  autoSync: boolean;
  showDeclinedEvents: boolean;
  defaultEventDuration: string;
  enableKeyboardShortcuts: boolean;
}

/**
 * Calendar Item (for sidebar)
 */
export interface CalendarItem {
  id: string;
  name: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  visible: boolean;
  count: number;
}

/**
 * Event Priority
 */
export type EventPriority = 'critical' | 'high' | 'medium' | 'low';

/**
 * Events Count Map (for mini calendar)
 */
export type EventsCountMap = Record<string, number>;
