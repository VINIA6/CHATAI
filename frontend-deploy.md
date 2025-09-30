# Deploy do Frontend na Hostinger

## Configuração do Frontend para Produção

### 1. Atualizar configuração do Vite

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
  },
  define: {
    'process.env.NODE_ENV': '"production"'
  }
})
```

### 2. Atualizar variáveis de ambiente

```typescript
// src/config/env.ts
const isProduction = import.meta.env.PROD;

export const API_BASE_URL = isProduction 
  ? 'https://yourdomain.com/api'  // Substitua pelo seu domínio
  : 'http://localhost:5001/api';
```

### 3. Build para produção

```bash
cd frontend
npm run build
```

### 4. Deploy no servidor

```bash
# Copiar arquivos build para o servidor
scp -r dist/* root@72.60.166.17:/var/www/html/

# Ou usar rsync
rsync -avz --delete dist/ root@72.60.166.17:/var/www/html/
```

### 5. Configurar Nginx para servir o frontend

```nginx
# /etc/nginx/sites-available/chatai-frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    root /var/www/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:5001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 6. Configurar SSL

```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```
