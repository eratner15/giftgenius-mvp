import React, { useState, useEffect } from 'react';

// Gift Comparison Engine
export class ComparisonEngine {
  constructor() {
    this.comparedGifts = new Map();
    this.comparisonCriteria = [
      { id: 'price', label: 'Price', weight: 0.25, format: 'currency' },
      { id: 'successRate', label: 'Success Rate', weight: 0.30, format: 'percentage' },
      { id: 'totalReviews', label: 'Reviews', weight: 0.20, format: 'number' },
      { id: 'deliveryDays', label: 'Delivery', weight: 0.15, format: 'days' },
      { id: 'category', label: 'Category', weight: 0.10, format: 'text' }
    ];
  }

  addToComparison(gift) {
    if (this.comparedGifts.size >= 3) {
      throw new Error('Maximum 3 gifts can be compared');
    }

    this.comparedGifts.set(gift.id, {
      ...gift,
      addedAt: Date.now()
    });

    return Array.from(this.comparedGifts.values());
  }

  removeFromComparison(giftId) {
    this.comparedGifts.delete(giftId);
    return Array.from(this.comparedGifts.values());
  }

  getComparedGifts() {
    return Array.from(this.comparedGifts.values());
  }

  clearComparison() {
    this.comparedGifts.clear();
    return [];
  }

  analyzeComparison() {
    const gifts = this.getComparedGifts();
    if (gifts.length < 2) return null;

    const analysis = {
      bestValue: this.findBestValue(gifts),
      mostPopular: this.findMostPopular(gifts),
      fastestDelivery: this.findFastestDelivery(gifts),
      highestRated: this.findHighestRated(gifts),
      recommendations: this.generateRecommendations(gifts)
    };

    return analysis;
  }

  findBestValue(gifts) {
    return gifts.reduce((best, gift) => {
      const valueScore = this.calculateValueScore(gift);
      const bestScore = this.calculateValueScore(best);
      return valueScore > bestScore ? gift : best;
    });
  }

  calculateValueScore(gift) {
    const price = gift.price || 0;
    const successRate = gift.successRate || gift.success_rate || 0;
    const reviews = gift.totalReviews || gift.total_reviews || 0;

    // Higher success rate and more reviews with lower price = better value
    return (successRate * 0.6 + Math.min(reviews / 10, 50) * 0.4) / (price * 0.01);
  }

  findMostPopular(gifts) {
    return gifts.reduce((most, gift) => {
      const popularityScore = (gift.totalReviews || gift.total_reviews || 0) *
                             (gift.successRate || gift.success_rate || 0) / 100;
      const mostScore = (most.totalReviews || most.total_reviews || 0) *
                        (most.successRate || most.success_rate || 0) / 100;
      return popularityScore > mostScore ? gift : most;
    });
  }

  findFastestDelivery(gifts) {
    return gifts.reduce((fastest, gift) => {
      const giftDays = gift.deliveryDays || gift.delivery_days || 7;
      const fastestDays = fastest.deliveryDays || fastest.delivery_days || 7;
      return giftDays < fastestDays ? gift : fastest;
    });
  }

  findHighestRated(gifts) {
    return gifts.reduce((highest, gift) => {
      const giftRate = gift.successRate || gift.success_rate || 0;
      const highestRate = highest.successRate || highest.success_rate || 0;
      return giftRate > highestRate ? gift : highest;
    });
  }

  generateRecommendations(gifts) {
    const recommendations = [];
    const analysis = {
      bestValue: this.findBestValue(gifts),
      mostPopular: this.findMostPopular(gifts),
      fastestDelivery: this.findFastestDelivery(gifts),
      highestRated: this.findHighestRated(gifts)
    };

    // Budget-conscious recommendation
    const cheapest = gifts.reduce((cheap, gift) =>
      gift.price < cheap.price ? gift : cheap
    );

    if (cheapest.successRate > 80) {
      recommendations.push({
        type: 'budget-friendly',
        gift: cheapest,
        reason: 'Great quality at the lowest price point',
        icon: '💰'
      });
    }

    // Safe choice recommendation
    if (analysis.highestRated.successRate > 90) {
      recommendations.push({
        type: 'safe-choice',
        gift: analysis.highestRated,
        reason: 'Highest success rate - very low risk',
        icon: '✅'
      });
    }

    // Time-sensitive recommendation
    if (analysis.fastestDelivery.deliveryDays <= 2) {
      recommendations.push({
        type: 'fast-delivery',
        gift: analysis.fastestDelivery,
        reason: 'Fastest delivery for last-minute gifts',
        icon: '⚡'
      });
    }

    // Value recommendation
    recommendations.push({
      type: 'best-value',
      gift: analysis.bestValue,
      reason: 'Best balance of quality, popularity, and price',
      icon: '⭐'
    });

    return recommendations.slice(0, 2); // Return top 2 recommendations
  }

