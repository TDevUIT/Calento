'use client';

import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { taskService } from '@/service';
import { CreateTaskRequest, TaskResponse } from '@/interface/task.interface';
import { TASK_QUERY_KEYS } from './query-keys';
import { toast } from 'sonner';

export const useCreateTask = (): UseMutationResult<TaskResponse, Error, CreateTaskRequest> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskRequest) => taskService.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: TASK_QUERY_KEYS.all,
        refetchType: 'active'
      });
      toast.success('Task created successfully!');
    },
    onError: (error: Error) => {
      toast.error('Failed to create task', {
        description: error.message,
      });
    },
  });
};
