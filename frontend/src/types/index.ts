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
  email: string;
  avatar?: string;
  role: 'admin' | 'user' | 'analyst';
  company?: string;
  department?: string;
  createdAt: Date;
  lastLoginAt?: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  user: User;
  token: string;
  expiresIn: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
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
