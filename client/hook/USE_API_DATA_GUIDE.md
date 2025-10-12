# 🎯 useApiData Hook - Unified API Data Extraction

## 📋 Problem

Backend returns **double-wrapped** responses:
```typescript
{
  data: {           // Wrap 1
    data: {         // Wrap 2
      items: [...], // Actual data
      meta: {...}
    }
  }
}
```

**Before:** Phải viết nhiều lần
```typescript
const calendars = data?.data?.data?.items || [];
const events = data?.data?.data?.items || [];
const users = data?.data?.data?.items || [];
```

**After:** Dùng utility hook
```typescript
const { items: calendars } = useApiData<Calendar>(queryResult);
const { items: events } = useApiData<Event>(queryResult);
const { items: users } = useApiData<User>(queryResult);
```

---

## 🎨 API

### useApiData<T> - For Paginated Lists

```typescript
function useApiData<T>(
  queryResult: UseQueryResult<any, Error>
): {
  items: T[];           // Extracted items array
  meta?: any;           // Pagination metadata
  isLoading: boolean;   // Loading state
  error: Error | null;  // Error state
  refetch: () => void;  // Refetch function
}
```

### useApiItem<T> - For Single Items

```typescript
function useApiItem<T>(
  queryResult: UseQueryResult<any, Error>
): {
  item: T | null;       // Single item or null
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}
```

---

## 📚 Usage Examples

### 1. Calendar List (Paginated)

```typescript
'use client';

import { useCalendars } from '@/hook/calendar';
import { useApiData } from '@/hook/use-api-data';
import { Calendar } from '@/interface/calendar.interface';

function CalendarList() {
  const queryResult = useCalendars({ page: 1, limit: 20 });
  const { items: calendars, meta, isLoading, error } = useApiData<Calendar>(queryResult);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {calendars.map(calendar => (
        <div key={calendar.id}>{calendar.name}</div>
      ))}
      <p>Total: {meta?.total}</p>
    </div>
  );
}
```

### 2. Single Calendar Detail

```typescript
import { useCalendarDetail } from '@/hook/calendar';
import { useApiItem } from '@/hook/use-api-data';

function CalendarDetail({ id }: { id: string }) {
  const queryResult = useCalendarDetail(id);
  const { item: calendar, isLoading, error } = useApiItem<Calendar>(queryResult);

  if (isLoading) return <div>Loading...</div>;
  if (!calendar) return <div>Calendar not found</div>;

  return (
    <div>
      <h1>{calendar.name}</h1>
      <p>{calendar.description}</p>
    </div>
  );
}
```

### 3. Event List

```typescript
import { useEvents } from '@/hook/event';
import { useApiData } from '@/hook/use-api-data';
import { Event } from '@/interface/event.interface';

function EventList() {
  const queryResult = useEvents({ page: 1, limit: 10 });
  const { items: events, meta, isLoading } = useApiData<Event>(queryResult);

  return (
    <div>
      {events.map(event => (
        <div key={event.id}>{event.title}</div>
      ))}
      <p>Page {meta?.page} of {meta?.totalPages}</p>
    </div>
  );
}
```

### 4. Search with Pagination

```typescript
import { useSearchEvents } from '@/hook/event';
import { useApiData } from '@/hook/use-api-data';

function EventSearch({ searchTerm }: { searchTerm: string }) {
  const queryResult = useSearchEvents(searchTerm);
  const { items: events, meta, isLoading } = useApiData<Event>(queryResult);

  return (
    <div>
      {isLoading ? (
        <div>Searching...</div>
      ) : (
        <>
          <p>Found {meta?.total} events</p>
          {events.map(event => (
            <div key={event.id}>{event.title}</div>
          ))}
        </>
      )}
    </div>
  );
}
```

### 5. With Refetch

```typescript
function CalendarListWithRefresh() {
  const queryResult = useCalendars();
  const { items: calendars, refetch, isLoading } = useApiData<Calendar>(queryResult);

  return (
    <div>
      <button onClick={() => refetch()}>
        Refresh Calendars
      </button>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        calendars.map(cal => <div key={cal.id}>{cal.name}</div>)
      )}
    </div>
  );
}
```

