import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  MessageSquare, 
  X,
  Search,
  LogOut,
  User,
  Shield,
  BarChart3,
  Edit3,
  Trash2
} from 'lucide-react';
// useChatStore removido - apenas conversas do banco de dados
import { useAuth } from '../../hooks/useAuth';
import { formatRelativeTime, cn } from '../../utils';
import { chatService } from '../../services/chatService';
import type { Talk } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onNewChat: () => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  onNewChat,
  className,
}) => {
  // Apenas conversas do banco de dados - sem estado local
  
  const { user, logout } = useAuth();

  // Estados removidos - apenas conversas do banco de dados
  const [searchTerm, setSearchTerm] = useState('');
  const [talks, setTalks] = useState<Talk[]>([]);
  const [loadingTalks, setLoadingTalks] = useState(false);
  const [talksError, setTalksError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const filteredTalks = useMemo(() =>
    talks.filter(talk =>
      talk.name.toLowerCase().includes(searchTerm.toLowerCase()) && !talk.is_deleted
    ), [talks, searchTerm]
  );

  // Load user talks on component mount or when user changes
  useEffect(() => {
    const loadUserTalks = async () => {
      if (!user?.id) {
        console.log('🔍 Sidebar - Usuário não logado, limpando talks');
        setTalks([]);
        return;
      }
      
      console.log('🔍 Sidebar - Carregando talks para usuário:', user.id);
      setLoadingTalks(true);
      setTalksError(null);
      
      try {
        const userTalks = await chatService.getUserTalks();
        console.log('✅ Sidebar - Talks carregados:', userTalks);
        setTalks(userTalks);
      } catch (error) {
        console.error('❌ Sidebar - Erro ao carregar talks:', error);
        setTalksError('Erro ao carregar conversas do servidor');
        setTalks([]); // Limpar talks em caso de erro
      } finally {
        setLoadingTalks(false);
      }
    };

    // Debounce para evitar chamadas excessivas
    const timeoutId = setTimeout(() => {
      loadUserTalks();
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [user?.id]); // Dependência mais específica

  // Listen for new talk creation to update sidebar
  useEffect(() => {
    const handleTalkCreated = (event: CustomEvent) => {
      const { talk } = event.detail;
      console.log('🆕 Sidebar - Nova conversa criada:', talk);
      
      // Adicionar a nova conversa à lista
      const newTalk: Talk = {
        _id: { $oid: talk.talk_id },
        name: talk.name,
        create_at: { $date: talk.created_at },
        update_at: { $date: talk.created_at },
        user_id: { $oid: user?.id || '' },
        is_deleted: false
      };
      
      setTalks(prev => [newTalk, ...prev]);
      console.log('✅ Sidebar - Lista de conversas atualizada');
    };

    window.addEventListener('talkCreated', handleTalkCreated as EventListener);
    
    return () => {
      window.removeEventListener('talkCreated', handleTalkCreated as EventListener);
    };
  }, [user?.id]);

  // Funções removidas - apenas conversas do banco de dados

  const handleSelectTalk = async (talk: Talk) => {
    console.log('🎯 Sidebar - Conversa selecionada:', talk.name, 'ID:', talk._id.$oid);
    
    try {
      // Carregar mensagens da conversa
      const messages = await chatService.getMessagesByTalk(talk._id.$oid);
      console.log('✅ Sidebar - Mensagens carregadas:', messages.length, 'mensagens');
      
      // Disparar evento customizado para carregar as mensagens no chat
      window.dispatchEvent(new CustomEvent('loadTalkMessages', {
        detail: {
          talkId: talk._id.$oid,
          talkName: talk.name,
          messages: messages
        }
      }));
      
      // Fechar sidebar no mobile
      if (window.innerWidth < 768) {
        onToggle();
      }
    } catch (error) {
      console.error('❌ Sidebar - Erro ao carregar mensagens:', error);
      // Aqui você pode adicionar um toast de erro se quiser
    }
  };

  const handleEditTalk = (talk: Talk) => {
    console.log('✏️ Sidebar - Editando conversa:', talk.name);
    setEditingId(talk._id.$oid);
    setEditTitle(talk.name);
  };

  const handleSaveEdit = async (talkId: string) => {
    if (!editTitle.trim()) return;
    
    try {
      console.log('💾 Sidebar - Salvando edição:', { talkId, newTitle: editTitle });
      await chatService.updateTalk(talkId, editTitle.trim());
      
      // Atualizar a lista de conversas
      setTalks(prev => prev.map(talk => 
        talk._id.$oid === talkId 
          ? { ...talk, name: editTitle.trim() }
          : talk
      ));
      
      setEditingId(null);
      setEditTitle('');
      console.log('✅ Sidebar - Conversa atualizada com sucesso');
    } catch (error) {
      console.error('❌ Sidebar - Erro ao atualizar conversa:', error);
      // Aqui você pode adicionar um toast de erro se quiser
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const handleDeleteTalk = async (talk: Talk) => {
    if (!confirm(`Tem certeza que deseja deletar a conversa "${talk.name}"?`)) {
      return;
    }
    
    try {
      console.log('🗑️ Sidebar - Deletando conversa:', talk.name);
      await chatService.deleteTalk(talk._id.$oid);
      
      // Remover da lista de conversas
      setTalks(prev => prev.filter(t => t._id.$oid !== talk._id.$oid));
      
      console.log('✅ Sidebar - Conversa deletada com sucesso');
    } catch (error) {
      console.error('❌ Sidebar - Erro ao deletar conversa:', error);
      // Aqui você pode adicionar um toast de erro se quiser
    }
  };

  const handleNewChat = () => {
    onNewChat();
    // Close sidebar on mobile after new chat
    if (window.innerWidth < 768) {
      onToggle();
    }
    // Focus input for immediate typing
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('focusInput'));
    }, 200);
  };

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          x: isOpen ? 0 : '-100%',
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={cn(
          'fixed left-0 top-0 h-full bg-gray-900 text-white z-50',
          'w-80 md:w-80',
          'mobile-sidebar',
          'md:relative md:translate-x-0 md:opacity-100',
          'flex flex-col shadow-lg',
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Observatório IA</h2>
          <button
            onClick={onToggle}
            className="p-1 hover:bg-gray-700 rounded md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center gap-3 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Plus size={18} />
            <span>Nova conversa</span>
          </button>
        </div>

        {/* Search */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar conversas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-800 text-white placeholder-gray-400 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 dark-scrollbar">
          {/* Loading state */}
          {loadingTalks && (
            <div className="text-center text-gray-400 py-4">
              <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-sm">Carregando conversas...</p>
            </div>
          )}

          {/* Error state */}
          {talksError && (
            <div className="text-center text-red-400 py-4">
              <p className="text-sm">{talksError}</p>
              <button 
                onClick={() => window.location.reload()}
                className="text-xs text-blue-400 hover:text-blue-300 mt-1"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {/* Talks from API */}
          <AnimatePresence>
            {!loadingTalks && !talksError && (
              <>
                {filteredTalks.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                      Suas Conversas ({filteredTalks.length})
                    </h3>
                    {filteredTalks.map((talk) => (
                      <motion.div
                        key={talk._id.$oid}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="group mb-2 p-3 rounded-lg transition-colors hover:bg-gray-700 border border-gray-600"
                      >
                        {editingId === talk._id.$oid ? (
                          // Modo de edição
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="w-full px-2 py-1 text-sm bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleSaveEdit(talk._id.$oid);
                                } else if (e.key === 'Escape') {
                                  handleCancelEdit();
                                }
                              }}
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSaveEdit(talk._id.$oid)}
                                className="px-2 py-1 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700"
                              >
                                Salvar
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        ) : (
                          // Modo normal
                          <div 
                            className="flex items-start justify-between cursor-pointer"
                            onClick={() => handleSelectTalk(talk)}
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate text-white">
                                {talk.name}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {formatRelativeTime(new Date(talk.update_at.$date))}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 ml-2">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditTalk(talk);
                                  }}
                                  className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                                  title="Editar conversa"
                                >
                                  <Edit3 size={14} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteTalk(talk);
                                  }}
                                  className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                                  title="Deletar conversa"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Empty state */}
                {filteredTalks.length === 0 && !loadingTalks && !talksError && (
                  <div className="text-center text-gray-400 py-8">
                    <MessageSquare size={24} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">
                      {searchTerm ? 'Nenhuma conversa encontrada' : 'Nenhuma conversa ainda'}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Suas conversas serão carregadas do banco de dados
                    </p>
                  </div>
                )}
              </>
            )}
          </AnimatePresence>
        </div>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-700">
          {user && (
            <div className="mb-4">
              <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                  {user.role === 'admin' ? (
                    <Shield size={18} className="text-white" />
                  ) : user.role === 'analyst' ? (
                    <BarChart3 size={18} className="text-white" />
                  ) : (
                    <User size={18} className="text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {user.email}
                  </p>
                  <p className="text-xs text-emerald-400 font-medium">
                    {user.role === 'admin' ? 'Administrador' : 
                     user.role === 'analyst' ? 'Analista' : 'Usuário'}
                  </p>
                </div>
              </div>
              
              <button
                onClick={logout}
                className="w-full mt-3 flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <LogOut size={16} />
                Sair
              </button>
            </div>
          )}
          
          <div className="text-xs text-gray-400 text-center">
            v1.0.0 • Observatório da Indústria
          </div>
        </div>
      </motion.div>

    </>
  );
};
