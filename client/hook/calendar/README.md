# Calendar Hooks Documentation

Complete React Query hooks for Calendar container operations in Tempra.

## 📁 Structure

```
hook/calendar/
├── index.ts                      # Main export file
├── query-keys.ts                # Centralized query keys
├── use-calendars.tsx            # List query
├── use-primary-calendar.tsx     # Primary calendar query
├── use-calendar-detail.tsx      # Single calendar query
├── use-search-calendars.tsx     # Search with debounce
├── use-create-calendar.tsx      # Create mutation
├── use-update-calendar.tsx      # Update mutation
├── use-delete-calendar.tsx      # Delete mutation
└── README.md                    # This file
```

## 🎯 Available Hooks

### Query Hooks (Fetching Data)

#### 1. **useCalendars** - Get paginated calendars
```tsx
import { useCalendars } from '@/hook/calendar';

function CalendarList() {
  const { data, isLoading } = useCalendars({
    page: 1,
    limit: 20,
  });

  return (
    <div>
      {data?.data.map(calendar => (
        <div key={calendar.id}>
          {calendar.name || calendar.google_calendar_id}
          {calendar.is_primary && ' (Primary)'}
        </div>
      ))}
    </div>
  );
}
```

#### 2. **usePrimaryCalendar** - Get primary calendar
```tsx
import { usePrimaryCalendar } from '@/hook/calendar';

function PrimaryCalendarInfo() {
  const { data, isLoading } = usePrimaryCalendar();

  if (isLoading) return <div>Loading primary calendar...</div>;

  return (
    <div>
      <h2>Primary Calendar</h2>
      <p>{data?.data.name}</p>
      <p>Timezone: {data?.data.timezone}</p>
    </div>
  );
}
```

#### 3. **useCalendarDetail** - Get single calendar
```tsx
import { useCalendarDetail } from '@/hook/calendar';

function CalendarDetail({ calendarId }: { calendarId: string }) {
  const { data, isLoading } = useCalendarDetail(calendarId);

  if (isLoading) return <div>Loading calendar...</div>;

  return (
    <div>
      <h1>{data?.data.name}</h1>
      <p>{data?.data.description}</p>
      <p>Google Calendar ID: {data?.data.google_calendar_id}</p>
      <p>Timezone: {data?.data.timezone}</p>
      <p>Primary: {data?.data.is_primary ? 'Yes' : 'No'}</p>
    </div>
  );
}
```

#### 4. **useSearchCalendars** - Search with debounce
```tsx
import { useSearchCalendars } from '@/hook/calendar';
import { useState } from 'react';

function CalendarSearch() {
  const [search, setSearch] = useState('');
  
  const { data, isLoading } = useSearchCalendars(search, {
    page: 1,
    limit: 10,
  });

  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search calendars..."
      />
      {isLoading && <div>Searching...</div>}
      {data?.data.map(calendar => (
        <div key={calendar.id}>{calendar.name}</div>
      ))}
    </div>
  );
}
```

### Mutation Hooks (Creating/Updating/Deleting)

#### 1. **useCreateCalendar** - Create new calendar
```tsx
import { useCreateCalendar } from '@/hook/calendar';

function CreateCalendarForm() {
  const { mutate, isPending } = useCreateCalendar();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    mutate({
      google_calendar_id: 'primary',
      name: 'Work Calendar',
      description: 'My work calendar',
      timezone: 'Asia/Ho_Chi_Minh',
      is_primary: true,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Calendar'}
      </button>
    </form>
  );
}
```

#### 2. **useUpdateCalendar** - Update existing calendar
```tsx
import { useUpdateCalendar } from '@/hook/calendar';

function UpdateCalendarForm({ calendarId }: { calendarId: string }) {
  const { mutate, isPending } = useUpdateCalendar();

  const handleUpdate = () => {
    mutate({
      id: calendarId,
      data: {
        name: 'Updated Calendar Name',
        timezone: 'America/New_York',
      },
    });
  };

  return (
    <button onClick={handleUpdate} disabled={isPending}>
      {isPending ? 'Updating...' : 'Update Calendar'}
    </button>
  );
}
```

#### 3. **useDeleteCalendar** - Delete calendar
```tsx
import { useDeleteCalendar } from '@/hook/calendar';

function DeleteCalendarButton({ calendarId }: { calendarId: string }) {
  const { mutate, isPending } = useDeleteCalendar();

  const handleDelete = () => {
    if (confirm('Delete this calendar?')) {
      mutate(calendarId);
    }
  };

  return (
    <button onClick={handleDelete} disabled={isPending}>
      {isPending ? 'Deleting...' : 'Delete Calendar'}
    </button>
  );
}
```