---

## 🔧 How It Works

### Input: React Query Result
```typescript
const queryResult = useCalendars();
// queryResult.data = {
//   data: {
//     data: {
//       items: [...],
//       meta: {...}
//     }
//   }
// }
```

### Processing: useApiData
```typescript
const { items, meta } = useApiData<Calendar>(queryResult);
// Extracts:
// - items = data.data.data.items
// - meta = data.data.data.meta
```

### Output: Clean Data
```typescript
items: Calendar[]  // Ready to use!
meta: { page, limit, total, ... }
```

---

## ✅ Benefits

### 1. **DRY Principle**
```typescript
// ❌ Before (Repetitive)
const calendars = data?.data?.data?.items || [];
const events = data?.data?.data?.items || [];
const users = data?.data?.data?.items || [];

// ✅ After (Reusable)
const { items: calendars } = useApiData<Calendar>(useCalendars());
const { items: events } = useApiData<Event>(useEvents());
const { items: users } = useApiData<User>(useUsers());
```

### 2. **Type Safety**
```typescript
const { items: calendars } = useApiData<Calendar>(queryResult);
// calendars is typed as Calendar[]
```

### 3. **Consistent Interface**
```typescript
// All hooks return same structure
const { items, meta, isLoading, error, refetch } = useApiData(...);
```

### 4. **Easy to Update**
```typescript
// If backend response changes, update ONE file
// All components automatically fixed!
```

---

## 🎯 Migration Guide

### Before
```typescript
function MyComponent() {
  const { data, isLoading, error } = useCalendars();
  const calendars = data?.data?.data?.items || [];
  const meta = data?.data?.data?.meta;
  
  // Use calendars...
}
```

### After
```typescript
function MyComponent() {
  const queryResult = useCalendars();
  const { items: calendars, meta, isLoading, error } = useApiData<Calendar>(queryResult);
  
  // Use calendars...
}
```

---

## 🔄 Works With All Hooks

### Calendar Hooks
```typescript
useCalendars() → useApiData<Calendar>()
useCalendarDetail() → useApiItem<Calendar>()
useSearchCalendars() → useApiData<Calendar>()
```

### Event Hooks
```typescript
useEvents() → useApiData<Event>()
useEventDetail() → useApiItem<Event>()
useSearchEvents() → useApiData<Event>()
useRecurringEvents() → useApiData<Event>()
```

### User Hooks (Future)
```typescript
useUsers() → useApiData<User>()
useUserDetail() → useApiItem<User>()
```

---

## 🐛 Troubleshooting

### Issue: items is empty but data exists
```typescript
// Debug: Check actual response structure
const { data } = useCalendars();
console.log('Response:', data);

// Adjust hook if needed
const nestedData = data?.data?.data;  // Current
// or
const nestedData = data?.data;        // If single wrap
```

### Issue: TypeScript errors
```typescript
// Ensure generic type is specified
const { items } = useApiData<Calendar>(queryResult);
//                            ^^^^^^^^ Important!
```

---

## 📝 Summary

**Created:**
- ✅ `client/hook/use-api-data.ts` - Utility hook
- ✅ `client/hook/USE_API_DATA_GUIDE.md` - Documentation

**Usage:**
```typescript
// 1. Import
import { useApiData } from '@/hook/use-api-data';

// 2. Use with any query hook
const queryResult = useCalendars();

// 3. Extract data
const { items, meta, isLoading, error } = useApiData<Calendar>(queryResult);

// 4. Use items directly
items.map(item => ...)
```

**Benefits:**
- ✅ No more `data?.data?.data?.items`
- ✅ Consistent interface
- ✅ Type safe
- ✅ Easy to maintain
- ✅ Works with all APIs

---

**Date:** October 12, 2025  
**Status:** ✅ READY TO USE
