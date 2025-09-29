import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Message, ChatState, Conversation } from '../types';

interface ChatStore extends ChatState {
  // Actions
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  deleteMessage: (id: string) => void;
  clearMessages: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setTyping: (isTyping: boolean) => void;
  
  // Conversations
  conversations: Conversation[];
  addConversation: (conversation: Omit<Conversation, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  deleteConversation: (id: string) => void;
  setCurrentConversation: (id: string | null) => void;
  loadConversation: (id: string) => void;
  
  // Utils
  generateMessageId: () => string;
}

export const useChatStore = create<ChatStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        messages: [],
        isLoading: false,
        error: null,
        currentConversationId: null,
        conversations: [],

        // Message actions
        addMessage: (messageData) => {
          const message: Message = {
            ...messageData,
            id: get().generateMessageId(),
            timestamp: new Date(),
          };
          
          set((state) => ({
            messages: [...state.messages, message],
            error: null,
          }));
        },

        updateMessage: (id, updates) => {
          set((state) => ({
            messages: state.messages.map((msg) =>
              msg.id === id ? { ...msg, ...updates } : msg
            ),
          }));
        },

        deleteMessage: (id) => {
          set((state) => ({
            messages: state.messages.filter((msg) => msg.id !== id),
          }));
        },

        clearMessages: () => {
          set({ messages: [], error: null });
        },

        setLoading: (loading) => {
          set({ isLoading: loading });
        },

        setError: (error) => {
          set({ error, isLoading: false });
        },

        setTyping: (isTyping) => {
          set((state) => ({
            messages: state.messages.map((msg) =>
              msg.type === 'bot' && msg.isTyping !== undefined
                ? { ...msg, isTyping }
                : msg
            ),
          }));
        },

        // Conversation actions
        addConversation: (conversationData) => {
          const conversation: Conversation = {
            ...conversationData,
            id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          
          set((state) => ({
            conversations: [conversation, ...state.conversations],
            currentConversationId: conversation.id,
          }));
          
          return conversation.id;
        },

        updateConversation: (id, updates) => {
          set((state) => ({
            conversations: state.conversations.map((conv) =>
              conv.id === id 
                ? { ...conv, ...updates, updatedAt: new Date() }
                : conv
            ),
          }));
        },

        deleteConversation: (id) => {
          set((state) => ({
            conversations: state.conversations.filter((conv) => conv.id !== id),
            currentConversationId: 
              state.currentConversationId === id ? null : state.currentConversationId,
          }));
        },

        setCurrentConversation: (id) => {
          set({ currentConversationId: id });
        },

        loadConversation: (id) => {
          const state = get();
          const conversation = state.conversations.find(conv => conv.id === id);
          
          if (conversation) {
            set({
              messages: [...conversation.messages],
              currentConversationId: id,
              error: null,
            });
          }
        },

        // Utilities
        generateMessageId: () => {
          return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        },
      }),
      {
        name: 'chat-store',
        partialize: (state) => ({
          conversations: state.conversations,
          currentConversationId: state.currentConversationId,
        }),
      }
    ),
    {
      name: 'chat-store',
    }
  )
);
