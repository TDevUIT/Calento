'use client';

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { calendarService } from '@/service/calendar.service';
import { PaginatedCalendarsResponse, CalendarQueryParams } from '@/interface/calendar.interface';
import { CALENDAR_QUERY_KEYS } from './query-keys';

/**
 * Hook to fetch paginated calendars
 */
export const useCalendars = (params?: CalendarQueryParams): UseQueryResult<PaginatedCalendarsResponse, Error> => {
  return useQuery({
    queryKey: CALENDAR_QUERY_KEYS.list(params),
    queryFn: () => calendarService.getCalendars(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });
};
