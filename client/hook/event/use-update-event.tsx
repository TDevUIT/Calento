'use client';

import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { eventService } from '@/service/event.service';
import { UpdateEventRequest, EventResponse } from '@/interface/event.interface';
import { EVENT_QUERY_KEYS } from './query-keys';

interface UpdateEventParams {
  id: string;
  data: UpdateEventRequest;
}

export const useUpdateEvent = (): UseMutationResult<EventResponse, Error, UpdateEventParams> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateEventParams) => eventService.updateEvent(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEYS.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEYS.lists() });
    },
  });
};
