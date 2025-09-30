import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type { ChatRequest, ChatResponse, Talk, MessageFromAPI, Message } from '../types';

class ChatService {
  private api: AxiosInstance;

  constructor() {
    // Detectar ambiente e usar URL apropriada
    let baseURL: string;
    if (import.meta.env.VITE_API_URL) {
      // Se há variável de ambiente, usar ela
      baseURL = import.meta.env.VITE_API_URL;
    } else if (import.meta.env.PROD) {
      // Se está em produção (Vercel), usar proxy relativo
      baseURL = '/api';
    } else {
      // Em desenvolvimento local, usar URL direta do backend
      baseURL = 'http://72.60.166.177:5001/api';
    }
    
    console.log('🌐 ChatService - URL do backend:', baseURL);
    console.log('🌐 ChatService - Ambiente:', import.meta.env.MODE);
    console.log('🌐 ChatService - Produção:', import.meta.env.PROD);

    this.api = axios.create({
      baseURL,
      timeout: 120000, // 2 minutos para agentes lentos
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

  // Helper para retry em caso de timeout
  private async retryOnTimeout<T>(
    fn: () => Promise<T>,
    maxRetries: number = 2,
    retryDelay: number = 2000
  ): Promise<T> {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 Tentativa ${attempt + 1}/${maxRetries + 1}`);
        return await fn();
      } catch (error) {
        lastError = error as Error;
        
        // Se for timeout e ainda temos tentativas, retry
        if (axios.isAxiosError(error) && 
            (error.code === 'ECONNABORTED' || error.message.includes('timeout')) &&
            attempt < maxRetries) {
          console.warn(`⏱️ Timeout na tentativa ${attempt + 1}, tentando novamente em ${retryDelay}ms...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          continue;
        }
        
        // Se não é timeout ou não temos mais tentativas, lançar erro
        throw error;
      }
    }
    
    throw lastError;
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
      
      // Garantir que sempre retornamos um array
      if (!Array.isArray(response.data)) {
        console.error('❌ ChatService - getUserTalks retornou não-array:', response.data);
        return [];
      }
      
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

  async createNewTalk(message: string): Promise<{ talk: { talk_id: string; name: string; created_at: string }; messages: Message[] }> {
    try {
      console.log('🔍 ChatService - Criando nova conversa com mensagem:', message);
      
      // Usar retry para operações críticas (agente pode ser lento)
      const response = await this.retryOnTimeout(
        () => this.api.post('/talk', { message }),
        2, // 2 retries
        3000 // 3 segundos entre tentativas
      );
      
      console.log('✅ ChatService - Nova conversa criada:', response.data);
      
      // Converter mensagens da API para o formato do frontend
      const messages = response.data.messages.map(this.convertApiMessageToMessage);
      
      return {
        talk: response.data.talk,
        messages: messages
      };
    } catch (error) {
      console.error('❌ ChatService - Erro ao criar nova conversa:', error);
      throw this.handleError(error);
    }
  }

  async sendMessageToExistingTalk(talkId: string, message: string): Promise<Message[]> {
    try {
      console.log('🔍 ChatService - Enviando mensagem para conversa existente:', { talkId, message });
      
      // Usar retry para operações críticas (agente pode ser lento)
      const response = await this.retryOnTimeout(
        () => this.api.post('/message', {
          talk_id: talkId,
          content: message,
          type: 'user'
        }),
        2, // 2 retries
        3000 // 3 segundos entre tentativas
      );
      
      console.log('✅ ChatService - Mensagem enviada:', response.data);
      
      // Converter mensagens da API para o formato do frontend
      const messages = response.data.messages.map(this.convertApiMessageToMessage);
      
      return messages;
    } catch (error) {
      console.error('❌ ChatService - Erro ao enviar mensagem:', error);
      throw this.handleError(error);
    }
  }

  async updateTalk(talkId: string, newName: string): Promise<{ talk_id: string; name: string; updated_at: string }> {
    try {
      console.log('🔍 ChatService - Atualizando conversa:', { talkId, newName });
      const response = await this.api.put('/talk', {
        talk_id: talkId,
        name: newName
      });
      console.log('✅ ChatService - Conversa atualizada:', response.data);
      return response.data.talk;
    } catch (error) {
      console.error('❌ ChatService - Erro ao atualizar conversa:', error);
      throw this.handleError(error);
    }
  }

  async deleteTalk(talkId: string): Promise<void> {
    try {
      console.log('🔍 ChatService - Deletando conversa:', talkId);
      const response = await this.api.delete(`/talk?talk_id=${talkId}`);
      console.log('✅ ChatService - Conversa deletada:', response.data);
    } catch (error) {
      console.error('❌ ChatService - Erro ao deletar conversa:', error);
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      
      // Tratamento específico para erros conhecidos do backend
      if (errorMessage.includes('Timeout ao conectar com n8n')) {
        return new Error(
          'O sistema está demorando mais que o esperado para processar sua mensagem. ' +
          'Isso geralmente acontece quando o agente está analisando perguntas complexas. ' +
          'Por favor, aguarde alguns instantes e tente novamente.'
        );
      }
      
      if (errorMessage.includes('timeout') || errorMessage.includes('ETIMEDOUT')) {
        return new Error(
          'O servidor demorou muito para responder. ' +
          'Por favor, tente novamente em alguns instantes.'
        );
      }
      
      return new Error(errorMessage);
    }
    return error instanceof Error ? error : new Error('Erro desconhecido ao processar sua mensagem');
  }
}

export const chatService = new ChatService();
