/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-use-before-define */
import React, { useState, useEffect, useCallback } from 'react';
import Hero from './components/Hero';
import FilterBar from './components/FilterBar';
import GiftGrid from './components/GiftGrid';
import TestimonialModal from './components/TestimonialModal';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import ResultsSummary from './components/ResultsSummary';
import { MobileGiftWizard } from './components/MobileWizard';
import { CameraScanner, QuickScanButton } from './components/CameraIntegration';
import { TouchButton, PullToRefresh } from './components/TouchGestures';
import { ShareModal, SocialProofTicker, ReferralWidget } from './components/SocialSharing';
import { CollaborativeGiftList } from './components/GiftListCollaboration';
import { ViralChallengeCard, ChallengeLeaderboard, AchievementGallery, GamificationProgress } from './components/ViralChallenges';
import {
  PremiumSubscriptionManager,
  SubscriptionUpgradeModal,
  PremiumFeatureGate,
  PersonalGiftConcierge,
  PremiumAnalyticsDashboard
} from './components/PremiumFeatures';
import {
  GiftReminderManager,
  GiftReminderDashboard,
  ReminderNotifications
} from './components/GiftReminders';
import {
  CorporateGiftingManager,
  CorporateGiftingDashboard
} from './components/CorporateGifting';
import { getGifts, getGifts as getGiftsWithFallback } from './api/gifts';
import { UserAnalytics, RecommendationEngine, SocialProofManager } from './utils/analytics';
import { offlineManager, saveOffline } from './utils/offlineSync';
import { useToast } from './utils/toast';
import './styles/App.css';
import './styles/EnhancedUX.css';
import './styles/ComponentEnhancements.css';
import './styles/MobileExcellence.css';
import './styles/SocialViral.css';
import './styles/PremiumFeatures.css';

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

  // Level 4: Mobile Excellence states
  const [showMobileWizard, setShowMobileWizard] = useState(false);
  const [showCameraScanner, setShowCameraScanner] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Level 5: Social & Viral states
  const [showSocialSharing, setShowSocialSharing] = useState(false);
  const [showCollaboration, setShowCollaboration] = useState(false);
  const [showChallenges, setShowChallenges] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [shareData, setShareData] = useState(null);

  // Level 6: Premium Features states
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showReminders, setShowReminders] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showConcierge, setShowConcierge] = useState(false);
  const [showCorporate, setShowCorporate] = useState(false);
  const [subscriptionManager, setSubscriptionManager] = useState(null);
  const [reminderManager, setReminderManager] = useState(null);
  const [corporateManager, setCorporateManager] = useState(null);

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
    occasion: '',
    relationship: '',
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

  // Mobile functionality handlers
  const handlePullToRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchGiftsData();
      // Track offline data
      if (analytics) {
        await saveOffline.analytics('pull-to-refresh', { timestamp: Date.now() });
      }
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCameraScan = (analysisResult, imageData) => {
    // Process camera scan results
    if (analysisResult && analysisResult.recommendations) {
      const scannedGifts = analysisResult.recommendations.map(rec => ({
        id: `scanned_${Date.now()}_${Math.random()}`,
        name: rec.name,
        price: rec.price,
        match_score: rec.match,
        image_url: null,
        category: analysisResult.category || 'scanned'
      }));

      // Update gifts with scanned results at the top
      setGifts(prev => [...scannedGifts, ...prev]);

      // Track the scan
      if (analytics) {
        saveOffline.analytics('camera-scan', {
          category: analysisResult.category,
          confidence: analysisResult.confidence,
          itemsFound: scannedGifts.length
        });
      }

      toast.showSuccess('📸 Scan Complete', `Found ${scannedGifts.length} similar gifts!`);
    }
    setShowCameraScanner(false);
  };

  const handleWizardComplete = (recommendations, wizardData) => {
    // Process wizard results
    if (recommendations && recommendations.length > 0) {
      setGifts(recommendations);

      // Save wizard data offline
      saveOffline.wizard(Date.now().toString(), wizardData, true);

      // Track wizard completion
      if (analytics) {
        saveOffline.analytics('wizard-complete', {
          recommendationsCount: recommendations.length,
          averageMatch: recommendations.reduce((sum, r) => sum + r.match_score, 0) / recommendations.length
        });
      }

      toast.showSuccess('🎯 Wizard Complete', `Found ${recommendations.length} perfect matches!`);
    }
    setShowMobileWizard(false);
  };

  // Level 5: Social & Viral handlers
  const handleSocialShare = (gift) => {
    setShareData({
      gift,
      url: window.location.href,
      title: `Check out this amazing gift: ${gift.name || gift.title}`,
      description: `I found the perfect gift on GiftGenius! ${gift.name || gift.title} for just $${gift.price}`,
      image: gift.image_url || gift.imageUrl
    });
    setShowSocialSharing(true);
  };

  const handleCollaborationRequest = (gift) => {
    setShareData({ gift, mode: 'collaborate' });
    setShowCollaboration(true);
  };

  const handleChallengeAction = (action, data) => {
    if (analytics) {
      analytics.trackChallengeInteraction(action, data);
      saveOffline.analytics('challenge-action', { action, ...data });
    }

    switch (action) {
      case 'complete':
        toast.showSuccess('🏆 Challenge Complete!', `You earned ${data.reward} points!`);
        break;
      case 'share':
        handleSocialShare(data);
        break;
      case 'join':
        setShowChallenges(true);
        break;
      default:
        break;
    }
  };

  // Initialize offline manager
  useEffect(() => {
    offlineManager.init?.();
  }, []);

  // Save search queries offline
  const handleSearchOffline = useCallback((query) => {
    if (query) {
      saveOffline.search(query, filter);
    }
  }, [filter]);

  // Function definitions before use
  const fetchGiftsData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('🎁 Fetching gifts from API with fallback...');
      const data = await getGiftsWithFallback();
      const giftList = data.gifts || data || [];
      console.log('✅ API Response:', giftList.length, 'gifts loaded');

      setAllGifts(giftList);
      setGifts(giftList);
    } catch (err) {
      console.error('❌ Failed to fetch gifts:', err);
      setError(err.message);
      toast.showError('⚠️ Connection Issue', 'Using sample data instead');
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

    if (filter.occasion) {
      filtered = filtered.filter(gift => gift.occasion === filter.occasion);
    }

    if (filter.relationship) {
      filtered = filtered.filter(gift => gift.relationship_stage === filter.relationship);
    }

    if (filter.search) {
      const searchTerm = filter.search.toLowerCase();
      filtered = filtered.filter(gift =>
        (gift.name || gift.title || '').toLowerCase().includes(searchTerm) ||
        (gift.category || '').toLowerCase().includes(searchTerm) ||
        (gift.description || '').toLowerCase().includes(searchTerm) ||
        (gift.occasion || '').toLowerCase().includes(searchTerm) ||
        (gift.retailer || '').toLowerCase().includes(searchTerm)
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
      case 'success':
        filtered = filtered.sort((a, b) => (b.successRate || b.success_rate || 0) - (a.successRate || a.success_rate || 0));
        break;
      case 'reviews':
        filtered = filtered.sort((a, b) => (b.totalReviews || b.total_reviews || 0) - (a.totalReviews || a.total_reviews || 0));
        break;
      case 'newest':
        filtered = filtered.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        break;
      case 'relevance':
      default:
        // Keep original order for relevance
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

  // Initialize premium managers
  useEffect(() => {
    if (!subscriptionManager) {
      const subscriptionInstance = new PremiumSubscriptionManager();
      const reminderInstance = new GiftReminderManager();
      const corporateInstance = new CorporateGiftingManager();

      setSubscriptionManager(subscriptionInstance);
      setReminderManager(reminderInstance);
      setCorporateManager(corporateInstance);
    }
  }, [subscriptionManager]);

  useEffect(() => {
    console.log('🚀 App useEffect: Starting initial data load');
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
      // Track search offline
      handleSearchOffline(filter.search);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [filter.search, allGifts, analytics, generateSearchSuggestions, gifts, handleSearchOffline]);

  // Start activity updates only after everything is loaded
  useEffect(() => {
    if (socialProof && allGifts.length > 0) {
      // Generate initial activities but don't auto-update
      socialProof.generateRealtimeActivity(allGifts);
      setActivities([...socialProof.getActivities()]);

      // Uncomment below for real-time updates (currently disabled for better UX)
      // const activityInterval = setInterval(() => {
      //   socialProof.generateRealtimeActivity(allGifts);
      //   setActivities([...socialProof.getActivities()]);
      // }, 30000); // 30 seconds instead of 8
      // return () => clearInterval(activityInterval);
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
      occasion: '',
      relationship: '',
      maxPrice: 1000,
      minAge: '',
      maxAge: '',
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

    if (filter.occasion) {
      activeFilters.push({
        key: 'occasion',
        label: `Occasion: ${filter.occasion}`
      });
    }

    if (filter.relationship) {
      activeFilters.push({
        key: 'relationship',
        label: `Relationship: ${filter.relationship}`
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
      case 'occasion':
        setFilter(prev => ({ ...prev, occasion: '' }));
        break;
      case 'relationship':
        setFilter(prev => ({ ...prev, relationship: '' }));
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
      toast.showInfo('💔 Removed', 'Removed from favorites');
    } else {
      const newFavorites = [...favorites, gift];
      saveFavorites(newFavorites);
      toast.showSuccess('💝 Saved', 'Added to favorites');
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

      {/* Mobile Action Buttons */}
      <div className="mobile-actions">
        <TouchButton
          variant="primary"
          onClick={() => setShowMobileWizard(true)}
          className="mobile-wizard-btn"
        >
          🧙‍♂️ Gift Wizard
        </TouchButton>

        <QuickScanButton
          onScanStart={() => setShowCameraScanner(true)}
          className="mobile-scan-btn"
        />

        <TouchButton
          variant="secondary"
          onClick={() => setShowChallenges(true)}
          className="challenge-btn"
        >
          🏆 Challenges
        </TouchButton>

        <TouchButton
          variant="tertiary"
          onClick={() => setShowCollaboration(true)}
          className="collab-btn"
        >
          👥 Collaborate
        </TouchButton>

        <TouchButton
          variant="premium"
          onClick={() => setShowUpgradeModal(true)}
          className="premium-btn"
        >
          👑 Go Pro
        </TouchButton>
      </div>

      <PullToRefresh
        onRefresh={handlePullToRefresh}
        className="main-content"
      >
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
                {socialProof && typeof socialProof.getRecentPurchases === 'function'
                  ? `${socialProof.getRecentPurchases().length} recent purchases`
                  : 'Recent activity available'
                }
              </div>
            </div>
          </div>
        )}

        {/* Activity Feed */}
        {activities.length > 0 && (
          <div className="activity-feed">
            {activities.slice(0, 3).map(activity => (
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
          <>
            <ResultsSummary
              giftsCount={gifts.length}
              totalGifts={allGifts.length}
              sortBy={sortBy}
              setSortBy={setSortBy}
              isFiltered={gifts.length !== allGifts.length}
              searchQuery={filter.search}
            />
            <GiftGrid
              gifts={gifts}
              loading={loading}
              onGiftClick={handleGiftClick}
              sortBy={sortBy}
              setSortBy={setSortBy}
              analytics={analytics}
              recommendationEngine={recommendationEngine}
              onShare={handleSocialShare}
              onCollaborate={handleCollaborationRequest}
            />
          </>
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
      </PullToRefresh>

      {/* Mobile Wizard Modal */}
      {showMobileWizard && (
        <MobileGiftWizard
          onComplete={handleWizardComplete}
          onClose={() => setShowMobileWizard(false)}
        />
      )}

      {/* Camera Scanner Modal */}
      {showCameraScanner && (
        <CameraScanner
          onAnalysis={handleCameraScan}
          onClose={() => setShowCameraScanner(false)}
          facingMode="environment"
        />
      )}

      {/* Level 5: Social & Viral Modals */}
      {showSocialSharing && shareData && (
        <ShareModal
          gift={shareData.gift}
          isOpen={showSocialSharing}
          onClose={() => {
            setShowSocialSharing(false);
            setShareData(null);
          }}
          onShare={(platform) => {
            if (analytics) {
              analytics.trackSocialShare && analytics.trackSocialShare(platform, shareData.gift);
              saveOffline.analytics('social-share', { platform, gift: shareData.gift.id });
            }
            toast.showSuccess('📤 Shared!', `Shared to ${platform}`);
          }}
        />
      )}

      {showCollaboration && (
        <CollaborativeGiftList
          onClose={() => {
            setShowCollaboration(false);
            setShareData(null);
          }}
        />
      )}

      {showChallenges && (
        <div className="challenge-modal-overlay">
          <div className="challenge-modal">
            <div className="challenge-header">
              <h2>🏆 Challenges</h2>
              <button
                className="close-btn"
                onClick={() => setShowChallenges(false)}
              >
                ✕
              </button>
            </div>
            <ChallengeLeaderboard currentUserId="user123" />
          </div>
        </div>
      )}

      {showAchievements && (
        <div className="achievement-modal-overlay">
          <div className="achievement-modal">
            <div className="achievement-header">
              <h2>🏆 Achievements</h2>
              <button
                className="close-btn"
                onClick={() => setShowAchievements(false)}
              >
                ✕
              </button>
            </div>
            <AchievementGallery userId="user123" />
          </div>
        </div>
      )}

      {/* Social Proof Ticker */}
      {activities.length > 0 && (
        <SocialProofTicker activities={activities.slice(0, 5)} />
      )}

      {/* Floating Achievement Indicator */}
      {analytics && (
        <div
          className="floating-achievement-btn"
          onClick={() => setShowAchievements(true)}
        >
          🏆
          <span className="achievement-count">3</span>
        </div>
      )}

      {/* Gamification Progress */}
      <GamificationProgress userId="user123" />

      {/* Level 6: Premium Features Modals */}
      {subscriptionManager && (
        <>
          {showUpgradeModal && (
            <SubscriptionUpgradeModal
              isOpen={showUpgradeModal}
              onClose={() => setShowUpgradeModal(false)}
              currentTier={subscriptionManager.getCurrentTier()}
              onUpgrade={(tier, period) => {
                subscriptionManager.upgradeTo(tier);
                toast.showSuccess('🎉 Upgraded!', `Welcome to GiftGenius ${tier === 'pro' ? 'Pro' : 'Concierge'}!`);
                setShowUpgradeModal(false);
              }}
            />
          )}

          {showAnalytics && subscriptionManager.hasFeature('analytics') && (
            <div className="premium-modal-overlay">
              <div className="premium-modal">
                <div className="premium-modal-header">
                  <h2>📊 Your Analytics</h2>
                  <button
                    className="close-btn"
                    onClick={() => setShowAnalytics(false)}
                  >
                    ✕
                  </button>
                </div>
                <PremiumAnalyticsDashboard subscriptionManager={subscriptionManager} />
              </div>
            </div>
          )}

          {showConcierge && subscriptionManager.hasFeature('conciergeAccess') && (
            <div className="premium-modal-overlay">
              <div className="premium-modal">
                <div className="premium-modal-header">
                  <h2>🎩 Personal Concierge</h2>
                  <button
                    className="close-btn"
                    onClick={() => setShowConcierge(false)}
                  >
                    ✕
                  </button>
                </div>
                <PersonalGiftConcierge subscriptionManager={subscriptionManager} />
              </div>
            </div>
          )}

          {showReminders && reminderManager && (
            <div className="premium-modal-overlay">
              <div className="premium-modal">
                <div className="premium-modal-header">
                  <h2>🗓️ Gift Reminders</h2>
                  <button
                    className="close-btn"
                    onClick={() => setShowReminders(false)}
                  >
                    ✕
                  </button>
                </div>
                <GiftReminderDashboard
                  reminderManager={reminderManager}
                  onGiftSearch={(params) => {
                    setFilter(prev => ({
                      ...prev,
                      search: params.occasion,
                      category: params.suggestions[0] || ''
                    }));
                    setShowReminders(false);
                    toast.showInfo('🎯 Search Updated', 'Showing gifts for ' + params.occasion);
                  }}
                />
              </div>
            </div>
          )}

          {showCorporate && corporateManager && (
            <div className="premium-modal-overlay">
              <div className="premium-modal">
                <div className="premium-modal-header">
                  <h2>🏢 Corporate Gifting</h2>
                  <button
                    className="close-btn"
                    onClick={() => setShowCorporate(false)}
                  >
                    ✕
                  </button>
                </div>
                <CorporateGiftingDashboard
                  corporateManager={corporateManager}
                  onCreateOrder={(orderData) => {
                    corporateManager.createBulkOrder(orderData);
                    toast.showSuccess('📦 Order Submitted!', 'You\'ll receive a quote within 2 hours');
                  }}
                />
              </div>
            </div>
          )}

          {/* Premium Feature Gates */}
          <PremiumFeatureGate
            feature="advancedFilters"
            subscriptionManager={subscriptionManager}
            onUpgradePrompt={() => setShowUpgradeModal(true)}
          >
            {/* Advanced filters would go here when user has access */}
          </PremiumFeatureGate>

          {/* Reminder Notifications */}
          {reminderManager && (
            <ReminderNotifications
              reminderManager={reminderManager}
              onDismiss={(id) => {
                // Handle dismissal
              }}
              onAction={(reminder) => {
                setFilter(prev => ({
                  ...prev,
                  search: reminder.occasion.toLowerCase(),
                  quickFilter: reminder.occasion.toLowerCase()
                }));
                toast.showInfo('🎯 Search Started', `Looking for ${reminder.occasion} gifts`);
              }}
            />
          )}

          {/* Premium Access Menu */}
          {subscriptionManager.getCurrentTier() !== 'free' && (
            <div className="premium-access-menu">
              <button
                className="premium-menu-btn"
                onClick={() => setShowAnalytics(true)}
                title="View Analytics"
              >
                📊
              </button>
              <button
                className="premium-menu-btn"
                onClick={() => setShowReminders(true)}
                title="Gift Reminders"
              >
                🗓️
              </button>
              {subscriptionManager.getCurrentTier() === 'concierge' && (
                <button
                  className="premium-menu-btn"
                  onClick={() => setShowConcierge(true)}
                  title="Personal Concierge"
                >
                  🎩
                </button>
              )}
              <button
                className="premium-menu-btn"
                onClick={() => setShowCorporate(true)}
                title="Corporate Gifting"
              >
                🏢
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
