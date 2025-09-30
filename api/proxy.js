export const config = {
  maxDuration: 60, // Máximo permitido no Vercel Pro (ou 10 para free tier)
};

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Lidar com preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const backendUrl = 'http://72.60.166.177:5001';
  const targetUrl = `${backendUrl}${req.url.replace('/api/proxy', '/api')}`;

  console.log(`[${new Date().toISOString()}] Proxy: ${req.method} ${req.url} -> ${targetUrl}`);

  try {
    const fetch = (await import('node-fetch')).default;
    
    // Preparar opções da requisição com timeout maior
    const options = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Vercel-Proxy/2.0'
      },
      timeout: 120000 // 2 minutos
    };

    // Adicionar Authorization se existir
    if (req.headers.authorization) {
      options.headers.Authorization = req.headers.authorization;
    }

    // Adicionar body para métodos que suportam
    if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
      options.body = JSON.stringify(req.body);
    }

    console.log(`[${new Date().toISOString()}] Making request to VPS with 2min timeout...`);

    const response = await fetch(targetUrl, options);
    const responseData = await response.text();

    console.log(`[${new Date().toISOString()}] VPS Response: ${response.status}`);

    // Retornar resposta mantendo status code original
    let parsedData;
    try {
      parsedData = JSON.parse(responseData);
    } catch {
      parsedData = responseData;
    }

    res.status(response.status).json(parsedData);

  } catch (error) {
    console.error(`[${new Date().toISOString()}] Proxy Error:`, error.message);
    
    // Distinguir entre timeout e outros erros
    if (error.message.includes('timeout') || error.code === 'ETIMEDOUT') {
      res.status(504).json({
        success: false,
        error: 'Gateway Timeout',
        message: 'O agente está demorando muito para responder. Isso pode acontecer com perguntas complexas. Por favor, tente novamente.',
        targetUrl,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Proxy Error',
        message: error.message,
        targetUrl,
        timestamp: new Date().toISOString()
      });
    }
  }
}
