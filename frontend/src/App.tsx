import { Layout, MainLayout } from './components/Layout';
import { ChatPage } from './pages';

function App() {
  return (
    <Layout>
      <MainLayout>
        <ChatPage />
      </MainLayout>
    </Layout>
  );
}

export default App;