import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, MoreVertical, Trash2, Download } from 'lucide-react';
import { Message } from '../Message';
import { ChatInput } from '../Input';
import { useChat } from '../../hooks/useChat';
import { useChatStore } from '../../store/chatStore';
import { cn } from '../../utils';

interface ChatContainerProps {
  className?: string;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({ className }) => {
  const { messages, isLoading, sendMessage, regenerateResponse } = useChat();
  const { 
    clearMessages, 
    conversations, 
    currentConversationId 
  } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Auto-scroll instantaneously when new messages arrive
  useEffect(() => {
    const scrollToBottomInstant = () => {
      if (messagesContainerRef.current && messages.length > 0) {
        const container = messagesContainerRef.current;
        
        // Instant scroll for ALL messages (user and bot)
        requestAnimationFrame(() => {
          container.scrollTop = container.scrollHeight;
        });
      }
    };

    scrollToBottomInstant();
  }, [messages]);

  // Additional instant scroll trigger for message updates
  useEffect(() => {
    if (messagesContainerRef.current && messages.length > 0) {
      const container = messagesContainerRef.current;
      // Double-ensure instant scroll with direct property assignment
      container.scrollTop = container.scrollHeight;
    }
  }, [messages.length]);

  // Listen for force scroll events from hooks
  useEffect(() => {
    const handleForceScroll = () => {
      forceScrollToBottom();
    };

    window.addEventListener('forceScroll', handleForceScroll);
    return () => window.removeEventListener('forceScroll', handleForceScroll);
  }, []);

  // Mutation observer for DOM changes - instant scroll
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const observer = new MutationObserver(() => {
      // Instant scroll for any DOM change
      container.scrollTop = container.scrollHeight;
    });

    observer.observe(container, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  // Handle scroll to show/hide scroll button
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;
      setShowScrollButton(!isNearBottom && messages.length > 3);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [messages.length]);

  const handleScrollToBottom = () => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  // Force instant scroll to bottom
  const forceScrollToBottom = () => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      // Instant scroll - no animation
      container.scrollTop = container.scrollHeight;
    }
  };

  const handleClearChat = () => {
    clearMessages();
    setShowMenu(false);
  };

  const handleExportChat = () => {
    const chatData = messages.map(msg => ({
      type: msg.type,
      content: msg.content,
      timestamp: msg.timestamp.toISOString(),
    }));

    const blob = new Blob([JSON.stringify(chatData, null, 2)], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setShowMenu(false);
  };

  const isEmpty = messages.length === 0;
  
  // Obter título da conversa atual
  const currentConversation = currentConversationId 
    ? conversations.find(c => c.id === currentConversationId)
    : null;
  
  const conversationTitle = currentConversation?.title || 'Nova conversa';

  return (
    <div className={cn('flex flex-col h-full chat-area', className)}>
      {/* Responsive header with status and menu */}
      <div className="relative flex items-center justify-between p-3 sm:p-4 mobile-header border-b chat-header overflow-visible">
        <div className="flex items-center flex-1 min-w-0 pr-4 sm:pr-6">
          {/* Mobile hamburger button - inside header */}
          <button
            onClick={() => {
              // Trigger sidebar toggle - we'll get this from props or context
              const event = new CustomEvent('toggleSidebar');
              window.dispatchEvent(event);
            }}
            className="p-2 hover:bg-gray-600 rounded-lg transition-colors text-gray-300 mr-3 md:hidden"
            aria-label="Toggle menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6"/>
              <line x1="4" y1="12" x2="20" y2="12"/>
              <line x1="4" y1="18" x2="20" y2="18"/>
            </svg>
          </button>
          
          <p className="text-xs sm:text-sm text-gray-300 truncate">
            {isLoading ? (
              <span className="hidden xs:inline">ChatBot está digitando...</span>
            ) : (
              <>
                <span className="hidden lg:inline" title={conversationTitle}>
                  {conversationTitle}
                </span>
                <span className="hidden sm:inline lg:hidden">{messages.length} mensagens</span>
                <span className="sm:hidden">{messages.length} msgs</span>
              </>
            )}
          </p>
        </div>

        <div className="relative flex-shrink-0 z-20">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 sm:p-2 hover:bg-gray-600 rounded-full transition-colors text-gray-300"
            aria-label="Menu de opções"
          >
            <MoreVertical size={16} />
          </button>

          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute right-0 top-full mt-1 w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-30"
              >
                <button
                  onClick={handleExportChat}
                  disabled={isEmpty}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-700 text-gray-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download size={14} />
                  Exportar conversa
                </button>
                <button
                  onClick={handleClearChat}
                  disabled={isEmpty}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-700 text-red-400 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 size={14} />
                  Limpar conversa
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Messages area */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto bg-gray-800 custom-scrollbar"
        onClick={() => {
          setShowMenu(false);
          // Focus input for better UX
          window.dispatchEvent(new CustomEvent('focusInput'));
        }}
      >
        <AnimatePresence>
          {isEmpty ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full p-8 md:p-8 mobile-welcome text-center"
            >
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mb-4">
                <MessageSquare size={24} className="text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-100 mb-2">
                Assistente do Observatório da Indústria
              </h2>
              <p className="text-gray-300 max-w-md">
                Olá! Sou seu assistente inteligente para consultas sobre dados de empresas, 
                vendas, integração ERP/CRM e análises comerciais. Como posso ajudá-lo hoje?
              </p>
            </motion.div>
          ) : (
            <div className="py-4">
              {messages.map((message, index) => (
                <Message
                  key={message.id}
                  message={message}
                  onRegenerate={() => regenerateResponse(index)}
                  showActions={!message.isTyping}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </AnimatePresence>

        {/* Error messages now appear as bot messages with special styling */}

        {/* Scroll to bottom button - moved to input area for better visibility */}
      </div>

      {/* Input area */}
      <ChatInput
        onSendMessage={sendMessage}
        disabled={isLoading}
        isLoading={isLoading}
        showFileUpload={true}
        showVoiceInput={true}
        showScrollButton={showScrollButton}
        onScrollToBottom={handleScrollToBottom}
      />
    </div>
  );
};
