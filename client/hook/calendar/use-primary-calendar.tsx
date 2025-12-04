'use client';

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { calendarService } from '@/service';
import { CalendarResponse } from '@/interface/calendar.interface';
import { CALENDAR_QUERY_KEYS } from './query-keys';

/**
 * Hook to fetch primary calendar
 */
export const usePrimaryCalendar = (): UseQueryResult<CalendarResponse, Error> => {
  return useQuery({
    queryKey: CALENDAR_QUERY_KEYS.primary(),
    queryFn: () => calendarService.getPrimaryCalendar(),
    staleTime: 10 * 60 * 1000, // 10 minutes (primary rarely changes)
    refetchOnWindowFocus: false,
  });
};
