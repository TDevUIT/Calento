'use client';

import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { eventService } from '@/service/event.service';
import { CreateEventRequest, EventResponse } from '@/interface/event.interface';
import { toast } from 'sonner';
import { EVENT_QUERY_KEYS } from './query-keys';

/**
 * Hook to create new event
 */
export const useCreateEvent = (): UseMutationResult<EventResponse, Error, CreateEventRequest> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEventRequest) => eventService.createEvent(data),
    onSuccess: (response) => {
      // Invalidate events list to refetch
      queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEYS.lists() });
      
      toast.success('Event created successfully!', {
        description: response.data.title,
      });
    },
    onError: (error: Error) => {
      toast.error('Failed to create event', {
        description: error.message,
      });
    },
  });
};
