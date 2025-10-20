"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { addDays } from "date-fns";
import { EVENT_QUERY_KEYS } from "@/hook/event/query-keys";
import { getEventsByDateRange } from "@/service/event.service";
import type { Event } from "@/interface/event.interface";

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

  // Use stable dates to prevent query key from changing every render
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

  console.log('⚙️ [useUpcomingEvents] Hook setup:', {
    now: startDateISO,
    endDate: endDateISO,
    maxEvents,
    enabled,
  });

  const query = useQuery({
    queryKey: EVENT_QUERY_KEYS.upcoming(startDateISO, endDateISO, maxEvents),
    queryFn: async () => {
      console.log('🔍 [useUpcomingEvents] queryFn called - Fetching upcoming events...', {
        startDate: startDateISO,
        endDate: endDateISO,
        maxEvents,
      });

      const response = await getEventsByDateRange(
        startDateISO,
        endDateISO,
        {
          page: 1,
          limit: maxEvents * 2, // Get more to filter properly
        }
      );

      console.log('📦 [useUpcomingEvents] API Response:', {
        totalItems: response.data.items?.length || 0,
        meta: response.data.meta,
        items: response.data.items,
      });

      // Transform API events to UpcomingEvent format
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
          color: event.color || '#3b82f6',
          creator: event.creator ? {
            id: event.creator.id,
            name: event.creator.name || event.creator.email,
            email: event.creator.email,
            avatar: event.creator.avatar,
          } : undefined,
        }));

      console.log('✅ [useUpcomingEvents] Transformed events:', {
        count: upcomingEvents.length,
        events: upcomingEvents,
      });

      return upcomingEvents;
    },
    enabled,
    staleTime: 0, // Disable cache for debugging
    gcTime: 0, // Disable cache for debugging (formerly cacheTime)
    refetchInterval: false, // Disable auto refetch for now
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: 2,
  });

  console.log('📊 [useUpcomingEvents] Query state:', {
    status: query.status,
    fetchStatus: query.fetchStatus,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    dataLength: query.data?.length || 0,
  });

  return {
    events: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
