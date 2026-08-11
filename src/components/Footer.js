import React, { useState } from 'react';
import LegalModal from './LegalModal';

const Footer = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();
  const [legalModal, setLegalModal] = useState({ isOpen: false, type: null });

  const openLegalModal = (type) => {
    setLegalModal({ isOpen: true, type });
  };

  const closeLegalModal = () => {
    setLegalModal({ isOpen: false, type: null });
  };

  const handleNavigation = (page) => {
    if (onNavigate) {
      onNavigate(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>GiftGenius</h3>
          <p>AI-powered gift recommendations backed by real success stories. Find the perfect gift every time.</p>
        </div>

        <div className="footer-section">
          <h4>Shop</h4>
          <ul>
            <li><button onClick={() => handleNavigation('browse')} className="footer-link-button">Browse All Gifts</button></li>
            <li><button onClick={() => handleNavigation('guides')} className="footer-link-button">Gift Guides</button></li>
            <li><button onClick={() => handleNavigation('concierge')} className="footer-link-button">Personal Concierge</button></li>
            <li><button onClick={() => handleNavigation('home')} className="footer-link-button">Take Gift Quiz</button></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Company</h4>
          <ul>
            <li><button onClick={() => handleNavigation('about')} className="footer-link-button">About Us</button></li>
            <li><button onClick={() => handleNavigation('how-it-works')} className="footer-link-button">How It Works</button></li>
            <li><button onClick={() => handleNavigation('about')} className="footer-link-button">Success Stories</button></li>
            <li><button onClick={() => handleNavigation('guides')} className="footer-link-button">Gift Ideas</button></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li><button onClick={() => handleNavigation('faq')} className="footer-link-button">FAQ</button></li>
            <li><button onClick={() => handleNavigation('contact')} className="footer-link-button">Contact Us</button></li>
            <li><button onClick={() => handleNavigation('faq')} className="footer-link-button">Shipping Info</button></li>
            <li><button onClick={() => handleNavigation('faq')} className="footer-link-button">Returns</button></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Legal</h4>
          <ul>
            <li><button onClick={() => openLegalModal('privacy')} className="footer-link-button">Privacy Policy</button></li>
            <li><button onClick={() => openLegalModal('terms')} className="footer-link-button">Terms of Service</button></li>
            <li><button onClick={() => openLegalModal('affiliate')} className="footer-link-button">Affiliate Disclosure</button></li>
          </ul>
        </div>
      </div>


      <div className="footer-bottom">
        <p>© {currentYear} GiftGenius. All rights reserved.</p>
        <p className="affiliate-disclosure">
          As an Amazon Associate, we earn from qualifying purchases.
        </p>
      </div>

      <LegalModal
        isOpen={legalModal.isOpen}
        onClose={closeLegalModal}
        type={legalModal.type}
      />
    </footer>
  );
};

export default Footer;