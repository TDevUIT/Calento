import { CalendarQueryParams } from '@/interface/calendar.interface';

export const CALENDAR_QUERY_KEYS = {
  all: ['calendars'] as const,
  
  lists: () => [...CALENDAR_QUERY_KEYS.all, 'list'] as const,
  
  list: (params?: CalendarQueryParams) => 
    [...CALENDAR_QUERY_KEYS.lists(), params] as const,
  
  primary: () => [...CALENDAR_QUERY_KEYS.all, 'primary'] as const,
  
  search: (searchTerm: string, params?: Omit<CalendarQueryParams, 'search'>) =>
    [...CALENDAR_QUERY_KEYS.lists(), 'search', { searchTerm, ...params }] as const,
  
  details: () => [...CALENDAR_QUERY_KEYS.all, 'detail'] as const,
  
  detail: (id: string) => 
    [...CALENDAR_QUERY_KEYS.details(), id] as const,
} as const;
