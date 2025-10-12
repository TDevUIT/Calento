# Event Hooks Documentation

Complete React Query hooks for Event/Calendar operations in Tempra.

## 📁 Structure

```
hook/event/
├── index.ts                    # Main export file
├── query-keys.ts              # Centralized query keys
├── use-events.tsx             # List & date range queries
├── use-event-detail.tsx       # Single event query
├── use-create-event.tsx       # Create mutation
├── use-update-event.tsx       # Update mutation
├── use-delete-event.tsx       # Delete mutation
├── use-recurring-events.tsx   # Recurring events expansion
├── use-search-events.tsx      # Search with debounce
└── README.md                  # This file
```

## 🎯 Available Hooks

### Query Hooks (Fetching Data)

#### 1. **useEvents** - Get paginated events
```tsx
import { useEvents } from '@/hook/event';

function EventsList() {
  const { data, isLoading, error } = useEvents({
    page: 1,
    limit: 20,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.data.map(event => (
        <div key={event.id}>{event.title}</div>
      ))}
      <p>Total: {data?.meta.total}</p>
    </div>
  );
}
```

#### 2. **useEventsByDateRange** - Filter by date range
```tsx
import { useEventsByDateRange } from '@/hook/event';

function CalendarView() {
  const startDate = '2024-01-01T00:00:00Z';
  const endDate = '2024-01-31T23:59:59Z';

  const { data } = useEventsByDateRange(startDate, endDate, {
    page: 1,
    limit: 50,
  });

  return <div>Events in January: {data?.meta.total}</div>;
}
```

#### 3. **useEventDetail** - Get single event
```tsx
import { useEventDetail } from '@/hook/event';

function EventDetail({ eventId }: { eventId: string }) {
  const { data, isLoading } = useEventDetail(eventId);

  if (isLoading) return <div>Loading event...</div>;

  return (
    <div>
      <h1>{data?.data.title}</h1>
      <p>{data?.data.description}</p>
      <p>Start: {new Date(data?.data.start_time).toLocaleString()}</p>
    </div>
  );
}
```

#### 4. **useRecurringEvents** - Expand recurring events
```tsx
import { useRecurringEvents } from '@/hook/event';

function RecurringEventsList() {
  const { data } = useRecurringEvents({
    start_date: '2024-01-01T00:00:00Z',
    end_date: '2024-12-31T23:59:59Z',
    max_occurrences: 100,
    page: 1,
    limit: 50,
  });

  return (
    <div>
      {data?.data.map(event => (
        <div key={event.id}>
          {event.title} - Occurrence #{event.occurrence_index}
        </div>
      ))}
    </div>
  );
}
```

#### 5. **useSearchEvents** - Search with debounce
```tsx
import { useSearchEvents } from '@/hook/event';
import { useState } from 'react';

function EventSearch() {
  const [search, setSearch] = useState('');
  
  // Automatically debounced (300ms default)
  const { data, isLoading } = useSearchEvents(search, {
    page: 1,
    limit: 10,
  });

  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search events..."
      />
      {isLoading && <div>Searching...</div>}
      {data?.data.map(event => (
        <div key={event.id}>{event.title}</div>
      ))}
    </div>
  );
}
```

### Mutation Hooks (Creating/Updating/Deleting)

#### 1. **useCreateEvent** - Create new event
```tsx
import { useCreateEvent } from '@/hook/event';

function CreateEventForm() {
  const { mutate, isPending } = useCreateEvent();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    mutate({
      title: 'Team Meeting',
      description: 'Weekly sync',
      start_time: '2024-01-15T10:00:00Z',
      end_time: '2024-01-15T11:00:00Z',
      location: 'Conference Room A',
      is_all_day: false,
      recurrence_rule: 'FREQ=WEEKLY;BYDAY=MO',
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Event'}
      </button>
    </form>
  );
}
```

#### 2. **useUpdateEvent** - Update existing event
```tsx
import { useUpdateEvent } from '@/hook/event';

function UpdateEventForm({ eventId }: { eventId: string }) {
  const { mutate, isPending } = useUpdateEvent();

  const handleUpdate = () => {
    mutate({
      id: eventId,
      data: {
        title: 'Updated Meeting Title',
        location: 'Conference Room B',
      },
    });
  };

  return (
    <button onClick={handleUpdate} disabled={isPending}>
      {isPending ? 'Updating...' : 'Update Event'}
    </button>
  );
}
```

#### 3. **useDeleteEvent** - Delete event
```tsx
import { useDeleteEvent } from '@/hook/event';

function DeleteEventButton({ eventId }: { eventId: string }) {
  const { mutate, isPending } = useDeleteEvent();

  const handleDelete = () => {
    if (confirm('Delete this event?')) {
      mutate(eventId);
    }
  };

  return (
    <button onClick={handleDelete} disabled={isPending}>
      {isPending ? 'Deleting...' : 'Delete Event'}
    </button>
  );
}
```

