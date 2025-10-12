'use client';

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { eventService } from '@/service/event.service';
import { PaginatedEventsResponse, EventQueryParams } from '@/interface/event.interface';
import { useDebounce } from '../use-debounce';
import { EVENT_QUERY_KEYS } from './query-keys';

/**
 * Hook to search events with debounce
 */
export const useSearchEvents = (
  searchTerm: string,
  params?: Omit<EventQueryParams, 'search'>,
  debounceMs: number = 300
): UseQueryResult<PaginatedEventsResponse, Error> => {
  // Debounce search term to avoid too many requests
  const debouncedSearch = useDebounce(searchTerm, debounceMs);

  return useQuery({
    queryKey: EVENT_QUERY_KEYS.search(debouncedSearch, params),
    queryFn: () => eventService.searchEvents(debouncedSearch, params),
    staleTime: 1 * 60 * 1000, // 1 minute
    enabled: debouncedSearch.length >= 2, // Only search if 2+ characters
  });
};
