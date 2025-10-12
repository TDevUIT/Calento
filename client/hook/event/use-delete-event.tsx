'use client';

import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { eventService } from '@/service/event.service';
import { EVENT_QUERY_KEYS } from './query-keys';
import { toast } from 'sonner';

export const useDeleteEvent = (): UseMutationResult<void, Error, string> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => eventService.deleteEvent(eventId),
    onSuccess: (_, eventId) => {
      queryClient.removeQueries({ queryKey: EVENT_QUERY_KEYS.detail(eventId) });
      queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEYS.lists() });
      toast.success('Event deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error('Failed to delete event', {
        description: error.message,
      });
    },
  });
};
