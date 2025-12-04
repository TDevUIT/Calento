'use client';

import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { calendarService } from '@/service';
import { CreateCalendarRequest, CalendarResponse } from '@/interface/calendar.interface';
import { CALENDAR_QUERY_KEYS } from './query-keys';

export const useCreateCalendar = (): UseMutationResult<CalendarResponse, Error, CreateCalendarRequest> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCalendarRequest) => calendarService.createCalendar(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: CALENDAR_QUERY_KEYS.lists() });
      
      if (response.data.is_primary) {
        queryClient.invalidateQueries({ queryKey: CALENDAR_QUERY_KEYS.primary() });
      }
    },
  });
};
