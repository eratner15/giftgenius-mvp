import React, { useState } from 'react';
import ShippingTimer from './ShippingTimer';
import OptimizedImage from './OptimizedImage';

const GiftCard = ({ gift, onClick, analytics, recommendationEngine }) => {

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

  const getRating = (successRate) => {
    return (Math.round((successRate || 0) / 20 * 10) / 10).toFixed(1);
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
        <OptimizedImage
          src={gift.image_url || 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=500&h=200&fit=crop'}
          alt={gift.title}
          className="gift-card-image"
          lazy={true}
        />

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

        {/* Add shipping urgency timer */}
        <ShippingTimer shippingDays={2} cutoffHour={14} />

        <div className="rating-row">
          <span className="success-text" style={{fontWeight: 700, color: 'var(--color-text)'}}>
            {getRating(gift.success_rate)}/5
          </span>
          <div style={{flex: 1, height: 4, background: 'var(--color-border)', borderRadius: 2, overflow: 'hidden'}}>
            <div style={{width: `${gift.success_rate}%`, height: '100%', background: 'var(--color-accent)', borderRadius: 2}}></div>
          </div>
          <span className="success-text">
            {gift.success_rate}%
          </span>
        </div>

        <div className="reviews-count">
          {gift.total_reviews.toLocaleString()} reviews
        </div>

        {aiInsight && (
          <div className="ai-insight">
            <span style={{fontWeight: 700, fontSize: 11, background: 'var(--color-primary)', color: 'white', padding: '1px 5px', borderRadius: 3, marginRight: 6}}>AI</span>
            {aiInsight}
          </div>
        )}

        <div className="gift-card-actions">
          <button
            className="btn-view-details"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            View Details
          </button>
          <a
            href={gift.affiliate_link || gift.buy_now_link || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-buy-now"
            onClick={(e) => {
              e.stopPropagation();
              if (window.gtag) {
                window.gtag('event', 'affiliate_click', {
                  gift_id: gift.id,
                  gift_title: gift.title,
                  price: gift.price,
                  category: gift.category
                });
              }
            }}
          >
            Buy Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default GiftCard;