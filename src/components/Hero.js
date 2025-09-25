import React from 'react';

const Hero = () => {
  return (
    <div className="hero">
      <div className="hero-content">
        <h1>🎁 GiftGenius</h1>
        <p>Perfect Gifts, Every Time</p>
        <div className="hero-subtitle">
          Discover gift ideas backed by real testimonials and success stories
        </div>
        <div className="trust-indicators">
          <div className="trust-indicator">
            <span>✨</span>
            <span>24 Curated Gifts</span>
          </div>
          <div className="trust-indicator">
            <span>💝</span>
            <span>95% Success Rate</span>
          </div>
          <div className="trust-indicator">
            <span>⚡</span>
            <span>Fast Delivery</span>
          </div>
          <div className="trust-indicator">
            <span>🎯</span>
            <span>Personalized</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;