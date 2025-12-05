'use client';

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { taskService } from '@/service';
import { PaginatedTasksResponse, TaskQueryParams } from '@/interface';
import { TASK_QUERY_KEYS } from './query-keys';

export const useOverdueTasks = (params?: TaskQueryParams): UseQueryResult<PaginatedTasksResponse, Error> => {
  return useQuery({
    queryKey: TASK_QUERY_KEYS.overdue(params),
    queryFn: () => taskService.getOverdueTasks(params),
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
};
