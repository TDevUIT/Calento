'use client';

import React from 'react';
import { 
  useCreateEvent, 
  useUpdateEvent, 
  useDeleteEvent,
} from '@/hook/event';
import { CreateEventRequest, PartialUpdateEventRequest } from '@/interface/event.interface';


export const EventMutationDemo: React.FC = () => {
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();

  const handleCreateEvent = () => {
    const newEvent: CreateEventRequest = {
      calendar_id: 'default',
      title: 'Test Event',
      description: 'This is a test event',
      start_time: new Date().toISOString(),
      end_time: new Date(Date.now() + 3600000).toISOString(), // 1 hour later
      location: 'Test Location',
      is_all_day: false,
    };

    createEvent.mutate(newEvent, {
      onSuccess: (response) => {
        console.log('Event created successfully:', response.data);
      },
      onError: (error) => {
        console.error('Failed to create event:', error.message);
      }
    });
  };

  const handleUpdateEvent = (eventId: string) => {
    const updateData: PartialUpdateEventRequest = {
      title: 'Updated Event Title',
      description: 'Updated description',
    };

    updateEvent.mutate({ id: eventId, data: updateData }, {
      onSuccess: (response) => {
        console.log('Event updated successfully:', response.data);
      },
      onError: (error) => {
        console.error('Failed to update event:', error.message);
      }
    });
  };

  const handleDeleteEvent = (eventId: string) => {
    deleteEvent.mutate(eventId, {
      onSuccess: () => {
        console.log('Event deleted successfully');
      },
      onError: (error) => {
        console.error('Failed to delete event:', error.message);
      }
    });
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Event Mutation Demo</h2>
      
      <div className="space-y-2">
        <button
          onClick={handleCreateEvent}
          disabled={createEvent.isPending}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {createEvent.isPending ? 'Creating...' : 'Create Event'}
        </button>

        <button
          onClick={() => handleUpdateEvent('sample-id')}
          disabled={updateEvent.isPending}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {updateEvent.isPending ? 'Updating...' : 'Update Event'}
        </button>

        <button
          onClick={() => handleDeleteEvent('sample-id')}
          disabled={deleteEvent.isPending}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
        >
          {deleteEvent.isPending ? 'Deleting...' : 'Delete Event'}
        </button>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p><strong>Features:</strong></p>
        <ul className="list-disc list-inside space-y-1">
          <li>✅ Optimistic updates - UI updates immediately</li>
          <li>✅ Auto rollback on errors</li>
          <li>✅ Toast notifications</li>
          <li>✅ Cache invalidation for real-time sync</li>
          <li>✅ Loading states</li>
        </ul>
      </div>
    </div>
  );
};

export default EventMutationDemo;
