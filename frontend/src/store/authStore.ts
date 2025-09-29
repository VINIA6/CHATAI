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
  refreshSession: () => Promise<void>;
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
          set({ isLoading: true, error: null });
          
          try {
            const response = await authService.login(credentials);
            
            set({
              user: response.user,
              token: response.token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            
            // Armazenar tempo de expiração
            const expiresAt = Date.now() + response.expiresIn;
            localStorage.setItem('auth_expires_at', expiresAt.toString());
            
          } catch (error) {
            set({
              isLoading: false,
              error: error instanceof Error ? error.message : 'Erro ao fazer login',
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
          
          return Date.now() < parseInt(expiresAt);
        },

        refreshSession: async () => {
          const state = get();
          if (!state.token) return;
          
          try {
            set({ isLoading: true });
            const response = await authService.refreshToken(state.token);
            
            set({
              user: response.user,
              token: response.token,
              isAuthenticated: true,
              isLoading: false,
            });
            
            const expiresAt = Date.now() + response.expiresIn;
            localStorage.setItem('auth_expires_at', expiresAt.toString());
            
          } catch {
            // Token inválido, fazer logout
            get().logout();
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
