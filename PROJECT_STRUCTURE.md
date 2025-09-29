# Estrutura do Projeto ChatBot FIEC

## 📁 Estrutura de Arquivos

```
chatBotFIEC/
├── frontend/                           # Aplicação React Frontend
│   ├── public/                         # Arquivos públicos
│   ├── src/                           # Código fonte
│   │   ├── components/                # Componentes React
│   │   │   ├── Chat/                  # Componentes do chat
│   │   │   │   ├── ChatContainer.tsx  # Container principal do chat
│   │   │   │   └── index.ts          # Barrel export
│   │   │   ├── Input/                 # Componentes de entrada
│   │   │   │   ├── ChatInput.tsx     # Input com recursos avançados
│   │   │   │   └── index.ts          # Barrel export
│   │   │   ├── Layout/                # Componentes de layout
│   │   │   │   ├── Layout.tsx        # Layout principal com providers
│   │   │   │   └── index.ts          # Barrel export
│   │   │   ├── Message/               # Componentes de mensagem
│   │   │   │   ├── Message.tsx       # Componente de mensagem individual
│   │   │   │   └── index.ts          # Barrel export
│   │   │   └── UI/                    # Componentes UI base (futuro)
│   │   ├── config/                    # Configurações
│   │   │   └── env.ts                # Configurações de ambiente
│   │   ├── hooks/                     # Hooks customizados
│   │   │   └── useChat.ts            # Hook principal do chat
│   │   ├── pages/                     # Páginas da aplicação
│   │   │   ├── ChatPage.tsx          # Página principal do chat
│   │   │   └── index.ts              # Barrel export
│   │   ├── services/                  # Serviços de API
│   │   │   └── chatService.ts        # Serviço de comunicação com API
│   │   ├── store/                     # Gerenciamento de estado
│   │   │   └── chatStore.ts          # Store Zustand do chat
│   │   ├── types/                     # Definições TypeScript
│   │   │   └── index.ts              # Tipos principais
│   │   ├── utils/                     # Utilitários
│   │   │   └── index.ts              # Funções utilitárias
│   │   ├── App.tsx                   # Componente raiz
│   │   ├── index.css                 # Estilos Tailwind
│   │   └── main.tsx                  # Entry point
│   ├── .gitignore                    # Arquivos ignorados pelo Git
│   ├── eslint.config.js              # Configuração ESLint
│   ├── index.html                    # HTML principal
│   ├── package.json                  # Dependências e scripts
│   ├── postcss.config.js             # Configuração PostCSS
│   ├── README.md                     # Documentação do frontend
│   ├── tailwind.config.js            # Configuração Tailwind
│   ├── tsconfig.app.json             # Config TypeScript (app)
│   ├── tsconfig.json                 # Config TypeScript principal
│   ├── tsconfig.node.json            # Config TypeScript (node)
│   └── vite.config.ts                # Configuração Vite
├── Prova - Analista Desenvolvedor e Integrador de Sistemas.pdf
└── PROJECT_STRUCTURE.md             # Este arquivo
```

## 🚀 Tecnologias Implementadas

### Frontend
- **React 18** com TypeScript
- **Vite** como bundler (com Rolldown experimental)
- **Tailwind CSS v4** para estilização
- **Zustand** para gerenciamento de estado
- **React Query** para cache e sincronização de dados
- **Framer Motion** para animações
- **Axios** para requisições HTTP
- **Lucide React** para ícones

### Ferramentas de Desenvolvimento
- **ESLint** para linting
- **TypeScript** para tipagem estática
- **PostCSS** para processamento CSS
- **React Query Devtools** para debug

## 🎨 Funcionalidades Implementadas

### ✅ Core Features
1. **Interface de Chat Moderna**
   - Design similar ao ChatGPT/Gemini
   - Responsivo (mobile-first)
   - Animações fluidas
   - Tema claro profissional

2. **Componente de Mensagem**
   - Diferenciação visual usuário/bot
   - Indicador de digitação
   - Ações: copiar, regenerar, like/dislike
   - Timestamps formatados
   - Avatar personalizados

3. **Input Avançado**
   - Auto-resize do textarea
   - Suporte a Shift+Enter para quebra de linha
   - Sugestões rápidas
   - Contador de caracteres
   - Preparado para upload de arquivos
   - Preparado para entrada por voz

4. **Gerenciamento de Estado**
   - Persistência local de conversas
   - Cache de mensagens
   - Estado de loading/erro
   - Histórico de conversas

5. **Comunicação com API**
   - Suporte a streaming de respostas
   - Interceptors para autenticação
   - Tratamento de erros robusto
   - Retry automático

### ✅ UX Features
1. **Responsividade Total**
   - Layout adaptativo
   - Mobile-first design
   - Otimizado para touch

2. **Acessibilidade**
   - Navegação por teclado
   - Roles e labels apropriados
   - Alto contraste

3. **Performance**
   - Code splitting automático
   - Lazy loading de componentes
   - Otimização de bundle

## 🛠️ Como Usar

### Desenvolvimento
```bash
cd frontend
npm install
npm run dev
```

### Build para Produção
```bash
npm run build
npm run preview
```

### Testes e Qualidade
```bash
npm run lint
npm run type-check
```

## 🔧 Configurações Importantes

### Variáveis de Ambiente
- `VITE_API_URL`: URL da API backend
- `VITE_ENABLE_STREAMING`: Habilitar streaming
- `VITE_ENABLE_FILE_UPLOAD`: Habilitar upload
- `VITE_ENABLE_VOICE_INPUT`: Habilitar entrada por voz

### Tailwind CSS
- Configurado com sistema de cores personalizado
- Componentes utilitários pré-definidos
- Animações customizadas

### TypeScript
- Configuração estrita
- Type-only imports quando necessário
- Tipagem completa da aplicação

## 📱 Design System

### Cores Principais
- **Primary**: Azul (#3b82f6 - #1e3a8a)
- **Gray**: Escala de cinzas (#f9fafb - #030712)
- **Estados**: Verde (sucesso), Vermelho (erro), Amarelo (warning)

### Componentes Base
- `.chat-container`: Container principal
- `.message-bubble`: Bolhas de mensagem
- `.message-user`: Estilo usuário
- `.message-bot`: Estilo bot
- `.input-container`: Container do input
- `.chat-input`: Campo de entrada
- `.send-button`: Botão de envio

## 🚧 Próximos Passos

### Backend Integration
1. Criar API backend (Node.js/Express ou Python/FastAPI)
2. Implementar autenticação JWT
3. Conectar com modelo de IA (OpenAI, Anthropic, etc.)
4. Websockets para chat em tempo real

### Features Adicionais
1. Upload e processamento de arquivos
2. Entrada por voz (Speech-to-Text)
3. Modo escuro
4. Múltiplas conversas simultâneas
5. Busca no histórico
6. Exportação avançada (PDF, HTML)

### Deploy
1. Configurar CI/CD
2. Deploy em cloud (Vercel, Netlify, AWS)
3. CDN para assets estáticos
4. Monitoramento e analytics

## 📞 Suporte

Para desenvolvimento e manutenção:
- Documentação completa no README.md
- Código bem comentado e tipado
- Estrutura modular e escalável
- Padrões de código estabelecidos

---

✨ **Projeto criado seguindo as melhores práticas de desenvolvimento frontend moderno!**
