import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { AuthState, User, LoginCredentials, LoginResponse } from '../types';

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

// Simulação de API de autenticação
const authAPI = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Usuários demo para o Observatório da Indústria
    const demoUsers = [
      {
        id: 'admin-001',
        name: 'Administrador FIEC',
        email: 'admin@observatorio.fiec.org.br',
        password: 'admin123',
        role: 'admin' as const,
        company: 'FIEC',
        department: 'Observatório da Indústria',
        createdAt: new Date('2024-01-01'),
        lastLoginAt: new Date(),
      },
      {
        id: 'analyst-001',
        name: 'Maria Silva',
        email: 'maria.silva@observatorio.fiec.org.br',
        password: 'analyst123',
        role: 'analyst' as const,
        company: 'FIEC',
        department: 'Análise de Dados',
        createdAt: new Date('2024-01-15'),
        lastLoginAt: new Date(),
      },
      {
        id: 'user-001',
        name: 'João Santos',
        email: 'joao.santos@empresa.com.br',
        password: 'user123',
        role: 'user' as const,
        company: 'Empresa Exemplo Ltda',
        department: 'Comercial',
        createdAt: new Date('2024-02-01'),
        lastLoginAt: new Date(),
      }
    ];
    
    const user = demoUsers.find(u => 
      u.email === credentials.email && u.password === credentials.password
    );
    
    if (!user) {
      throw new Error('Email ou senha inválidos');
    }
    
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword,
      token: `demo_token_${user.id}_${Date.now()}`,
      expiresIn: 24 * 60 * 60 * 1000, // 24 horas
    };
  },
  
  refreshToken: async (token: string): Promise<LoginResponse> => {
    // Simular verificação de token
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!token || !token.startsWith('demo_token_')) {
      throw new Error('Token inválido');
    }
    
    // Para demonstração, sempre renovar o token
    const userId = token.split('_')[2];
    const demoUser = {
      id: userId,
      name: 'Usuário Demo',
      email: 'demo@observatorio.fiec.org.br',
      role: 'user' as const,
      company: 'FIEC',
      department: 'Demo',
      createdAt: new Date('2024-01-01'),
      lastLoginAt: new Date(),
    };
    
    return {
      user: demoUser,
      token: `demo_token_${userId}_${Date.now()}`,
      expiresIn: 24 * 60 * 60 * 1000,
    };
  }
};

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
            const response = await authAPI.login(credentials);
            
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
            const response = await authAPI.refreshToken(state.token);
            
            set({
              user: response.user,
              token: response.token,
              isAuthenticated: true,
              isLoading: false,
            });
            
            const expiresAt = Date.now() + response.expiresIn;
            localStorage.setItem('auth_expires_at', expiresAt.toString());
            
          } catch (error) {
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
