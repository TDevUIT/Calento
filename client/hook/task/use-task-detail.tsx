'use client';

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { taskService } from '@/service';
import { TaskResponse } from '@/interface';
import { TASK_QUERY_KEYS } from './query-keys';

export const useTaskDetail = (taskId: string): UseQueryResult<TaskResponse, Error> => {
  return useQuery({
    queryKey: TASK_QUERY_KEYS.detail(taskId),
    queryFn: () => taskService.getTaskById(taskId),
    staleTime: 5 * 60 * 1000,
    enabled: !!taskId,
  });
};
