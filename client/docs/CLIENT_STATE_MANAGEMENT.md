# Client State Management - TanStack Query + Zustand

## 📋 Tổng Quan

Tài liệu này mô tả kiến trúc quản lý state và data fetching trong Tempra Client, sử dụng **TanStack Query v5** cho server state và **Zustand** cho client state.

## 🏗️ Kiến Trúc Tổng Thể

```
┌─────────────────────────────────────────────────────────────────┐
│                        REACT COMPONENTS                          │
│                     (UI Layer)                                   │
└─────────────────────────────────────────────────────────────────┘
           │                    │                    │
           │ useEvents()        │ useAuthStore()     │ useAIChat()
           ▼                    ▼                    ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  TANSTACK QUERY  │  │     ZUSTAND      │  │   MUTATIONS      │
│  (Server State)  │  │  (Client State)  │  │  (Write Ops)     │
└──────────────────┘  └──────────────────┘  └──────────────────┘
           │                    │                    │
           │ eventService       │ localStorage       │ API calls
           ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SERVICE LAYER                               │
│         (event.service, auth.service, ai.service)                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ axios instance
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND API                               │
│                    (NestJS Server)                               │
└─────────────────────────────────────────────────────────────────┘
```

## 📂 Cấu Trúc Thư Mục

```
client/
├── hook/                           # Custom React hooks
│   ├── event/                      # Event-related hooks
│   │   ├── query-keys.ts          # Query key factory
│   │   ├── use-events.tsx         # List events query
│   │   ├── use-event-detail.tsx   # Single event query
│   │   └── use-event-mutations.tsx # Create/Update/Delete mutations
│   ├── ai/                         # AI-related hooks
│   │   ├── use-ai-chat.tsx
│   │   └── use-conversations.tsx
│   └── auth/                       # Auth hooks
│       └── use-login.tsx
│
├── service/                        # API services
│   ├── event.service.ts
│   ├── ai.service.ts
│   └── auth.service.ts
│
├── store/                          # Zustand stores
│   ├── auth.store.ts
│   ├── calendar-settings.store.ts
│   └── user-settings.store.ts
│
└── provider/                       # React providers
    └── query-provider.tsx          # QueryClient provider
```

## 🎯 TanStack Query (Server State Management)

### 1. Setup QueryClient

**File:** `provider/query-provider.tsx`

```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 5 * 60 * 1000,      // 5 minutes
                gcTime: 10 * 60 * 1000,        // 10 minutes (formerly cacheTime)
                refetchOnWindowFocus: true,     // Refetch on window focus
                retry: 3,                       // Retry failed requests 3 times
            },
        },
    }));

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
```

**Key Concepts:**
- `staleTime`: Thời gian data được coi là "fresh" (không cần refetch)
- `gcTime`: Thời gian data được cache sau khi không còn observers
- `refetchOnWindowFocus`: Tự động refetch khi user quay lại tab
- `retry`: Số lần retry khi request fail

### 2. Query Keys Pattern

**File:** `hook/event/query-keys.ts`

```typescript
export const EVENT_QUERY_KEYS = {
  all: ['events'] as const,
  
  lists: () => [...EVENT_QUERY_KEYS.all, 'list'] as const,
  
  list: (params?: EventQueryParams) => 
    [...EVENT_QUERY_KEYS.lists(), params] as const,
  
  byDateRange: (startDate: string, endDate: string, params?) => 
    [...EVENT_QUERY_KEYS.lists(), 'dateRange', { startDate, endDate, ...params }] as const,
  
  search: (searchTerm: string, params?) =>
    [...EVENT_QUERY_KEYS.lists(), 'search', { searchTerm, ...params }] as const,
  
  details: () => [...EVENT_QUERY_KEYS.all, 'detail'] as const,
  
  detail: (id: string) => 
    [...EVENT_QUERY_KEYS.details(), id] as const,
} as const;
```

**Query Key Hierarchy:**
```
['events']                                    // All events
  ├── ['events', 'list']                     // All event lists
  │   ├── ['events', 'list', params]         // Paginated list
  │   ├── ['events', 'list', 'dateRange', {...}]  // Date range filtered
  │   └── ['events', 'list', 'search', {...}]     // Search results
  └── ['events', 'detail']                   // All event details
      └── ['events', 'detail', id]           // Specific event
```

### 3. Query Hooks

#### useEvents - Fetch Event List

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import { eventService } from '@/service/event.service';
import { EVENT_QUERY_KEYS } from './query-keys';

export const useEvents = (params?: EventQueryParams) => {
  return useQuery({
    queryKey: EVENT_QUERY_KEYS.list(params),
    queryFn: () => eventService.getEvents(params),
    staleTime: 0,                     // Always consider data stale
    gcTime: 0,                        // Don't cache
    refetchOnWindowFocus: true,
    refetchOnMount: 'always',
  });
};
```

#### useEventsByDateRange - Date Range Query

```typescript
export const useEventsByDateRange = (
  startDate: string,
  endDate: string,
  params?: Omit<EventQueryParams, 'start_date' | 'end_date'>
) => {
  return useQuery({
    queryKey: EVENT_QUERY_KEYS.byDateRange(startDate, endDate, params),
    queryFn: () => eventService.getEventsByDateRange(startDate, endDate, params),
    staleTime: 30 * 1000,            // 30 seconds
    enabled: !!startDate && !!endDate,  // Only run if dates provided
    refetchOnMount: true,
  });
};
```

### 4. Mutation Hooks

#### useCreateEvent

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService } from '@/service/event.service';
import { EVENT_QUERY_KEYS } from './query-keys';
import { toast } from 'sonner';

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEventRequest) => eventService.createEvent(data),
    
    onSuccess: async (newEvent, variables) => {
      // 1. Update cache with new event detail
      if (newEvent?.data?.id) {
        queryClient.setQueryData(
          EVENT_QUERY_KEYS.detail(newEvent.data.id), 
          newEvent
        );
      }
      
      // 2. Remove all cached queries
      queryClient.removeQueries({ 
        queryKey: EVENT_QUERY_KEYS.all,
      });
      
      // 3. Invalidate and refetch active queries
      await queryClient.invalidateQueries({ 
        queryKey: EVENT_QUERY_KEYS.all,
        refetchType: 'active'
      });
      
      // 4. Show success toast
      toast.success('Event created successfully!');
    },

    onError: (error) => {
      toast.error('Failed to create event', {
        description: error.message,
      });
    },
  });
};
```

**Mutation Flow:**
1. `mutationFn`: Execute API call
2. `onSuccess`: Update cache và invalidate queries
3. `onError`: Handle errors
4. UI automatically updates via query invalidation

#### useUpdateEvent

```typescript
export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => eventService.updateEvent(id, data),
    
    onSuccess: async (updatedEvent, variables) => {
      // Update specific event cache
      queryClient.setQueryData(
        EVENT_QUERY_KEYS.detail(variables.id),
        updatedEvent
      );
      
      // Invalidate all event lists
      queryClient.removeQueries({ 
        queryKey: EVENT_QUERY_KEYS.all,
      });
      
      await queryClient.invalidateQueries({ 
        queryKey: EVENT_QUERY_KEYS.all,
        refetchType: 'active'
      });
      
      toast.success('Event updated successfully!');
    },
  });
};
```

