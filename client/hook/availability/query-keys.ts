export const AVAILABILITY_QUERY_KEYS = {
  all: ['availability'] as const,
  lists: () => [...AVAILABILITY_QUERY_KEYS.all, 'list'] as const,
  list: (filters?: any) => [...AVAILABILITY_QUERY_KEYS.lists(), { filters }] as const,
  active: () => [...AVAILABILITY_QUERY_KEYS.all, 'active'] as const,
  schedule: () => [...AVAILABILITY_QUERY_KEYS.all, 'schedule'] as const,
  details: () => [...AVAILABILITY_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...AVAILABILITY_QUERY_KEYS.details(), id] as const,
  check: (dateTime: string) => [...AVAILABILITY_QUERY_KEYS.all, 'check', dateTime] as const,
  slots: (startDate: string, endDate: string) => 
    [...AVAILABILITY_QUERY_KEYS.all, 'slots', startDate, endDate] as const,
};
