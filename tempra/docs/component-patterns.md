# Component Patterns & Implementation Guide

Cập nhật: 2025-09-26  
Phạm vi: Modern React patterns, shadcn/ui, Form handling, State management

## 1. Component Architecture Patterns

### 1.1 Compound Components Pattern
```typescript
// components/calendar/CalendarView.tsx
import { createContext, useContext } from 'react';

interface CalendarContextType {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  events: CalendarEvent[];
}

const CalendarContext = createContext<CalendarContextType | null>(null);

export const Calendar = ({ children, ...props }: CalendarProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { data: events = [] } = useEvents(
    startOfMonth(selectedDate).toISOString(),
    endOfMonth(selectedDate).toISOString()
  );

  return (
    <CalendarContext.Provider value={{
      selectedDate,
      onDateSelect: setSelectedDate,
      events,
    }}>
      <div className="calendar-container">
        {children}
      </div>
    </CalendarContext.Provider>
  );
};

Calendar.Header = ({ children }: { children: React.ReactNode }) => {
  const context = useContext(CalendarContext);
  if (!context) throw new Error('Calendar.Header must be used within Calendar');
  
  return <div className="calendar-header">{children}</div>;
};

Calendar.Grid = () => {
  const context = useContext(CalendarContext);
  if (!context) throw new Error('Calendar.Grid must be used within Calendar');
  
  return (
    <div className="calendar-grid">
      {/* Calendar grid implementation */}
    </div>
  );
};

// Usage
<Calendar>
  <Calendar.Header>
    <h2>September 2025</h2>
  </Calendar.Header>
  <Calendar.Grid />
</Calendar>
```

### 1.2 Render Props Pattern
```typescript
// components/data/DataFetcher.tsx
interface DataFetcherProps<T> {
  queryKey: string[];
  queryFn: () => Promise<T>;
  children: (props: {
    data: T | undefined;
    isLoading: boolean;
    error: Error | null;
    refetch: () => void;
  }) => React.ReactNode;
}

export function DataFetcher<T>({ queryKey, queryFn, children }: DataFetcherProps<T>) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn,
  });

  return <>{children({ data, isLoading, error, refetch })}</>;
}

// Usage
<DataFetcher
  queryKey={['events', timeRange]}
  queryFn={() => calendarService.getEvents(timeRange)}
>
  {({ data: events, isLoading, error }) => (
    <div>
      {isLoading && <Skeleton />}
      {error && <ErrorMessage error={error} />}
      {events && <EventsList events={events} />}
    </div>
  )}
</DataFetcher>
```

## 2. Form Components with React Hook Form

### 2.1 Event Form Component
```typescript
// components/forms/EventForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const eventSchema = z.object({
  summary: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().optional(),
  start: z.object({
    dateTime: z.string().min(1, 'Start time is required'),
    timeZone: z.string().default('UTC'),
  }),
  end: z.object({
    dateTime: z.string().min(1, 'End time is required'),
    timeZone: z.string().default('UTC'),
  }),
  attendees: z.array(z.string().email()).optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

interface EventFormProps {
  initialData?: Partial<EventFormData>;
  onSubmit: (data: EventFormData) => void;
  isLoading?: boolean;
}

export function EventForm({ initialData, onSubmit, isLoading }: EventFormProps) {
  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      summary: '',
      description: '',
      start: { dateTime: '', timeZone: 'UTC' },
      end: { dateTime: '', timeZone: 'UTC' },
      attendees: [],
      ...initialData,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter event title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Add event description..." 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start.dateTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end.dateTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Saving...' : 'Save Event'}
        </Button>
      </form>
    </Form>
  );
}
```

### 2.2 Form Usage with Mutations
```typescript
// app/(dashboard)/events/create/page.tsx
'use client';

import { EventForm } from '@/components/forms/EventForm';
import { useCreateEvent } from '@/lib/hooks/use-calendar';
import { useRouter } from 'next/navigation';

export default function CreateEventPage() {
  const router = useRouter();
  const createEventMutation = useCreateEvent();

  const handleSubmit = (data: EventFormData) => {
    createEventMutation.mutate(data, {
      onSuccess: () => {
        router.push('/dashboard');
      },
    });
  };

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Event</h1>
      <EventForm 
        onSubmit={handleSubmit}
        isLoading={createEventMutation.isPending}
      />
    </div>
  );
}
```

## 3. Loading States & Error Handling

### 3.1 Loading Components
```typescript
// components/ui/loading-states.tsx
import { Skeleton } from '@/components/ui/skeleton';

export function EventCardSkeleton() {
  return (
    <div className="p-4 border rounded-lg space-y-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <div className="flex gap-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

export function CalendarSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 35 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    </div>
  );
}

// Usage with Suspense
import { Suspense } from 'react';

function EventsPage() {
  return (
    <Suspense fallback={<CalendarSkeleton />}>
      <EventsCalendar />
    </Suspense>
  );
}
```

