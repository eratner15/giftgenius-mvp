import React, { useState, useEffect, useCallback } from 'react';

// AI-Powered Gift Recommendations
export const AIRecommendations = ({ userBehavior, currentGift }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  const generateRecommendations = useCallback(async () => {
    try {
      const response = await fetch('/api/gifts?' + new URLSearchParams({
        category: currentGift?.category || '',
        minPrice: Math.max(0, (currentGift?.price || 50) - 30),
        maxPrice: (currentGift?.price || 50) + 50,
        limit: 6
      }));

      const data = await response.json();

      // AI-like scoring based on user behavior
      const scoredGifts = data.gifts
        .filter(gift => gift.id !== currentGift?.id)
        .map(gift => ({
          ...gift,
          aiScore: calculateAIScore(gift, userBehavior, currentGift),
          reason: getRecommendationReason(gift, userBehavior, currentGift)
        }))
        .sort((a, b) => b.aiScore - a.aiScore)
        .slice(0, 4);

      setRecommendations(scoredGifts);
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
    } finally {
      setLoading(false);
    }
  }, [currentGift, userBehavior]);

  useEffect(() => {
    generateRecommendations();
  }, [generateRecommendations]);

  const calculateAIScore = (gift, behavior, currentGift) => {
    let score = gift.success_rate || 50;

    // Price preference matching
    if (behavior.avgPriceRange) {
      const [minPref, maxPref] = behavior.avgPriceRange;
      if (gift.price >= minPref && gift.price <= maxPref) {
        score += 20;
      }
    }

    // Category affinity
    if (behavior.favoriteCategories?.includes(gift.category)) {
      score += 15;
    }

    // Occasion matching
    if (behavior.recentOccasions?.includes(gift.occasion)) {
      score += 10;
    }

    // Similar items bonus
    if (currentGift && gift.category === currentGift.category) {
      score += 8;
    }

    // Trending bonus
    if (gift.total_reviews > 10) {
      score += 5;
    }

    return Math.min(100, score);
  };

  const getRecommendationReason = (gift, behavior, currentGift) => {
    const reasons = [];

    if (gift.success_rate >= 90) {
      reasons.push('Highly successful with partners');
    }

    if (behavior.favoriteCategories?.includes(gift.category)) {
      reasons.push('Matches your interests');
    }

    if (currentGift && Math.abs(gift.price - currentGift.price) <= 20) {
      reasons.push('Similar price range');
    }

    if (gift.delivery_days <= 2) {
      reasons.push('Fast delivery');
    }

    return reasons[0] || 'Popular choice';
  };

  if (loading) {
    return (
      <div className="ai-recommendations loading">
        <div className="ai-header">
          <span className="ai-icon">🤖</span>
          <h3>AI is finding perfect matches...</h3>
        </div>
        <div className="recommendation-skeleton">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton-recommendation">
              <div className="skeleton skeleton-image"></div>
              <div className="skeleton skeleton-text"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="ai-recommendations">
      <div className="ai-header">
        <span className="ai-icon">🤖</span>
        <h3>AI Recommendations Just for You</h3>
        <span className="ai-badge">Powered by your preferences</span>
      </div>

      <div className="recommendations-grid">
        {recommendations.map(gift => (
          <div key={gift.id} className="ai-recommendation-card">
            <div className="recommendation-image">
              <img src={gift.image_url} alt={gift.title} />
              <div className="ai-score-badge">{Math.round(gift.aiScore)}% match</div>
            </div>
            <div className="recommendation-content">
              <h4>{gift.title}</h4>
              <div className="recommendation-price">${gift.price}</div>
              <div className="recommendation-reason">{gift.reason}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Smart Search with Auto-Complete and Suggestions
export const SmartSearch = ({ onSearch, searchHistory = [] }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);

  const searchSuggestions = [
    { text: 'jewelry for anniversary', category: 'jewelry', icon: '💎' },
    { text: 'birthday gifts under $50', category: 'all', icon: '🎂' },
    { text: 'tech gadgets for boyfriend', category: 'tech', icon: '📱' },
    { text: 'romantic valentine gifts', category: 'experiences', icon: '💝' },
    { text: 'luxury gifts for her', category: 'all', icon: '✨' },
    { text: 'quick delivery gifts', category: 'all', icon: '⚡' },
    { text: 'personalized presents', category: 'unique', icon: '🎨' },
    { text: 'spa and wellness', category: 'beauty', icon: '🧴' }
  ];

  const handleInputChange = (value) => {
    setQuery(value);

    if (value.length > 2) {
      const filtered = searchSuggestions.filter(suggestion =>
        suggestion.text.toLowerCase().includes(value.toLowerCase())
      );

      // Add search history matches
      const historyMatches = searchHistory
        .filter(term => term.toLowerCase().includes(value.toLowerCase()))
        .map(term => ({ text: term, category: 'history', icon: '🕐' }));

      setSuggestions([...filtered, ...historyMatches].slice(0, 6));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSearch(suggestions[selectedIndex].text);
        } else {
          handleSearch(query);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSearch = async (searchTerm) => {
    setIsSearching(true);
    setQuery(searchTerm);
    setShowSuggestions(false);
    setSelectedIndex(-1);

    try {
      await onSearch(searchTerm);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="smart-search">
      <div className="search-input-container">
        <input
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length > 2 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder="What's the perfect gift for...?"
          className="smart-search-input"
        />
        <div className="search-icons">
          {isSearching && <div className="search-spinner">⟳</div>}
          <button
            onClick={() => handleSearch(query)}
            className="search-button"
          >
            🔍
          </button>
        </div>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="search-suggestions">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className={`suggestion-item ${index === selectedIndex ? 'selected' : ''}`}
              onClick={() => handleSearch(suggestion.text)}
            >
              <span className="suggestion-icon">{suggestion.icon}</span>
              <span className="suggestion-text">{suggestion.text}</span>
              {suggestion.category !== 'history' && (
                <span className="suggestion-category">{suggestion.category}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Real-time Social Proof & Activity Feed
export const SocialProofFeed = () => {
  const [activities, setActivities] = useState([]);
  const [recentPurchases, setRecentPurchases] = useState(0);

  useEffect(() => {
    // Simulate real-time activity
    const generateActivity = () => {
      const activities = [
        { user: 'Alex M.', action: 'just found the perfect anniversary gift', time: '2m ago', gift: 'Diamond Earrings' },
        { user: 'Sarah K.', action: 'bought a birthday surprise', time: '5m ago', gift: 'Silk Scarf Set' },
        { user: 'Mike R.', action: 'saved a Valentine\'s gift', time: '8m ago', gift: 'Cooking Class' },
        { user: 'Jessica L.', action: 'found a last-minute gift', time: '12m ago', gift: 'Spa Package' },
        { user: 'David W.', action: 'discovered the perfect present', time: '15m ago', gift: 'Tech Gadget' }
      ];

      const randomActivity = activities[Math.floor(Math.random() * activities.length)];

      setActivities(prev => [
        {
          ...randomActivity,
          id: Date.now() + Math.random(),
          time: 'just now'
        },
        ...prev.slice(0, 4)
      ]);

      setRecentPurchases(prev => prev + 1);
    };

    // Initial activities
    generateActivity();
    generateActivity();
    generateActivity();

    // Generate new activity every 15-30 seconds
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every interval
        generateActivity();
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="social-proof-container">
      <div className="live-stats">
        <div className="stat-item">
          <span className="stat-number">{recentPurchases + 247}</span>
          <span className="stat-label">gifts found today</span>
        </div>
        <div className="stat-divider">•</div>
        <div className="stat-item">
          <span className="stat-number">95%</span>
          <span className="stat-label">partner approval</span>
        </div>
        <div className="stat-divider">•</div>
        <div className="stat-item">
          <span className="stat-number live-counter">
            {activities.length + 12}
          </span>
          <span className="stat-label">shopping now</span>
        </div>
      </div>

      <div className="activity-feed">
        <h4>🔥 Recent Activity</h4>
        <div className="activity-list">
          {activities.map(activity => (
            <div key={activity.id} className="activity-item fade-in">
              <div className="activity-avatar">
                {activity.user.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="activity-content">
                <span className="activity-text">
                  <strong>{activity.user}</strong> {activity.action}
                  <span className="activity-gift"> "{activity.gift}"</span>
                </span>
                <span className="activity-time">{activity.time}</span>
              </div>
              <div className="activity-indicator">💖</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Urgency & Scarcity Indicators
export const UrgencyIndicators = ({ gift, occasion }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState('low');

  useEffect(() => {
    const calculateUrgency = () => {
      const now = new Date();
      let targetDate = null;

      // Calculate urgency based on upcoming occasions
      switch (occasion) {
        case 'valentine':
          targetDate = new Date(now.getFullYear(), 1, 14); // Feb 14
          if (targetDate < now) {
            targetDate.setFullYear(now.getFullYear() + 1);
          }
          break;
        case 'christmas':
          targetDate = new Date(now.getFullYear(), 11, 25); // Dec 25
          if (targetDate < now) {
            targetDate.setFullYear(now.getFullYear() + 1);
          }
          break;
        default:
          // For other occasions, create artificial urgency
          if (gift.delivery_days > 5) {
            return;
          }
      }

      if (targetDate) {
        const daysLeft = Math.ceil((targetDate - now) / (1000 * 60 * 60 * 24));

        if (daysLeft <= 3) {
          setUrgencyLevel('high');
          setTimeLeft(`${daysLeft} days left for ${occasion}!`);
        } else if (daysLeft <= 7) {
          setUrgencyLevel('medium');
          setTimeLeft(`${daysLeft} days until ${occasion}`);
        } else if (daysLeft <= 14) {
          setUrgencyLevel('low');
          setTimeLeft(`${daysLeft} days to plan for ${occasion}`);
        }
      }
    };

    calculateUrgency();
    const interval = setInterval(calculateUrgency, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [gift, occasion]);

  const getStockLevel = (gift) => {
    // Simulate stock levels based on popularity
    const popularity = gift.total_reviews || 0;
    if (popularity > 15) return 'low';
    if (popularity > 8) return 'medium';
    return 'high';
  };

  const stockLevel = getStockLevel(gift);

  return (
    <div className="urgency-indicators">
      {timeLeft && (
        <div className={`urgency-banner ${urgencyLevel}`}>
          <span className="urgency-icon">⏰</span>
          <span className="urgency-text">{timeLeft}</span>
        </div>
      )}

      {gift.delivery_days <= 2 && (
        <div className="delivery-urgency">
          <span className="delivery-icon">⚡</span>
          <span>Order in next 2 hours for delivery by tomorrow</span>
        </div>
      )}

      {stockLevel === 'low' && (
        <div className="stock-warning">
          <span className="stock-icon">🔥</span>
          <span>High demand - {Math.floor(Math.random() * 5) + 3} people viewing</span>
        </div>
      )}

      {gift.success_rate >= 95 && (
        <div className="popularity-indicator">
          <span className="popularity-icon">⭐</span>
          <span>Customer favorite - 95%+ partner approval</span>
        </div>
      )}
    </div>
  );
};

// Gift Comparison Tool
export const GiftComparison = ({ gifts, onRemove, onSelect }) => {
  if (gifts.length === 0) return null;

  const features = ['price', 'success_rate', 'total_reviews', 'delivery_days'];

  return (
    <div className="gift-comparison">
      <div className="comparison-header">
        <h3>Compare Your Selections</h3>
        <span className="comparison-count">{gifts.length}/3 gifts</span>
      </div>

      <div className="comparison-table">
        <div className="comparison-row comparison-images">
          {gifts.map(gift => (
            <div key={gift.id} className="comparison-cell comparison-gift">
              <button
                onClick={() => onRemove(gift.id)}
                className="remove-from-comparison"
              >
                ✕
              </button>
              <img src={gift.image_url} alt={gift.title} />
              <h4>{gift.title}</h4>
            </div>
          ))}
        </div>

        {features.map(feature => (
          <div key={feature} className="comparison-row">
            <div className="feature-label">
              {feature.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </div>
            {gifts.map(gift => (
              <div key={gift.id} className="comparison-cell">
                {feature === 'price' && `$${gift[feature]}`}
                {feature === 'success_rate' && `${gift[feature]}%`}
                {feature === 'total_reviews' && `${gift[feature]} reviews`}
                {feature === 'delivery_days' && `${gift[feature]} days`}
              </div>
            ))}
          </div>
        ))}

        <div className="comparison-row comparison-actions">
          <div className="feature-label">Action</div>
          {gifts.map(gift => (
            <div key={gift.id} className="comparison-cell">
              <button
                onClick={() => onSelect(gift)}
                className="select-gift-button"
              >
                Choose This One
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default {
  AIRecommendations,
  SmartSearch,
  SocialProofFeed,
  UrgencyIndicators,
  GiftComparison
};