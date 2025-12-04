'use client';

import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { taskService } from '@/service';
import { UpdateTaskRequest, TaskResponse } from '@/interface/task.interface';
import { TASK_QUERY_KEYS } from './query-keys';
import { toast } from 'sonner';

interface UpdateTaskParams {
  id: string;
  data: UpdateTaskRequest;
}

export const useUpdateTask = (): UseMutationResult<TaskResponse, Error, UpdateTaskParams> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateTaskParams) => taskService.updateTask(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.detail(variables.id) });
      queryClient.invalidateQueries({ 
        queryKey: TASK_QUERY_KEYS.all,
        refetchType: 'active'
      });
      toast.success('Task updated successfully!');
    },
    onError: (error: Error) => {
      toast.error('Failed to update task', {
        description: error.message,
      });
    },
  });
};

export const usePartialUpdateTask = (): UseMutationResult<TaskResponse, Error, UpdateTaskParams> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateTaskParams) => taskService.partialUpdateTask(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.detail(variables.id) });
      queryClient.invalidateQueries({ 
        queryKey: TASK_QUERY_KEYS.all,
        refetchType: 'active'
      });
      toast.success('Task updated successfully!');
    },
    onError: (error: Error) => {
      toast.error('Failed to update task', {
        description: error.message,
      });
    },
  });
};
