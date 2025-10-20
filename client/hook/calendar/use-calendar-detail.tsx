'use client';

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { calendarService } from '@/service/calendar.service';
import { CalendarResponse } from '@/interface/calendar.interface';
import { CALENDAR_QUERY_KEYS } from './query-keys';


export const useCalendarDetail = (calendarId: string): UseQueryResult<CalendarResponse, Error> => {
  return useQuery({
    queryKey: CALENDAR_QUERY_KEYS.detail(calendarId),
    queryFn: () => calendarService.getCalendarById(calendarId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!calendarId,
  });
};
