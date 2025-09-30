import { useCallback, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useChatStore } from '../store/chatStore';
import { chatService } from '../services/chatService';
import type { ChatRequest } from '../types';

export const useChat = () => {
  const {
    messages,
    isLoading,
    error,
    addMessage,
    setLoading,
  } = useChatStore();
  
  // const { user } = useAuthStore(); // Desabilitado temporariamente

  const [isStreaming, setIsStreaming] = useState(false);

  // Auto-salvar conversa quando mensagens são adicionadas - DESABILITADO TEMPORARIAMENTE
  // useEffect(() => {
  //   if (messages.length === 0) return;

  //   const generateConversationTitle = (messages: { type: string; content: string }[]) => {
  //     const userMessages = messages.filter(msg => msg.type === 'user');
  //     if (userMessages.length > 0) {
  //       const firstMessage = userMessages[0].content;
  //       return firstMessage.length > 50 
  //         ? firstMessage.substring(0, 47) + '...' 
  //         : firstMessage;
  //     }
  //     return `Nova conversa ${new Date().toLocaleDateString()}`;
  //   };

  //   // Debounce para evitar salvamentos excessivos
  //   const timeoutId = setTimeout(() => {
  //     if (currentConversationId) {
  //       // Atualizar conversa existente
  //       const currentConversation = conversations.find(c => c.id === currentConversationId);
  //       if (currentConversation) {
  //         updateConversation(currentConversationId, {
  //           messages: [...messages],
  //           title: currentConversation.title || generateConversationTitle(messages),
  //         });
  //       }
  //     } else {
  //       // Criar nova conversa se há pelo menos 2 mensagens (pergunta + resposta)
  //       if (messages.length >= 2) {
  //         const title = generateConversationTitle(messages);
  //         const conversationId = addConversation({
  //           title,
  //           messages: [...messages],
  //           userId: user?.id || 'anonymous',
  //         });
  //         // Atualizar o ID da conversa atual
  //         useChatStore.getState().setCurrentConversation(conversationId);
  //       }
  //     }
  //   }, 1000); // 1 segundo de debounce

  //   return () => clearTimeout(timeoutId);
  // }, [messages, currentConversationId, conversations, addConversation, updateConversation]);

  const sendMessageMutation = useMutation({
    mutationFn: async (request: ChatRequest) => {
      return chatService.sendMessage(request);
    },
    onSuccess: (response) => {
      addMessage({
        content: response.message,
        type: 'bot',
      });
      setLoading(false);
    },
    onError: (error) => {
      // Add error as bot message instead of global error
      addMessage({
        content: `❌ Desculpe, ocorreu um erro ao processar sua mensagem:\n\n"${error.message}"\n\nTente novamente em alguns instantes.`,
        type: 'bot',
        isError: true,
      });
      setLoading(false);
    },
  });

  const sendMessage = useCallback(
    async (content: string, useStreaming = true) => {
      if (!content.trim()) return;

      // Add user message
      addMessage({
        content: content.trim(),
        type: 'user',
      });

          // Immediate scroll trigger after message is added
          setTimeout(() => {
            // Trigger scroll event for any listening components
            window.dispatchEvent(new CustomEvent('forceScroll'));
          }, 10);

      // Simulate different responses for demo
      if (content.toLowerCase().includes('erro') || content.toLowerCase().includes('test error')) {
        // Simulate an error response
        setTimeout(() => {
          addMessage({
            content: `❌ Desculpe, ocorreu um erro ao processar sua mensagem:\n\n"Failed to fetch"\n\nTente novamente em alguns instantes.`,
            type: 'bot',
            isError: true,
          });
          setLoading(false);
        }, 1000);
        setLoading(true);
        return;
      }

      // Simulate responses for demo based on business context
      if (content.toLowerCase().includes('olá') || content.toLowerCase().includes('oi')) {
        setTimeout(() => {
          addMessage({
            content: 'Olá! Sou o assistente IA do Observatório da Indústria. Posso ajudá-lo com consultas sobre dados de empresas, análises de vendas, integração de sistemas ERP/CRM e geração de relatórios. Em que posso auxiliá-lo?',
            type: 'bot',
          });
          setLoading(false);
        }, 800);
        setLoading(true);
        return;
      }

      // Handle specific business queries
      if (content.toLowerCase().includes('empresa') || content.toLowerCase().includes('cliente')) {
        setTimeout(() => {
          addMessage({
            content: 'Para consultar dados de empresas clientes, posso acessar informações consolidadas do ERP, CRM e planilhas comerciais. Você gostaria de buscar por CNPJ, razão social ou segmento específico? Posso também gerar relatórios de performance comercial.',
            type: 'bot',
          });
          setLoading(false);
        }, 1000);
        setLoading(true);
        return;
      }

      if (content.toLowerCase().includes('vendas') || content.toLowerCase().includes('comercial')) {
        setTimeout(() => {
          addMessage({
            content: 'Posso ajudar com análises de vendas consolidadas! Tenho acesso aos dados de faturamento (ERP), oportunidades (CRM) e informações de campo. Você precisa de dados por período, região, analista ou segmento industrial? Posso gerar relatórios para Business Intelligence.',
            type: 'bot',
          });
          setLoading(false);
        }, 1200);
        setLoading(true);
        return;
      }

      if (content.toLowerCase().includes('erp') || content.toLowerCase().includes('crm') || content.toLowerCase().includes('integr')) {
        setTimeout(() => {
          addMessage({
            content: 'A integração entre ERP, CRM e planilhas comerciais é uma das minhas especialidades! Posso consolidar dados de faturamento, gestão de clientes e informações de campo em uma visão unificada. Isso elimina retrabalho e melhora a precisão das análises. Que tipo de integração você precisa?',
            type: 'bot',
          });
          setLoading(false);
        }, 1000);
        setLoading(true);
        return;
      }

      // For other messages, try the API

      const request: ChatRequest = {
        message: content.trim(),
        conversationId: useChatStore.getState().currentConversationId || undefined,
      };

      if (useStreaming) {
        setIsStreaming(true);
        setLoading(true);

        // Add placeholder bot message for streaming
        addMessage({
          content: '',
          type: 'bot',
          isTyping: true,
        });

        let streamedContent = '';

        await chatService.sendMessageStream(
          request,
          (chunk) => {
            streamedContent += chunk;
            // Update the bot message with streamed content
            const state = useChatStore.getState();
            const lastMessage = state.messages[state.messages.length - 1];
            if (lastMessage && lastMessage.type === 'bot') {
              useChatStore.getState().updateMessage(lastMessage.id, {
                content: streamedContent,
                isTyping: false, // Remove typing indicator once content starts
              });
            }
          },
          (response) => {
            // Finalize the message
            const state = useChatStore.getState();
            const lastMessage = state.messages[state.messages.length - 1];
            if (lastMessage && lastMessage.type === 'bot') {
              useChatStore.getState().updateMessage(lastMessage.id, {
                content: response.message,
                isTyping: false,
              });
            }
            setIsStreaming(false);
            setLoading(false);
          },
          (error) => {
            // Remove the typing message and add error message
            const state = useChatStore.getState();
            const lastMessage = state.messages[state.messages.length - 1];
            if (lastMessage && lastMessage.type === 'bot' && lastMessage.isTyping) {
              useChatStore.getState().deleteMessage(lastMessage.id);
            }
            
            // Add error as bot message
            addMessage({
              content: `❌ Desculpe, ocorreu um erro de conexão:\n\n"${error.message}"\n\nVerifique sua internet e tente novamente.`,
              type: 'bot',
              isError: true,
            });
            
            setIsStreaming(false);
            setLoading(false);
          }
        );
      } else {
        setLoading(true);
        sendMessageMutation.mutate(request);
      }
    },
[addMessage, sendMessageMutation, setLoading]
  );

  const regenerateResponse = useCallback(
    (messageIndex: number) => {
      const state = useChatStore.getState();
      if (messageIndex > 0 && messageIndex < state.messages.length) {
        const userMessage = state.messages[messageIndex - 1];
        if (userMessage.type === 'user') {
          // Remove the bot message and regenerate
          useChatStore.getState().deleteMessage(state.messages[messageIndex].id);
          sendMessage(userMessage.content);
        }
      }
    },
    [sendMessage]
  );

  return {
    messages,
    isLoading: isLoading || isStreaming,
    error,
    sendMessage,
    regenerateResponse,
    isStreaming,
  };
};
