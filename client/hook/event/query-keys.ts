import { EventQueryParams, RecurringEventsQueryParams } from '@/interface/event.interface';

/**
 * Centralized query keys for event-related queries
 * Following React Query best practices for cache invalidation
 */
export const EVENT_QUERY_KEYS = {
  all: ['events'] as const,
  
  lists: () => [...EVENT_QUERY_KEYS.all, 'list'] as const,
  
  list: (params?: EventQueryParams) => 
    [...EVENT_QUERY_KEYS.lists(), params] as const,
  
  byDateRange: (
    startDate: string, 
    endDate: string, 
    params?: Omit<EventQueryParams, 'start_date' | 'end_date'>
  ) => 
    [...EVENT_QUERY_KEYS.lists(), 'dateRange', { startDate, endDate, ...params }] as const,
  
  search: (searchTerm: string, params?: Omit<EventQueryParams, 'search'>) =>
    [...EVENT_QUERY_KEYS.lists(), 'search', { searchTerm, ...params }] as const,
  
  details: () => [...EVENT_QUERY_KEYS.all, 'detail'] as const,
  
  detail: (id: string) => 
    [...EVENT_QUERY_KEYS.details(), id] as const,
  
  recurring: (params: RecurringEventsQueryParams) =>
    [...EVENT_QUERY_KEYS.all, 'recurring', params] as const,
  
  upcoming: (startDate: string, endDate: string, maxEvents?: number) =>
    [...EVENT_QUERY_KEYS.all, 'upcoming', { startDate, endDate, maxEvents }] as const,
} as const;
