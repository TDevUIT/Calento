export { useEvents, useEventsByDateRange } from './use-events';
export { useEventDetail } from './use-event-detail';
export { useRecurringEvents } from './use-recurring-events';
export { useSearchEvents } from './use-search-events';

// Mutation hooks (all with optimistic updates)
export { 
  useCreateEvent,           // Create with optimistic updates
  useUpdateEvent,           // PATCH with optimistic updates  
  useReplaceEvent,          // PUT with optimistic updates
  useDeleteEvent,           // Delete with optimistic updates
  useUpdateEventWithMethod  // Flexible method with optimistic updates
} from './use-event-mutations';

// Query keys
export { EVENT_QUERY_KEYS } from './query-keys';
