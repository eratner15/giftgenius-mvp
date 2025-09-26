import React from 'react';
import GiftCard from './GiftCard';

const GiftGrid = ({
  gifts,
  loading,
  onGiftClick,
  sortBy,
  setSortBy,
  analytics,
  recommendationEngine
}) => {
  if (loading) {
    return (
      <div className="gift-grid loading">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="skeleton-gift-card">
            <div className="skeleton-image"></div>
            <div className="skeleton-content">
              <div className="skeleton-title"></div>
              <div className="skeleton-price"></div>
              <div className="skeleton-rating"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (gifts.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🔍</div>
        <h2 className="empty-title">No gifts found</h2>
        <p className="empty-message">
          Try adjusting your filters or explore our popular categories
        </p>
        <div className="empty-suggestions">
          <div className="suggestion-chip" onClick={() => setSortBy('popular')}>
            Most Popular
          </div>
          <div className="suggestion-chip" onClick={() => setSortBy('price-low')}>
            Budget Friendly
          </div>
          <div className="suggestion-chip" onClick={() => setSortBy('personalized')}>
            For You
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Results Summary */}
      <div className="results-summary">
        <div className="results-count">
          {gifts.length} {gifts.length === 1 ? 'gift' : 'gifts'} found
        </div>
        <div className="sort-options">
          <button
            className={`sort-btn enhanced-button ${sortBy === 'personalized' ? 'active' : ''}`}
            onClick={() => setSortBy('personalized')}
          >
            🤖 For You
          </button>
          <button
            className={`sort-btn enhanced-button ${sortBy === 'popular' ? 'active' : ''}`}
            onClick={() => setSortBy('popular')}
          >
            ⭐ Most Popular
          </button>
          <button
            className={`sort-btn enhanced-button ${sortBy === 'price-low' ? 'active' : ''}`}
            onClick={() => setSortBy('price-low')}
          >
            💰 Price: Low to High
          </button>
          <button
            className={`sort-btn enhanced-button ${sortBy === 'price-high' ? 'active' : ''}`}
            onClick={() => setSortBy('price-high')}
          >
            💎 Price: High to Low
          </button>
        </div>
      </div>

      {/* Gift Grid */}
      <div className="gift-grid">
        {gifts.map(gift => (
          <GiftCard
            key={gift.id}
            gift={gift}
            onClick={onGiftClick}
            analytics={analytics}
            recommendationEngine={recommendationEngine}
          />
        ))}
      </div>
    </>
  );
};

export default GiftGrid;