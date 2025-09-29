import { Layout, MainLayout } from './components/Layout';
import { ChatPage } from './pages';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoginPage } from './components/Auth';
import { useAuth } from './hooks/useAuth';
import { Loader2 } from 'lucide-react';

function App() {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Tela de carregamento durante verificação de autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-300">Verificando autenticação...</p>
        </div>
      </div>
    );
  }
  
  try {
    return (
      <ErrorBoundary>
        {isAuthenticated ? (
          <Layout>
            <MainLayout>
              <ChatPage />
            </MainLayout>
          </Layout>
        ) : (
          <LoginPage />
        )}
      </ErrorBoundary>
    );
  } catch (error) {
    throw error;
  }
}

export default App;