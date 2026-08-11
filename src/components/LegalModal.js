import React from 'react';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfService from './TermsOfService';

const LegalModal = ({ isOpen, onClose, type }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const renderContent = () => {
    switch (type) {
      case 'privacy':
        return <PrivacyPolicy />;
      case 'terms':
        return <TermsOfService />;
      case 'affiliate':
        return (
          <div className="legal-page">
            <div className="legal-container">
              <h1>Affiliate Disclosure</h1>
              <p><em>Last Updated: {new Date().toLocaleDateString()}</em></p>

              <section>
                <h2>Our Affiliate Partnerships</h2>
                <p>
                  <strong>GiftGenius is an affiliate marketing website.</strong> We partner with retailers
                  including Amazon, Walmart, and others to earn commissions when you make qualifying purchases
                  through our links.
                </p>
              </section>

              <section>
                <h2>How It Works</h2>
                <ol>
                  <li>We recommend products we believe you'll love</li>
                  <li>You click our affiliate links to visit retailer websites</li>
                  <li>If you make a purchase, we earn a small commission</li>
                  <li>Your price remains the same - no extra cost to you</li>
                </ol>
              </section>

              <section>
                <h2>Our Promise</h2>
                <ul>
                  <li>We only recommend products we genuinely believe in</li>
                  <li>Commission rates don't influence our recommendations</li>
                  <li>We're transparent about all affiliate relationships</li>
                  <li>Your trust is more important than any commission</li>
                </ul>
              </section>

              <section>
                <h2>FTC Compliance</h2>
                <p>
                  This disclosure complies with the Federal Trade Commission's guidelines for affiliate marketing.
                  We believe in full transparency about how we fund our free service.
                </p>
              </section>

              <div className="legal-footer">
                <p><small>Questions? Contact us at disclosure@giftgenius.com</small></p>
              </div>
            </div>
          </div>
        );
      default:
        return <div>Content not found</div>;
    }
  };

  return (
    <div className="legal-modal-overlay" onClick={handleOverlayClick}>
      <div className="legal-modal-content">
        <button className="legal-modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <div className="legal-modal-scroll">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default LegalModal;