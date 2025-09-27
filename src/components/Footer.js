import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>🎁 GiftGenius</h3>
          <p>AI-powered gift recommendations backed by real success stories. Find the perfect gift every time.</p>
          <div className="social-links">
            <a href="#" aria-label="Facebook">📘</a>
            <a href="#" aria-label="Twitter">🐦</a>
            <a href="#" aria-label="Instagram">📷</a>
            <a href="#" aria-label="Pinterest">📌</a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Shop</h4>
          <ul>
            <li><a href="#browse">Browse All Gifts</a></li>
            <li><a href="#occasions">By Occasion</a></li>
            <li><a href="#recipients">By Recipient</a></li>
            <li><a href="#budget">By Budget</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Company</h4>
          <ul>
            <li><a href="#about">About Us</a></li>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="#success-stories">Success Stories</a></li>
            <li><a href="#blog">Gift Ideas Blog</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#contact">Contact Us</a></li>
            <li><a href="#shipping">Shipping Info</a></li>
            <li><a href="#returns">Returns</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Legal</h4>
          <ul>
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#terms">Terms of Service</a></li>
            <li><a href="#affiliate">Affiliate Disclosure</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-trust-badges">
        <div className="trust-badge">
          <span className="badge-icon">✓</span>
          <span>Secure Checkout</span>
        </div>
        <div className="trust-badge">
          <span className="badge-icon">⚡</span>
          <span>Fast Shipping</span>
        </div>
        <div className="trust-badge">
          <span className="badge-icon">🔄</span>
          <span>Easy Returns</span>
        </div>
        <div className="trust-badge">
          <span className="badge-icon">💝</span>
          <span>Gift Wrapping</span>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {currentYear} GiftGenius. All rights reserved.</p>
        <p className="affiliate-disclosure">
          As an Amazon Associate, we earn from qualifying purchases.
        </p>
      </div>
    </footer>
  );
};

export default Footer;