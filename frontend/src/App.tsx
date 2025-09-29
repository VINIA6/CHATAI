import { Layout, MainLayout } from './components/Layout';
import { ChatPage } from './pages';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Layout>
        <MainLayout>
          <ChatPage />
        </MainLayout>
      </Layout>
    </ErrorBoundary>
  );
}

export default App;