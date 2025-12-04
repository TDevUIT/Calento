'use client';

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { taskService } from '@/service';
import { PaginatedTasksResponse, TaskQueryParams } from '@/interface/task.interface';
import { TASK_QUERY_KEYS } from './query-keys';

export const useSearchTasks = (
  searchTerm: string,
  params?: Omit<TaskQueryParams, 'search'>
): UseQueryResult<PaginatedTasksResponse, Error> => {
  return useQuery({
    queryKey: TASK_QUERY_KEYS.search(searchTerm, params),
    queryFn: () => taskService.searchTasks(searchTerm, params),
    staleTime: 2 * 60 * 1000,
    enabled: !!searchTerm && searchTerm.length > 0,
  });
};
