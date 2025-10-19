'use client';

import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { calendarService } from '@/service/calendar.service';
import { toast } from 'sonner';
import { CALENDAR_QUERY_KEYS } from './query-keys';

export const useDeleteCalendar = (): UseMutationResult<void, Error, string> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (calendarId: string) => calendarService.deleteCalendar(calendarId),
    onSuccess: (_, calendarId) => {
      queryClient.removeQueries({ queryKey: CALENDAR_QUERY_KEYS.detail(calendarId) });
      queryClient.invalidateQueries({ queryKey: CALENDAR_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: CALENDAR_QUERY_KEYS.primary() });
      
      toast.success('Calendar deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error('Failed to delete calendar', {
        description: error.message,
      });
    },
  });
};
