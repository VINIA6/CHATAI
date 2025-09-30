#!/bin/bash

# Script de Deploy para Hostinger
# Uso: ./deploy.sh

set -e

echo "🚀 Iniciando deploy do ChatAI Backend..."

# Configurações
SERVER_IP="72.60.166.17"
SERVER_USER="root"  # ou seu usuário SSH
APP_NAME="chatai-backend"
APP_DIR="/var/www/$APP_NAME"
SERVICE_NAME="chatai-backend"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📦 Preparando arquivos para deploy...${NC}"

# Criar arquivo .tar.gz com o backend
cd backend
tar -czf ../chatai-backend.tar.gz \
    --exclude='__pycache__' \
    --exclude='*.pyc' \
    --exclude='.env*' \
    --exclude='venv' \
    --exclude='.git' \
    --exclude='*.log' \
    .

cd ..

echo -e "${YELLOW}📤 Enviando arquivos para o servidor...${NC}"

# Enviar arquivos para o servidor
scp chatai-backend.tar.gz $SERVER_USER@$SERVER_IP:/tmp/

echo -e "${YELLOW}🔧 Executando deploy no servidor...${NC}"

# Executar comandos no servidor
ssh $SERVER_USER@$SERVER_IP << EOF
    set -e
    
    echo "📁 Criando diretório da aplicação..."
    mkdir -p $APP_DIR
    cd $APP_DIR
    
    echo "📦 Extraindo arquivos..."
    tar -xzf /tmp/chatai-backend.tar.gz
    rm /tmp/chatai-backend.tar.gz
    
    echo "🐍 Instalando dependências Python..."
    python3 -m venv venv
    source venv/bin/activate
    pip install --upgrade pip
    pip install -r requirements.txt
    
    echo "🐳 Instalando Docker e Docker Compose..."
    if ! command -v docker &> /dev/null; then
        curl -fsSL https://get.docker.com -o get-docker.sh
        sh get-docker.sh
        systemctl start docker
        systemctl enable docker
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-\$(uname -s)-\$(uname -m)" -o /usr/local/bin/docker-compose
        chmod +x /usr/local/bin/docker-compose
    fi
    
    echo "🔧 Configurando aplicação..."
    cp env.production.example .env
    
    echo "🚀 Iniciando serviços..."
    docker-compose up -d
    
    echo "⏳ Aguardando serviços ficarem prontos..."
    sleep 30
    
    echo "🔍 Verificando status dos serviços..."
    docker-compose ps
    
    echo "✅ Deploy concluído!"
EOF

echo -e "${GREEN}🎉 Deploy concluído com sucesso!${NC}"
echo -e "${YELLOW}📋 Próximos passos:${NC}"
echo "1. Acesse o servidor: ssh $SERVER_USER@$SERVER_IP"
echo "2. Configure o arquivo .env em $APP_DIR"
echo "3. Configure o Nginx como proxy reverso"
echo "4. Configure SSL/HTTPS"
echo "5. Teste a API: http://$SERVER_IP:5001/api/health"

# Limpar arquivo temporário
rm chatai-backend.tar.gz

echo -e "${GREEN}✨ Deploy finalizado!${NC}"