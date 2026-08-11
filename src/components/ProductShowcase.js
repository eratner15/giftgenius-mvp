import React, { useState, useEffect } from 'react';
import OptimizedImage from './OptimizedImage';

const ProductShowcase = ({ gifts, isRecommendation = false, recommendationData = null }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [displayGifts, setDisplayGifts] = useState([]);

  const categories = [
    { id: 'all', name: 'All Gifts', icon: 'All' },
    { id: 'jewelry', name: 'Jewelry', icon: 'J' },
    { id: 'tech', name: 'Tech', icon: 'T' },
    { id: 'home', name: 'Home', icon: 'H' },
    { id: 'experiences', name: 'Experiences', icon: 'E' },
    { id: 'fashion', name: 'Fashion', icon: 'F' },
    { id: 'food', name: 'Gourmet', icon: 'G' }
  ];

  const priceRanges = [
    { id: 'all', label: 'Any Price' },
    { id: 'under-25', label: 'Under $25' },
    { id: '25-50', label: '$25 - $50' },
    { id: '50-100', label: '$50 - $100' },
    { id: '100-200', label: '$100 - $200' },
    { id: 'over-200', label: 'Over $200' }
  ];

  useEffect(() => {
    let filtered = [...gifts];

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(gift => gift.category === selectedCategory);
    }

    // Price filter
    if (priceRange !== 'all') {
      switch (priceRange) {
        case 'under-25':
          filtered = filtered.filter(gift => gift.price < 25);
          break;
        case '25-50':
          filtered = filtered.filter(gift => gift.price >= 25 && gift.price <= 50);
          break;
        case '50-100':
          filtered = filtered.filter(gift => gift.price >= 50 && gift.price <= 100);
          break;
        case '100-200':
          filtered = filtered.filter(gift => gift.price >= 100 && gift.price <= 200);
          break;
        case 'over-200':
          filtered = filtered.filter(gift => gift.price > 200);
          break;
        default:
          break;
      }
    }

    // Sorting
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.success_rate - a.success_rate);
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      default:
        break;
    }

    setDisplayGifts(filtered.slice(0, 12));
  }, [gifts, selectedCategory, priceRange, sortBy]);

  return (
    <div className="product-showcase">
      <div className="showcase-header">
        {isRecommendation && recommendationData ? (
          <>
            <h2 className="showcase-title">Your Personalized Recommendations</h2>
            <p className="showcase-subtitle">
              Based on your preferences: {recommendationData.query}
            </p>
            {recommendationData.confidence && (
              <div className="confidence-badge">
                {recommendationData.confidence}% match confidence
              </div>
            )}
          </>
        ) : (
          <>
            <h2 className="showcase-title">Gift Collection</h2>
            <p className="showcase-subtitle">
              Hand-picked gifts for every occasion
            </p>
          </>
        )}
      </div>

      {/* Category Pills */}
      <div className="category-nav">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-pill ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
          </button>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="filters-bar">
        <div className="filter-group">
          <label>Price Range</label>
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="filter-select"
          >
            {priceRanges.map(range => (
              <option key={range.id} value={range.id}>{range.label}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="popular">Most Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest First</option>
          </select>
        </div>

        <div className="results-count">
          {displayGifts.length} gifts found
        </div>
      </div>

      {/* Product Grid */}
      <div className="product-grid">
        {displayGifts.map(gift => (
          <div key={gift.id} className="product-card">
            {gift.success_rate >= 90 && !isRecommendation && (
              <div className="product-badge">Popular</div>
            )}
            {isRecommendation && gift.recommendationScore >= 80 && (
              <div className="product-badge recommendation">Great Match</div>
            )}

            <div className="product-image">
              <OptimizedImage
                src={gift.image_url || 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=300&h=300&fit=crop'}
                alt={gift.title}
                className="product-image-element"
                lazy={true}
              />
            </div>

            <div className="product-info">
              <h3 className="product-title">{gift.title}</h3>
              <p className="product-description">
                {gift.description.slice(0, 80)}...
              </p>

              {isRecommendation && gift.recommendationReasons && gift.recommendationReasons.length > 0 && (
                <div className="recommendation-reasons">
                  {gift.recommendationReasons.slice(0, 2).map((reason, index) => (
                    <span key={index} className="reason-tag">
                      {reason}
                    </span>
                  ))}
                </div>
              )}

              <div className="product-meta">
                <div className="product-rating">
                  <span className="rating-stars">★★★★★</span>
                  <span className="rating-count">({gift.total_reviews})</span>
                </div>
                <div className="product-price">
                  ${gift.price.toFixed(2)}
                </div>
              </div>

              <div className="product-actions">
                <button className="btn-add-wishlist" title="Add to Wishlist">
                  ♡
                </button>
                <a
                  href={gift.affiliate_link || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-buy-now"
                >
                  View Product
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="showcase-footer">
        <button className="btn-load-more">
          Load More Gifts
        </button>
      </div>
    </div>
  );
};

export default ProductShowcase;