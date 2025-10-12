'use client';

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { eventService } from '@/service/event.service';
import { EventResponse } from '@/interface/event.interface';
import { EVENT_QUERY_KEYS } from './query-keys';

/**
 * Hook to fetch single event by ID
 */
export const useEventById = (id: string, enabled = true): UseQueryResult<EventResponse, Error> => {
  return useQuery({
    queryKey: EVENT_QUERY_KEYS.detail(id),
    queryFn: () => eventService.getEventById(id),
    enabled: enabled && !!id,
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: false,
  });
};
