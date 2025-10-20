export const HEALTH_QUERY_KEYS = {
  all: ['health'] as const,
  
  status: () => [...HEALTH_QUERY_KEYS.all, 'status'] as const,
  ok: () => [...HEALTH_QUERY_KEYS.all, 'ok'] as const,
} as const;
