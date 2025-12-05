'use client';

import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { getUserPriorities, updatePriority, bulkUpdatePriorities, deletePriority, resetPriorities } from '@/service';
import type { UserPriority, UpdatePriorityRequest, BulkUpdatePriorityRequest, ItemType } from '@/interface';
import { toast } from 'sonner';

export const PRIORITY_QUERY_KEYS = {
  all: ['priorities'] as const,
  lists: () => [...PRIORITY_QUERY_KEYS.all, 'list'] as const,
  item: (itemId: string, itemType: string) => [...PRIORITY_QUERY_KEYS.all, 'item', itemId, itemType] as const,
  level: (priority: string) => [...PRIORITY_QUERY_KEYS.all, 'level', priority] as const,
  type: (itemType: string) => [...PRIORITY_QUERY_KEYS.all, 'type', itemType] as const,
};

export const usePriorities = (): UseQueryResult<UserPriority[], Error> => {
  return useQuery({
    queryKey: PRIORITY_QUERY_KEYS.lists(),
    queryFn: getUserPriorities,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdatePriority = (): UseMutationResult<UserPriority, Error, UpdatePriorityRequest> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePriority,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRIORITY_QUERY_KEYS.all });
      toast.success('Priority updated');
    },
    onError: (error: Error) => {
      toast.error('Failed to update priority', {
        description: error.message,
      });
    },
  });
};

export const useBulkUpdatePriorities = (): UseMutationResult<UserPriority[], Error, BulkUpdatePriorityRequest> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkUpdatePriorities,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRIORITY_QUERY_KEYS.all });
      toast.success('Priorities updated');
    },
    onError: (error: Error) => {
      toast.error('Failed to update priorities', {
        description: error.message,
      });
    },
  });
};

export const useDeletePriority = (): UseMutationResult<void, Error, { itemId: string; itemType: ItemType }> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, itemType }) => deletePriority(itemId, itemType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRIORITY_QUERY_KEYS.all });
      toast.success('Priority deleted');
    },
    onError: (error: Error) => {
      toast.error('Failed to delete priority', {
        description: error.message,
      });
    },
  });
};

export const useResetPriorities = (): UseMutationResult<void, Error, void> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resetPriorities,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRIORITY_QUERY_KEYS.all });
      toast.success('All priorities reset');
    },
    onError: (error: Error) => {
      toast.error('Failed to reset priorities', {
        description: error.message,
      });
    },
  });
};
