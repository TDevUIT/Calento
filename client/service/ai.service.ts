import { api, getErrorMessage } from '../config/axios';
import {
  ChatRequest,
  ChatResponse,
  StreamChatRequest,
  FunctionExecutionRequest,
  FunctionExecutionResponse,
} from '../interface/ai.interface';
import { API_ROUTES } from '../constants/routes';

export const chat = async (data: ChatRequest): Promise<ChatResponse> => {
  try {
    const response = await api.post<ChatResponse>(
      API_ROUTES.AI_CHAT,
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const chatStream = async (
  data: StreamChatRequest,
  onMessage: (chunk: string) => void,
  onComplete: () => void,
  onError: (error: Error) => void
): Promise<void> => {
  let buffer = '';
  
  try {
    console.log('ðŸŒ Starting stream to:', API_ROUTES.AI_CHAT_STREAM);
    console.log('ðŸ“‹ Request data:', data);
    console.log('ðŸ”§ Axios baseURL:', api.defaults.baseURL);
    
    const fullUrl = `${api.defaults.baseURL}${API_ROUTES.AI_CHAT_STREAM}`;
    console.log('ðŸ”— Full URL:', fullUrl);
    
    console.log('ðŸ§ª Testing backend connectivity...');
    try {
      const testResponse = await fetch(`${api.defaults.baseURL}/ai/health`, {
        method: 'GET',
        credentials: 'include',
      });
      console.log('ðŸ¥ Health check status:', testResponse.status);
    } catch (healthError) {
      console.error('âŒ Backend health check failed:', healthError);
      throw new Error(`Backend not reachable: ${healthError instanceof Error ? healthError.message : String(healthError)}`);
    }

    const fetchHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream',
    };

    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: fetchHeaders,
      body: JSON.stringify(data),
      credentials: 'include', // Always include cookies for authentication
    }).catch((fetchError) => {
      console.error('âŒ Fetch failed:', fetchError);
      throw new Error(`Network error: ${fetchError.message}. Please check if the server is running.`);
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error('âŒ Streaming request failed:', {
        status: response.status,
        statusText: response.statusText,
        url: fullUrl,
        errorBody: errorText,
      });
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}. ${errorText}`);
    }
    
    console.log('âœ… Streaming connection established');

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No reader available');
    }

    const decoder = new TextDecoder();

    const readStream = async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            console.log('ðŸ Reader done');
            onComplete();
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          console.log('ðŸ“¦ Raw buffer chunk:', buffer.substring(0, 100));
          
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // Keep incomplete line in buffer

          for (const line of lines) {
            const trimmedLine = line.trim();
            
            if (!trimmedLine) continue;
            
            if (trimmedLine.startsWith('event:')) {
              const eventType = trimmedLine.substring(6).trim();
              console.log('ðŸ“¡ SSE Event type:', eventType);
              
              if (eventType === 'error') {
                console.error('âŒ Backend error event detected');
              }
              continue;
            }
            
            if (trimmedLine.startsWith('data:')) {
              try {
                const jsonStr = trimmedLine.substring(5).trim();
                console.log('ðŸ” Parsing JSON:', jsonStr);
                
                try {
                  const parsed = JSON.parse(jsonStr);
                  console.log('ðŸ“¨ Received SSE:', parsed);
                  
                  const eventData = parsed.data || parsed;
                  
                  if (eventData.error) {
                    console.error('âŒ Backend error:', eventData.error);
                    onError(new Error(eventData.error));
                    return;
                  }
                  
                  if (eventData.text) {
                    console.log('âœï¸ Chunk text:', eventData.text);
                    onMessage(eventData.text);
                  }
                  
                  if (eventData.done) {
                    console.log('ðŸ Stream done');
                    onComplete();
                    return;
                  }
                } catch (jsonError) {
                  console.error('âŒ Backend error message:', jsonStr);
                  onError(new Error(`Backend error: ${jsonStr}`));
                  return;
                }
              } catch (parseError) {
                console.warn('âš ï¸ Failed to parse SSE data:', trimmedLine);
                console.warn('Parse error:', parseError);
              }
            }
          }
        }
      } catch (error) {
        console.error('âŒ readStream error:', error);
        onError(new Error(getErrorMessage(error)));
      }
    };

    await readStream();
  } catch (error) {
    console.error('âŒ chatStream error:', error);
    onError(new Error(getErrorMessage(error)));
  }
};

export const executeFunction = async (
  data: FunctionExecutionRequest
): Promise<FunctionExecutionResponse> => {
  try {
    const response = await api.post<FunctionExecutionResponse>(
      API_ROUTES.AI_FUNCTION_EXECUTE,
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const aiService = {
  chat,
  chatStream,
  executeFunction,
};

export default aiService;
