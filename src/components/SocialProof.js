import React, { useState, useEffect } from 'react';

const SocialProof = ({ variant = "ticker" }) => {
  const [currentStat, setCurrentStat] = useState(0);
  const [visible, setVisible] = useState(false);

  // Real, trackable statistics
  const realStats = [
    { number: "113", label: "Curated Gift Ideas", icon: "🎁" },
    { number: "8", label: "Categories", icon: "📦" },
    { number: "Free", label: "To Use", icon: "💝" },
    { number: "24/7", label: "Available", icon: "🕒" }
  ];

  useEffect(() => {
    if (variant === "ticker") {
      const interval = setInterval(() => {
        setCurrentStat((prev) => (prev + 1) % realStats.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [variant, realStats.length]);

  if (variant === "ticker") {
    return (
      <div className="social-proof-ticker">
        <div className="ticker-content">
          <span className="ticker-icon">{realStats[currentStat].icon}</span>
          <span className="ticker-number">{realStats[currentStat].number}</span>
          <span className="ticker-label">{realStats[currentStat].label}</span>
        </div>
      </div>
    );
  }

  if (variant === "trust-badges") {
    return (
      <div className="social-proof-trust">
        <div className="trust-header">
          <span>Why Choose GiftGenius?</span>
        </div>
        <div className="trust-badges">
          <div className="trust-badge">
            <div className="badge-icon">🔒</div>
            <span className="badge-text">Secure Shopping</span>
          </div>
          <div className="trust-badge">
            <div className="badge-icon">🎯</div>
            <span className="badge-text">Curated Selection</span>
          </div>
          <div className="trust-badge">
            <div className="badge-icon">⚡</div>
            <span className="badge-text">Instant Results</span>
          </div>
          <div className="trust-badge">
            <div className="badge-icon">💝</div>
            <span className="badge-text">Thoughtful Gifts</span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "stats-grid") {
    return (
      <div className="social-proof-stats-grid">
        {realStats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-number">{stat.number}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "email-signup") {
    return (
      <div className="social-proof-email">
        <div className="email-header">
          <h3>Get Gift Ideas Delivered</h3>
          <p>Join our newsletter for curated gift recommendations</p>
        </div>
        <div className="email-form">
          <input
            type="email"
            placeholder="Enter your email"
            className="email-input"
          />
          <button className="email-submit">
            Subscribe
          </button>
        </div>
        <div className="email-disclaimer">
          <small>No spam. Unsubscribe anytime. We respect your privacy.</small>
        </div>
      </div>
    );
  }

  // Default fallback
  return (
    <div className="social-proof-simple">
      <div className="simple-stats">
        <span className="simple-number">113</span>
        <span className="simple-label">Gift Ideas Available</span>
      </div>
    </div>
  );
};

export default SocialProof;