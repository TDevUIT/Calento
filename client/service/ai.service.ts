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
    console.log('🌐 Starting stream to:', API_ROUTES.AI_CHAT_STREAM);
    console.log('📋 Request data:', data);
    console.log('🔧 Axios baseURL:', api.defaults.baseURL);
    
    // Use axios configuration for consistent URL building
    const fullUrl = `${api.defaults.baseURL}${API_ROUTES.AI_CHAT_STREAM}`;
    console.log('🔗 Full URL:', fullUrl);
    
    // Test if backend is reachable first
    console.log('🧪 Testing backend connectivity...');
    try {
      const testResponse = await fetch(`${api.defaults.baseURL}/ai/health`, {
        method: 'GET',
        credentials: 'include',
      });
      console.log('🏥 Health check status:', testResponse.status);
    } catch (healthError) {
      console.error('❌ Backend health check failed:', healthError);
      throw new Error(`Backend not reachable: ${healthError instanceof Error ? healthError.message : String(healthError)}`);
    }

    // Build headers compatible with fetch API, inheriting from axios defaults
    const fetchHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream',
    };

    // Use fetch for SSE streaming (axios doesn't support real-time streaming in browser)
    // But reuse axios configuration for consistency
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: fetchHeaders,
      body: JSON.stringify(data),
      credentials: 'include', // Always include cookies for authentication
    }).catch((fetchError) => {
      console.error('❌ Fetch failed:', fetchError);
      throw new Error(`Network error: ${fetchError.message}. Please check if the server is running.`);
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error('❌ Streaming request failed:', {
        status: response.status,
        statusText: response.statusText,
        url: fullUrl,
        errorBody: errorText,
      });
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}. ${errorText}`);
    }
    
    console.log('✅ Streaming connection established');

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
            console.log('🏁 Reader done');
            onComplete();
            break;
          }

          // Decode the chunk
          buffer += decoder.decode(value, { stream: true });
          console.log('📦 Raw buffer chunk:', buffer.substring(0, 100));
          
          // Split by SSE format (data: {json}\n)
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // Keep incomplete line in buffer

          for (const line of lines) {
            const trimmedLine = line.trim();
            
            // Skip empty lines
            if (!trimmedLine) continue;
            
            // Handle SSE event types
            if (trimmedLine.startsWith('event:')) {
              const eventType = trimmedLine.substring(6).trim();
              console.log('📡 SSE Event type:', eventType);
              
              if (eventType === 'error') {
                console.error('❌ Backend error event detected');
              }
              continue;
            }
            
            if (trimmedLine.startsWith('data:')) {
              try {
                // Remove "data:" prefix and parse JSON
                const jsonStr = trimmedLine.substring(5).trim();
                console.log('🔍 Parsing JSON:', jsonStr);
                
                // Try to parse as JSON first
                try {
                  const parsed = JSON.parse(jsonStr);
                  console.log('📨 Received SSE:', parsed);
                  
                  // Handle both formats: direct {text, done} or nested {data: {text, done}}
                  const eventData = parsed.data || parsed;
                  
                  // Check for error in response
                  if (eventData.error) {
                    console.error('❌ Backend error:', eventData.error);
                    onError(new Error(eventData.error));
                    return;
                  }
                  
                  if (eventData.text) {
                    console.log('✍️ Chunk text:', eventData.text);
                    onMessage(eventData.text);
                  }
                  
                  if (eventData.done) {
                    console.log('🏁 Stream done');
                    onComplete();
                    return;
                  }
                } catch (jsonError) {
                  // Not JSON - might be error message
                  console.error('❌ Backend error message:', jsonStr);
                  onError(new Error(`Backend error: ${jsonStr}`));
                  return;
                }
              } catch (parseError) {
                console.warn('⚠️ Failed to parse SSE data:', trimmedLine);
                console.warn('Parse error:', parseError);
              }
            }
          }
        }
      } catch (error) {
        console.error('❌ readStream error:', error);
        onError(new Error(getErrorMessage(error)));
      }
    };

    await readStream();
  } catch (error) {
    console.error('❌ chatStream error:', error);
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
