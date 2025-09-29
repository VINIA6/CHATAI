import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './utils/clearStorage'
import App from './App.tsx'
import { AppDebug } from './AppDebug.tsx'

// Log para debug em produção
console.log('🚀 ChatAI - Inicializando aplicação...');
console.log('Environment:', import.meta.env.MODE);
console.log('Base URL:', import.meta.env.BASE_URL);

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('❌ Elemento root não encontrado!');
  throw new Error('Elemento root não encontrado');
}

console.log('✅ Elemento root encontrado, renderizando aplicação...');

// Usar AppDebug temporariamente para identificar problema
const isProduction = import.meta.env.PROD;
const useDebug = isProduction; // Ativar debug apenas em produção

createRoot(rootElement).render(
  <StrictMode>
    {useDebug ? <AppDebug /> : <App />}
  </StrictMode>,
)
