import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    token,
    login,
    logout,
    clearError,
    isTokenValid,
    refreshSession,
  } = useAuthStore();

  // Verificar sessão ao inicializar
  useEffect(() => {
    const checkSession = async () => {
      if (token && !isTokenValid()) {
        // Token expirado, tentar renovar
        try {
          await refreshSession();
        } catch (error) {
          // Se falhar, fazer logout
          logout();
        }
      }
    };

    checkSession();
  }, [token, isTokenValid, refreshSession, logout]);

  // Auto-refresh do token
  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const refreshInterval = setInterval(async () => {
      if (isTokenValid()) {
        try {
          await refreshSession();
        } catch (error) {
          logout();
        }
      }
    }, 15 * 60 * 1000); // Verificar a cada 15 minutos

    return () => clearInterval(refreshInterval);
  }, [isAuthenticated, token, isTokenValid, refreshSession, logout]);

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
