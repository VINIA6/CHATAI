import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    clearError,
    isTokenValid,
    checkSession,
  } = useAuthStore();

  // Debug: Log when useAuth is called
  console.log('🔍 useAuth called:', { 
    isAuthenticated, 
    isLoading, 
    userId: user?.id,
    hasError: !!error
  });

  // Verificar sessão ao inicializar - apenas uma vez
  useEffect(() => {
    checkSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Array vazio intencionalmente - checkSession é estável

  const hasRole = (role: string | string[]) => {
    if (!user) return false;
    
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    
    return user.role === role;
  };

  const isAdmin = () => hasRole('admin');
  const isAnalyst = () => hasRole(['admin', 'analyst']);

  return {
    // Estado
    user,
    isAuthenticated,
    isLoading,
    error,
    
    // Ações
    login,
    logout,
    clearError,
    
    // Utilidades
    hasRole,
    isAdmin,
    isAnalyst,
    isTokenValid,
  };
};
