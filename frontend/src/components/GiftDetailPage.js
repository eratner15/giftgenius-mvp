import React from 'react';

const GiftDetailPage = ({ gift, onClose, onAddToFavorites, isFavorite }) => {
  if (!gift) return null;

  const categoryEmoji = {
    jewelry: '💎',
    experiences: '🎭',
    home: '🏠',
    fashion: '👗',
    beauty: '💄',
    tech: '📱',
    unique: '✨'
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getSuccessColor = (rate) => {
    if (rate >= 95) return 'text-green-600';
    if (rate >= 90) return 'text-blue-600';
    if (rate >= 80) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <div className="gift-detail-overlay" onClick={onClose}>
      <div className="gift-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="gift-detail-header">
          <button className="close-btn" onClick={onClose}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="gift-detail-content">
          <div className="gift-detail-image">
            <img src={gift.imageUrl} alt={gift.name || gift.title} />
            <div className="gift-category-badge">
              <span className="category-emoji">{categoryEmoji[gift.category]}</span>
              <span className="category-name">{gift.category}</span>
            </div>
          </div>

          <div className="gift-detail-info">
            <div className="gift-title-section">
              <h1>{gift.name || gift.title}</h1>
              <div className="gift-price">{formatPrice(gift.price)}</div>
            </div>

            <div className="gift-stats">
              <div className="stat-item">
                <span className={`stat-value ${getSuccessColor(gift.successRate)}`}>
                  {gift.successRate}%
                </span>
                <span className="stat-label">Success Rate</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{gift.totalReviews}</span>
                <span className="stat-label">Reviews</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{gift.deliveryDays}</span>
                <span className="stat-label">Days Delivery</span>
              </div>
            </div>

            <div className="gift-description">
              <h3>Description</h3>
              <p>{gift.description}</p>
            </div>

            {gift.aiInsight && (
              <div className="ai-insight">
                <div className="insight-icon">🤖</div>
                <div className="insight-content">
                  <h4>AI Insight</h4>
                  <p>{gift.aiInsight}</p>
                </div>
              </div>
            )}

            {gift.testimonialPreview && (
              <div className="testimonial-preview">
                <h4>What others say</h4>
                <blockquote>"{gift.testimonialPreview}"</blockquote>
              </div>
            )}

            <div className="gift-actions">
              <button
                className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
                onClick={() => onAddToFavorites(gift)}
              >
                <svg className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {isFavorite ? 'Favorited' : 'Add to Favorites'}
              </button>

              <a
                href={gift.affiliateUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="buy-btn"
              >
                Buy at {gift.retailer}
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            <div className="retailer-info">
              <p><strong>Sold by:</strong> {gift.retailer}</p>
              <p><strong>Estimated delivery:</strong> {gift.deliveryDays} days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiftDetailPage;