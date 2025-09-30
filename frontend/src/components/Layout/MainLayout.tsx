import React, { useState, useEffect, useCallback, memo } from 'react';
import { Sidebar } from './Sidebar';
import { useChatStore } from '../../store/chatStore';
import { useAuth } from '../../hooks/useAuth';
import { RenderTracker } from '../Debug/RenderTracker';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayoutComponent: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const { 
    setCurrentConversation,
    clearMessages,
    addConversation,
    updateConversation,
  } = useChatStore();

  // Debug: Log when MainLayout renders
  console.log('🔍 MainLayout render:', { 
    sidebarOpen, 
    userId: user?.id, 
    userEmail: user?.email 
  });

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    // Set initial state
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Listen for sidebar toggle events from header
  useEffect(() => {
    const handleToggleEvent = () => {
      setSidebarOpen(prev => !prev); // Use function to avoid dependency
    };

    window.addEventListener('toggleSidebar', handleToggleEvent);
    return () => window.removeEventListener('toggleSidebar', handleToggleEvent);
  }, []); // Empty dependency array

  const generateConversationTitle = useCallback((messages: { type: string; content: string }[]) => {
    const userMessages = messages.filter(msg => msg.type === 'user');
    if (userMessages.length > 0) {
      const firstMessage = userMessages[0].content;
      // Gerar título baseado na primeira mensagem (máximo 50 caracteres)
      return firstMessage.length > 50 
        ? firstMessage.substring(0, 47) + '...' 
        : firstMessage;
    }
    return `Nova conversa ${new Date().toLocaleDateString()}`;
  }, []);

  const handleNewChat = useCallback(() => {
    const state = useChatStore.getState();
    const currentMessages = state.messages;
    const currentId = state.currentConversationId;
    const allConversations = state.conversations;
    
    // Salvar conversa atual se houver mensagens
    if (currentMessages.length > 0) {
      if (currentId) {
        // Atualizar conversa existente
        const currentConversation = allConversations.find(c => c.id === currentId);
        if (currentConversation) {
          updateConversation(currentId, {
            messages: [...currentMessages],
            title: currentConversation.title || generateConversationTitle(currentMessages),
          });
        }
      } else {
        // Criar nova conversa para as mensagens atuais
        const title = generateConversationTitle(currentMessages);
        addConversation({
          title,
          messages: [...currentMessages],
          userId: user?.id || 'anonymous',
        });
      }
    }

    // Limpar mensagens e iniciar nova conversa
    clearMessages();
    setCurrentConversation(null);
  }, [updateConversation, generateConversationTitle, addConversation, user?.id, clearMessages, setCurrentConversation]);

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  return (
    <div className="flex h-screen bg-gray-800">
      <RenderTracker componentName="MainLayout" props={{ sidebarOpen, userId: user?.id }} />
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={handleToggleSidebar}
        onNewChat={handleNewChat}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
    </div>
  );
};

export const MainLayout = memo(MainLayoutComponent);
MainLayout.displayName = 'MainLayout';
