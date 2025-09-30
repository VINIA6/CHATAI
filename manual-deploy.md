# Deploy Manual do ChatAI na Hostinger

## Passo 1: Conectar ao servidor
```bash
ssh root@72.60.166.17
# Digite a senha quando solicitado
```

## Passo 2: Configurar o servidor (execute no servidor)
```bash
# Atualizar sistema
apt update && apt upgrade -y

# Instalar dependências
apt install -y curl wget git nginx docker.io docker-compose

# Iniciar Docker
systemctl start docker
systemctl enable docker

# Criar diretório da aplicação
mkdir -p /var/www/chatai-backend
cd /var/www/chatai-backend
```

## Passo 3: Fazer upload dos arquivos (execute na sua máquina local)
```bash
# Criar arquivo compactado
cd /home/vinia6/Documentos/projects/CHATAI/backend
tar -czf ../chatai-backend.tar.gz \
    --exclude='__pycache__' \
    --exclude='*.pyc' \
    --exclude='.env*' \
    --exclude='venv' \
    --exclude='.git' \
    --exclude='*.log' \
    .

# Enviar para o servidor (será solicitada a senha)
scp ../chatai-backend.tar.gz root@72.60.166.17:/var/www/chatai-backend/
```

## Passo 4: Configurar no servidor (execute no servidor)
```bash
cd /var/www/chatai-backend

# Extrair arquivos
tar -xzf chatai-backend.tar.gz
rm chatai-backend.tar.gz

# Instalar dependências Python
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# Configurar variáveis de ambiente
cp env.production.example .env
nano .env  # Editar com suas configurações
```

## Passo 5: Configurar Docker no servidor
```bash
# Iniciar serviços
docker-compose up -d

# Verificar status
docker-compose ps
```

## Passo 6: Configurar Nginx
```bash
# Criar configuração
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

# Testar e reiniciar
nginx -t
systemctl restart nginx
```

## Passo 7: Testar
```bash
# Testar API
curl http://72.60.166.17/api/health

# Deve retornar:
# {"database":"connected","service":"ChatAI API","status":"healthy"}
```