## 🔑 Query Keys

Centralized query keys for cache management:

```tsx
import { EVENT_QUERY_KEYS } from '@/hook/event';

// Invalidate all events
queryClient.invalidateQueries({ 
  queryKey: EVENT_QUERY_KEYS.all 
});

// Invalidate all lists
queryClient.invalidateQueries({ 
  queryKey: EVENT_QUERY_KEYS.lists() 
});

// Invalidate specific event
queryClient.invalidateQueries({ 
  queryKey: EVENT_QUERY_KEYS.detail(eventId) 
});
```

## 🎨 Advanced Usage

### Combining Multiple Hooks

```tsx
import { 
  useEvents, 
  useCreateEvent, 
  useDeleteEvent 
} from '@/hook/event';

function EventManager() {
  const { data: events, refetch } = useEvents({ page: 1, limit: 20 });
  const createMutation = useCreateEvent();
  const deleteMutation = useDeleteEvent();

  const handleCreate = (newEvent) => {
    createMutation.mutate(newEvent, {
      onSuccess: () => {
        refetch(); // Manually refetch if needed
      },
    });
  };

  return (
    <div>
      {/* Your UI */}
    </div>
  );
}
```

### Custom onSuccess/onError

```tsx
import { useCreateEvent } from '@/hook/event';
import { useRouter } from 'next/navigation';

function CreateEventWithRedirect() {
  const router = useRouter();
  const { mutate } = useCreateEvent();

  const handleCreate = (data) => {
    mutate(data, {
      onSuccess: (response) => {
        console.log('Event created:', response);
        router.push(`/events/${response.data.id}`);
      },
      onError: (error) => {
        console.error('Failed:', error);
        // Custom error handling
      },
    });
  };

  return <div>...</div>;
}
```

### Optimistic Updates

```tsx
import { useUpdateEvent } from '@/hook/event';
import { useQueryClient } from '@tanstack/react-query';
import { EVENT_QUERY_KEYS } from '@/hook/event';

function OptimisticUpdate({ eventId }: { eventId: string }) {
  const queryClient = useQueryClient();
  const { mutate } = useUpdateEvent();

  const handleUpdate = (newTitle: string) => {
    mutate(
      { id: eventId, data: { title: newTitle } },
      {
        // Optimistically update cache before API call
        onMutate: async ({ data }) => {
          // Cancel outgoing refetches
          await queryClient.cancelQueries({ 
            queryKey: EVENT_QUERY_KEYS.detail(eventId) 
          });

          // Snapshot previous value
          const previousEvent = queryClient.getQueryData(
            EVENT_QUERY_KEYS.detail(eventId)
          );

          // Optimistically update
          queryClient.setQueryData(
            EVENT_QUERY_KEYS.detail(eventId),
            (old: any) => ({
              ...old,
              data: { ...old.data, ...data },
            })
          );

          return { previousEvent };
        },
        // Rollback on error
        onError: (err, variables, context) => {
          queryClient.setQueryData(
            EVENT_QUERY_KEYS.detail(eventId),
            context?.previousEvent
          );
        },
      }
    );
  };

  return <div>...</div>;
}
```

## 🔄 Auto-Refetch Configuration

All hooks come with sensible defaults:

- **Lists**: 5 minutes stale time, refetch on window focus
- **Details**: 5 minutes stale time
- **Recurring**: 2 minutes stale time (shorter for dynamic data)
- **Search**: 1 minute stale time

To override:

```tsx
const { data } = useEvents(
  { page: 1 },
  {
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchInterval: 30000, // Refetch every 30s
  }
);
```

## 🎯 TypeScript Support

All hooks are fully typed with TypeScript:

```tsx
import type {
  Event,
  CreateEventRequest,
  UpdateEventRequest,
  EventQueryParams,
  PaginatedEventsResponse,
} from '@/interface/event.interface';

const { data } = useEvents(); // data is typed as PaginatedEventsResponse
```

## 📦 Dependencies

- `@tanstack/react-query` - Data fetching & caching
- `sonner` - Toast notifications
- Custom `useDebounce` hook for search

## 🚀 Best Practices

1. **Use query keys** - Always use `EVENT_QUERY_KEYS` for cache invalidation
2. **Handle loading states** - Check `isLoading`, `isPending` for UX
3. **Error boundaries** - Wrap components in error boundaries
4. **Optimistic updates** - For better UX on mutations
5. **Debounce search** - Already built-in with `useSearchEvents`

## 🐛 Troubleshooting

### Events not updating after mutation?
- Check if `queryClient.invalidateQueries` is being called
- Verify query keys match between query and invalidation

### Search not working?
- Ensure search term is at least 2 characters (built-in minimum)
- Check debounce delay (default 300ms)

### Too many API calls?
- Adjust `staleTime` in query options
- Set `refetchOnWindowFocus: false` if needed
