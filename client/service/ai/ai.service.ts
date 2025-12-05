import { api, getErrorMessage } from '../../config/axios';
import {
  ChatRequest,
  ChatResponse,
  StreamChatRequest,
  FunctionExecutionRequest,
  FunctionExecutionResponse,
  ConversationResponse,
  ConversationsListResponse,
  DeleteConversationResponse,
  StreamMessage,
} from '../../interface';
import { API_ROUTES } from '../../constants/routes';
import { logger } from '../../utils/logger.utils';


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

const checkBackendHealth = async () => {
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
};

const initiateStreamRequest = async (url: string, data: StreamChatRequest) => {
  const fetchHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'text/event-stream',
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: fetchHeaders,
    body: JSON.stringify(data),
    credentials: 'include',
  }).catch((fetchError) => {
    logger.error(`Fetch failed: ${fetchError.message}`);
    throw new Error(`Network error: ${fetchError.message}. Please check if the server is running.`);
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    logger.error(`Streaming request failed: ${response.status} - ${response.statusText}`, url);
    throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}. ${errorText}`);
  }

  return response;
};

const processSSELine = (
  line: string,
  onMessage: (chunk: StreamMessage) => void,
  onComplete: () => void,
  onError: (error: Error) => void
) => {
  const trimmedLine = line.trim();
  if (!trimmedLine) return;

  if (trimmedLine.startsWith('event:')) {
    const eventType = trimmedLine.substring(6).trim();
    logger.info('SSE Event type:', eventType);
    if (eventType === 'error') {
      logger.error('Backend error event detected');
    }
    return;
  }

  if (trimmedLine.startsWith('data:')) {
    try {
      const jsonStr = trimmedLine.substring(5).trim();
      logger.info('Parsing JSON:', jsonStr);

      const parsed = JSON.parse(jsonStr);
      logger.info('Received SSE:', parsed);

      const eventData = parsed.data || parsed;

      if (eventData.error) {
        logger.error(`Backend error: ${eventData.error}`);
        onError(new Error(eventData.error));
        return;
      }

      switch (eventData.type) {
        case 'text':
          onMessage({ type: 'text', content: eventData.content });
          break;
        case 'action_start':
          onMessage({ type: 'action_start', action: eventData.action });
          break;
        case 'action_result':
          onMessage({ type: 'action_result', action: eventData.action });
          break;
        case 'done':
          onComplete();
          break;
        case 'error':
          onError(new Error(eventData.error));
          break;
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        logger.warn('Failed to parse SSE data:', trimmedLine);
        logger.warn('Parse error:', error);
      } else {
        logger.error(`Error processing SSE data: ${error}`);
        onError(new Error(`Error processing stream data`));
      }
    }
  }
};

export const chatStream = async (
  data: StreamChatRequest,
  onMessage: (chunk: StreamMessage) => void,
  onComplete: () => void,
  onError: (error: Error) => void
): Promise<void> => {
  try {
    logger.info('Starting stream to:', API_ROUTES.AI_CHAT_STREAM);
    logger.info('Request data:', data);

    const fullUrl = `${api.defaults.baseURL}${API_ROUTES.AI_CHAT_STREAM}`;
    logger.info('Full URL:', fullUrl);

    await checkBackendHealth();

    const response = await initiateStreamRequest(fullUrl, data);
    logger.info('Streaming connection established');

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No reader available');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        logger.info('Reader done');
        onComplete();
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        processSSELine(line, onMessage, onComplete, onError);
      }
    }
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

