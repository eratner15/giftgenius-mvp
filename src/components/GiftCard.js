import React from 'react';

const GiftCard = ({ gift, onClick, analytics, recommendationEngine }) => {
  const handleClick = () => {
    if (analytics) {
      analytics.trackGiftView(gift.id);
        // Image loading states
        const [imageLoaded, setImageLoaded] = useState(false);
        const [imageError, setImageError] = useState(false);

        const handleImageLoad = () => setImageLoaded(true);
        const handleImageError = () => setImageError(true);
      
      analytics.trackCategoryInterest(gift.category);
      analytics.trackPriceInterest(gift.price);
    }
    onClick(gift);
  };

  const getBadgeType = (gift) => {
    if (gift.successRate >= 95) return { type: 'hot', text: 'HOT' };
    if (gift.successRate >= 90) return { type: 'trending', text: 'TRENDING' };
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

    if (gift.successRate >= 95) {
      return '95%+ success rate in our community';
    }

    return null;
  };

  const badge = getBadgeType(gift);
  const aiInsight = getAiInsight(gift);

  return (
    <div className="gift-card enhanced-button" onClick={handleClick}>

    {/* Image Container with Loading States */}
          <div className="gift-image-container">
    {!imageLoaded && !imageError && (
                <div className="image-skeleton">
                  <div className="skeleton-shimmer"></div>
      </div>
              )}

  {!imageError ? (
              <img 
                src={gift.imageUrl}
              alt={gift.name}
              onLoad={handleImageLoad}
                            onError={handleImageError}
style={{ 
                                                          display: imageLoaded ? 'block' : 'none',
                                                          width: '100%',
                                                          height: '200px',
                                                          objectFit: 'cover',
                                                          borderRadius: '8px'
                                          }}
            loading="lazy"
                        />
                      ) : (
                                  <div className="image-placeholder">
                                    <div className="placeholder-icon">🎁</div>
                          <span className="placeholder-text">{gift.name}</span>
              </div>
                      )}

{badge && (
            <span className={`badge ${badge.text.toLowerCase()}`}>
{badge.text}
</span>
          )}
</div>
      <img
        src={gift.image || '/api/placeholder/300/200'}
        alt={gift.name || gift.title}
        onError={(e) => {
          e.target.src = '/api/placeholder/300/200';
        
      />

      {badge && (
        <div className={`gift-badge ${badge.type}`}>
          {badge.text}
        </div>
      )}

      <div className="gift-card-content">
        <h3>{gift.name || gift.title}</h3>

        <div className="price-row">
          <span className="price">${gift.price}</span>
          <span className="delivery">
            {gift.delivery || 'Free shipping'}
          </span>
        </div>

        <div className="rating-row">
          <div className="hearts">
            {getHearts(gift.successRate)}
          </div>
          <span className="success-text">
            {gift.successRate || 90}% success rate
          </span>
        </div>

        {gift.testimonials && gift.testimonials.length > 0 && (
          <div className="testimonial-preview">
            "{gift.testimonials[0].text?.substring(0, 80)}..."
          </div>
        )}

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
