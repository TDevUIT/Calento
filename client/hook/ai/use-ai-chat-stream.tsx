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
    console.log('🎬 useAIChatStream: Starting stream with data:', data);
    setIsStreaming(true);
    setStreamedContent('');

    await aiService.chatStream(
      data,
      (chunk: string) => {
        console.log('📥 useAIChatStream: Received chunk:', chunk);
        setStreamedContent((prev) => {
          const newContent = prev + chunk;
          console.log('📊 useAIChatStream: Total content length:', newContent.length);
          return newContent;
        });
      },
      () => {
        console.log('✅ useAIChatStream: Stream completed');
        setIsStreaming(false);
      },
      (error: Error) => {
        console.error('❌ useAIChatStream: Stream error:', error);
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
