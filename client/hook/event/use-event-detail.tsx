'use client';

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { eventService } from '@/service';
import { EventResponse } from '@/interface';
import { EVENT_QUERY_KEYS } from './query-keys';

/**
 * Hook to fetch single event by ID
 */
export const useEventDetail = (eventId: string): UseQueryResult<EventResponse, Error> => {
  return useQuery({
    queryKey: EVENT_QUERY_KEYS.detail(eventId),
    queryFn: () => eventService.getEventById(eventId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!eventId,
  });
};
