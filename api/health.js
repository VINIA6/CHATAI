export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Testar conectividade básica
    const fetch = (await import('node-fetch')).default;
    
    const response = await fetch('http://72.60.166.177:5001/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'test@test.com',
        password: 'test123'
      })
    });

    const data = await response.text();
    
    res.status(200).json({
      success: true,
      message: 'VPS is accessible',
      vpsStatus: response.status,
      vpsResponse: data,
      timestamp: new Date().toISOString(),
      vercelRegion: process.env.VERCEL_REGION || 'unknown'
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'VPS is not accessible',
      error: error.message,
      timestamp: new Date().toISOString(),
      vercelRegion: process.env.VERCEL_REGION || 'unknown'
    });
  }
}
