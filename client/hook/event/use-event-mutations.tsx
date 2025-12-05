'use client';

import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { eventService } from '@/service';
import { 
  CreateEventRequest, 
  UpdateEventRequest, 
  PartialUpdateEventRequest, 
  EventResponse, 
} from '@/interface';
import { EVENT_QUERY_KEYS } from './query-keys';
import { toast } from 'sonner';

interface UpdateEventParams {
  id: string;
  data: UpdateEventRequest;
}

interface PartialUpdateEventParams {
  id: string;
  data: PartialUpdateEventRequest;
}

export const useCreateEvent = (): UseMutationResult<EventResponse, Error, CreateEventRequest> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEventRequest) => eventService.createEvent(data),
    
    onSuccess: async (newEvent, variables) => {
      if (!newEvent?.data?.id) return;

      queryClient.setQueryData(EVENT_QUERY_KEYS.detail(newEvent.data.id), newEvent);
      
      queryClient.removeQueries({ 
        queryKey: EVENT_QUERY_KEYS.all,
      });
      
      await queryClient.invalidateQueries({ 
        queryKey: EVENT_QUERY_KEYS.all,
        refetchType: 'active'
      });
      
      toast.success('Event created successfully!');
    },

    onError: (error, variables) => {
      toast.error('Failed to create event', {
        description: error.message,
      });
    },
  });
};


export const useUpdateEvent = (): UseMutationResult<EventResponse, Error, PartialUpdateEventParams> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: PartialUpdateEventParams) => eventService.updateEvent(id, data),
    
    onSuccess: async (updatedEvent, variables) => {
      queryClient.setQueryData(
        EVENT_QUERY_KEYS.detail(variables.id),
        updatedEvent
      );
      
      queryClient.removeQueries({ 
        queryKey: EVENT_QUERY_KEYS.all,
      });
      
      await queryClient.invalidateQueries({ 
        queryKey: EVENT_QUERY_KEYS.all,
        refetchType: 'active'
      });
      
      toast.success('Event updated successfully!');
    },

    onError: (error, variables, context) => {
      toast.error('Failed to update event', {
        description: error.message,
      });
    },
  });
};


export const useReplaceEvent = (): UseMutationResult<EventResponse, Error, UpdateEventParams> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateEventParams) => eventService.replaceEvent(id, data),
    
    onSuccess: async (updatedEvent, variables) => {
      queryClient.setQueryData(
        EVENT_QUERY_KEYS.detail(variables.id),
        updatedEvent
      );
      
      queryClient.removeQueries({ 
        queryKey: EVENT_QUERY_KEYS.all,
      });
      
      await queryClient.invalidateQueries({ 
        queryKey: EVENT_QUERY_KEYS.all,
        refetchType: 'active'
      });
      
      toast.success('Event updated successfully!');
    },

    onError: (error, variables) => {
      toast.error('Failed to update event', {
        description: error.message,
      });
    },
  });
};


export const useDeleteEvent = (): UseMutationResult<void, Error, string> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => eventService.deleteEvent(eventId),
    
    onSuccess: async (_, eventId) => {
      queryClient.removeQueries({ queryKey: EVENT_QUERY_KEYS.detail(eventId) });
      
      queryClient.removeQueries({ 
        queryKey: EVENT_QUERY_KEYS.all,
      });
      
      await queryClient.invalidateQueries({ 
        queryKey: EVENT_QUERY_KEYS.all,
        refetchType: 'active'
      });
      
      toast.success('Event deleted successfully!');
    },

    onError: (error, eventId) => {
      toast.error('Failed to delete event', {
        description: error.message,
      });
    },
  });
};


export const useUpdateEventWithMethod = (): UseMutationResult<EventResponse, Error, UpdateEventParams & { method?: 'PUT' | 'PATCH' }> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data, method = 'PATCH' }: UpdateEventParams & { method?: 'PUT' | 'PATCH' }) => 
      eventService.updateEventWithMethod(id, data, method),
    
    onSuccess: async (updatedEvent, variables) => {
      queryClient.setQueryData(
        EVENT_QUERY_KEYS.detail(variables.id),
        updatedEvent
      );
      
      queryClient.removeQueries({ 
        queryKey: EVENT_QUERY_KEYS.all,
      });
      
      await queryClient.invalidateQueries({ 
        queryKey: EVENT_QUERY_KEYS.all,
        refetchType: 'active'
      });
      
      toast.success('Event updated successfully!');
    },

    onError: (error, variables) => {
      toast.error('Failed to update event', {
        description: error.message,
      });
    },
  });
};
