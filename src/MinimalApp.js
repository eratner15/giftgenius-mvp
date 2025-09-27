import React from 'react';

function MinimalApp() {
  return (
    <div style={{
      padding: '40px',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <header>
        <h1 style={{ color: '#6B46C1', marginBottom: '20px' }}>
          🎁 GiftGenius MVP
        </h1>
        <h2 style={{ color: '#4A5568', marginBottom: '30px' }}>
          ✅ React App Successfully Loaded!
        </h2>
      </header>

      <main>
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <h3 style={{ color: '#2D3748', marginBottom: '20px' }}>
            🚀 Status: Working!
          </h3>

          <p style={{ color: '#4A5568', lineHeight: '1.6', marginBottom: '20px' }}>
            This confirms that:
          </p>

          <ul style={{
            textAlign: 'left',
            color: '#4A5568',
            lineHeight: '1.8',
            backgroundColor: '#EDF2F7',
            padding: '20px',
            borderRadius: '8px'
          }}>
            <li>✅ React is loading and rendering properly</li>
            <li>✅ JavaScript execution is working</li>
            <li>✅ GitHub Pages deployment is successful</li>
            <li>✅ Base path configuration is correct</li>
          </ul>

          <div style={{ marginTop: '30px' }}>
            <p style={{ color: '#6B46C1', fontWeight: 'bold' }}>
              Next: Add gift data and functionality
            </p>
          </div>
        </div>
      </main>

      <footer style={{ marginTop: '40px', color: '#718096' }}>
        <p>Hosted on GitHub Pages • Build: {new Date().toISOString()}</p>
      </footer>
    </div>
  );
}

export default MinimalApp;