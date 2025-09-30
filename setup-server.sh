#!/bin/bash

# Script de Configuração Completa do Servidor Hostinger
# Execute no servidor: curl -sSL https://raw.githubusercontent.com/seu-repo/setup-server.sh | bash

set -e

echo "🚀 Configurando servidor Hostinger para ChatAI..."

# Atualizar sistema
echo "📦 Atualizando sistema..."
apt update && apt upgrade -y

# Instalar dependências básicas
echo "🔧 Instalando dependências..."
apt install -y curl wget git nginx certbot python3-certbot-nginx ufw

# Configurar firewall
echo "🔥 Configurando firewall..."
ufw allow ssh
ufw allow 80
ufw allow 443
ufw --force enable

# Configurar Nginx
echo "🌐 Configurando Nginx..."
cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup

# Criar configuração do ChatAI
cat > /etc/nginx/sites-available/chatai-backend << 'EOF'
server {
    listen 80;
    server_name 72.60.166.17;

    location / {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Ativar site
ln -sf /etc/nginx/sites-available/chatai-backend /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Testar configuração do Nginx
nginx -t

# Reiniciar Nginx
systemctl restart nginx
systemctl enable nginx

# Configurar SSL (se tiver domínio)
echo "🔒 Para configurar SSL com Let's Encrypt:"
echo "certbot --nginx -d yourdomain.com -d www.yourdomain.com"

# Configurar auto-start do Docker
systemctl enable docker

echo "✅ Servidor configurado com sucesso!"
echo "📋 Próximos passos:"
echo "1. Execute o deploy: ./deploy.sh"
echo "2. Configure o arquivo .env"
echo "3. Configure SSL se tiver domínio"
echo "4. Teste a API: http://72.60.166.17/api/health"
