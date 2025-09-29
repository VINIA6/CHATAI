// Utilitário para limpar dados corrompidos do localStorage
export const clearCorruptedStorage = () => {
  try {
    // Limpar dados do chat store que podem estar corrompidos
    localStorage.removeItem('chat-store');
    console.log('Chat store cleared from localStorage');
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

// Executar na inicialização para corrigir dados corrompidos
if (typeof window !== 'undefined') {
  try {
    const stored = localStorage.getItem('chat-store');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Verificar se há dados corrompidos
      if (parsed.state?.conversations) {
        const hasInvalidDates = parsed.state.conversations.some((conv: any) => {
          // Verificar se as datas estão corrompidas
          const createdAt = new Date(conv.createdAt);
          const updatedAt = new Date(conv.updatedAt);
          return isNaN(createdAt.getTime()) || isNaN(updatedAt.getTime());
        });
        
        if (hasInvalidDates) {
          console.warn('Detected corrupted date data, clearing storage...');
          clearCorruptedStorage();
        }
      }
    }
  } catch (error) {
    console.warn('Error checking localStorage data, clearing...');
    clearCorruptedStorage();
  }
}
