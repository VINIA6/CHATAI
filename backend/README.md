# ChatAI Backend

Backend da aplicação ChatAI desenvolvido em Python com Flask e MongoDB.

## 🚀 Execução com Docker

### Pré-requisitos
- Docker
- Docker Compose

### Executar a aplicação

```bash
# Construir e iniciar todos os serviços
docker-compose up --build

# Executar em background
docker-compose up -d --build

# Parar os serviços
docker-compose down

# Remover volumes (reseta banco de dados)
docker-compose down -v
```

### Serviços disponíveis

- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017
- **Mongo Express** (Admin UI): http://localhost:8081
  - Usuário: `admin`
  - Senha: `admin123`

### Inicialização do banco

O banco é inicializado automaticamente via serviço `db_init` no Docker Compose.

Para executar manualmente:
```bash
# Dentro do container
docker-compose exec backend python data/init_database.py

# Localmente (requer MongoDB rodando)
python init_db.py
```

## 🛠️ Desenvolvimento Local

### Pré-requisitos
- Python 3.11+
- MongoDB

### Configuração

```bash
# Criar ambiente virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows

# Instalar dependências
pip install -r requirements.txt

# Configurar variáveis de ambiente
cp env.example .env
# Editar .env conforme necessário

# Inicializar banco de dados
python init_db.py

# Executar aplicação
python app.py
```

## 📊 Dados Demo

### Usuários criados:
- **admin@observatorio.fiec.org.br** - senha: `admin123`
- **maria.silva@observatorio.fiec.org.br** - senha: `analyst123`  
- **joao.santos@empresa.com.br** - senha: `user123`

### Estrutura do banco:
- **user**: Usuários do sistema
- **talk**: Conversas/chats
- **message**: Mensagens das conversas

## 🔧 Configuração

### Variáveis de ambiente principais:

```env
MONGODB_URI=mongodb://admin:admin123@localhost:27017/chatai?authSource=admin
MONGODB_DATABASE=chatai
JWT_SECRET_KEY=your-super-secret-jwt-key
FLASK_ENV=development
```

## 🏗️ Arquitetura

O projeto segue os princípios de Clean Architecture:

```
backend/
├── app.py              # Ponto de entrada da aplicação
├── routes.py           # Definição das rotas
├── auth.py             # Middleware de autenticação
├── config/             # Configurações (database, settings)
├── entities/           # Entidades de domínio
├── controllers/        # Controllers da API
├── use_cases/          # Casos de uso/regras de negócio
├── repositories/       # Acesso a dados
├── factories/          # Factories para criação de objetos
└── data/               # Scripts de inicialização
```

## 🐳 Docker

### Dockerfile
- Base: `python:3.11-slim`
- Usuário não-root para segurança
- Multi-stage build otimizado

### Docker Compose
- **mongodb**: Banco de dados principal
- **backend**: API Flask
- **db_init**: Inicialização automática do banco
- **mongo-express**: Interface administrativa (opcional)

### Health Checks
- MongoDB: `mongosh --eval "db.adminCommand('ping')"`
- Backend: `curl -f http://localhost:5000/health`

## 📝 Endpoints

- `GET /` - Health check
- `GET /health` - Health check
- `POST /api/login` - Autenticação
- `GET /api/acessos-banda-larga` - Dados de banda larga
- `GET /api/analise/*` - Endpoints de análise

## 🔍 Logs e Debug

```bash
# Ver logs dos containers
docker-compose logs backend
docker-compose logs mongodb

# Logs em tempo real
docker-compose logs -f backend

# Entrar no container
docker-compose exec backend bash
```
