export const CONTACT_QUERY_KEYS = {
  all: ['contacts'] as const,
  
  submissions: () => [...CONTACT_QUERY_KEYS.all, 'submission'] as const,
} as const;