  getComparisonScores(gifts) {
    return gifts.map(gift => ({
      id: gift.id,
      scores: this.comparisonCriteria.map(criteria => ({
        criteria: criteria.id,
        value: this.getCriteriaValue(gift, criteria.id),
        normalizedScore: this.normalizeScore(gift, criteria.id, gifts),
        isHighlight: this.isHighlightValue(gift, criteria.id, gifts)
      }))
    }));
  }

  getCriteriaValue(gift, criteria) {
    switch (criteria) {
      case 'successRate':
        return gift.successRate || gift.success_rate || 0;
      case 'totalReviews':
        return gift.totalReviews || gift.total_reviews || 0;
      case 'deliveryDays':
        return gift.deliveryDays || gift.delivery_days || 7;
      case 'price':
        return gift.price || 0;
      case 'category':
        return gift.category || 'Unknown';
      default:
        return gift[criteria] || 0;
    }
  }

  normalizeScore(gift, criteria, allGifts) {
    const value = this.getCriteriaValue(gift, criteria);

    if (criteria === 'category') return 0; // Text fields don't get scores

    const values = allGifts.map(g => this.getCriteriaValue(g, criteria));
    const min = Math.min(...values);
    const max = Math.max(...values);

    if (max === min) return 50; // All same value

    // For price and delivery days, lower is better
    if (criteria === 'price' || criteria === 'deliveryDays') {
      return ((max - value) / (max - min)) * 100;
    }

    // For others, higher is better
    return ((value - min) / (max - min)) * 100;
  }

  isHighlightValue(gift, criteria, allGifts) {
    const value = this.getCriteriaValue(gift, criteria);
    const values = allGifts.map(g => this.getCriteriaValue(g, criteria));

    // For price and delivery days, highlight the lowest
    if (criteria === 'price' || criteria === 'deliveryDays') {
      return value === Math.min(...values);
    }

    // For others, highlight the highest
    return value === Math.max(...values);
  }
}

