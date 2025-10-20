import { StreamChatRequest } from '../interface/ai.interface';
import { chatStream as sseStream } from './ai.service';
import { aiWebSocketService } from './ai-websocket.service';
import { aiPollingService } from './ai-polling.service';

type StreamMethod = 'sse' | 'websocket' | 'polling';

interface StreamOptions {
  preferredMethod?: StreamMethod;
  enableFallback?: boolean;
  timeout?: number;
}

export const chatStreamWithFallback = async (
  data: StreamChatRequest,
  onMessage: (chunk: string) => void,
  onComplete: () => void,
  onError: (error: Error) => void,
  options: StreamOptions = {}
): Promise<void> => {
  const {
    preferredMethod = 'sse',
    enableFallback = true,
    timeout = 30000
  } = options;

  const methods: StreamMethod[] = enableFallback 
    ? [preferredMethod, ...(['sse', 'websocket', 'polling'].filter(m => m !== preferredMethod) as StreamMethod[])]
    : [preferredMethod];

  let currentMethodIndex = 0;
  let timeoutId: NodeJS.Timeout;

  const tryNextMethod = async (): Promise<void> => {
    if (currentMethodIndex >= methods.length) {
      onError(new Error('All streaming methods failed'));
      return;
    }

    const method = methods[currentMethodIndex];
    console.log(`ðŸ”„ Trying streaming method: ${method} (${currentMethodIndex + 1}/${methods.length})`);

    timeoutId = setTimeout(() => {
      console.warn(`â° Method ${method} timed out, trying next...`);
      currentMethodIndex++;
      tryNextMethod();
    }, timeout);

    const wrappedOnComplete = () => {
      clearTimeout(timeoutId);
      onComplete();
    };

    const wrappedOnError = (error: Error) => {
      clearTimeout(timeoutId);
      console.error(`âŒ Method ${method} failed:`, error.message);
      
      if (enableFallback && currentMethodIndex < methods.length - 1) {
        currentMethodIndex++;
        setTimeout(tryNextMethod, 1000); // Wait 1s before trying next method
      } else {
        onError(error);
      }
    };

    try {
      switch (method) {
        case 'sse':
          await sseStream(data, onMessage, wrappedOnComplete, wrappedOnError);
          break;
          
        case 'websocket':
          await aiWebSocketService.chatStream(data, onMessage, wrappedOnComplete, wrappedOnError);
          break;
          
        case 'polling':
          await aiPollingService.chatStream(data, onMessage, wrappedOnComplete, wrappedOnError);
          break;
          
        default:
          throw new Error(`Unknown streaming method: ${method}`);
      }
    } catch (error) {
      wrappedOnError(error as Error);
    }
  };

  await tryNextMethod();
};

export const chatStreamSSE = (
  data: StreamChatRequest,
  onMessage: (chunk: string) => void,
  onComplete: () => void,
  onError: (error: Error) => void
) => chatStreamWithFallback(data, onMessage, onComplete, onError, { 
  preferredMethod: 'sse', 
  enableFallback: false 
});

export const chatStreamWebSocket = (
  data: StreamChatRequest,
  onMessage: (chunk: string) => void,
  onComplete: () => void,
  onError: (error: Error) => void
) => chatStreamWithFallback(data, onMessage, onComplete, onError, { 
  preferredMethod: 'websocket', 
  enableFallback: false 
});

export const chatStreamPolling = (
  data: StreamChatRequest,
  onMessage: (chunk: string) => void,
  onComplete: () => void,
  onError: (error: Error) => void
) => chatStreamWithFallback(data, onMessage, onComplete, onError, { 
  preferredMethod: 'polling', 
  enableFallback: false 
});

export const aiFallbackService = {
  chatStream: chatStreamWithFallback,
  chatStreamSSE,
  chatStreamWebSocket,
  chatStreamPolling,
};
