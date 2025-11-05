# Client State Management - Part 2: Service Layer & Zustand

## 🔌 Service Layer (API Integration)

### 1. Axios Configuration

**File:** `config/axios.ts`

```typescript
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  timeout: 30000,
  withCredentials: true,  // Important for cookie-based auth
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const getErrorMessage = (error: any): string => {
  return error.response?.data?.message || error.message || 'Unknown error';
};
```

### 2. Event Service

**File:** `service/event.service.ts`

```typescript
import { api, getErrorMessage } from '../config/axios';
import { API_ROUTES } from '../constants/routes';

export const getEvents = async (params?: EventQueryParams) => {
  try {
    const response = await api.get(API_ROUTES.EVENTS, {
      params,
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const createEvent = async (data: CreateEventRequest) => {
  try {
    const response = await api.post(API_ROUTES.EVENT_CREATE, data, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const eventService = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventsByDateRange,
  searchEvents,
};
```

### 3. AI Service

**File:** `service/ai.service.ts`

```typescript
export const chat = async (data: ChatRequest): Promise<ChatResponse> => {
  try {
    const response = await api.post(API_ROUTES.AI_CHAT, data, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const aiService = {
  chat,
  getConversations,
  deleteConversation,
};
```

## 🗄️ Zustand (Client State Management)

### 1. Auth Store với Persist Middleware

**File:** `store/auth.store.ts`

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    immer((set) => ({
      ...initialState,

      setUser: (user) =>
        set((state) => {
          state.user = user;
          state.isAuthenticated = !!user;
          state.error = null;
        }),

      login: async (credentials) => {
        try {
          set((state) => {
            state.isLoading = true;
            state.error = null;
          });

          const response = await login(credentials);
          
          set((state) => {
            state.user = response.user;
            state.isAuthenticated = true;
            state.isLoading = false;
          });
        } catch (error) {
          set((state) => {
            state.error = error.message;
            state.isLoading = false;
          });
          throw error;
        }
      },

      logout: async () => {
        await logout();
        set((state) => {
          state.user = null;
          state.isAuthenticated = false;
          state.error = null;
        });
      },

      checkAuthStatus: async () => {
        try {
          const user = await getCurrentUser();
          set((state) => {
            state.user = user;
            state.isAuthenticated = true;
            state.isLoading = false;
          });
        } catch (error) {
          set((state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.isLoading = false;
          });
        }
      },
    })),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
```

**Key Features:**
- `persist`: Tự động lưu vào localStorage
- `immer`: Immutable state updates
- `partialize`: Chỉ lưu user và isAuthenticated

### 2. Calendar Settings Store

**File:** `store/calendar-settings.store.ts`

```typescript
interface CalendarSettingsState {
  defaultView: 'day' | 'week' | 'month' | 'year';
  weekStartsOn: 0 | 1 | 6;
  timeFormat: '12h' | '24h';
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  enableKeyboardShortcuts: boolean;
}

interface CalendarSettingsActions {
  updateSettings: (settings: Partial<CalendarSettingsState>) => void;
  reset: () => void;
}

export const useCalendarSettingsStore = create<CalendarSettingsStore>()(
  persist(
    (set) => ({
      defaultView: 'month',
      weekStartsOn: 1,
      timeFormat: '24h',
      dateFormat: 'DD/MM/YYYY',
      enableKeyboardShortcuts: true,

      updateSettings: (settings) => 
        set((state) => ({ ...state, ...settings })),
      
      reset: () => set(initialState),
    }),
    {
      name: 'calendar-settings',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

## 📊 Complete Component Integration

### Calendar Page Example

```typescript
'use client';

import { useEventsByDateRange } from '@/hook/event/use-events';
import { useCalendarSettingsStore } from '@/store/calendar-settings.store';
import { useCreateEvent } from '@/hook/event/use-event-mutations';

const CalendarPage = () => {
  const [startDate, setStartDate] = useState('2024-10-01');
  const [endDate, setEndDate] = useState('2024-10-31');

  // TanStack Query - Server State
  const { 
    data: eventsData, 
    isLoading, 
    error 
  } = useEventsByDateRange(startDate, endDate);

  // Zustand - Client State
  const { 
    defaultView, 
    timeFormat 
  } = useCalendarSettingsStore();

  // Mutations
  const createEvent = useCreateEvent();

  const handleCreateEvent = async (eventData) => {
    try {
      await createEvent.mutateAsync(eventData);
      // UI updates automatically via query invalidation
    } catch (error) {
      console.error('Failed:', error);
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <Error error={error} />;

  return (
    <Calendar
      events={eventsData?.data}
      defaultView={defaultView}
      timeFormat={timeFormat}
      onCreateEvent={handleCreateEvent}
    />
  );
};
```

## 🔄 Complete Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      USER ACTION                            │
│                 (Click "Create Event")                      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  COMPONENT LAYER                            │
│  const createEvent = useCreateEvent();                      │
│  await createEvent.mutateAsync(data);                       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  TANSTACK QUERY                             │
│  useMutation({                                              │
│    mutationFn: (data) => eventService.createEvent(data)     │
│  })                                                         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  SERVICE LAYER                              │
│  eventService.createEvent(data)                             │
│  → api.post('/api/events', data)                            │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   AXIOS INTERCEPTOR                         │
│  1. Add Authorization header                                │
│  2. Set withCredentials: true                               │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND API                               │
│  POST /api/events                                           │
│  → Create event in database                                 │
│  → Return event object                                      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   RESPONSE RETURNS                          │
│  Success: { data: Event, success: true }                    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              MUTATION onSuccess CALLBACK                    │
│  1. queryClient.setQueryData() - Update cache               │
│  2. queryClient.removeQueries() - Clear stale               │
│  3. queryClient.invalidateQueries() - Refetch active        │
│  4. toast.success() - Show notification                     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                 UI AUTO RE-RENDERS                          │
│  - Event list updates automatically                         │
│  - Calendar view shows new event                            │
│  - No manual state updates needed                           │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Best Practices Summary

### TanStack Query
✅ Use query keys factory pattern
✅ Invalidate queries after mutations
✅ Set appropriate staleTime and gcTime
✅ Use `enabled` option for conditional queries
✅ Handle loading and error states

### Zustand
✅ Use persist middleware for auth/settings
✅ Use immer for immutable updates
✅ Keep stores focused and small
✅ Use selectors to prevent unnecessary re-renders

### Service Layer
✅ Centralize API calls in services
✅ Use axios interceptors for auth
✅ Handle errors consistently
✅ Type all requests and responses

### Component Integration
✅ Separate server state (TanStack Query) from client state (Zustand)
✅ Use mutations for write operations
✅ Show loading/error states
✅ Provide user feedback (toasts)

## 🔗 Related Documentation

- [TanStack Query v5](https://tanstack.com/query/latest)
- [Zustand](https://docs.pmnd.rs/zustand)
- [Axios](https://axios-http.com)
- [Immer](https://immerjs.github.io/immer/)
