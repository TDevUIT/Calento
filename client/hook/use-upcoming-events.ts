"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { addDays } from "date-fns";
import { EVENT_QUERY_KEYS } from "@/hook/event/query-keys";
import { getEventsByDateRange } from "@/service/event.service";
import type { Event } from "@/interface/event.interface";
import { DEFAULT_EVENT_COLOR } from "@/constants/theme.constants";
import { CACHE_CONFIG } from "@/constants/api.constants";

interface UseUpcomingEventsOptions {
  enabled?: boolean;
  maxEvents?: number;
  daysAhead?: number;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  location?: string;
  attendees?: number;
  color?: string;
  creator?: {
    id: string;
    name?: string;
    email?: string;
    avatar?: string;
  };
}

export function useUpcomingEvents(options: UseUpcomingEventsOptions = {}) {
  const {
    enabled = true,
    maxEvents = 5,
    daysAhead = 7
  } = options;

  const { now, endDate, startDateISO, endDateISO } = useMemo(() => {
    const nowDate = new Date();
    const endDateTime = addDays(nowDate, daysAhead);
    return {
      now: nowDate,
      endDate: endDateTime,
      startDateISO: nowDate.toISOString(),
      endDateISO: endDateTime.toISOString(),
    };
  }, [daysAhead]); // Only recalculate if daysAhead changes

  const query = useQuery({
    queryKey: EVENT_QUERY_KEYS.upcoming(startDateISO, endDateISO, maxEvents),
    queryFn: async () => {
      const response = await getEventsByDateRange(
        startDateISO,
        endDateISO,
        {
          page: 1,
          limit: maxEvents * 2, // Get more to filter properly
        }
      );

      const upcomingEvents: UpcomingEvent[] = response.data.items
        .filter((event: Event) => {
          const eventStart = new Date(event.start_time);
          return eventStart >= now; // Only future events
        })
        .sort((a: Event, b: Event) => {
          return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
        })
        .slice(0, maxEvents)
        .map((event: Event): UpcomingEvent => ({
          id: event.id,
          title: event.title,
          start_time: typeof event.start_time === 'string' ? event.start_time : event.start_time.toISOString(),
          end_time: typeof event.end_time === 'string' ? event.end_time : event.end_time.toISOString(),
          location: event.location,
          attendees: event.attendees?.length || 0,
          color: event.color || DEFAULT_EVENT_COLOR,
          creator: event.creator ? {
            id: event.creator.id,
            name: event.creator.name || event.creator.email,
            email: event.creator.email,
            avatar: event.creator.avatar,
          } : undefined,
        }));

      return upcomingEvents;
    },
    enabled,
    staleTime: CACHE_CONFIG.STALE_TIME,
    gcTime: CACHE_CONFIG.GC_TIME,
    refetchInterval: false,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: CACHE_CONFIG.RETRY,
  });

  return {
    events: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
