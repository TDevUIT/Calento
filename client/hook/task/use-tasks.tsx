'use client';

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { taskService } from '@/service/task.service';
import { PaginatedTasksResponse, TaskQueryParams } from '@/interface/task.interface';
import { TASK_QUERY_KEYS } from './query-keys';

export const useTasks = (params?: TaskQueryParams): UseQueryResult<PaginatedTasksResponse, Error> => {
  return useQuery({
    queryKey: TASK_QUERY_KEYS.list(params),
    queryFn: () => taskService.getTasks(params),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
};
