import axios from 'axios';
import type { LoginCredentials, LoginResponse, User } from '../types';

class AuthService {
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await axios.post(`${this.baseURL}/login`, {
        username: credentials.email, // A API espera 'username' mas nosso frontend usa 'email'
        password: credentials.password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });

      const { data } = response;
      
      // Adaptar a resposta da API para o formato esperado pelo frontend
      const user: User = {
        id: data.user?.id || 'unknown',
        name: data.user?.name || 'Usuário',
        email: data.user?.email || credentials.email,
        role: (data.user?.cargo === 'Administrador' ? 'admin' : data.user?.cargo === 'Analista' ? 'analyst' : 'user') as 'admin' | 'user' | 'analyst',
        company: 'FIEC',
        department: data.user?.setor || 'Observatório da Indústria',
        createdAt: new Date(),
        lastLoginAt: new Date(),
      };

      return {
        user,
        token: data.token,
        expiresIn: 24 * 60 * 60 * 1000, // 24 horas por padrão
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.response?.data?.error || 'Erro ao fazer login';
        throw new Error(message);
      }
      throw new Error('Erro de conexão com o servidor');
    }
  }

  async refreshToken(token: string): Promise<LoginResponse> {
    try {
      const response = await axios.post(`${this.baseURL}/refresh`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        timeout: 10000,
      });

      const { data } = response;
      
      const user: User = {
        id: data.user?.id || 'unknown',
        name: data.user?.name || 'Usuário',
        email: data.user?.email || '',
        role: data.user?.role || 'user',
        company: data.user?.company || 'FIEC',
        department: data.user?.department || 'Observatório da Indústria',
        createdAt: data.user?.createdAt ? new Date(data.user.createdAt) : new Date(),
        lastLoginAt: new Date(),
      };

      return {
        user,
        token: data.access_token || data.token,
        expiresIn: data.expires_in || 24 * 60 * 60 * 1000,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.response?.data?.error || 'Token inválido';
        throw new Error(message);
      }
      throw new Error('Erro de conexão com o servidor');
    }
  }

  async logout(): Promise<void> {
    // Implementar logout na API se necessário
    // Por enquanto, apenas limpar dados locais
  }
}

export const authService = new AuthService();