### 3.2 Error Boundary
```typescript
// components/error-boundary.tsx
'use client';

import { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">
            We encountered an error while loading this content.
          </p>
          <Button 
            onClick={() => this.setState({ hasError: false })}
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## 4. Advanced Component Patterns

### 4.1 Modal Management
```typescript
// lib/hooks/use-modal.ts
import { create } from 'zustand';

interface ModalStore {
  modals: Record<string, boolean>;
  openModal: (id: string) => void;
  closeModal: (id: string) => void;
  toggleModal: (id: string) => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  modals: {},
  openModal: (id) => set((state) => ({ 
    modals: { ...state.modals, [id]: true } 
  })),
  closeModal: (id) => set((state) => ({ 
    modals: { ...state.modals, [id]: false } 
  })),
  toggleModal: (id) => set((state) => ({ 
    modals: { ...state.modals, [id]: !state.modals[id] } 
  })),
}));

// components/modals/EventModal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useModalStore } from '@/lib/hooks/use-modal';

interface EventModalProps {
  eventId?: string;
}

export function EventModal({ eventId }: EventModalProps) {
  const { modals, closeModal } = useModalStore();
  const isOpen = modals['event-modal'] || false;

  return (
    <Dialog open={isOpen} onOpenChange={() => closeModal('event-modal')}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {eventId ? 'Edit Event' : 'Create Event'}
          </DialogTitle>
        </DialogHeader>
        <EventForm 
          initialData={eventId ? getEventData(eventId) : undefined}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
```

### 4.2 Infinite Scroll with TanStack Query
```typescript
// lib/hooks/use-infinite-events.ts
import { useInfiniteQuery } from '@tanstack/react-query';
import { calendarService } from '@/lib/api/services/calendar.service';

export function useInfiniteEvents(filters: EventFilters) {
  return useInfiniteQuery({
    queryKey: ['events', 'infinite', filters],
    queryFn: ({ pageParam = null }) =>
      calendarService.getEvents({
        ...filters,
        pageToken: pageParam,
      }),
    getNextPageParam: (lastPage) => lastPage.data.data.nextPageToken || null,
    initialPageParam: null,
  });
}

// components/events/InfiniteEventsList.tsx
import { useInfiniteEvents } from '@/lib/hooks/use-infinite-events';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

export function InfiniteEventsList({ filters }: { filters: EventFilters }) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteEvents(filters);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (isLoading) return <EventCardSkeleton />;

  const events = data?.pages.flatMap(page => page.data.data.items) || [];

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
      
      {hasNextPage && (
        <div ref={ref} className="flex justify-center p-4">
          {isFetchingNextPage ? <Spinner /> : null}
        </div>
      )}
    </div>
  );
}
```

## 5. Performance Optimization Patterns

### 5.1 Memoization
```typescript
// components/calendar/CalendarDay.tsx
import { memo } from 'react';

interface CalendarDayProps {
  date: Date;
  events: CalendarEvent[];
  isSelected: boolean;
  onSelect: (date: Date) => void;
}

export const CalendarDay = memo(({ date, events, isSelected, onSelect }: CalendarDayProps) => {
  const handleClick = useCallback(() => {
    onSelect(date);
  }, [date, onSelect]);

  return (
    <button
      onClick={handleClick}
      className={cn(
        'calendar-day',
        isSelected && 'selected'
      )}
    >
      <span>{format(date, 'd')}</span>
      {events.length > 0 && (
        <div className="event-indicators">
          {events.slice(0, 3).map((event) => (
            <div key={event.id} className="event-dot" />
          ))}
        </div>
      )}
    </button>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for better performance
  return (
    prevProps.date.getTime() === nextProps.date.getTime() &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.events.length === nextProps.events.length
  );
});
```

### 5.2 Virtual Scrolling for Large Lists
```typescript
// components/events/VirtualizedEventsList.tsx
import { FixedSizeList as List } from 'react-window';

interface VirtualizedEventsListProps {
  events: CalendarEvent[];
  height: number;
  itemHeight: number;
}

const EventRow = ({ index, style, data }: any) => (
  <div style={style}>
    <EventCard event={data[index]} />
  </div>
);

export function VirtualizedEventsList({ 
  events, 
  height, 
  itemHeight 
}: VirtualizedEventsListProps) {
  return (
    <List
      height={height}
      itemCount={events.length}
      itemSize={itemHeight}
      itemData={events}
    >
      {EventRow}
    </List>
  );
}
```

This component patterns guide provides modern React patterns optimized for performance and maintainability, following best practices for large-scale applications.
