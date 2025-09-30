#!/bin/bash

# Script para configurar o ChatAI no servidor Hostinger
# Execute este script no terminal do navegador da Hostinger

echo "🚀 Configurando ChatAI no servidor Hostinger..."

# Atualizar sistema
echo "📦 Atualizando sistema..."
apt update && apt upgrade -y

# Instalar dependências
echo "🔧 Instalando dependências..."
apt install -y curl wget git nginx docker.io docker-compose

# Iniciar Docker
echo "🐳 Configurando Docker..."
systemctl start docker
systemctl enable docker

# Criar diretório da aplicação
echo "📁 Criando diretório da aplicação..."
mkdir -p /var/www/chatai-backend
cd /var/www/chatai-backend

# Criar arquivo base64 do backend (você vai colar o conteúdo aqui)
echo "📝 Criando arquivo de configuração..."
cat > create_backend.sh << 'EOF'
#!/bin/bash

# Cole o conteúdo do arquivo chatai-backend-base64.txt aqui
# e execute: bash create_backend.sh

echo "📦 Decodificando arquivo base64..."
# Cole o conteúdo base64 aqui entre as aspas
BASE64_CONTENT=""

if [ -n "$BASE64_CONTENT" ]; then
    echo "$BASE64_CONTENT" | base64 -d > chatai-backend.tar.gz
    echo "✅ Arquivo decodificado com sucesso!"
    
    # Extrair arquivos
    echo "📂 Extraindo arquivos..."
    tar -xzf chatai-backend.tar.gz
    rm chatai-backend.tar.gz
    
    # Instalar dependências Python
    echo "🐍 Instalando dependências Python..."
    python3 -m venv venv
    source venv/bin/activate
    pip install --upgrade pip
    pip install -r requirements.txt
    
    # Configurar variáveis de ambiente
    echo "⚙️ Configurando variáveis de ambiente..."
    cp env.production.example .env
    
    echo "✅ Backend configurado com sucesso!"
    echo "📝 Edite o arquivo .env com suas configurações:"
    echo "   nano .env"
else
    echo "❌ Conteúdo base64 não encontrado!"
    echo "📋 Instruções:"
    echo "1. Copie o conteúdo do arquivo chatai-backend-base64.txt"
    echo "2. Cole entre as aspas na variável BASE64_CONTENT"
    echo "3. Execute: bash create_backend.sh"
fi
EOF

chmod +x create_backend.sh

echo "✅ Script de configuração criado!"
echo ""
echo "📋 Próximos passos:"
echo "1. Copie o conteúdo do arquivo chatai-backend-base64.txt da sua máquina local"
echo "2. Cole o conteúdo no arquivo create_backend.sh entre as aspas da variável BASE64_CONTENT"
echo "3. Execute: bash create_backend.sh"
echo ""
echo "📁 Arquivo criado em: /var/www/chatai-backend/create_backend.sh"
