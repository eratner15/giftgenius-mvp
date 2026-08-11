import React, { useState, useEffect } from 'react';

const GiftComparison = ({ gifts = [], onClose, onGiftClick }) => {
  const [compareItems, setCompareItems] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const removeFromComparison = (giftId) => {
    setCompareItems(prev => prev.filter(item => item.id !== giftId));
  };

  const addToComparison = (gift) => {
    if (compareItems.length < 4 && !compareItems.find(item => item.id === gift.id)) {
      setCompareItems(prev => [...prev, gift]);
    }
  };

  const clearComparison = () => {
    setCompareItems([]);
  };

  const getComparisonScore = (gift1, gift2, metric) => {
    const value1 = gift1[metric] || 0;
    const value2 = gift2[metric] || 0;

    if (metric === 'price') {
      return value1 < value2 ? 'better' : value1 > value2 ? 'worse' : 'equal';
    }
    return value1 > value2 ? 'better' : value1 < value2 ? 'worse' : 'equal';
  };

  const getMetricIcon = (metric) => {
    const icons = {
      price: '$',
      success_rate: 'SR',
      rating: 'R',
      shipping_time: 'Ship',
      eco_friendly: 'Eco',
      popularity: 'Pop'
    };
    return icons[metric] || '--';
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: 'OV' },
    { id: 'features', name: 'Features', icon: 'FT' },
    { id: 'pricing', name: 'Pricing', icon: '$' },
    { id: 'reviews', name: 'Reviews', icon: 'RV' }
  ];

  return (
    <div className={`gift-comparison-overlay ${isVisible ? 'visible' : ''}`}>
      <div className="gift-comparison-modal">
        <div className="comparison-header">
          <div className="header-content">
            <h2 className="comparison-title">
              Gift Comparison
            </h2>
            <p className="comparison-subtitle">
              Compare up to 4 gifts side by side
            </p>
          </div>
          <button
            className="close-comparison"
            onClick={onClose}
            aria-label="Close comparison"
          >
            ✕
          </button>
        </div>

        {/* Gift Selector */}
        <div className="gift-selector">
          <h3>Add gifts to compare:</h3>
          <div className="gift-selector-grid">
            {gifts.slice(0, 12).map(gift => (
              <div
                key={gift.id}
                className={`selector-gift-card ${compareItems.find(item => item.id === gift.id) ? 'selected' : ''}`}
                onClick={() => addToComparison(gift)}
              >
                <img src={gift.image_url} alt={gift.title} />
                <span className="gift-name">{gift.title}</span>
                <span className="gift-price">${gift.price}</span>
                {compareItems.find(item => item.id === gift.id) && (
                  <div className="selected-indicator">✓</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {compareItems.length > 0 && (
          <>
            {/* Comparison Tabs */}
            <div className="comparison-tabs">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="tab-icon">{tab.icon}</span>
                  <span className="tab-name">{tab.name}</span>
                </button>
              ))}
            </div>

            {/* Comparison Table */}
            <div className="comparison-content">
              {activeTab === 'overview' && (
                <div className="comparison-table">
                  <div className="comparison-grid">
                    {/* Headers */}
                    <div className="comparison-header-cell">
                      <div className="actions-cell">
                        <button
                          className="clear-all-btn"
                          onClick={clearComparison}
                        >
                          Clear All
                        </button>
                      </div>
                    </div>
                    {compareItems.map(gift => (
                      <div key={gift.id} className="gift-header-cell">
                        <div className="gift-card-header">
                          <img src={gift.image_url} alt={gift.title} />
                          <h4>{gift.title}</h4>
                          <button
                            className="remove-gift-btn"
                            onClick={() => removeFromComparison(gift.id)}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Price Row */}
                    <div className="metric-label">
                      <span className="metric-icon">$</span>
                      Price
                    </div>
                    {compareItems.map(gift => (
                      <div key={`${gift.id}-price`} className="metric-cell price-cell">
                        <span className="price-value">${gift.price}</span>
                        <div className="price-rating">
                          {compareItems.length > 1 && (
                            <span className={`comparison-indicator ${
                              Math.min(...compareItems.map(g => g.price)) === gift.price ? 'best' : ''
                            }`}>
                              {Math.min(...compareItems.map(g => g.price)) === gift.price ? 'Best Price' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Success Rate Row */}
                    <div className="metric-label">
                      <span className="metric-icon">SR</span>
                      Success Rate
                    </div>
                    {compareItems.map(gift => (
                      <div key={`${gift.id}-success`} className="metric-cell">
                        <div className="success-rate-bar">
                          <div
                            className="success-fill"
                            style={{ width: `${gift.success_rate || 0}%` }}
                          ></div>
                          <span className="success-text">{gift.success_rate || 0}%</span>
                        </div>
                      </div>
                    ))}

                    {/* Rating Row */}
                    <div className="metric-label">
                      <span className="metric-icon">R</span>
                      Rating
                    </div>
                    {compareItems.map(gift => (
                      <div key={`${gift.id}-rating`} className="metric-cell">
                        <div className="star-rating">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span
                              key={i}
                              className={`star ${i < (gift.rating || 0) ? 'filled' : ''}`}
                            >
                              ★
                            </span>
                          ))}
                          <span className="rating-text">({gift.rating || 0})</span>
                        </div>
                      </div>
                    ))}

                    {/* Category Row */}
                    <div className="metric-label">
                      <span className="metric-icon">Cat</span>
                      Category
                    </div>
                    {compareItems.map(gift => (
                      <div key={`${gift.id}-category`} className="metric-cell">
                        <span className="category-tag">{gift.category || 'General'}</span>
                      </div>
                    ))}

                    {/* Availability Row */}
                    <div className="metric-label">
                      <span className="metric-icon">Avail</span>
                      Availability
                    </div>
                    {compareItems.map(gift => (
                      <div key={`${gift.id}-availability`} className="metric-cell">
                        <span className={`availability-badge ${gift.in_stock ? 'in-stock' : 'out-stock'}`}>
                          {gift.in_stock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'features' && (
                <div className="features-comparison">
                  <div className="features-grid">
                    {compareItems.map(gift => (
                      <div key={gift.id} className="gift-features">
                        <h4>{gift.title}</h4>
                        <div className="features-list">
                          {(gift.features || []).map((feature, index) => (
                            <div key={index} className="feature-item">
                              <span className="feature-icon">✓</span>
                              <span className="feature-text">{feature}</span>
                            </div>
                          ))}
                          {(!gift.features || gift.features.length === 0) && (
                            <div className="no-features">No features listed</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'pricing' && (
                <div className="pricing-comparison">
                  <div className="pricing-chart">
                    <h4>Price Comparison Chart</h4>
                    <div className="chart-bars">
                      {compareItems.map(gift => (
                        <div key={gift.id} className="price-bar">
                          <div className="bar-container">
                            <div
                              className="bar-fill"
                              style={{
                                height: `${(gift.price / Math.max(...compareItems.map(g => g.price))) * 100}%`
                              }}
                            ></div>
                          </div>
                          <div className="bar-label">
                            <span className="gift-name">{gift.title.slice(0, 20)}...</span>
                            <span className="price-amount">${gift.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pricing-insights">
                    <div className="insight-card">
                      <h5>Price Range</h5>
                      <p>${Math.min(...compareItems.map(g => g.price))} - ${Math.max(...compareItems.map(g => g.price))}</p>
                    </div>
                    <div className="insight-card">
                      <h5>Average Price</h5>
                      <p>${Math.round(compareItems.reduce((sum, g) => sum + g.price, 0) / compareItems.length)}</p>
                    </div>
                    <div className="insight-card">
                      <h5>Best Value</h5>
                      <p>{compareItems.find(g => g.price === Math.min(...compareItems.map(item => item.price)))?.title}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="reviews-comparison">
                  <div className="reviews-grid">
                    {compareItems.map(gift => (
                      <div key={gift.id} className="gift-reviews">
                        <h4>{gift.title}</h4>
                        <div className="review-summary">
                          <div className="rating-overview">
                            <span className="rating-score">{gift.rating || 0}</span>
                            <div className="stars">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span
                                  key={i}
                                  className={`star ${i < (gift.rating || 0) ? 'filled' : ''}`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                            <span className="review-count">({gift.review_count || 0} reviews)</span>
                          </div>
                          <div className="review-highlights">
                            <div className="highlight positive">
                              <span className="highlight-icon">+</span>
                              <span>Great quality and packaging</span>
                            </div>
                            <div className="highlight positive">
                              <span className="highlight-icon">Ship</span>
                              <span>Fast shipping</span>
                            </div>
                            {gift.rating < 4 && (
                              <div className="highlight negative">
                                <span className="highlight-icon">-</span>
                                <span>Some quality concerns</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="comparison-actions">
              {compareItems.map(gift => (
                <button
                  key={gift.id}
                  className="view-gift-btn"
                  onClick={() => onGiftClick(gift)}
                >
                  <span className="btn-icon">View</span>
                  View {gift.title.slice(0, 15)}...
                </button>
              ))}
            </div>
          </>
        )}

        {compareItems.length === 0 && (
          <div className="empty-comparison">
            <div className="empty-icon">Compare</div>
            <h3>No gifts selected for comparison</h3>
            <p>Choose up to 4 gifts from the list above to start comparing</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GiftComparison;
