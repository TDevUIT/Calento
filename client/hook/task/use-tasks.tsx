'use client';

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { taskService } from '@/service';
import { PaginatedTasksResponse, TaskQueryParams } from '@/interface';
import { TASK_QUERY_KEYS } from './query-keys';

export const useTasks = (params?: TaskQueryParams): UseQueryResult<PaginatedTasksResponse, Error> => {
  return useQuery({
    queryKey: TASK_QUERY_KEYS.list(params),
    queryFn: () => taskService.getTasks(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });
};
