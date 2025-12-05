'use client';

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { calendarService } from '@/service';
import { PaginatedCalendarsResponse, CalendarQueryParams } from '@/interface';
import { CALENDAR_QUERY_KEYS } from './query-keys';
import { useDebounce } from '@/hook/use-debounce';

/**
 * Hook to search calendars with debounce
 */
export const useSearchCalendars = (
  searchTerm: string,
  params?: Omit<CalendarQueryParams, 'search'>,
  debounceMs: number = 300
): UseQueryResult<PaginatedCalendarsResponse, Error> => {
  const debouncedSearch = useDebounce(searchTerm, debounceMs);

  return useQuery({
    queryKey: CALENDAR_QUERY_KEYS.search(debouncedSearch, params),
    queryFn: () => calendarService.searchCalendars(debouncedSearch, params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: debouncedSearch.length >= 2,
  });
};
