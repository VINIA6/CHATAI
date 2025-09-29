# ChatBot FIEC - Observatório da Indústria

Plataforma moderna de chatbot desenvolvida com React, TypeScript e Tailwind CSS, inspirada no design do ChatGPT e Gemini.

## 🚀 Features

- ✅ Interface moderna e responsiva
- ✅ Histórico de conversas com sidebar
- ✅ Scroll automático instantâneo
- ✅ Auto-focus no input para interação fluida
- ✅ Mensagens de erro integradas ao chat
- ✅ Design dark consistente
- ✅ Animações suaves com Framer Motion
- ✅ Gerenciamento de estado com Zustand
- ✅ Cache inteligente com React Query

## 🛠 Tecnologias

- **React 19** + **TypeScript**
- **Vite com Rolldown** (build ultra-rápido)
- **Tailwind CSS v4** (design system moderno)
- **Framer Motion** (animações fluidas)
- **Zustand** (gerenciamento de estado)
- **React Query** (cache e sincronização)
- **Lucide React** (ícones consistentes)

## 📱 Funcionalidades

### Interface
- Design responsivo para desktop e mobile
- Sidebar com histórico de conversas
- Header com contador de mensagens
- Botões de áudio e anexo (em desenvolvimento)

### Chat
- Scroll automático instantâneo
- Auto-focus no input após envio
- Mensagens diferenciadas por usuário/bot
- Exibição de erros integrada ao chat
- Botão de scroll para o final

### Gerenciamento
- Persistência de conversas no localStorage
- Busca no histórico de conversas
- Exportação de conversas em JSON
- Limpeza de conversa atual

## 🚀 Deploy na Vercel

### Método 1: Via GitHub (Recomendado)

1. **Crie um repositório no GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: ChatBot FIEC"
   git branch -M main
   git remote add origin https://github.com/seu-usuario/chatbot-fiec.git
   git push -u origin main
   ```

2. **Deploy automático na Vercel:**
   - Acesse [vercel.com](https://vercel.com)
   - Faça login com sua conta GitHub
   - Clique em "New Project"
   - Selecione seu repositório
   - A Vercel detectará automaticamente as configurações

### Método 2: Via Vercel CLI

1. **Instale a Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Faça o deploy:**
   ```bash
   vercel
   ```

3. **Siga as instruções:**
   - Link to existing project? `N`
   - Project name: `chatbot-fiec`
   - Directory: `./`
   - Want to override settings? `N`

### Configurações Automáticas

O projeto já inclui:
- ✅ `vercel.json` configurado
- ✅ Build command: `cd frontend && npm run build`
- ✅ Output directory: `frontend/dist`
- ✅ SPA routing configurado

## 🔧 Desenvolvimento Local

1. **Clone o projeto:**
   ```bash
   git clone [seu-repo]
   cd chatbot-fiec/frontend
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Execute em desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Build para produção:**
   ```bash
   npm run build
   ```

## 📁 Estrutura do Projeto

```
chatBotFIEC/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chat/           # Componentes do chat
│   │   │   ├── Input/          # Input de mensagens
│   │   │   ├── Layout/         # Layout e sidebar
│   │   │   └── Message/        # Componente de mensagem
│   │   ├── hooks/              # Custom hooks
│   │   ├── pages/              # Páginas da aplicação
│   │   ├── services/           # Serviços API
│   │   ├── store/              # Gerenciamento de estado
│   │   ├── types/              # Tipos TypeScript
│   │   └── utils/              # Funções utilitárias
│   ├── public/                 # Arquivos estáticos
│   └── package.json
├── vercel.json                 # Configuração Vercel
└── README.md
```

## 🌐 Variáveis de Ambiente

Crie um arquivo `.env` na pasta `frontend/`:

```env
VITE_API_BASE_URL=https://sua-api.com/api
```

Na Vercel, adicione as variáveis em:
**Project Settings → Environment Variables**

## 📊 Performance

- ✅ **Lighthouse Score**: 90+
- ✅ **First Contentful Paint**: < 1.5s
- ✅ **Time to Interactive**: < 2.5s
- ✅ **Bundle Size**: < 500KB gzipped

## 🎨 Customização

### Cores e Tema
Edite `frontend/tailwind.config.js` para personalizar:
- Paleta de cores
- Tamanhos e espaçamentos
- Animações

### Funcionalidades
- Audio/Anexos: Descomente em `ChatInput.tsx`
- API Backend: Configure em `services/chatService.ts`
- Persistência: Ajuste em `store/chatStore.ts`

## 📞 Suporte

Criado para o **Observatório da Indústria FIEC**
- Consultas sobre dados de empresas
- Análises de vendas consolidadas
- Integração ERP/CRM
- Relatórios de Business Intelligence

---

**Versão**: 1.0.0  
**Desenvolvido com**: ❤️ para FIEC
