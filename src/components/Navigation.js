import React, { useState } from 'react';

const Navigation = ({
  onShowAIChat,
  onShowWishlist,
  onNavigate,
  activeView,
  wishlistCount = 0
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (view, e) => {
    e.preventDefault();
    setIsOpen(false);
    onNavigate(view);
  };

  return (
    <nav className="main-navigation">
      <div className="nav-container">
        <div className="nav-brand" onClick={() => onNavigate('home')}>
          <span className="brand-text">GiftGenius</span>
        </div>

        <div className={`nav-menu ${isOpen ? 'nav-menu-open' : ''}`}>
          <button
            className={`nav-link ${activeView === 'home' ? 'active' : ''}`}
            onClick={(e) => handleNavClick('home', e)}
          >
            Home
          </button>
          <button
            className={`nav-link ${activeView === 'guides' ? 'active' : ''}`}
            onClick={(e) => handleNavClick('guides', e)}
          >
            Gift Guides
          </button>
          <button
            className={`nav-link ${activeView === 'concierge' ? 'active' : ''}`}
            onClick={(e) => handleNavClick('concierge', e)}
          >
            Concierge
          </button>
          <button
            className={`nav-link ${activeView === 'browse' ? 'active' : ''}`}
            onClick={(e) => handleNavClick('browse', e)}
          >
            Browse
          </button>
          <button
            className="nav-cta"
            onClick={() => {
              setIsOpen(false);
              onShowAIChat();
            }}
          >
            Ask AI
          </button>
        </div>

        <div className="nav-actions">
          <button
            className="wishlist-btn"
            onClick={onShowWishlist}
            title="My Wishlist"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            <span className="wishlist-count">{wishlistCount}</span>
          </button>

          <button
            className="mobile-toggle"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;