import axios, { AxiosError } from 'axios';
import type { LoginCredentials, LoginResponse, User } from '../types';

interface ApiLoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    cargo: string;
    setor: string;
  };
}

class AuthService {
  private readonly baseURL: string;
  private readonly timeout = 120000; // 2 minutos para agentes lentos

  constructor() {
    // Detectar ambiente e usar URL apropriada
    if (import.meta.env.VITE_API_URL) {
      // Se há variável de ambiente, usar ela
      this.baseURL = import.meta.env.VITE_API_URL;
    } else if (import.meta.env.PROD) {
      // Se está em produção (Vercel), usar proxy relativo
      this.baseURL = '/api';
    } else {
      // Em desenvolvimento local, usar URL direta do backend
      this.baseURL = 'http://72.60.166.177:5001/api';
    }
    
    console.log('🌐 AuthService - URL do backend:', this.baseURL);
    console.log('🌐 AuthService - Ambiente:', import.meta.env.MODE);
    console.log('🌐 AuthService - Produção:', import.meta.env.PROD);
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    console.log('🔧 AuthService - Iniciando login com:', {
      email: credentials.email,
      hasPassword: !!credentials.password,
      rememberMe: credentials.rememberMe
    });
    
    this.validateCredentials(credentials);
    console.log('✅ AuthService - Credenciais validadas');
    
    try {
      const requestData = {
        username: credentials.email,
        password: credentials.password,
      };
      
      console.log('📤 AuthService - Enviando para backend:', {
        url: `${this.baseURL}/login`,
        username: requestData.username,
        hasPassword: !!requestData.password,
        fullURL: `${this.baseURL}/login`
      });
      
      const response = await axios.post<ApiLoginResponse>(
        `${this.baseURL}/login`,
        requestData,
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: this.timeout,
        }
      );

      console.log('📨 AuthService - Resposta do backend:', {
        status: response.status,
        statusText: response.statusText,
        hasToken: !!response.data.token,
        hasUser: !!response.data.user,
        userName: response.data.user?.name,
        fullResponse: response.data
      });

      return this.transformApiResponse(response.data, credentials.email);
      
    } catch (error) {
      console.error('❌ AuthService - Erro no login:', error);
      throw this.handleError(error);
    }
  }

  private validateCredentials(credentials: LoginCredentials): void {
    if (!credentials.email?.trim()) {
      throw new Error('Email é obrigatório');
    }
    if (!credentials.password?.trim()) {
      throw new Error('Senha é obrigatória');
    }
    if (!this.isValidEmail(credentials.email)) {
      throw new Error('Formato de email inválido');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private transformApiResponse(data: ApiLoginResponse, email: string): LoginResponse {
    if (!data.token || !data.user) {
      throw new Error('Resposta inválida do servidor');
    }

    const user: User = {
      id: data.user.id,
      name: data.user.name,
      email: data.user.email || email,
      role: this.mapUserRole(data.user.cargo),
      company: 'FIEC',
      department: data.user.setor || 'Observatório da Indústria',
      createdAt: new Date(),
      lastLoginAt: new Date(),
    };

    return {
      user,
      token: data.token,
      expiresIn: 24 * 60 * 60 * 1000, // 24 horas
    };
  }

  private mapUserRole(cargo: string): 'admin' | 'analyst' | 'user' {
    if (!cargo) return 'user';
    
    const cargoLower = cargo.toLowerCase();
    if (cargoLower.includes('administrador')) return 'admin';
    if (cargoLower.includes('analista')) return 'analyst';
    return 'user';
  }

  private handleError(error: unknown): Error {
    console.log('🔍 AuthService - Detalhes do erro:', error);
    
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message?: string; error?: string }>;
      
      console.log('📊 Axios Error Details:', {
        code: axiosError.code,
        message: axiosError.message,
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        data: axiosError.response?.data,
        config: {
          url: axiosError.config?.url,
          method: axiosError.config?.method,
          headers: axiosError.config?.headers
        }
      });
      
      if (axiosError.code === 'ECONNREFUSED') {
        return new Error('Servidor indisponível. Tente novamente em alguns instantes.');
      }
      
      if (axiosError.code === 'ECONNABORTED') {
        return new Error('Tempo limite excedido. Verifique sua conexão.');
      }
      
      if (axiosError.response?.status === 401) {
        return new Error('Email ou senha incorretos');
      }
      
      if (axiosError.response && axiosError.response.status >= 500) {
        return new Error('Erro interno do servidor. Tente novamente mais tarde.');
      }
      
      const serverMessage = axiosError.response?.data?.message || axiosError.response?.data?.error;
      if (serverMessage) {
        return new Error(serverMessage);
      }
      
      return new Error(`Erro HTTP ${axiosError.response?.status}: ${axiosError.message}`);
    }
    
    return new Error('Erro inesperado. Tente novamente.');
  }

  async logout(): Promise<void> {
    // Implementar logout na API se necessário no futuro
    // Por enquanto, apenas limpar dados locais no store
  }

  isTokenExpired(expiresAt: number): boolean {
    return Date.now() >= expiresAt;
  }

  getTokenExpiryTime(expiresIn: number): number {
    return Date.now() + expiresIn;
  }
}

export const authService = new AuthService();
