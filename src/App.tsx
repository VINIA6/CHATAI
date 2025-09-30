import { memo } from 'react';
import { Layout, MainLayout } from './components/Layout';
import { ChatPage } from './pages';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoginPage } from './components/Auth';
import { useAuth } from './hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { RenderTracker } from './components/Debug/RenderTracker';

// Componente de loading memoizado
const LoadingScreen = memo(() => (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center">
    <div className="text-center">
      <Loader2 size={48} className="text-emerald-600 animate-spin mx-auto mb-4" />
      <p className="text-gray-300">Verificando autenticação...</p>
    </div>
  </div>
));

LoadingScreen.displayName = 'LoadingScreen';

// Componente principal da aplicação autenticada memoizado
const AuthenticatedApp = memo(() => (
  <Layout>
    <MainLayout>
      <ChatPage />
    </MainLayout>
  </Layout>
));

AuthenticatedApp.displayName = 'AuthenticatedApp';

function App() {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Debug render tracking
  console.log('🔍 App render:', { isAuthenticated, isLoading });
  
  // Tela de carregamento durante verificação de autenticação
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  return (
    <ErrorBoundary>
      <RenderTracker componentName="App" props={{ isAuthenticated, isLoading }} />
      {isAuthenticated ? <AuthenticatedApp /> : <LoginPage />}
    </ErrorBoundary>
  );
}

export default memo(App);