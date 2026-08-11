import React, { useState, useEffect } from 'react';

const Hero = ({ onBrowseGifts, onStartQuiz }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`hero-clean ${isVisible ? 'hero-visible' : ''}`}>
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Tell Us Who You're Shopping For.
            <span className="hero-title-accent"> We'll Tell You Exactly What to Get.</span>
          </h1>

          <p className="hero-subtitle">
            800+ curated gifts, AI-powered matching, and a 95% success rate.
            Stop guessing. Start gifting.
          </p>

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">800+</span>
              <span className="stat-label">curated gifts</span>
            </div>
            <div className="stat">
              <span className="stat-number">95%</span>
              <span className="stat-label">success rate</span>
            </div>
            <div className="stat">
              <span className="stat-number">30 sec</span>
              <span className="stat-label">to find the one</span>
            </div>
          </div>

          <div className="hero-actions">
            <button className="btn-primary" onClick={onStartQuiz}>
              Find the Perfect Gift
            </button>
            <button className="btn-secondary" onClick={onBrowseGifts}>
              Browse All Gifts
            </button>
          </div>

          <p className="hero-note">
            Free • No signup required • Instant results
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;