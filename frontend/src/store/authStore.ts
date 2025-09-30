import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { AuthState, User, LoginCredentials } from '../types';
import { authService } from '../services/authService';

interface AuthStore extends AuthState {
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Utils
  isTokenValid: () => boolean;
  checkSession: () => void;
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        token: null,

        // Actions
        login: async (credentials) => {
          console.log('🏪 AuthStore - Recebendo credenciais:', {
            email: credentials.email,
            hasPassword: !!credentials.password,
            rememberMe: credentials.rememberMe
          });
          
          set({ isLoading: true, error: null });
          
          try {
            console.log('📡 AuthStore - Chamando authService.login...');
            const response = await authService.login(credentials);
            console.log('📥 AuthStore - Resposta recebida:', {
              hasUser: !!response.user,
              hasToken: !!response.token,
              userName: response.user?.name,
              expiresIn: response.expiresIn
            });
            
            const expiresAt = authService.getTokenExpiryTime(response.expiresIn);
            
            set({
              user: response.user,
              token: response.token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            
            // Armazenar tempo de expiração
            localStorage.setItem('auth_expires_at', expiresAt.toString());
            console.log('✅ AuthStore - Login concluído com sucesso');
            
          } catch (error) {
            console.error('❌ AuthStore - Erro no login:', error);
            const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer login';
            set({
              isLoading: false,
              error: errorMessage,
            });
            throw error;
          }
        },

        logout: () => {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
          });
          localStorage.removeItem('auth_expires_at');
        },

        setUser: (user) => {
          set({ user, isAuthenticated: true });
        },

        setLoading: (loading) => {
          set({ isLoading: loading });
        },

        setError: (error) => {
          set({ error });
        },

        clearError: () => {
          set({ error: null });
        },

        isTokenValid: () => {
          const state = get();
          if (!state.token) return false;
          
          const expiresAt = localStorage.getItem('auth_expires_at');
          if (!expiresAt) return false;
          
          return !authService.isTokenExpired(parseInt(expiresAt));
        },

        checkSession: () => {
          const state = get();
          if (state.token && !state.isAuthenticated) {
            // Verificar se o token ainda é válido
            const expiresAt = localStorage.getItem('auth_expires_at');
            if (expiresAt && !authService.isTokenExpired(parseInt(expiresAt))) {
              set({ isAuthenticated: true });
            } else {
              // Token expirado, fazer logout
              set({
                user: null,
                token: null,
                isAuthenticated: false,
                error: null,
              });
              localStorage.removeItem('auth_expires_at');
            }
          }
        },
      }),
      {
        name: 'auth-store',
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        }),
        // Configuração para lidar com datas corretamente
        storage: {
          getItem: (name) => {
            const str = localStorage.getItem(name);
            if (!str) return null;
            
            try {
              const parsed = JSON.parse(str);
              // Converter strings de data de volta para objetos Date
              if (parsed.state?.user) {
                if (parsed.state.user.createdAt) {
                  parsed.state.user.createdAt = new Date(parsed.state.user.createdAt);
                }
                if (parsed.state.user.lastLoginAt) {
                  parsed.state.user.lastLoginAt = new Date(parsed.state.user.lastLoginAt);
                }
              }
              return parsed;
            } catch (error) {
              console.error('Error parsing auth storage data:', error);
              return null;
            }
          },
          setItem: (name, value) => {
            localStorage.setItem(name, JSON.stringify(value));
          },
          removeItem: (name) => {
            localStorage.removeItem(name);
          },
        },
      }
    ),
    {
      name: 'auth-store',
    }
  )
);
