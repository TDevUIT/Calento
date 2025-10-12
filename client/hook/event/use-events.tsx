'use client';

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { eventService } from '@/service/event.service';
import { PaginatedEventsResponse, EventQueryParams } from '@/interface/event.interface';
import { EVENT_QUERY_KEYS } from './query-keys';

/**
 * Hook to fetch paginated events
 */
export const useEvents = (params?: EventQueryParams): UseQueryResult<PaginatedEventsResponse, Error> => {
  return useQuery({
    queryKey: EVENT_QUERY_KEYS.list(params),
    queryFn: () => eventService.getEvents(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });
};

/**
 * Hook to fetch events by date range
 */
export const useEventsByDateRange = (
  startDate: string,
  endDate: string,
  params?: Omit<EventQueryParams, 'start_date' | 'end_date'>
): UseQueryResult<PaginatedEventsResponse, Error> => {
  return useQuery({
    queryKey: EVENT_QUERY_KEYS.byDateRange(startDate, endDate, params),
    queryFn: () => eventService.getEventsByDateRange(startDate, endDate, params),
    staleTime: 5 * 60 * 1000,
    enabled: !!startDate && !!endDate,
  });
};
