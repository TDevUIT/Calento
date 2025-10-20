export const AI_QUERY_KEYS = {
  all: ['ai'] as const,
  
  conversations: () => [...AI_QUERY_KEYS.all, 'conversation'] as const,
  
  conversation: (conversationId?: string) => 
    [...AI_QUERY_KEYS.conversations(), conversationId] as const,
} as const;
