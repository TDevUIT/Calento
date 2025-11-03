'use client';

import { useState, useCallback } from 'react';
import { aiService } from '@/service/ai.service';
import { StreamChatRequest } from '@/interface/ai.interface';
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
      (chunk: string) => {
        setStreamedContent((prev) => prev + chunk);
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