## 🔑 Query Keys

```tsx
import { CALENDAR_QUERY_KEYS } from '@/hook/calendar';

// Invalidate all calendars
queryClient.invalidateQueries({ 
  queryKey: CALENDAR_QUERY_KEYS.all 
});

// Invalidate primary calendar
queryClient.invalidateQueries({ 
  queryKey: CALENDAR_QUERY_KEYS.primary() 
});

// Invalidate specific calendar
queryClient.invalidateQueries({ 
  queryKey: CALENDAR_QUERY_KEYS.detail(calendarId) 
});
```

## 🎨 Advanced Usage

### Set Primary Calendar
```tsx
import { useUpdateCalendar, useCalendars } from '@/hook/calendar';

function SetPrimaryButton({ calendarId }: { calendarId: string }) {
  const { mutate } = useUpdateCalendar();
  const { refetch } = useCalendars();

  const handleSetPrimary = () => {
    mutate({
      id: calendarId,
      data: { is_primary: true },
    }, {
      onSuccess: () => {
        refetch(); // Refresh calendar list
      },
    });
  };

  return <button onClick={handleSetPrimary}>Set as Primary</button>;
}
```

### Filter by Primary Status
```tsx
import { useCalendars } from '@/hook/calendar';

function PrimaryCalendarsOnly() {
  const { data } = useCalendars({
    is_primary: true,
    page: 1,
    limit: 10,
  });

  return (
    <div>
      <h2>Primary Calendars</h2>
      {data?.data.map(calendar => (
        <div key={calendar.id}>{calendar.name}</div>
      ))}
    </div>
  );
}
```

### Filter by Timezone
```tsx
import { useCalendars } from '@/hook/calendar';

function CalendarsByTimezone() {
  const { data } = useCalendars({
    timezone: 'Asia/Ho_Chi_Minh',
    page: 1,
    limit: 20,
  });

  return <div>Calendars in Ho Chi Minh timezone: {data?.meta.total}</div>;
}
```

## 🔄 Auto-Refetch Configuration

- **Lists**: 5 minutes stale time
- **Primary**: 10 minutes stale time (rarely changes)
- **Details**: 5 minutes stale time
- **Search**: 2 minutes stale time

## 📦 TypeScript Support

```tsx
import type {
  Calendar,
  CreateCalendarRequest,
  UpdateCalendarRequest,
  CalendarQueryParams,
  PaginatedCalendarsResponse,
} from '@/interface/calendar.interface';

const { data } = useCalendars(); // data is typed as PaginatedCalendarsResponse
```

## 🎯 Use Cases

### Sync with Google Calendar
```tsx
const { mutate: createCalendar } = useCreateCalendar();

// After Google OAuth
const syncGoogleCalendar = (googleCalendarId: string) => {
  createCalendar({
    google_calendar_id: googleCalendarId,
    name: 'Google Calendar',
    is_primary: true,
  });
};
```

### Multi-Calendar Management
```tsx
const { data: calendars } = useCalendars();
const { data: primary } = usePrimaryCalendar();

// Display all calendars with primary highlighted
```

### Calendar Switcher
```tsx
function CalendarSwitcher() {
  const { data: calendars } = useCalendars();
  const { mutate: updateCalendar } = useUpdateCalendar();

  const switchToPrimary = (calendarId: string) => {
    updateCalendar({
      id: calendarId,
      data: { is_primary: true },
    });
  };

  return (
    <select onChange={(e) => switchToPrimary(e.target.value)}>
      {calendars?.data.map(cal => (
        <option key={cal.id} value={cal.id}>
          {cal.name}
        </option>
      ))}
    </select>
  );
}
```

## 🚀 Best Practices

1. **Always handle primary calendar** - Only one calendar should be primary
2. **Cache invalidation** - Update primary when setting new primary
3. **Loading states** - Always check `isLoading` and `isPending`
4. **Error boundaries** - Wrap components in error boundaries
5. **Optimistic updates** - For better UX

## 📝 Related

- Event Hooks: `hook/event/` - For managing events within calendars
- Google Integration: Sync calendars from Google Calendar

## ⚠️ Important Notes

- **Primary Calendar**: Only ONE calendar can be primary at a time
- **Google Calendar ID**: Must be unique per user
- **Deletion**: Deleting a calendar doesn't delete its events (handle separately)
- **Timezone**: Use IANA timezone format (e.g., 'Asia/Ho_Chi_Minh')
