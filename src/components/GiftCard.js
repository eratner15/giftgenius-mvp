import React, { useState } from 'react';

const GiftCard = ({ gift, onClick, analytics, recommendationEngine }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => setImageLoaded(true);
  const handleImageError = () => setImageError(true);

  const handleClick = () => {
    if (analytics) {
      analytics.trackGiftView(gift.id);
      analytics.trackCategoryInterest(gift.category);
      analytics.trackPriceInterest(gift.price);
    }
    onClick(gift);
  };

  const getBadgeType = (gift) => {
    if (gift.success_rate >= 95) return { type: 'hot', text: 'HOT' };
    if (gift.success_rate >= 90) return { type: 'trending', text: 'TRENDING' };
    if (analytics && analytics.getPersonalizationScore(gift) > 50) {
      return { type: 'ai-recommended', text: 'FOR YOU' };
    }
    return null;
  };

  const getHearts = (successRate) => {
    const hearts = Math.round((successRate || 0) / 20);
    return '❤️'.repeat(Math.max(1, Math.min(5, hearts)));
  };

  const getAiInsight = (gift) => {
    if (!analytics || !analytics.isReturningUser()) return null;

    const preferredCategories = analytics.getPreferredCategories();
    const isPreferredCategory = preferredCategories.includes(gift.category);

    if (isPreferredCategory) {
      return `Based on your interest in ${gift.category}`;
    }

    const priceRange = analytics.getPriceRange(gift.price);
    const preferredRange = analytics.getPreferredPriceRange();

    if (priceRange === preferredRange) {
      return 'Matches your usual price range';
    }

    if (gift.success_rate >= 95) {
      return '95%+ success rate in our community';
    }

    return null;
  };

  const badge = getBadgeType(gift);
  const aiInsight = getAiInsight(gift);

  return (
    <div className="gift-card enhanced-button" onClick={handleClick}>
      <div className="gift-image-container">
        {!imageLoaded && !imageError && (
          <div className="image-skeleton">
            <div className="skeleton-shimmer"></div>
          </div>
        )}

        {!imageError ? (
          <img
            src={gift.image_url || 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=500&h=200&fit=crop'}
            alt={gift.title}
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{
              display: imageLoaded ? 'block' : 'none',
              width: '100%',
              height: '200px',
              objectFit: 'cover',
              borderRadius: '8px 8px 0 0'
            }}
            loading="lazy"
          />
        ) : (
          <div className="image-placeholder">
            <div className="placeholder-icon">🎁</div>
            <span className="placeholder-text">{gift.title}</span>
          </div>
        )}

        {badge && (
          <span className={`gift-badge ${badge.type}`}>
            {badge.text}
          </span>
        )}
      </div>

      <div className="gift-card-content">
        <h3>{gift.title}</h3>

        <p className="gift-description">{gift.description}</p>

        <div className="price-row">
          <span className="price">${gift.price.toFixed(2)}</span>
          <span className="delivery">Free shipping</span>
        </div>

        <div className="rating-row">
          <div className="hearts">
            {getHearts(gift.success_rate)}
          </div>
          <span className="success-text">
            {gift.success_rate}% success rate
          </span>
        </div>

        <div className="reviews-count">
          {gift.total_reviews.toLocaleString()} reviews
        </div>

        {aiInsight && (
          <div className="ai-insight">
            🤖 {aiInsight}
          </div>
        )}
      </div>
    </div>
  );
};

export default GiftCard;