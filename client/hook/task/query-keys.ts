import { TaskQueryParams } from '@/interface/task.interface';

export const TASK_QUERY_KEYS = {
  all: ['tasks'] as const,
  
  lists: () => [...TASK_QUERY_KEYS.all, 'list'] as const,
  
  list: (params?: TaskQueryParams) => 
    [...TASK_QUERY_KEYS.lists(), params] as const,
  
  overdue: (params?: TaskQueryParams) =>
    [...TASK_QUERY_KEYS.all, 'overdue', params] as const,
  
  statistics: () => [...TASK_QUERY_KEYS.all, 'statistics'] as const,
  
  search: (searchTerm: string, params?: Omit<TaskQueryParams, 'search'>) =>
    [...TASK_QUERY_KEYS.lists(), 'search', { searchTerm, ...params }] as const,
  
  details: () => [...TASK_QUERY_KEYS.all, 'detail'] as const,
  
  detail: (id: string) => 
    [...TASK_QUERY_KEYS.details(), id] as const,
} as const;
