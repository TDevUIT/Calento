'use client';

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { eventService } from '@/service/event.service';
import { PaginatedEventsResponse, EventQueryParams } from '@/interface/event.interface';
import { useDebounce } from '../use-debounce';
import { EVENT_QUERY_KEYS } from './query-keys';

export const useSearchEvents = (
  searchTerm: string,
  params?: Omit<EventQueryParams, 'search'>,
  debounceMs: number = 300
): UseQueryResult<PaginatedEventsResponse, Error> => {
  const debouncedSearch = useDebounce(searchTerm, debounceMs);

  return useQuery({
    queryKey: EVENT_QUERY_KEYS.search(debouncedSearch, params),
    queryFn: () => eventService.searchEvents(debouncedSearch, params),
    staleTime: 1 * 60 * 1000,
    enabled: debouncedSearch.length >= 2,
  });
};
