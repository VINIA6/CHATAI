import React, { useState, useEffect } from 'react';

export function AppDebug() {
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  useEffect(() => {
    const logs: string[] = [];
    
    logs.push(`✅ AppDebug component mounted`);
    logs.push(`🌐 Location: ${window.location.href}`);
    logs.push(`📱 User Agent: ${navigator.userAgent}`);
    logs.push(`⚛️ React: ${React.version || 'Unknown'}`);
    logs.push(`🎯 Environment: ${import.meta.env.MODE}`);
    logs.push(`📂 Base URL: ${import.meta.env.BASE_URL}`);
    logs.push(`🔧 Dev: ${import.meta.env.DEV}`);
    logs.push(`🏭 Prod: ${import.meta.env.PROD}`);
    
    // Test localStorage
    try {
      localStorage.setItem('test', 'ok');
      localStorage.removeItem('test');
      logs.push(`💾 localStorage: OK`);
    } catch (e) {
      logs.push(`❌ localStorage: Error - ${e}`);
    }
    
    // Test CSS loading
    const computed = window.getComputedStyle(document.body);
    logs.push(`🎨 Body background: ${computed.backgroundColor}`);
    
    setDebugInfo(logs);
    
    // Also log to console
    logs.forEach(log => console.log(log));
  }, []);

  const testError = () => {
    throw new Error('Test error for debugging');
  };

  return (
    <div style={{
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'monospace',
      backgroundColor: '#1a1a1a',
      color: '#00ff00',
      lineHeight: '1.5'
    }}>
      <h1 style={{ color: '#00ff00', marginBottom: '20px' }}>
        🚀 ChatAI Debug Mode
      </h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ color: '#ffff00' }}>Debug Information:</h2>
        {debugInfo.map((info, index) => (
          <div key={index} style={{ margin: '5px 0' }}>
            {info}
          </div>
        ))}
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ color: '#ffff00' }}>Test Actions:</h2>
        <button 
          onClick={testError}
          style={{
            backgroundColor: '#ff0000',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            margin: '5px'
          }}
        >
          Test Error Boundary
        </button>
        
        <button 
          onClick={() => window.location.reload()}
          style={{
            backgroundColor: '#0066cc',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            margin: '5px'
          }}
        >
          Reload Page
        </button>
      </div>
      
      <div style={{ 
        backgroundColor: '#333', 
        padding: '15px', 
        borderRadius: '5px',
        border: '1px solid #555'
      }}>
        <h3 style={{ color: '#ff9900' }}>Instructions:</h3>
        <p>If you can see this page, React is working!</p>
        <p>Check the browser console for additional logs.</p>
        <p>After debugging, we'll switch back to the main app.</p>
      </div>
    </div>
  );
}
