export interface Message {
  id: string;
  content: string;
  type: 'user' | 'bot';
  timestamp: Date;
  isTyping?: boolean;
  isError?: boolean;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  currentConversationId: string | null;
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatConfig {
  apiEndpoint: string;
  maxRetries: number;
  timeout: number;
  streamingEnabled: boolean;
}

export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatRequest {
  message: string;
  conversationId?: string;
  context?: string;
}

export interface ChatResponse {
  message: string;
  conversationId: string;
  timestamp: number;
}
