'use client';

import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { eventService } from '@/service/event.service';
import { CreateEventRequest, EventResponse } from '@/interface/event.interface';
import { EVENT_QUERY_KEYS } from './query-keys';

export const useCreateEvent = (): UseMutationResult<EventResponse, Error, CreateEventRequest> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEventRequest) => eventService.createEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEYS.lists() });
    },
  });
};
