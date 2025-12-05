'use client';

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { taskService } from '@/service';
import { TaskStatisticsResponse } from '@/interface';
import { TASK_QUERY_KEYS } from './query-keys';

export const useTaskStatistics = (): UseQueryResult<TaskStatisticsResponse, Error> => {
  return useQuery({
    queryKey: TASK_QUERY_KEYS.statistics(),
    queryFn: () => taskService.getTaskStatistics(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
};
