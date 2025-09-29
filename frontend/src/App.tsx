import { Layout, MainLayout } from './components/Layout';
import { ChatPage } from './pages';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  console.log('📱 App component renderizando...');
  
  try {
    return (
      <ErrorBoundary>
        <Layout>
          <MainLayout>
            <ChatPage />
          </MainLayout>
        </Layout>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('❌ Erro no App component:', error);
    throw error;
  }
}

export default App;