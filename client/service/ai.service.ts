import { api, getErrorMessage } from '../config/axios';
import {
  ChatRequest,
  ChatResponse,
  StreamChatRequest,
  FunctionExecutionRequest,
  FunctionExecutionResponse,
  ConversationResponse,
  ConversationsListResponse,
  DeleteConversationResponse,
} from '../interface/ai.interface';
import { API_ROUTES } from '../constants/routes';
import { logger } from '../utils/logger.utils';

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
    logger.info('Starting stream to:', API_ROUTES.AI_CHAT_STREAM);
    logger.info('Request data:', data);
    logger.info('Axios baseURL:', api.defaults.baseURL);
    
    const fullUrl = `${api.defaults.baseURL}${API_ROUTES.AI_CHAT_STREAM}`;
    logger.info('Full URL:', fullUrl);
    
    logger.info('Testing backend connectivity...');
    try {
      const testResponse = await fetch(`${api.defaults.baseURL}/ai/health`, {
        method: 'GET',
        credentials: 'include',
      });
      logger.info('Health check status:', testResponse.status);
    } catch (healthError) {
      logger.error(`Backend health check failed: ${healthError instanceof Error ? healthError.message : String(healthError)}`);
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
      logger.error(`Fetch failed: ${fetchError.message}`);
      throw new Error(`Network error: ${fetchError.message}. Please check if the server is running.`);
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      logger.error(`Streaming request failed: ${response.status} - ${response.statusText}`, fullUrl);
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}. ${errorText}`);
    }
    
    logger.info('Streaming connection established');

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
            logger.info('Reader done');
            onComplete();
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          logger.info('Raw buffer chunk:', buffer.substring(0, 100));
          
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // Keep incomplete line in buffer

          for (const line of lines) {
            const trimmedLine = line.trim();
            
            if (!trimmedLine) continue;
            
            if (trimmedLine.startsWith('event:')) {
              const eventType = trimmedLine.substring(6).trim();
              logger.info('SSE Event type:', eventType);
              
              if (eventType === 'error') {
                logger.error('Backend error event detected');
              }
              continue;
            }
            
            if (trimmedLine.startsWith('data:')) {
              try {
                const jsonStr = trimmedLine.substring(5).trim();
                logger.info('Parsing JSON:', jsonStr);
                
                try {
                  const parsed = JSON.parse(jsonStr);
                  logger.info('Received SSE:', parsed);
                  
                  const eventData = parsed.data || parsed;
                  
                  if (eventData.error) {
                    logger.error(`Backend error: ${eventData.error}`);
                    onError(new Error(eventData.error));
                    return;
                  }
                  
                  if (eventData.text) {
                    logger.info('Chunk text:', eventData.text);
                    onMessage(eventData.text);
                  }
                  
                  if (eventData.done) {
                    logger.info('Stream done');
                    onComplete();
                    return;
                  }
                } catch (jsonError) {
                  logger.error(`Backend error message: ${jsonStr}`);
                  onError(new Error(`Backend error: ${jsonStr}`));
                  return;
                }
              } catch (parseError) {
                logger.warn('Failed to parse SSE data:', trimmedLine);
                logger.warn('Parse error:', parseError);
              }
            }
          }
        }
      } catch (error) {
        logger.error(`readStream error: ${error instanceof Error ? error.message : String(error)}`);
        onError(new Error(getErrorMessage(error)));
      }
    };

    await readStream();
  } catch (error) {
    logger.error(`chatStream error: ${error instanceof Error ? error.message : String(error)}`);
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

export const getConversations = async (
  limit: number = 50
): Promise<ConversationsListResponse> => {
  try {
    const response = await api.get<ConversationsListResponse>(
      `${API_ROUTES.AI_CONVERSATIONS}?limit=${limit}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getConversation = async (
  conversationId: string
): Promise<ConversationResponse> => {
  try {
    const response = await api.get<ConversationResponse>(
      API_ROUTES.AI_CONVERSATION_DETAIL(conversationId),
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const deleteConversation = async (
  conversationId: string
): Promise<DeleteConversationResponse> => {
  try {
    const response = await api.delete<DeleteConversationResponse>(
      API_ROUTES.AI_CONVERSATION_DELETE(conversationId),
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
  getConversations,
  getConversation,
  deleteConversation,
};

export default aiService;
