import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type { ChatRequest, ChatResponse, Talk, MessageFromAPI, Message } from '../types';

class ChatService {
  private api: AxiosInstance;

  constructor() {
    // Detectar se estamos acessando via IP da rede
    const currentHost = window.location.hostname;
    const isNetworkAccess = currentHost !== 'localhost' && currentHost !== '127.0.0.1';
    
    let baseURL: string;
    if (isNetworkAccess) {
      // Usar o mesmo IP da rede para o backend
      baseURL = `http://${currentHost}:5001/api`;
    } else {
      baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
    }
    
    console.log('🌐 ChatService - URL do backend:', baseURL);

    this.api = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        // Add auth token if available - get from Zustand store
        const authData = localStorage.getItem('auth-store');
        if (authData) {
          try {
            const parsed = JSON.parse(authData);
            const token = parsed?.state?.token;
            if (token) {
              config.headers.Authorization = `Bearer ${token}`;
            }
          } catch (error) {
            console.warn('Error parsing auth store:', error);
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access - clear auth store
          localStorage.removeItem('auth-store');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await this.api.post<ChatResponse>('/chat', request);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async sendMessageStream(
    request: ChatRequest,
    onChunk: (chunk: string) => void,
    onComplete: (response: ChatResponse) => void,
    onError: (error: Error) => void
  ): Promise<void> {
    try {
      // Get token from auth store
      const authData = localStorage.getItem('auth-store');
      let token = '';
      if (authData) {
        try {
          const parsed = JSON.parse(authData);
          token = parsed?.state?.token || '';
        } catch (error) {
          console.warn('Error parsing auth store for stream:', error);
        }
      }

      const response = await fetch(`${this.api.defaults.baseURL}/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('Response body is not readable');
      }

      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data === '[DONE]') {
              onComplete({
                message: fullResponse,
                conversationId: request.conversationId || crypto.randomUUID(),
                timestamp: Date.now(),
              });
              return;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                fullResponse += parsed.content;
                onChunk(parsed.content);
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      onError(this.handleError(error));
    }
  }

  async getConversations(): Promise<unknown[]> {
    try {
      const response = await this.api.get('/conversations');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getConversation(id: string): Promise<unknown> {
    try {
      const response = await this.api.get(`/conversations/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getUserTalks(): Promise<Talk[]> {
    try {
      const response = await this.api.get<Talk[]>('/talk-user');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getMessagesByTalk(talkId: string): Promise<Message[]> {
    try {
      console.log('🔍 ChatService - Buscando mensagens para talk:', talkId);
      const response = await this.api.get<MessageFromAPI[]>(`/messages-by-talk?talk_id=${talkId}`);
      console.log('✅ ChatService - Mensagens carregadas:', response.data);
      
      // Converter mensagens da API para o formato do frontend
      const messages = response.data.map(this.convertApiMessageToMessage);
      console.log('✅ ChatService - Mensagens convertidas:', messages);
      return messages;
    } catch (error) {
      console.error('❌ ChatService - Erro ao carregar mensagens:', error);
      throw this.handleError(error);
    }
  }

  private convertApiMessageToMessage(apiMessage: MessageFromAPI): Message {
    return {
      id: apiMessage._id.$oid,
      content: apiMessage.content,
      type: apiMessage.type,
      timestamp: new Date(apiMessage.create_at.$date),
    };
  }

  private handleError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      return new Error(message);
    }
    return error instanceof Error ? error : new Error('Unknown error occurred');
  }
}

export const chatService = new ChatService();
