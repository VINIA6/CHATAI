import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { useChatStore } from '../../store/chatStore';
import { useAuth } from '../../hooks/useAuth';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const { 
    messages,
    currentConversationId,
    conversations,
    setCurrentConversation,
    clearMessages,
    addConversation,
    updateConversation,
  } = useChatStore();

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
      setSidebarOpen(!sidebarOpen);
    };

    window.addEventListener('toggleSidebar', handleToggleEvent);
    return () => window.removeEventListener('toggleSidebar', handleToggleEvent);
  }, [sidebarOpen]);

  const generateConversationTitle = (messages: { type: string; content: string }[]) => {
    const userMessages = messages.filter(msg => msg.type === 'user');
    if (userMessages.length > 0) {
      const firstMessage = userMessages[0].content;
      // Gerar título baseado na primeira mensagem (máximo 50 caracteres)
      return firstMessage.length > 50 
        ? firstMessage.substring(0, 47) + '...' 
        : firstMessage;
    }
    return `Nova conversa ${new Date().toLocaleDateString()}`;
  };

  const handleNewChat = () => {
    // Salvar conversa atual se houver mensagens
    if (messages.length > 0) {
      if (currentConversationId) {
        // Atualizar conversa existente
        const currentConversation = conversations.find(c => c.id === currentConversationId);
        if (currentConversation) {
          updateConversation(currentConversationId, {
            messages: [...messages],
            title: currentConversation.title || generateConversationTitle(messages),
          });
        }
      } else {
        // Criar nova conversa para as mensagens atuais
        const title = generateConversationTitle(messages);
        addConversation({
          title,
          messages: [...messages],
          userId: user?.id || 'anonymous',
        });
      }
    }

    // Limpar mensagens e iniciar nova conversa
    clearMessages();
    setCurrentConversation(null);
  };

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-800">
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
