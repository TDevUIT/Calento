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

export type CalendarView = 'day' | 'week' | 'month' | 'year';


export interface CalendarSettings {
  defaultView: 'day' | 'week' | 'month' | 'year';
  weekStartsOn: 'sunday' | 'monday' | 'saturday';
  timeFormat: '12h' | '24h';
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  
  compactMode: boolean;
  showWeekNumbers: boolean;
  highlightWeekends: boolean;
  
  enableNotifications: boolean;
  eventReminders: boolean;
  reminderTime: string;
  soundEnabled: boolean;
  
  autoSync: boolean;
  showDeclinedEvents: boolean;
  defaultEventDuration: string;
  enableKeyboardShortcuts: boolean;
}

export interface CalendarItem {
  id: string;
  name: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  visible: boolean;
  count: number;
}


export type EventPriority = 'critical' | 'high' | 'medium' | 'low';


export type EventsCountMap = Record<string, number>;
