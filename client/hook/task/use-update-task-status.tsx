'use client';

import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { taskService } from '@/service/task.service';
import { TaskResponse, TaskStatus } from '@/interface/task.interface';
import { toast } from 'sonner';
import { TASK_QUERY_KEYS } from './query-keys';

interface UpdateTaskStatusParams {
  id: string;
  status: TaskStatus;
}

export const useUpdateTaskStatus = (): UseMutationResult<TaskResponse, Error, UpdateTaskStatusParams> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: UpdateTaskStatusParams) => taskService.updateTaskStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.detail(variables.id) });
      queryClient.invalidateQueries({ 
        queryKey: TASK_QUERY_KEYS.all,
        refetchType: 'active'
      });
      toast.success('Task status updated successfully!');
    },
    onError: (error: Error) => {
      toast.error('Failed to update task status', {
        description: error.message,
      });
    },
  });
};
