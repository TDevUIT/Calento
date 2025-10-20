'use client';

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { eventService } from '@/service/event.service';
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
    staleTime: 0, // Always consider data stale
    gcTime: 0, // Don't cache - always fetch fresh data
    enabled: !!params.start_date && !!params.end_date,
    refetchOnMount: 'always',
  });
};
