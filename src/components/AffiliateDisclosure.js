import React, { useState } from 'react';

const AffiliateDisclosure = ({ placement = "top" }) => {
  const [isMinimized, setIsMinimized] = useState(false);

  if (placement === "banner") {
    return (
      <div className={`affiliate-disclosure-banner ${isMinimized ? 'minimized' : ''}`}>
        <div className="disclosure-content">
          <div className="disclosure-icon">ℹ️</div>
          <div className="disclosure-text">
            <strong>Affiliate Disclosure:</strong> We earn commissions from qualifying purchases made through our links. This doesn't affect your price or our recommendations.
          </div>
          <button
            className="disclosure-minimize"
            onClick={() => setIsMinimized(!isMinimized)}
            title={isMinimized ? "Show disclosure" : "Minimize disclosure"}
          >
            {isMinimized ? '↗️' : '↙️'}
          </button>
        </div>
        {isMinimized && (
          <div className="disclosure-minimized">
            <span className="mini-icon">ℹ️</span>
            <span className="mini-text">Affiliate Disclosure</span>
          </div>
        )}
      </div>
    );
  }

  if (placement === "inline") {
    return (
      <div className="affiliate-disclosure-inline">
        <div className="inline-content">
          <span className="inline-icon">💰</span>
          <span className="inline-text">
            We may earn a commission when you purchase through our links, at no extra cost to you.
          </span>
        </div>
      </div>
    );
  }

  if (placement === "product") {
    return (
      <div className="affiliate-disclosure-product">
        <div className="product-disclosure">
          <span className="product-icon">🔗</span>
          <span className="product-text">
            Affiliate link - We earn from qualifying purchases
          </span>
        </div>
      </div>
    );
  }

  // Default top banner
  return (
    <div className="affiliate-disclosure-top">
      <div className="top-content">
        <div className="disclosure-main">
          <span className="main-icon">📢</span>
          <span className="main-text">
            <strong>Transparency Notice:</strong> GiftGenius participates in affiliate programs. When you purchase through our recommendations, we may earn a commission at no additional cost to you. This helps us keep our service free and continue curating great gift ideas.
          </span>
        </div>
        <div className="disclosure-actions">
          <a href="/affiliate-policy" className="learn-more-link">
            Learn More
          </a>
        </div>
      </div>
    </div>
  );
};

export default AffiliateDisclosure;