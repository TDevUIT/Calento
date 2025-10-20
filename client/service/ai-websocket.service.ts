import { StreamChatRequest } from '../interface/ai.interface';
import { api } from '../config/axios';

export class AIWebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private reconnectDelay = 1000;

  constructor() {}

  async chatStream(
    data: StreamChatRequest,
    onMessage: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: Error) => void
  ): Promise<void> {
    try {
      // Use axios baseURL and convert HTTP URL to WebSocket URL
      const baseUrl = api.defaults.baseURL || 'http://localhost:8000/api';
      const wsUrl = baseUrl.replace('http://', 'ws://').replace('https://', 'wss://');
      const fullWsUrl = `${wsUrl}/ai/chat/ws`;
      
      console.log('🔌 Connecting to WebSocket:', fullWsUrl);
      
      this.ws = new WebSocket(fullWsUrl);
      
      this.ws.onopen = () => {
        console.log('✅ WebSocket connected');
        this.reconnectAttempts = 0;
        
        // Send chat request
        if (this.ws) {
          this.ws.send(JSON.stringify({
            type: 'chat_stream',
            data: data
          }));
        }
      };
      
      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          if (message.type === 'chunk') {
            onMessage(message.text);
          } else if (message.type === 'complete') {
            onComplete();
            this.close();
          } else if (message.type === 'error') {
            onError(new Error(message.error));
            this.close();
          }
        } catch (parseError) {
          console.error('❌ Failed to parse WebSocket message:', parseError);
          onError(new Error('Failed to parse server response'));
        }
      };
      
      this.ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        onError(new Error('WebSocket connection error'));
      };
      
      this.ws.onclose = (event) => {
        console.log('🔌 WebSocket closed:', event.code, event.reason);
        
        if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
          // Attempt to reconnect
          this.reconnectAttempts++;
          console.log(`🔄 Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
          
          setTimeout(() => {
            this.chatStream(data, onMessage, onComplete, onError);
          }, this.reconnectDelay * this.reconnectAttempts);
        }
      };
      
    } catch (error) {
      console.error('❌ WebSocket setup error:', error);
      onError(new Error(`WebSocket setup failed: ${error}`));
    }
  }
  
  close(): void {
    if (this.ws) {
      this.ws.close(1000, 'Client closed connection');
      this.ws = null;
    }
  }
}

// Export singleton instance
export const aiWebSocketService = new AIWebSocketService();
