'use client';

import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { taskService } from '@/service';
import { toast } from 'sonner';
import { TASK_QUERY_KEYS } from './query-keys';

export const useDeleteTask = (): UseMutationResult<void, Error, string> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => taskService.deleteTask(taskId),
    onSuccess: (_, taskId) => {
      queryClient.removeQueries({ queryKey: TASK_QUERY_KEYS.detail(taskId) });
      queryClient.invalidateQueries({ 
        queryKey: TASK_QUERY_KEYS.all,
        refetchType: 'active'
      });
      toast.success('Task deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error('Failed to delete task', {
        description: error.message,
      });
    },
  });
};