// Comparison Tool Component
export const GiftComparisonTool = ({ comparisonEngine, onClose }) => {
  const [comparedGifts, setComparedGifts] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [scores, setScores] = useState([]);
  const [activeTab, setActiveTab] = useState('comparison');

  useEffect(() => {
    updateComparison();
  }, [comparisonEngine]);

  const updateComparison = () => {
    const gifts = comparisonEngine.getComparedGifts();
    setComparedGifts(gifts);

    if (gifts.length >= 2) {
      const comparisonAnalysis = comparisonEngine.analyzeComparison();
      const comparisonScores = comparisonEngine.getComparisonScores(gifts);
      setAnalysis(comparisonAnalysis);
      setScores(comparisonScores);
    } else {
      setAnalysis(null);
      setScores([]);
    }
  };

  const handleRemoveGift = (giftId) => {
    comparisonEngine.removeFromComparison(giftId);
    updateComparison();
  };

  const handleClearAll = () => {
    comparisonEngine.clearComparison();
    updateComparison();
  };

  const formatCriteriaValue = (value, format) => {
    switch (format) {
      case 'currency':
        return `$${value.toFixed(2)}`;
      case 'percentage':
        return `${value}%`;
      case 'days':
        return value === 1 ? '1 day' : `${value} days`;
      case 'number':
        return value.toLocaleString();
      case 'text':
        return value;
      default:
        return value;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10B981'; // Green
    if (score >= 60) return '#F59E0B'; // Yellow
    if (score >= 40) return '#EF4444'; // Red
    return '#6B7280'; // Gray
  };

  if (comparedGifts.length === 0) {
    return (
      <div className="comparison-tool empty">
        <div className="comparison-header">
          <h2>Gift Comparison</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="empty-comparison">
          <div className="empty-icon">🔍</div>
          <h3>Compare Up to 3 Gifts</h3>
          <p>Add gifts to comparison to see detailed side-by-side analysis</p>
          <div className="comparison-benefits">
            <div className="benefit">✅ Price comparison</div>
            <div className="benefit">📊 Success rate analysis</div>
            <div className="benefit">🚚 Delivery comparison</div>
            <div className="benefit">🎯 Personalized recommendations</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="comparison-tool">
      <div className="comparison-header">
        <h2>Comparing {comparedGifts.length} Gift{comparedGifts.length !== 1 ? 's' : ''}</h2>
        <div className="header-actions">
          <button className="clear-all-btn" onClick={handleClearAll}>
            Clear All
          </button>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
      </div>

      <div className="comparison-tabs">
        <button
          className={`tab ${activeTab === 'comparison' ? 'active' : ''}`}
          onClick={() => setActiveTab('comparison')}
        >
          📊 Comparison
        </button>
        {analysis && (
          <button
            className={`tab ${activeTab === 'recommendations' ? 'active' : ''}`}
            onClick={() => setActiveTab('recommendations')}
          >
            🎯 Recommendations
          </button>
        )}
      </div>

      <div className="comparison-content">
        {activeTab === 'comparison' && (
          <div className="comparison-table-wrapper">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th className="criteria-column">Features</th>
                  {comparedGifts.map(gift => (
                    <th key={gift.id} className="gift-column">
                      <div className="gift-header">
                        <img
                          src={gift.image_url || '/api/placeholder/60/60'}
                          alt={gift.name || gift.title}
                          className="gift-thumb"
                        />
                        <div className="gift-info">
                          <h4>{gift.name || gift.title}</h4>
                          <button
                            className="remove-gift-btn"
                            onClick={() => handleRemoveGift(gift.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonEngine.comparisonCriteria.map(criteria => (
                  <tr key={criteria.id}>
                    <td className="criteria-label">{criteria.label}</td>
                    {comparedGifts.map(gift => {
                      const value = comparisonEngine.getCriteriaValue(gift, criteria.id);
                      const isHighlight = comparisonEngine.isHighlightValue(gift, criteria.id, comparedGifts);
                      const score = comparisonEngine.normalizeScore(gift, criteria.id, comparedGifts);

                      return (
                        <td key={gift.id} className={`comparison-cell ${isHighlight ? 'highlight' : ''}`}>
                          <div className="cell-content">
                            <span className="cell-value">
                              {formatCriteriaValue(value, criteria.format)}
                            </span>
                            {criteria.format !== 'text' && (
                              <div className="score-bar">
                                <div
                                  className="score-fill"
                                  style={{
                                    width: `${score}%`,
                                    backgroundColor: getScoreColor(score)
                                  }}
                                />
                              </div>
                            )}
                            {isHighlight && criteria.format !== 'text' && (
                              <span className="best-badge">
                                {criteria.id === 'price' || criteria.id === 'deliveryDays' ? 'Best' : 'Highest'}
                              </span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'recommendations' && analysis && (
          <div className="recommendations-tab">
            <div className="quick-analysis">
              <h3>Quick Analysis</h3>
              <div className="analysis-grid">
                <div className="analysis-card">
                  <div className="analysis-icon">💰</div>
                  <div className="analysis-content">
                    <h4>Best Value</h4>
                    <p>{analysis.bestValue.name || analysis.bestValue.title}</p>
                    <span className="analysis-price">${analysis.bestValue.price}</span>
                  </div>
                </div>

                <div className="analysis-card">
                  <div className="analysis-icon">⭐</div>
                  <div className="analysis-content">
                    <h4>Highest Rated</h4>
                    <p>{analysis.highestRated.name || analysis.highestRated.title}</p>
                    <span className="analysis-rating">
                      {analysis.highestRated.successRate || analysis.highestRated.success_rate}% success
                    </span>
                  </div>
                </div>

                <div className="analysis-card">
                  <div className="analysis-icon">⚡</div>
                  <div className="analysis-content">
                    <h4>Fastest Delivery</h4>
                    <p>{analysis.fastestDelivery.name || analysis.fastestDelivery.title}</p>
                    <span className="analysis-delivery">
                      {analysis.fastestDelivery.deliveryDays || analysis.fastestDelivery.delivery_days || 7} days
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="detailed-recommendations">
              <h3>Our Recommendations</h3>
              <div className="recommendations-list">
                {analysis.recommendations.map((rec, index) => (
                  <div key={index} className="recommendation-card">
                    <div className="rec-icon">{rec.icon}</div>
                    <div className="rec-content">
                      <h4>{rec.gift.name || rec.gift.title}</h4>
                      <p className="rec-reason">{rec.reason}</p>
                      <div className="rec-details">
                        <span className="rec-price">${rec.gift.price}</span>
                        <span className="rec-success">
                          {rec.gift.successRate || rec.gift.success_rate}% success
                        </span>
                        <span className="rec-delivery">
                          {rec.gift.deliveryDays || rec.gift.delivery_days || 7} day delivery
                        </span>
                      </div>
                    </div>
                    <button className="choose-btn">Choose This Gift</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Floating Comparison Button
export const ComparisonFloatingButton = ({ comparisonEngine, onClick }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      setCount(comparisonEngine.getComparedGifts().length);
    };

    updateCount();
    const interval = setInterval(updateCount, 1000);
    return () => clearInterval(interval);
  }, [comparisonEngine]);

  if (count === 0) return null;

  return (
    <button className="comparison-floating-btn" onClick={onClick}>
      <div className="floating-btn-content">
        <span className="floating-btn-icon">⚖️</span>
        <span className="floating-btn-text">Compare ({count})</span>
        {count >= 2 && <span className="ready-indicator">Ready!</span>}
      </div>
    </button>
  );
};

export default ComparisonEngine;