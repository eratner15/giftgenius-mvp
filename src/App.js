/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-use-before-define */
import React, { useState, useEffect, useCallback } from 'react';
import Hero from './components/Hero';
import FilterBar from './components/FilterBar';
import GiftGrid from './components/GiftGrid';
import TestimonialModal from './components/TestimonialModal';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import { getGifts } from './api/gifts';
import { UserAnalytics, RecommendationEngine, SocialProofManager } from './utils/analytics';
import { useToast } from './utils/toast';
import './styles/App.css';

function App() {
  // State management
  const [gifts, setGifts] = useState([]);
  const [allGifts, setAllGifts] = useState([]);
  const [selectedGift, setSelectedGift] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [sortBy, setSortBy] = useState('personalized');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);

  // Phase 2: Intelligence & Personalization (initialized lazily)
  const [analytics, setAnalytics] = useState(null);
  const [recommendationEngine, setRecommendationEngine] = useState(null);
  const [socialProof, setSocialProof] = useState(null);
  const [personalizedGifts, setPersonalizedGifts] = useState([]);
  const [contextualGifts, setContextualGifts] = useState([]);
  const [trendingGifts, setTrendingGifts] = useState([]);
  const [activities, setActivities] = useState([]);

  const [filter, setFilter] = useState({
    category: '',
    maxPrice: 1000,
      minAge: '',
  maxAge: '',
    minSuccessRate: 0,
    search: '',
    quickFilter: ''
  });

  // Quick recommendation scenarios
  const quickScenarios = [
    { id: 'anniversary', emoji: '💑', label: 'Anniversary', desc: 'Romantic & meaningful', filter: { category: 'jewelry', minSuccessRate: 90 } },
    { id: 'birthday', emoji: '🎂', label: 'Birthday', desc: 'Personal & special', filter: { category: '', minSuccessRate: 80 } },
    { id: 'justbecause', emoji: '💝', label: 'Just Because', desc: 'Thoughtful surprise', filter: { maxPrice: 100 } },
    { id: 'apology', emoji: '🙏', label: 'Apology Gift', desc: 'Make things right', filter: { minSuccessRate: 95 } },
    { id: 'holiday', emoji: '🎄', label: 'Holiday', desc: 'Festive & cozy', filter: { category: 'home' } },
    { id: 'firstdate', emoji: '🌹', label: 'New Relationship', desc: 'Not too much', filter: { maxPrice: 50 } }
  ];

  // Toast notifications
  const toast = useToast();

  // Function definitions before use
  const fetchGiftsData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('Fetching gifts...');
      const data = await getGifts();
      const giftList = data.gifts || data || [];

      setAllGifts(giftList);
      setGifts(giftList);
      toast.showSuccess('Success', `Loaded ${giftList.length} gifts`);
    } catch (err) {
      console.error('Failed to fetch gifts:', err);
      setError(err.message);
      toast.showError('Error', 'Failed to load gifts');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const filterAndSortGifts = useCallback(() => {
    let filtered = [...allGifts];

    // Apply filters
    if (filter.category) {
      filtered = filtered.filter(gift => gift.category === filter.category);
    }

    if (filter.maxPrice) {
      filtered = filtered.filter(gift => gift.price <= filter.maxPrice);
    }

    if (filter.minSuccessRate) {
      filtered = filtered.filter(gift => (gift.successRate || 0) >= filter.minSuccessRate);
    }

    if (filter.search) {
      const searchTerm = filter.search.toLowerCase();
      filtered = filtered.filter(gift =>
        (gift.name || gift.title || '').toLowerCase().includes(searchTerm) ||
        (gift.category || '').toLowerCase().includes(searchTerm) ||
        (gift.description || '').toLowerCase().includes(searchTerm)
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'personalized':
        if (analytics) {
          filtered = filtered
            .map(gift => ({
              ...gift,
              personalizedScore: analytics.getPersonalizationScore(gift)
            }))
            .sort((a, b) => b.personalizedScore - a.personalizedScore);
        } else {
          filtered = filtered.sort((a, b) => (b.successRate || 0) - (a.successRate || 0));
        }
        break;
      case 'popular':
        filtered = filtered.sort((a, b) => (b.successRate || 0) - (a.successRate || 0));
        break;
      case 'price-low':
        filtered = filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered = filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    setGifts(filtered);
  }, [allGifts, filter, sortBy, analytics]);

  const updateRecommendations = useCallback(() => {
    if (allGifts.length === 0) return;

    // Get personalized recommendations
    const personalizedResults = recommendationEngine.getPersonalizedGifts(allGifts, 6);
    setPersonalizedGifts(personalizedResults);

    // Get trending gifts
    const trendingResults = recommendationEngine.getTrendingGifts(allGifts, 4);
    setTrendingGifts(trendingResults);

    // Get contextual/seasonal gifts
    const contextualResults = recommendationEngine.getContextualGifts(allGifts, 4);
    setContextualGifts(contextualResults);

    // User profile is handled by analytics directly
  }, [allGifts, recommendationEngine]);

  const generateSearchSuggestions = useCallback((query) => {
    if (!query || query.length < 2) {
      setSearchSuggestions([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const suggestions = [];

    // Gift name suggestions
    allGifts.forEach(gift => {
      const name = (gift.name || gift.title || '').toLowerCase();
      if (name.includes(lowerQuery) && suggestions.length < 5) {
        suggestions.push({
          type: 'gift',
          text: gift.name || gift.title,
          icon: '🎁',
          gift: gift
        });
      }
    });

    // Category suggestions
    const categories = ['jewelry', 'experiences', 'home', 'fashion', 'beauty', 'tech', 'unique'];
    categories.forEach(category => {
      if (category.includes(lowerQuery)) {
        suggestions.push({
          type: 'category',
          text: category.charAt(0).toUpperCase() + category.slice(1),
          icon: getCategoryIcon(category),
          category: category
        });
      }
    });

    // AI-powered suggestions based on user behavior
    if (analytics && analytics.isReturningUser()) {
      const preferredCategories = analytics.getPreferredCategories();
      preferredCategories.forEach(cat => {
        if (cat.includes(lowerQuery)) {
          suggestions.push({
            type: 'ai',
            text: `${cat} (Your favorite)`,
            icon: '🤖',
            category: cat
          });
        }
      });
    }

    setSearchSuggestions(suggestions.slice(0, 8));
    setShowSuggestions(true);
    setSelectedSuggestion(-1);
  }, [allGifts, analytics]);

  // Initialize analytics lazily after first render
  useEffect(() => {
    if (!analytics) {
      const analyticsInstance = new UserAnalytics();
      const recommendationEngineInstance = new RecommendationEngine(analyticsInstance);
      const socialProofInstance = new SocialProofManager();

      setAnalytics(analyticsInstance);
      setRecommendationEngine(recommendationEngineInstance);
      setSocialProof(socialProofInstance);

      analyticsInstance.trackSession();
    }
  }, [analytics]);

  useEffect(() => {
    fetchGiftsData();
    loadFavorites();
  }, [fetchGiftsData]);

  useEffect(() => {
    filterAndSortGifts();
    if (analytics && recommendationEngine && allGifts.length > 0) {
      updateRecommendations();
    }
  }, [filter, sortBy, allGifts, analytics, recommendationEngine, filterAndSortGifts, updateRecommendations]);

  useEffect(() => {
    if (filter.search) {
      generateSearchSuggestions(filter.search);
      if (analytics) {
        analytics.trackSearch(filter.search, gifts);
      }
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [filter.search, allGifts, analytics, generateSearchSuggestions, gifts]);

  // Start activity updates only after everything is loaded
  useEffect(() => {
    if (socialProof && allGifts.length > 0) {
      const activityInterval = setInterval(() => {
        socialProof.generateRealtimeActivity(allGifts);
        setActivities([...socialProof.getActivities()]);
      }, 8000);

      return () => clearInterval(activityInterval);
    }
  }, [socialProof, allGifts]);

  const getCategoryIcon = (category) => {
    const icons = {
      jewelry: '💎',
      experiences: '🎭',
      home: '🏠',
      fashion: '👗',
      beauty: '💄',
      tech: '📱',
      unique: '✨'
    };
    return icons[category] || '🎁';
  };

  const handleSearchKeyDown = (e) => {
    if (!showSuggestions || searchSuggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestion(prev =>
          prev < searchSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestion(prev =>
          prev > 0 ? prev - 1 : searchSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestion >= 0) {
          selectSuggestion(searchSuggestions[selectedSuggestion]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestion(-1);
        break;
      default:
        break;
    }
  };

  const selectSuggestion = (suggestion) => {
    if (suggestion.type === 'category' || suggestion.type === 'ai') {
      setFilter(prev => ({ ...prev, category: suggestion.category, search: '' }));
    } else if (suggestion.type === 'gift') {
      setFilter(prev => ({ ...prev, search: suggestion.text }));
    } else {
      setFilter(prev => ({ ...prev, search: suggestion.text }));
    }
    setShowSuggestions(false);
    setSelectedSuggestion(-1);
  };

  const handleGiftClick = (gift) => {
    setSelectedGift(gift);
    if (analytics) {
      analytics.trackGiftView(gift.id, 2000);
      analytics.trackCategoryInterest(gift.category);
      analytics.trackPriceInterest(gift.price);
    }

    // Track gift view for analytics
  };

  const handleQuickFilter = (scenarioId) => {
    const scenario = quickScenarios.find(s => s.id === scenarioId);
    if (scenario) {
      setFilter(prev => ({
        ...prev,
        ...scenario.filter,
        quickFilter: scenarioId
      }));
    }
  };

  const clearFilters = () => {
    setFilter({
      category: '',
      maxPrice: 1000,
      minSuccessRate: 0,
      search: '',
      quickFilter: ''
    });
  };

  const getActiveFilters = () => {
    const activeFilters = [];

    if (filter.category) {
      activeFilters.push({
        key: 'category',
        label: `Category: ${filter.category}`
      });
    }

    if (filter.maxPrice < 1000) {
      activeFilters.push({
        key: 'maxPrice',
        label: `Under $${filter.maxPrice}`
      });
    }

    if (filter.minSuccessRate > 0) {
      activeFilters.push({
        key: 'minSuccessRate',
        label: `${filter.minSuccessRate}%+ Success`
      });
    }

    if (filter.search) {
      activeFilters.push({
        key: 'search',
        label: `Search: ${filter.search}`
      });
    }

    if (filter.quickFilter) {
      const scenario = quickScenarios.find(s => s.id === filter.quickFilter);
      if (scenario) {
        activeFilters.push({
          key: 'quickFilter',
          label: `Occasion: ${scenario.label}`
        });
      }
    }

    return activeFilters;
  };

  const removeFilter = (filterKey) => {
    switch (filterKey) {
      case 'category':
        setFilter(prev => ({ ...prev, category: '' }));
        break;
      case 'maxPrice':
        setFilter(prev => ({ ...prev, maxPrice: 1000 }));
        break;
      case 'minSuccessRate':
        setFilter(prev => ({ ...prev, minSuccessRate: 0 }));
        break;
      case 'search':
        setFilter(prev => ({ ...prev, search: '' }));
        break;
      case 'quickFilter':
        setFilter(prev => ({ ...prev, quickFilter: '' }));
        break;
      default:
        break;
    }
  };

  const loadFavorites = () => {
    const saved = localStorage.getItem('giftgenius_favorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  };

  const saveFavorites = (newFavorites) => {
    localStorage.setItem('giftgenius_favorites', JSON.stringify(newFavorites));
    setFavorites(newFavorites);
  };

  const handleSaveGift = (gift) => {
    const isCurrentlySaved = favorites.some(fav => fav.id === gift.id);

    if (isCurrentlySaved) {
      const newFavorites = favorites.filter(fav => fav.id !== gift.id);
      saveFavorites(newFavorites);
      toast.showInfo('Removed', 'Gift removed from favorites');
    } else {
      const newFavorites = [...favorites, gift];
      saveFavorites(newFavorites);
      toast.showSuccess('Saved', 'Gift added to favorites');
    }
  };

  const isGiftSaved = (gift) => {
    return favorites.some(fav => fav.id === gift.id);
  };

  if (error) {
    return (
      <div className="app-container">
        <div className="container">
          <div className="empty-state">
            <div className="empty-icon">⚠️</div>
            <h2 className="empty-title">Something went wrong</h2>
            <p className="empty-message">{error}</p>
            <button onClick={fetchGiftsData} className="suggestion-chip">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Hero />

      <div className="container">
        {/* Personalization Banner */}
        {analytics && analytics.isReturningUser() && (
          <div className="personalization-banner">
            <div className="personalization-content">
              <span className="personalization-icon">🤖</span>
              <div className="personalization-text">
                <h3>Welcome back!</h3>
                <p>We've found {personalizedGifts.length} personalized recommendations for you</p>
              </div>
              <div className="activity-counter">
                {socialProof ? socialProof.getRecentPurchases() : 0} recent purchases
              </div>
            </div>
          </div>
        )}

        {/* Activity Feed */}
        {activities.length > 0 && (
          <div className="activity-feed">
            {activities.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-avatar">
                  {activity.name.charAt(0)}
                </div>
                <div className="activity-text">
                  <strong>{activity.name}</strong> {activity.action} <em>{activity.gift}</em>
                  {activity.trending && <span className="trending-indicator">TRENDING</span>}
                </div>
                <div className="activity-time">{activity.time}</div>
              </div>
            ))}
          </div>
        )}

        {/* Smart Recommendations */}
        {analytics && analytics.isReturningUser() && (
          <div className="smart-recommendations">
            <h3>🎯 Smart Recommendations</h3>

            {personalizedGifts.length > 0 && (
              <div className="recommendation-section">
                <div className="recommendation-title">
                  💡 Perfect For You
                </div>
                <div className="recommendation-grid">
                  {personalizedGifts.slice(0, 3).map(gift => (
                    <div
                      key={gift.id}
                      className="recommendation-card"
                      onClick={() => handleGiftClick(gift)}
                    >
                      <div className="recommendation-reason">PERSONALIZED</div>
                      <div className="recommendation-name">{gift.name || gift.title}</div>
                      <div className="recommendation-match">
                        Based on your preferences
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {contextualGifts.length > 0 && (
              <div className="recommendation-section">
                <div className="recommendation-title">
                  🌟 Trending Now
                </div>
                <div className="recommendation-grid">
                  {contextualGifts.slice(0, 3).map(gift => (
                    <div
                      key={gift.id}
                      className="recommendation-card"
                      onClick={() => handleGiftClick(gift)}
                    >
                      <div className="recommendation-reason">SEASONAL</div>
                      <div className="recommendation-name">{gift.name || gift.title}</div>
                      <div className="recommendation-match">
                        Perfect for this time of year
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {trendingGifts.length > 0 && (
              <div className="recommendation-section">
                <div className="recommendation-title">
                  🔥 Hot Right Now
                </div>
                <div className="recommendation-grid">
                  {trendingGifts.map(gift => (
                    <div
                      key={gift.id}
                      className="recommendation-card"
                      onClick={() => handleGiftClick(gift)}
                    >
                      <div className="recommendation-reason">TRENDING</div>
                      <div className="recommendation-name">{gift.name || gift.title}</div>
                      <div className="recommendation-match">
                        {gift.successRate || 90}% success rate
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <FilterBar
          filter={filter}
          setFilter={setFilter}
          showSuggestions={showSuggestions}
          setShowSuggestions={setShowSuggestions}
          searchSuggestions={searchSuggestions}
          selectedSuggestion={selectedSuggestion}
          handleSearchKeyDown={handleSearchKeyDown}
          selectSuggestion={selectSuggestion}
          clearFilters={clearFilters}
          getActiveFilters={getActiveFilters}
          removeFilter={removeFilter}
          quickScenarios={quickScenarios}
          handleQuickFilter={handleQuickFilter}
        />

        {loading ? (
          <LoadingSpinner size="large" message="Finding the perfect gifts for you..." />
        ) : error ? (
          <ErrorMessage
            title="Oops! Something went wrong"
            message={error}
            onRetry={fetchGiftsData}
            actionLabel="Reload Gifts"
          />
        ) : (
          <GiftGrid
            gifts={gifts}
            loading={loading}
            onGiftClick={handleGiftClick}
            sortBy={sortBy}
            setSortBy={setSortBy}
            analytics={analytics}
            recommendationEngine={recommendationEngine}
          />
        )}

        {selectedGift && (
          <TestimonialModal
            gift={selectedGift}
            onClose={() => setSelectedGift(null)}
            onSave={handleSaveGift}
            isSaved={isGiftSaved(selectedGift)}
          />
        )}
      </div>
    </div>
  );
}

export default App;
