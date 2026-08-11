import React from 'react';
import GiftCard from './GiftCard';
import FastSkeletonLoader from './FastSkeletonLoader';

const GiftGrid = ({
  gifts = [],
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
        <FastSkeletonLoader type="card" count={6} className="gift-skeleton" />
      </div>
    );
  }

  if (!gifts || gifts.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9B9B9B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></div>
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
            For You
          </button>
          <button
            className={`sort-btn enhanced-button ${sortBy === 'popular' ? 'active' : ''}`}
            onClick={() => setSortBy('popular')}
          >
            Popular
          </button>
          <button
            className={`sort-btn enhanced-button ${sortBy === 'price-low' ? 'active' : ''}`}
            onClick={() => setSortBy('price-low')}
          >
            Price: Low to High
          </button>
          <button
            className={`sort-btn enhanced-button ${sortBy === 'price-high' ? 'active' : ''}`}
            onClick={() => setSortBy('price-high')}
          >
            Price: High to Low
          </button>
        </div>
      </div>

      {/* Gift Grid */}
      <div className="gift-grid">
        {gifts && gifts.map(gift => (
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