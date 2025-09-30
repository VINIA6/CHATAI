# Configuração do Backend para Timeouts

## Problema Identificado

O backend está tendo timeout ao conectar com n8n após 30 segundos:
```
Erro: Timeout ao conectar com n8n (>30s)
```

## Soluções Recomendadas para o Backend

### 1. **Aumentar Timeout do n8n** (Recomendado)

No seu backend, aumente o timeout da conexão com n8n:

```python
# Exemplo em Python
import requests

response = requests.post(
    'http://n8n-url/webhook',
    json=data,
    timeout=120  # Aumentar de 30s para 120s (2 minutos)
)
```

```javascript
// Exemplo em Node.js
const axios = require('axios');

const response = await axios.post(
    'http://n8n-url/webhook',
    data,
    {
        timeout: 120000  // 2 minutos em milissegundos
    }
);
```

### 2. **Implementar Sistema de Queue** (Ideal para Produção)

Para perguntas complexas que demoram muito:

```python
# Backend recebe pergunta
# 1. Retorna ID da tarefa imediatamente
# 2. Processa em background
# 3. Frontend faz polling para verificar status

from celery import Celery

app = Celery('tasks', broker='redis://localhost:6379')

@app.task
def process_question(question_id, question):
    # Processa com n8n sem pressa
    result = call_n8n(question)
    # Salva resultado no banco
    save_result(question_id, result)
```

### 3. **Usar Webhooks de Callback**

Configure n8n para chamar um webhook quando terminar:

```python
# Backend
@app.post("/ask")
async def ask_question(question: str):
    task_id = generate_id()
    
    # Envia para n8n com callback URL
    requests.post('http://n8n/webhook', json={
        'question': question,
        'callback_url': f'http://backend/callback/{task_id}'
    })
    
    return {'task_id': task_id, 'status': 'processing'}

@app.post("/callback/{task_id}")
async def receive_callback(task_id: str, result: dict):
    # Salva resultado e notifica frontend via WebSocket
    save_result(task_id, result)
    notify_frontend(task_id)
```

### 4. **Otimizar n8n Workflow**

- Verifique se há nodes lentos no workflow
- Use cache quando possível
- Divida workflows complexos em menores
- Use processamento paralelo quando aplicável

### 5. **Monitoramento e Logging**

Adicione logs para identificar gargalos:

```python
import logging
import time

logger = logging.getLogger(__name__)

def call_n8n(question):
    start = time.time()
    logger.info(f"Iniciando chamada n8n: {question}")
    
    try:
        response = requests.post(n8n_url, json={'question': question}, timeout=120)
        elapsed = time.time() - start
        logger.info(f"n8n respondeu em {elapsed:.2f}s")
        return response.json()
    except requests.Timeout:
        elapsed = time.time() - start
        logger.error(f"Timeout após {elapsed:.2f}s")
        raise
```

## Configurações Frontend (Já Implementadas)

✅ Timeout de 2 minutos  
✅ Retry automático (até 3 tentativas)  
✅ Mensagens de erro amigáveis  
✅ Feedback visual melhorado  

## Recomendação Final

**Para ambiente de produção:**
1. Implementar sistema de queue (Celery + Redis)
2. Usar WebSockets para notificações em tempo real
3. Manter timeout do frontend em 2 minutos
4. Configurar timeout do backend com n8n em 5 minutos

**Para ambiente de desenvolvimento:**
1. Aumentar timeout do n8n para 120s
2. Otimizar workflow do n8n
3. Usar logs detalhados para identificar gargalos
