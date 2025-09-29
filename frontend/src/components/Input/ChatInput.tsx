import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Paperclip, ChevronDown } from 'lucide-react';
import { cn } from '../../utils';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
  maxLength?: number;
  showFileUpload?: boolean;
  showVoiceInput?: boolean;
  showScrollButton?: boolean;
  onScrollToBottom?: () => void;
  className?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  placeholder = 'Digite sua mensagem...',
  disabled = false,
  isLoading = false,
  maxLength = 4000,
  showFileUpload = false,
  showVoiceInput = false,
  showScrollButton = false,
  onScrollToBottom,
  className,
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || disabled || isLoading) return;
    
    onSendMessage(message.trim());
    setMessage('');
    
    // Reset textarea height and maintain focus
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      // Keep focus on input for fluid interaction
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setMessage(value);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [message]);

  // Auto-focus on component mount and when not loading
  useEffect(() => {
    if (!isLoading && !disabled && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isLoading, disabled]);

  // Focus on chat area click (for better UX)
  useEffect(() => {
    const handleChatAreaClick = () => {
      if (!isLoading && !disabled && textareaRef.current) {
        textareaRef.current.focus();
      }
    };

    // Listen for custom focus events
    window.addEventListener('focusInput', handleChatAreaClick);
    return () => window.removeEventListener('focusInput', handleChatAreaClick);
  }, [isLoading, disabled]);

  // Maintain focus when suggestions are clicked
  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 50);
  };

  const canSend = message.trim().length > 0 && !disabled && !isLoading;

  return (
    <div className={cn('chat-input-area p-4', className)}>
      <div className="max-w-4xl mx-auto">
        {/* Scroll to bottom button - positioned above input */}
        <AnimatePresence>
          {showScrollButton && (
            <div className="flex justify-end mb-2">
              <motion.button
                type="button"
                onClick={onScrollToBottom}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="p-2 bg-gray-700 text-gray-200 hover:bg-gray-600 rounded-full transition-colors shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Ir para o final"
              >
                <ChevronDown size={18} />
              </motion.button>
            </div>
          )}
        </AnimatePresence>
        
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-end gap-2">
            {/* File upload button - BLOCKED */}
            {showFileUpload && (
              <div className="flex-shrink-0 relative group">
                <button
                  type="button"
                  disabled={true}
                  className="p-3 text-red-500 bg-red-50 hover:bg-red-100 rounded-full transition-colors cursor-not-allowed opacity-75"
                  title="Funcionalidade em desenvolvimento"
                >
                  <Paperclip size={20} />
                </button>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  🚧 Funcionalidade em desenvolvimento
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                </div>
              </div>
            )}

            {/* Message input */}
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={disabled}
                rows={1}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="sentences"
                spellCheck="true"
                className={cn(
                  'w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl resize-none',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'placeholder:text-gray-500'
                )}
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
              
              {/* Character counter */}
              {message.length > maxLength * 0.8 && (
                <div className="absolute bottom-1 right-14 text-xs text-gray-400">
                  {message.length}/{maxLength}
                </div>
              )}
            </div>

            {/* Voice input button - BLOCKED */}
            {showVoiceInput && (
              <div className="flex-shrink-0 relative group">
                <motion.button
                  type="button"
                  disabled={true}
                  className="p-3 text-red-500 bg-red-50 hover:bg-red-100 rounded-full transition-colors cursor-not-allowed opacity-75"
                  title="Funcionalidade em desenvolvimento"
                >
                  <Mic size={20} />
                </motion.button>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  🚧 Funcionalidade em desenvolvimento
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                </div>
              </div>
            )}


            {/* Send button */}
            <div className="flex-shrink-0">
              <motion.button
                type="submit"
                disabled={!canSend}
                className={cn(
                  'p-3 rounded-full transition-colors',
                  canSend
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed',
                  'focus:outline-none'
                )}
                whileHover={canSend ? { scale: 1.05 } : {}}
                whileTap={canSend ? { scale: 0.95 } : {}}
                title="Enviar mensagem"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send size={20} />
                )}
              </motion.button>
            </div>
          </div>
        </form>

        {/* Quick suggestions */}
        {message.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 flex flex-wrap gap-2 md:flex-row mobile-suggestions"
          >
            {[
              'Como posso consultar dados de empresas clientes?',
              'Preciso de informações sobre vendas consolidadas',
              'Como integrar dados do ERP e CRM?',
              'Quero gerar relatórios de desempenho comercial'
            ].map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-1.5 text-sm text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors border border-gray-600"
              >
                {suggestion}
              </button>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};
