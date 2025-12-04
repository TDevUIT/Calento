'use client';

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { eventService } from '@/service';
import { PaginatedEventsResponse, RecurringEventsQueryParams } from '@/interface/event.interface';
import { EVENT_QUERY_KEYS } from './query-keys';

/**
 * Hook to fetch expanded recurring events
 */
export const useRecurringEvents = (
  params: RecurringEventsQueryParams
): UseQueryResult<PaginatedEventsResponse, Error> => {
  return useQuery({
    queryKey: EVENT_QUERY_KEYS.recurring(params),
    queryFn: () => eventService.expandRecurringEvents(params),
    staleTime: 30 * 1000, // Consider data fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    enabled: !!params.start_date && !!params.end_date,
    refetchOnMount: true, // Refetch on mount if stale
  });
};
