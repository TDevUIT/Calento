# Event Hooks - Complete Usage Examples

## 📅 Calendar View with Date Range

```tsx
'use client';

import { useEventsByDateRange } from '@/hook/event';
import { startOfMonth, endOfMonth } from 'date-fns';
import { useState } from 'react';

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const startDate = startOfMonth(currentDate).toISOString();
  const endDate = endOfMonth(currentDate).toISOString();

  const { data, isLoading, error } = useEventsByDateRange(startDate, endDate, {
    page: 1,
    limit: 100,
  });

  if (isLoading) return <div>Loading calendar...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="calendar-view">
      <h2>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
      
      <div className="events-grid">
        {data?.data.map(event => (
          <div key={event.id} className="event-card">
            <h3>{event.title}</h3>
            <p>{new Date(event.start_time).toLocaleString()}</p>
            <p>{event.location}</p>
          </div>
        ))}
      </div>

      <div className="pagination">
        <p>Showing {data?.data.length} of {data?.meta.total} events</p>
      </div>
    </div>
  );
}
```

## 🔍 Search with Autocomplete

```tsx
'use client';

import { useSearchEvents } from '@/hook/event';
import { useState } from 'react';

export function EventSearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Auto-debounced search (300ms)
  const { data, isLoading } = useSearchEvents(searchTerm, {
    limit: 5,
  });

  return (
    <div className="relative">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        placeholder="Search events..."
        className="w-full px-4 py-2 border rounded-lg"
      />

      {isOpen && searchTerm.length >= 2 && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
          {isLoading ? (
            <div className="p-4">Searching...</div>
          ) : data?.data.length === 0 ? (
            <div className="p-4 text-gray-500">No events found</div>
          ) : (
            <ul>
              {data?.data.map(event => (
                <li
                  key={event.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    // Handle event selection
                    console.log('Selected:', event);
                    setIsOpen(false);
                  }}
                >
                  <div className="font-medium">{event.title}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(event.start_time).toLocaleDateString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
```

## ➕ Create Event Form with Validation

```tsx
'use client';

import { useCreateEvent } from '@/hook/event';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().max(1000).optional(),
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
  location: z.string().max(255).optional(),
  is_all_day: z.boolean().default(false),
  recurrence_rule: z.string().optional(),
}).refine((data) => new Date(data.end_time) > new Date(data.start_time), {
  message: 'End time must be after start time',
  path: ['end_time'],
});

type EventFormData = z.infer<typeof eventSchema>;

export function CreateEventForm() {
  const router = useRouter();
  const { mutate, isPending } = useCreateEvent();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
  });

  const onSubmit = (data: EventFormData) => {
    mutate(data, {
      onSuccess: (response) => {
        reset();
        router.push(`/events/${response.data.id}`);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title *</label>
        <input
          {...register('title')}
          className="w-full px-3 py-2 border rounded-lg"
          placeholder="Team Meeting"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          {...register('description')}
          className="w-full px-3 py-2 border rounded-lg"
          rows={3}
          placeholder="Meeting agenda..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Start Time *</label>
          <input
            type="datetime-local"
            {...register('start_time')}
            className="w-full px-3 py-2 border rounded-lg"
          />
          {errors.start_time && (
            <p className="text-red-500 text-sm mt-1">{errors.start_time.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">End Time *</label>
          <input
            type="datetime-local"
            {...register('end_time')}
            className="w-full px-3 py-2 border rounded-lg"
          />
          {errors.end_time && (
            <p className="text-red-500 text-sm mt-1">{errors.end_time.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Location</label>
        <input
          {...register('location')}
          className="w-full px-3 py-2 border rounded-lg"
          placeholder="Conference Room A"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          {...register('is_all_day')}
          id="is_all_day"
          className="w-4 h-4"
        />
        <label htmlFor="is_all_day" className="text-sm font-medium">
          All Day Event
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Recurrence Rule (RRULE)
        </label>
        <input
          {...register('recurrence_rule')}
          className="w-full px-3 py-2 border rounded-lg"
          placeholder="FREQ=WEEKLY;BYDAY=MO"
        />
        <p className="text-xs text-gray-500 mt-1">
          Example: FREQ=WEEKLY;BYDAY=MO for weekly on Monday
        </p>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {isPending ? 'Creating...' : 'Create Event'}
      </button>
    </form>
  );
}
```

