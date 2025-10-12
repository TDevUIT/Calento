import { addHours } from 'date-fns';
import type { CalendarEvent } from '@/components/calendar';

export const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    start: new Date(),
    end: addHours(new Date(), 2),
    title: 'Team Meeting - Q1 Review',
    color: 'pink',
  },
  {
    id: '2',
    start: addHours(new Date(), 1.5),
    end: addHours(new Date(), 3),
    title: 'Design Sync',
    color: 'blue',
  },
  {
    id: '3',
    start: addHours(new Date(), 4),
    end: addHours(new Date(), 5),
    title: 'Client Call',
    color: 'green',
  },
  {
    id: '4',
    start: addHours(new Date(), -2),
    end: addHours(new Date(), -1),
    title: 'Morning Standup',
    color: 'purple',
  },
];
