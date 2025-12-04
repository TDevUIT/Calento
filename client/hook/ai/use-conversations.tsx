'use client';

import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { aiService } from '@/service';
import {
  ConversationsListResponse,
  ConversationResponse,
  DeleteConversationResponse,
} from '@/interface/ai.interface';
import { AI_QUERY_KEYS } from './query-keys';
import { toast } from 'sonner';

export const useConversations = (
  limit: number = 50
): UseQueryResult<ConversationsListResponse, Error> => {
  return useQuery({
    queryKey: AI_QUERY_KEYS.conversations(),
    queryFn: () => aiService.getConversations(limit),
    staleTime: 1000 * 60 * 5,
  });
};

export const useConversation = (
  conversationId?: string
): UseQueryResult<ConversationResponse, Error> => {
  return useQuery({
    queryKey: AI_QUERY_KEYS.conversation(conversationId),
    queryFn: () => aiService.getConversation(conversationId!),
    enabled: !!conversationId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useDeleteConversation = (): UseMutationResult<
  DeleteConversationResponse,
  Error,
  string
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) => aiService.deleteConversation(conversationId),
    onSuccess: (_, conversationId) => {
      queryClient.invalidateQueries({
        queryKey: AI_QUERY_KEYS.conversations(),
      });
      queryClient.removeQueries({
        queryKey: AI_QUERY_KEYS.conversation(conversationId),
      });
      toast.success('Conversation deleted');
    },
    onError: (error: Error) => {
      toast.error('Failed to delete conversation', {
        description: error.message,
      });
    },
  });
};
