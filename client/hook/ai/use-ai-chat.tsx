'use client';

import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { aiService } from '@/service';
import { ChatRequest, ChatResponse } from '@/interface';
import { AI_QUERY_KEYS } from './query-keys';
import { toast } from 'sonner';

export const useAIChat = (): UseMutationResult<ChatResponse, Error, ChatRequest> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ChatRequest) => aiService.chat(data),
    onSuccess: (response) => {
      if (response.data.conversation_id) {
        queryClient.invalidateQueries({ 
          queryKey: AI_QUERY_KEYS.conversation(response.data.conversation_id),
          refetchType: 'active'
        });
      }
    },
    onError: (error: Error) => {
      toast.error('AI chat failed', {
        description: error.message,
      });
    },
  });
};