## ✏️ Edit Event with Inline Editing

```tsx
'use client';

import { useEventDetail, useUpdateEvent } from '@/hook/event';
import { useState } from 'react';

export function EditableEventDetail({ eventId }: { eventId: string }) {
  const { data: eventData, isLoading } = useEventDetail(eventId);
  const { mutate: updateEvent, isPending } = useUpdateEvent();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');

  if (isLoading) return <div>Loading...</div>;
  const event = eventData?.data;
  if (!event) return null;

  const handleSave = () => {
    updateEvent(
      { id: eventId, data: { title: editedTitle } },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      {isEditing ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="flex-1 px-3 py-2 border rounded"
            autoFocus
          />
          <button
            onClick={handleSave}
            disabled={isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {isPending ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{event.title}</h1>
          <button
            onClick={() => {
              setEditedTitle(event.title);
              setIsEditing(true);
            }}
            className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded"
          >
            Edit
          </button>
        </div>
      )}

      <p className="mt-4 text-gray-600">{event.description}</p>
      <div className="mt-4 space-y-2 text-sm">
        <p><strong>Start:</strong> {new Date(event.start_time).toLocaleString()}</p>
        <p><strong>End:</strong> {new Date(event.end_time).toLocaleString()}</p>
        {event.location && <p><strong>Location:</strong> {event.location}</p>}
      </div>
    </div>
  );
}
```

## 🗑️ Delete Confirmation Dialog

```tsx
'use client';

import { useDeleteEvent } from '@/hook/event';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function DeleteEventButton({ eventId, eventTitle }: { 
  eventId: string;
  eventTitle: string;
}) {
  const router = useRouter();
  const { mutate: deleteEvent, isPending } = useDeleteEvent();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    deleteEvent(eventId, {
      onSuccess: () => {
        setShowConfirm(false);
        router.push('/calendar');
      },
    });
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded"
      >
        Delete Event
      </button>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md">
            <h3 className="text-lg font-bold mb-2">Delete Event?</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete "{eventTitle}"? This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                disabled={isPending}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                {isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
```

## 🔄 Recurring Events Expansion

```tsx
'use client';

import { useRecurringEvents } from '@/hook/event';
import { startOfYear, endOfYear } from 'date-fns';

export function RecurringEventsView() {
  const currentYear = new Date();
  const startDate = startOfYear(currentYear).toISOString();
  const endDate = endOfYear(currentYear).toISOString();

  const { data, isLoading } = useRecurringEvents({
    start_date: startDate,
    end_date: endDate,
    max_occurrences: 50,
    page: 1,
    limit: 100,
  });

  if (isLoading) return <div>Expanding recurring events...</div>;

  // Group by original event
  const groupedEvents = data?.data.reduce((acc, event) => {
    const originalId = event.original_event_id || event.id;
    if (!acc[originalId]) acc[originalId] = [];
    acc[originalId].push(event);
    return acc;
  }, {} as Record<string, typeof data.data>);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Recurring Events This Year</h2>
      
      {Object.entries(groupedEvents || {}).map(([originalId, occurrences]) => (
        <div key={originalId} className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">{occurrences[0].title}</h3>
          <p className="text-sm text-gray-500 mb-3">
            {occurrences[0].recurrence_rule}
          </p>
          
          <div className="space-y-1">
            {occurrences.map((event) => (
              <div key={event.id} className="text-sm">
                <span className="font-medium">Occurrence #{event.occurrence_index + 1}:</span>{' '}
                {new Date(event.start_time).toLocaleDateString()}
              </div>
            ))}
          </div>
          
          <p className="text-sm text-gray-600 mt-2">
            Total occurrences: {occurrences.length}
          </p>
        </div>
      ))}
    </div>
  );
}
```

These examples cover all major use cases for Event APIs in Tcalento!
