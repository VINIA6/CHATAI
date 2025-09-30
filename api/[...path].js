export default async function handler(req, res) {
  // Configurar CORS primeiro
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Lidar com preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const backendUrl = 'http://72.60.166.177:5001';
  const targetUrl = `${backendUrl}${req.url}`;

  console.log(`[${new Date().toISOString()}] Proxy: ${req.method} ${req.url} -> ${targetUrl}`);

  try {
    const fetch = (await import('node-fetch')).default;
    
    // Preparar opções da requisição
    const options = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Vercel-Proxy/1.0'
      }
    };

    // Adicionar Authorization se existir
    if (req.headers.authorization) {
      options.headers.Authorization = req.headers.authorization;
    }

    // Adicionar body para métodos que suportam
    if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
      options.body = JSON.stringify(req.body);
    }

    console.log(`[${new Date().toISOString()}] Making request to VPS...`);

    const response = await fetch(targetUrl, options);
    const responseData = await response.text();

    console.log(`[${new Date().toISOString()}] VPS Response: ${response.status}`);

    // Retornar resposta
    res.status(response.status).json({
      success: response.ok,
      status: response.status,
      data: responseData ? JSON.parse(responseData) : null,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`[${new Date().toISOString()}] Proxy Error:`, error.message);
    
    res.status(500).json({
      success: false,
      error: 'Proxy Error',
      message: error.message,
      targetUrl,
      timestamp: new Date().toISOString()
    });
  }
}
