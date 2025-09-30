export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const results = {
    timestamp: new Date().toISOString(),
    vercelRegion: process.env.VERCEL_REGION || 'unknown',
    tests: {}
  };

  try {
    const fetch = (await import('node-fetch')).default;
    
    // Teste 1: Conectividade básica
    try {
      const response1 = await fetch('http://72.60.166.177:5001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'test', password: 'test' })
      });
      
      results.tests.basicConnectivity = {
        success: true,
        status: response.status,
        message: 'Basic connectivity works'
      };
    } catch (error) {
      results.tests.basicConnectivity = {
        success: false,
        error: error.message,
        message: 'Basic connectivity failed'
      };
    }

    // Teste 2: Com timeout
    try {
      const response2 = await fetch('http://72.60.166.177:5001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'test', password: 'test' }),
        timeout: 5000
      });
      
      results.tests.timeoutTest = {
        success: true,
        status: response2.status,
        message: 'Timeout test works'
      };
    } catch (error) {
      results.tests.timeoutTest = {
        success: false,
        error: error.message,
        message: 'Timeout test failed'
      };
    }

    // Teste 3: Com User-Agent diferente
    try {
      const response3 = await fetch('http://72.60.166.177:5001/api/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'User-Agent': 'Vercel-Function/1.0'
        },
        body: JSON.stringify({ username: 'test', password: 'test' })
      });
      
      results.tests.userAgentTest = {
        success: true,
        status: response3.status,
        message: 'User-Agent test works'
      };
    } catch (error) {
      results.tests.userAgentTest = {
        success: false,
        error: error.message,
        message: 'User-Agent test failed'
      };
    }

    res.status(200).json(results);
    
  } catch (error) {
    results.error = error.message;
    res.status(500).json(results);
  }
}
