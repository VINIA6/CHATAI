# ChatBot FIEC - Frontend

Uma plataforma moderna de chatbot construída com React, TypeScript e as melhores práticas de desenvolvimento frontend.

## 🚀 Tecnologias Utilizadas

- **React 18** - Framework frontend moderno
- **TypeScript** - Tipagem estática para JavaScript
- **Vite** - Build tool ultra-rápido
- **Tailwind CSS** - Framework CSS utilitário
- **Zustand** - Gerenciamento de estado simples e poderoso
- **React Query** - Gerenciamento de dados assíncronos
- **Framer Motion** - Animações fluidas
- **Lucide React** - Ícones modernos
- **Axios** - Cliente HTTP

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Chat/           # Componentes do chat
│   ├── Input/          # Componentes de entrada
│   ├── Message/        # Componentes de mensagem
│   ├── Layout/         # Componentes de layout
│   └── UI/             # Componentes UI base
├── hooks/              # Hooks customizados
├── pages/              # Páginas da aplicação
├── services/           # Serviços de API
├── store/              # Gerenciamento de estado
├── types/              # Definições TypeScript
├── utils/              # Funções utilitárias
└── config/             # Configurações
```

## 🎨 Funcionalidades

### ✅ Implementadas
- **Interface Responsiva** - Funciona em desktop, tablet e mobile
- **Chat em Tempo Real** - Interface moderna similar ao ChatGPT/Gemini
- **Animações Fluidas** - Transições suaves com Framer Motion
- **Streaming de Respostas** - Respostas aparecem em tempo real
- **Histórico de Conversas** - Persistência local das conversas
- **Temas Personalizáveis** - Sistema de cores configurável
- **Acessibilidade** - Suporte a navegação por teclado
- **Exportação de Conversas** - Download do histórico em JSON

### 🚧 Planejadas
- **Upload de Arquivos** - Suporte a imagens e documentos
- **Entrada por Voz** - Reconhecimento de fala
- **Modo Escuro** - Alternância entre temas claro/escuro
- **Múltiplas Conversas** - Gerenciamento de várias conversas
- **Busca no Histórico** - Pesquisa em conversas antigas

## 🛠️ Configuração e Instalação

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação
1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd chatBotFIEC/frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
# Crie um arquivo .env baseado no .env.example
cp .env.example .env
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## 📱 Design Responsivo

A aplicação foi desenvolvida com **mobile-first** e é totalmente responsiva:

- **Mobile** (320px+): Layout otimizado para telas pequenas
- **Tablet** (768px+): Interface adaptada para telas médias
- **Desktop** (1024px+): Experiência completa em telas grandes

## 🎯 Padrões de Código

### Arquitetura
- **Component-Based**: Componentes pequenos e reutilizáveis
- **Custom Hooks**: Lógica de negócio separada dos componentes
- **Service Layer**: Comunicação com APIs centralizada
- **Type Safety**: TypeScript em todo o projeto

### Estilo de Código
- **ESLint + Prettier**: Formatação automática
- **Conventional Commits**: Padrão de mensagens de commit
- **Barrel Exports**: Imports organizados com index.ts

## 🔧 Scripts Disponíveis

```bash
npm run dev        # Inicia servidor de desenvolvimento
npm run build      # Build para produção
npm run preview    # Preview do build de produção
npm run lint       # Verifica problemas de código
npm run type-check # Verifica tipos TypeScript
```

## 🚀 Deploy

### Build para Produção
```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

### Variáveis de Ambiente
Configure as seguintes variáveis para produção:

```env
VITE_API_URL=https://api.chatbot-fiec.com/api
VITE_APP_NAME=ChatBot FIEC
VITE_ENABLE_STREAMING=true
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

Para suporte e dúvidas:
- 📧 Email: suporte@fiec.org.br
- 📱 WhatsApp: (85) 9999-9999
- 🌐 Website: https://www.fiec.org.br

---

Desenvolvido com ❤️ para a FIEC