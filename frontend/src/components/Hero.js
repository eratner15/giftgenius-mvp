import React from 'react';

const Hero = () => {
  return (
    <div className="hero">
      <h1>GiftGenius</h1>
      <p>Gift Ideas That Actually Work - Backed by Real Testimonials from Men</p>
      <div className="trust-indicators">
        <div className="trust-indicator">
          <span>✅</span>
          <span>Real Reviews</span>
        </div>
        <div className="trust-indicator">
          <span>📈</span>
          <span>Success Tracked</span>
        </div>
        <div className="trust-indicator">
          <span>🎯</span>
          <span>AI Personalized</span>
        </div>
        <div className="trust-indicator">
          <span>⚡</span>
          <span>Quick Delivery</span>
        </div>
      </div>
    </div>
  );
};

export default Hero;