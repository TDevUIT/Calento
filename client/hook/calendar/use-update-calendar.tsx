'use client';

import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { calendarService } from '@/service/calendar.service';
import { UpdateCalendarRequest, CalendarResponse } from '@/interface/calendar.interface';
import { CALENDAR_QUERY_KEYS } from './query-keys';

interface UpdateCalendarParams {
  id: string;
  data: UpdateCalendarRequest;
}

export const useUpdateCalendar = (): UseMutationResult<CalendarResponse, Error, UpdateCalendarParams> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateCalendarParams) => calendarService.updateCalendar(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: CALENDAR_QUERY_KEYS.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: CALENDAR_QUERY_KEYS.lists() });
      
      if (response.data.is_primary) {
        queryClient.invalidateQueries({ queryKey: CALENDAR_QUERY_KEYS.primary() });
      }
    },
  });
};
