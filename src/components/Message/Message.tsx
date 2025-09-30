import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Copy, 
  RotateCcw, 
  ThumbsUp, 
  ThumbsDown,
  User,
  Bot
} from 'lucide-react';
import type { Message as MessageType } from '../../types';
import { formatTime, copyToClipboard, cn } from '../../utils';

interface MessageProps {
  message: MessageType;
  onRegenerate?: () => void;
  showActions?: boolean;
  className?: string;
}

export const Message: React.FC<MessageProps> = ({
  message,
  onRegenerate,
  showActions = true,
  className,
}) => {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<boolean | null>(null);

  const handleCopy = async () => {
    try {
      await copyToClipboard(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy message:', error);
    }
  };

  const handleLike = (isLike: boolean) => {
    setLiked(liked === isLike ? null : isLike);
  };

  const isUser = message.type === 'user';
  const isTyping = message.isTyping;
  const isError = message.isError;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex gap-3 max-w-4xl mx-auto px-4 py-6 group',
        isUser ? 'flex-row-reverse' : 'flex-row',
        className
      )}
    >
      {/* Avatar */}
      <div className={cn(
        'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
        isUser 
          ? 'bg-emerald-600 text-white' 
          : isError
            ? 'bg-red-600 text-white'
            : 'bg-gray-600 text-gray-200'
      )}>
        {isUser ? (
          <User size={16} />
        ) : (
          <Bot size={16} />
        )}
      </div>

      {/* Content */}
      <div className={cn(
        'flex-1 space-y-2 flex flex-col',
        isUser ? 'items-end' : 'items-start'
      )}>
        {/* Message bubble */}
        <div className={cn(
          'inline-block max-w-[80%] px-4 py-3 rounded-2xl',
          isUser 
            ? 'bg-emerald-600 text-white rounded-br-sm' 
            : isError
              ? 'bg-gradient-to-r from-red-500 to-orange-400 text-white rounded-bl-sm border border-red-300'
              : 'bg-gray-600 text-gray-100 rounded-bl-sm'
        )}>
          {isTyping && !message.content ? (
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1">
                <div className="w-2.5 h-2.5 bg-gray-200 rounded-full" style={{ 
                  animation: 'typingDot 1.4s infinite ease-in-out', 
                  animationDelay: '0s' 
                }} />
                <div className="w-2.5 h-2.5 bg-gray-200 rounded-full" style={{ 
                  animation: 'typingDot 1.4s infinite ease-in-out', 
                  animationDelay: '0.2s' 
                }} />
                <div className="w-2.5 h-2.5 bg-gray-200 rounded-full" style={{ 
                  animation: 'typingDot 1.4s infinite ease-in-out', 
                  animationDelay: '0.4s' 
                }} />
              </div>
              <span className="text-sm text-gray-300 font-medium">Pensando... isso pode levar alguns segundos</span>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap break-words m-0">
                {message.content}
              </p>
            </div>
          )}
        </div>

        {/* Timestamp and actions */}
        <div className={cn(
          'flex items-center gap-2 text-xs text-gray-500',
          isUser ? 'justify-end' : 'justify-start'
        )}>
          <span>{formatTime(message.timestamp)}</span>
          
          {showActions && !isUser && !isTyping && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleCopy}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
                title="Copiar mensagem"
              >
                <Copy size={12} />
              </button>
              
              {onRegenerate && (
                <button
                  onClick={onRegenerate}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                  title="Regenerar resposta"
                >
                  <RotateCcw size={12} />
                </button>
              )}
              
              <button
                onClick={() => handleLike(true)}
                className={cn(
                  'p-1 hover:bg-gray-200 rounded transition-colors',
                  liked === true && 'text-green-600 bg-green-100'
                )}
                title="Curtir"
              >
                <ThumbsUp size={12} />
              </button>
              
              <button
                onClick={() => handleLike(false)}
                className={cn(
                  'p-1 hover:bg-gray-200 rounded transition-colors',
                  liked === false && 'text-red-600 bg-red-100'
                )}
                title="Não curtir"
              >
                <ThumbsDown size={12} />
              </button>
            </div>
          )}
          
          {copied && (
            <span className="text-green-600 text-xs">Copiado!</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
