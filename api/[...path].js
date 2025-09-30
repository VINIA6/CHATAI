export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Lidar com preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const backendUrl = 'http://72.60.166.177:5001';
  const targetUrl = `${backendUrl}${req.url}`;

  console.log('=== PROXY REQUEST ===');
  console.log('Original URL:', req.url);
  console.log('Target URL:', targetUrl);
  console.log('Method:', req.method);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Body:', req.body);

  try {
    const fetch = (await import('node-fetch')).default;
    
    const requestOptions = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Vercel-Proxy/1.0',
        'Origin': 'https://vercel.app', // Simular origem do Vercel
        ...(req.headers.authorization && { Authorization: req.headers.authorization })
      },
      timeout: 10000 // 10 segundos de timeout
    };

    // Adicionar body apenas para métodos que suportam
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      requestOptions.body = JSON.stringify(req.body);
    }

    console.log('Request options:', JSON.stringify(requestOptions, null, 2));

    const response = await fetch(targetUrl, requestOptions);
    
    console.log('Response status:', response.status);
    console.log('Response headers:', JSON.stringify([...response.headers.entries()], null, 2));

    const data = await response.text();
    console.log('Response data:', data);
    
    // Copiar headers da resposta, mas sobrescrever CORS
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() !== 'access-control-allow-origin') {
        res.setHeader(key, value);
      }
    });
    
    // Forçar CORS para permitir requisições do Vercel
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    res.status(response.status).send(data);
  } catch (error) {
    console.error('=== PROXY ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Target URL:', targetUrl);
    
    // Garantir que CORS está configurado mesmo em caso de erro
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    res.status(500).json({ 
      error: 'Proxy error', 
      message: error.message,
      targetUrl,
      details: error.toString()
    });
  }
}
