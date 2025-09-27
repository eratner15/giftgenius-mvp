import React, { useState, useEffect } from 'react';
import { enhancedGifts } from './data/enhanced-gifts';

function SimpleApp() {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      console.log('Loading gifts:', enhancedGifts.length);
      setGifts(enhancedGifts.slice(0, 6)); // Show first 6 gifts
      setLoading(false);
    } catch (error) {
      console.error('Error loading gifts:', error);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>GiftGenius MVP</h1>
        <p>Loading gifts...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#6B46C1' }}>🎁 GiftGenius MVP</h1>
        <p>AI-powered gift recommendations</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {gifts.map((gift, index) => (
          <div key={index} style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '15px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <img
              src={gift.image_url}
              alt={gift.title}
              style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }}
            />
            <h3 style={{ margin: '10px 0', color: '#333' }}>{gift.title}</h3>
            <p style={{ color: '#666', fontSize: '14px' }}>{gift.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#6B46C1' }}>
                ${gift.price}
              </span>
              <span style={{ fontSize: '12px', color: '#888' }}>
                {gift.success_rate}% success rate
              </span>
            </div>
          </div>
        ))}
      </div>

      <footer style={{ textAlign: 'center', marginTop: '40px', color: '#666' }}>
        <p>Showing {gifts.length} gifts • Hosted on GitHub Pages</p>
      </footer>
    </div>
  );
}

export default SimpleApp;