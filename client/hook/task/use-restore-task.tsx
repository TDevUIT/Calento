'use client';

import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { taskService } from '@/service';
import { TaskResponse } from '@/interface/task.interface';
import { toast } from 'sonner';
import { TASK_QUERY_KEYS } from './query-keys';

export const useRestoreTask = (): UseMutationResult<TaskResponse, Error, string> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => taskService.restoreTask(taskId),
    onSuccess: (response, taskId) => {
      queryClient.setQueryData(TASK_QUERY_KEYS.detail(taskId), response);
      queryClient.invalidateQueries({ 
        queryKey: TASK_QUERY_KEYS.all,
        refetchType: 'active'
      });
      toast.success('Task restored successfully!');
    },
    onError: (error: Error) => {
      toast.error('Failed to restore task', {
        description: error.message,
      });
    },
  });
};
