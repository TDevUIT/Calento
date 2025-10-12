'use client';

import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { eventService } from '@/service/event.service';
import { UpdateEventRequest, EventResponse } from '@/interface/event.interface';
import { toast } from 'sonner';
import { EVENT_QUERY_KEYS } from './query-keys';

interface UpdateEventParams {
  id: string;
  data: UpdateEventRequest;
}

/**
 * Hook to update existing event
 */
export const useUpdateEvent = (): UseMutationResult<EventResponse, Error, UpdateEventParams> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateEventParams) => eventService.updateEvent(id, data),
    onSuccess: (response, variables) => {
      // Invalidate specific event and lists
      queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEYS.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEYS.lists() });
      
      toast.success('Event updated successfully!', {
        description: response.data.title,
      });
    },
    onError: (error: Error) => {
      toast.error('Failed to update event', {
        description: error.message,
      });
    },
  });
};
