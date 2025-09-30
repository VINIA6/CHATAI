export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Testar conectividade com a VPS
    const fetch = (await import('node-fetch')).default;
    
    const response = await fetch('http://72.60.166.177:5001/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Vercel-Test/1.0'
      },
      body: JSON.stringify({
        username: 'test@test.com',
        password: 'test123'
      }),
      timeout: 5000
    });

    const data = await response.text();
    
    res.status(200).json({
      success: true,
      message: 'VPS is accessible from Vercel',
      vpsResponse: {
        status: response.status,
        data: data
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'VPS is not accessible from Vercel',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
