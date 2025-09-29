import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  Building2, 
  MessageSquare,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import type { LoginCredentials } from '../../types';

export const LoginPage: React.FC = () => {
  const { login, isLoading, error, clearError } = useAuthStore();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState<string>('');

  // Usuários disponíveis no sistema com suas senhas reais
  const demoUsers = [
    {
      id: 'admin',
      name: 'Administrador FIEC',
      email: 'admin@observatorio.fiec.org.br',
      password: 'admin123',
      role: 'Administrador',
      description: 'Acesso completo ao sistema',
    },
    {
      id: 'analyst',
      name: 'Maria Silva',
      email: 'maria.silva@observatorio.fiec.org.br',
      password: 'analyst123',
      role: 'Analista Sênior',
      description: 'Análise de dados industriais',
    },
    {
      id: 'user',
      name: 'João Santos',
      email: 'joao.santos@empresa.com.br',
      password: 'user123',
      role: 'Gerente Comercial',
      description: 'Consultas e relatórios empresariais',
    },
  ];

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.email.trim() || !credentials.password.trim()) {
      return;
    }

    try {
      await login(credentials);
    } catch {
      // Erro já tratado no store
    }
  };

  const handleDemoLogin = (demoUser: typeof demoUsers[0]) => {
    setCredentials({
      email: demoUser.email,
      password: demoUser.password,
      rememberMe: false,
    });
    setSelectedDemo(demoUser.id);
  };

  const handleInputChange = (field: keyof LoginCredentials, value: string | boolean) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value,
    }));
    if (error) clearError();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo e Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <MessageSquare size={32} className="text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">ChatAI</h1>
          <p className="text-gray-300">Assistente Inteligente do Observatório da Indústria</p>
        </div>

        {/* Formulário de Login */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={credentials.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="seu.email@exemplo.com"
                  required
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Senha
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full pl-10 pr-12 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Digite sua senha"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Lembrar-me */}
            <div className="flex items-center">
              <input
                id="rememberMe"
                type="checkbox"
                checked={credentials.rememberMe}
                onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                className="w-4 h-4 text-emerald-600 bg-gray-700 border-gray-600 rounded focus:ring-emerald-500 focus:ring-2"
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-300">
                Lembrar-me
              </label>
            </div>

            {/* Erro */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-red-900 border border-red-700 rounded-lg text-red-300"
              >
                <AlertCircle size={16} />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}

            {/* Botão de Login */}
            <button
              type="submit"
              disabled={isLoading || !credentials.email.trim() || !credentials.password.trim()}
              className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          {/* Divisor */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-600"></div>
            <span className="px-4 text-gray-400 text-sm">ou</span>
            <div className="flex-1 border-t border-gray-600"></div>
          </div>

          {/* Usuários Demo */}
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <Building2 size={16} />
              Usuários Disponíveis
            </h3>
            <div className="space-y-2">
              {demoUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleDemoLogin(user)}
                  className={`w-full p-3 text-left rounded-lg border transition-colors duration-200 ${
                    selectedDemo === user.id
                      ? 'bg-emerald-900 border-emerald-600 text-emerald-300'
                      : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <div className="font-medium text-sm">{user.name}</div>
                  <div className="text-xs text-gray-400 mt-1">{user.description}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {user.email} • {user.role}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center mt-6 text-gray-400 text-sm"
        >
          <p>© 2024 FIEC - Observatório da Indústria</p>
          <p className="mt-1">Sistema de Inteligência Artificial</p>
        </motion.div>
      </motion.div>
    </div>
  );
};
