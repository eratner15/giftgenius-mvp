import React, { useEffect } from 'react';

const TestimonialModal = ({ gift, onClose, onSave, isSaved }) => {
  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!gift) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleBuyClick = () => {
    // Open in new tab/window - would typically be the actual purchase URL
    window.open(gift.buyUrl || `https://amazon.com/s?k=${encodeURIComponent(gift.name || gift.title)}`, '_blank');
  };

  const getHearts = (successRate) => {
    const hearts = Math.round((successRate || 0) / 20);
    return '❤️'.repeat(Math.max(1, Math.min(5, hearts)));
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="detail-modal">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <div className="detail-content">
          <img
            src={gift.image || '/api/placeholder/400/400'}
            alt={gift.name || gift.title}
            className="detail-image"
            onError={(e) => {
              e.target.src = '/api/placeholder/400/400';
            }}
          />

          <div className="detail-info">
            <h2>{gift.name || gift.title}</h2>
            <div className="detail-price">${gift.price}</div>

            <div className="detail-stats">
              <div className="stat-box">
                <div className="stat-label">Success Rate</div>
                <div className="stat-value">{gift.successRate || 90}%</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Reviews</div>
                <div className="stat-value">{gift.testimonials?.length || 0}</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Rating</div>
                <div className="stat-value">{getHearts(gift.successRate)}</div>
              </div>
            </div>

            <div className="buy-section">
              <button className="buy-btn" onClick={handleBuyClick}>
                Buy Now
              </button>
              <button
                className={`save-btn ${isSaved ? 'saved' : ''}`}
                onClick={() => onSave(gift)}
              >
                {isSaved ? '❤️' : '🤍'}
              </button>
            </div>

            {gift.description && (
              <div className="gift-description">
                <h3>Description</h3>
                <p>{gift.description}</p>
              </div>
            )}
          </div>

          {gift.testimonials && gift.testimonials.length > 0 && (
            <div className="testimonials-section">
              <h3>What Men Are Saying</h3>
              {gift.testimonials.slice(0, 3).map((testimonial, index) => (
                <div key={index} className="testimonial">
                  <div className="testimonial-header">
                    <div className="reviewer-info">
                      <div className="activity-avatar">
                        {testimonial.reviewer?.charAt(0) || 'A'}
                      </div>
                      <div>
                        <div className="testimonial-author">
                          {testimonial.reviewer || 'Anonymous'}
                        </div>
                        <div className="reviewer-meta">
                          {testimonial.relationship || 'Verified Purchase'}
                        </div>
                      </div>
                    </div>
                    <div className="testimonial-rating">
                      {[1, 2, 3, 4, 5].map(i => (
                        <span key={i} className="star">⭐</span>
                      ))}
                    </div>
                  </div>
                  <div className="testimonial-text">
                    {testimonial.text}
                  </div>
                  <div className="testimonial-footer">
                    <button className="helpful-btn">
                      👍 Helpful ({Math.floor(Math.random() * 20 + 5)})
                    </button>
                    <span style={{ fontSize: '12px', color: 'var(--gray-500)' }}>
                      {Math.floor(Math.random() * 30 + 1)} days ago
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestimonialModal;