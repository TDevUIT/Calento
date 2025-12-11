'use client';

import { useState, useCallback } from 'react';
import { aiService } from '@/service';
import { StreamChatRequest, StreamMessage } from '@/interface';
import { toast } from 'sonner';

interface UseAIChatStreamReturn {
  isStreaming: boolean;
  streamedContent: string;
  conversationId: string | null;
  startStream: (data: StreamChatRequest) => Promise<void>;
  stopStream: () => void;
  resetContent: () => void;
}

export const useAIChatStream = (): UseAIChatStreamReturn => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedContent, setStreamedContent] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);

  const resetContent = useCallback(() => {
    setStreamedContent('');
    setConversationId(null);
  }, []);

  const stopStream = useCallback(() => {
    setIsStreaming(false);
  }, []);

  const startStream = useCallback(async (data: StreamChatRequest) => {
    setIsStreaming(true);
    setStreamedContent('');

    await aiService.chatStream(
      data,
      (chunk: StreamMessage) => {
        // Handle different message types
        switch (chunk.type) {
          case 'text':
            setStreamedContent((prev) => prev + chunk.content);
            break;
          case 'done':
            if (chunk.conversation_id) {
              setConversationId(chunk.conversation_id);
            }
            break;
          // You can handle other message types here if needed:
          // - 'action_start': Show action starting
          // - 'action_result': Show action completed
          // - 'error': Handle error in stream
        }
      },
      () => {
        setIsStreaming(false);
      },
      (error: Error) => {
        setIsStreaming(false);
        toast.error('Streaming failed', {
          description: error.message,
        });
      }
    );
  }, []);

  return {
    isStreaming,
    streamedContent,
    conversationId,
    startStream,
    stopStream,
    resetContent,
  };
};
