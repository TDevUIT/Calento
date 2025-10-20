import { api, getErrorMessage } from '../config/axios';
import { StreamChatRequest } from '../interface/ai.interface';
import { API_ROUTES } from '../constants/routes';

interface StreamSession {
  id: string;
  status: 'pending' | 'streaming' | 'completed' | 'error';
  chunks: string[];
  error?: string;
}

export const chatStreamPolling = async (
  data: StreamChatRequest,
  onMessage: (chunk: string) => void,
  onComplete: () => void,
  onError: (error: Error) => void
): Promise<void> => {
  try {
    console.log('🚀 Starting polling-based stream');
    
    // 1. Start streaming session
    const startResponse = await api.post<{ session_id: string }>(
      `${API_ROUTES.AI_CHAT}/stream/start`,
      data,
      { withCredentials: true }
    );
    
    const sessionId = startResponse.data.session_id;
    console.log('📋 Stream session started:', sessionId);
    
    // 2. Poll for chunks
    let lastChunkIndex = 0;
    const pollInterval = 500; // Poll every 500ms
    const maxPolls = 120; // Max 60 seconds (120 * 500ms)
    let pollCount = 0;
    
    const poll = async (): Promise<void> => {
      try {
        pollCount++;
        
        if (pollCount > maxPolls) {
          onError(new Error('Stream timeout - no response after 60 seconds'));
          return;
        }
        
        const pollResponse = await api.get<StreamSession>(
          `${API_ROUTES.AI_CHAT}/stream/${sessionId}`,
          { withCredentials: true }
        );
        
        const session = pollResponse.data;
        
        // Send new chunks
        if (session.chunks.length > lastChunkIndex) {
          const newChunks = session.chunks.slice(lastChunkIndex);
          newChunks.forEach(chunk => {
            console.log('📨 New chunk:', chunk.substring(0, 50));
            onMessage(chunk);
          });
          lastChunkIndex = session.chunks.length;
        }
        
        // Check session status
        if (session.status === 'completed') {
          console.log('✅ Stream completed');
          onComplete();
          return;
        } else if (session.status === 'error') {
          console.error('❌ Stream error:', session.error);
          onError(new Error(session.error || 'Stream failed'));
          return;
        }
        
        // Continue polling
        setTimeout(poll, pollInterval);
        
      } catch (pollError) {
        console.error('❌ Poll error:', pollError);
        onError(new Error(getErrorMessage(pollError)));
      }
    };
    
    // Start polling
    setTimeout(poll, pollInterval);
    
  } catch (error) {
    console.error('❌ Polling stream error:', error);
    onError(new Error(getErrorMessage(error)));
  }
};

export const aiPollingService = {
  chatStream: chatStreamPolling,
};
