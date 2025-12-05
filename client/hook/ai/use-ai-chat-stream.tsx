'use client';

import { useState, useCallback } from 'react';
import { aiService } from '@/service';
import { StreamChatRequest, StreamMessage } from '@/interface';
import { toast } from 'sonner';

interface UseAIChatStreamReturn {
  isStreaming: boolean;
  streamedContent: string;
  startStream: (data: StreamChatRequest) => Promise<void>;
  stopStream: () => void;
  resetContent: () => void;
}

export const useAIChatStream = (): UseAIChatStreamReturn => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedContent, setStreamedContent] = useState('');

  const resetContent = useCallback(() => {
    setStreamedContent('');
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
        // Only append content from 'text' type messages
        if (chunk.type === 'text') {
          setStreamedContent((prev) => prev + chunk.content);
        }
        // You can handle other message types here if needed:
        // - 'action_start': Show action starting
        // - 'action_result': Show action completed
        // - 'error': Handle error in stream
        // - 'done': Stream complete
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
    startStream,
    stopStream,
    resetContent,
  };
};
