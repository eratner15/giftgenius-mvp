// Advanced User Behavior Analytics System
export class BehaviorAnalyticsEngine {
  constructor() {
    this.sessionData = this.initializeSession();
    this.userProfile = this.loadUserProfile();
    this.eventQueue = [];
    this.patterns = new Map();
    this.startTime = Date.now();
  }

  initializeSession() {
    return {
      sessionId: this.generateSessionId(),
      startTime: Date.now(),
      pageViews: 0,
      interactions: 0,
      searchCount: 0,
      giftViews: new Set(),
      filterUsage: {},
      scrollDepth: 0,
      timeSpent: 0,
      deviceInfo: this.getDeviceInfo()
    };
  }

  generateSessionId() {
    return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  getDeviceInfo() {
    return {
      userAgent: navigator.userAgent,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio || 1,
      touchSupported: 'ontouchstart' in window,
      language: navigator.language,
      platform: navigator.platform,
      connectionType: navigator.connection?.effectiveType || 'unknown'
    };
  }

  loadUserProfile() {
    const saved = localStorage.getItem('giftgenius_user_profile');
    return saved ? JSON.parse(saved) : {
      userId: this.generateUserId(),
      createdAt: Date.now(),
      totalSessions: 0,
      totalTimeSpent: 0,
      favoriteCategories: {},
      pricePreferences: {},
      searchPatterns: [],
      giftInteractions: {},
      behaviorScore: {
        explorer: 0,    // Browses many categories/items
        decisive: 0,    // Quick decision making
        researcher: 0,  // Reads testimonials, compares
        social: 0,      // Influenced by social proof
        seasonal: 0     // Shops for occasions
      },
      conversionFunnel: {
        visits: 0,
        searches: 0,
        giftViews: 0,
        comparisons: 0,
        favorites: 0,
        clicks: 0
      }
    };
  }

  generateUserId() {
    return 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  saveUserProfile() {
    localStorage.setItem('giftgenius_user_profile', JSON.stringify(this.userProfile));
  }

  // Event Tracking Methods
  trackEvent(eventType, data = {}) {
    const event = {
      type: eventType,
      timestamp: Date.now(),
      sessionId: this.sessionData.sessionId,
      userId: this.userProfile.userId,
      data: {
        ...data,
        url: window.location.pathname,
        referrer: document.referrer,
        timeOnPage: this.getTimeOnPage()
      }
    };

    this.eventQueue.push(event);
    this.processEvent(event);

    // Batch send events every 10 events or 30 seconds
    if (this.eventQueue.length >= 10) {
      this.sendEvents();
    }
  }

  processEvent(event) {
    switch (event.type) {
      case 'page_view':
        this.handlePageView(event);
        break;
      case 'gift_view':
        this.handleGiftView(event);
        break;
      case 'search':
        this.handleSearch(event);
        break;
      case 'filter_use':
        this.handleFilterUse(event);
        break;
      case 'gift_click':
        this.handleGiftClick(event);
        break;
      case 'testimonial_read':
        this.handleTestimonialRead(event);
        break;
      case 'comparison_add':
        this.handleComparisonAdd(event);
        break;
      case 'scroll_milestone':
        this.handleScrollMilestone(event);
        break;
    }

    this.updateBehaviorScores(event);
    this.detectPatterns(event);
  }

  handlePageView(event) {
    this.sessionData.pageViews++;
    this.userProfile.conversionFunnel.visits++;
  }

  handleGiftView(event) {
    const giftId = event.data.giftId;
    this.sessionData.giftViews.add(giftId);

    if (!this.userProfile.giftInteractions[giftId]) {
      this.userProfile.giftInteractions[giftId] = {
        views: 0,
        timeSpent: 0,
        interactions: []
      };
    }

    this.userProfile.giftInteractions[giftId].views++;
    this.userProfile.giftInteractions[giftId].interactions.push({
      type: 'view',
      timestamp: Date.now()
    });

    this.userProfile.conversionFunnel.giftViews++;

    // Track category interest
    if (event.data.category) {
      this.userProfile.favoriteCategories[event.data.category] =
        (this.userProfile.favoriteCategories[event.data.category] || 0) + 1;
    }

    // Track price interest
    if (event.data.price) {
      const priceRange = this.getPriceRange(event.data.price);
      this.userProfile.pricePreferences[priceRange] =
        (this.userProfile.pricePreferences[priceRange] || 0) + 1;
    }
  }

  handleSearch(event) {
    this.sessionData.searchCount++;
    this.userProfile.conversionFunnel.searches++;

    this.userProfile.searchPatterns.push({
      query: event.data.query,
      resultsCount: event.data.resultsCount,
      timestamp: Date.now()
    });

    // Keep only recent searches
    if (this.userProfile.searchPatterns.length > 50) {
      this.userProfile.searchPatterns = this.userProfile.searchPatterns.slice(-50);
    }
  }

  handleFilterUse(event) {
    const filterType = event.data.filterType;
    this.sessionData.filterUsage[filterType] =
      (this.sessionData.filterUsage[filterType] || 0) + 1;
  }

  handleGiftClick(event) {
    this.userProfile.conversionFunnel.clicks++;

    if (event.data.giftId) {
      const giftId = event.data.giftId;
      if (this.userProfile.giftInteractions[giftId]) {
        this.userProfile.giftInteractions[giftId].interactions.push({
          type: 'click',
          timestamp: Date.now()
        });
      }
    }
  }

  handleTestimonialRead(event) {
    // Track time spent reading testimonials
    if (event.data.giftId) {
      const giftId = event.data.giftId;
      if (this.userProfile.giftInteractions[giftId]) {
        this.userProfile.giftInteractions[giftId].interactions.push({
          type: 'testimonial_read',
          duration: event.data.duration,
          timestamp: Date.now()
        });
      }
    }
  }

  handleComparisonAdd(event) {
    this.userProfile.conversionFunnel.comparisons++;
  }

  handleScrollMilestone(event) {
    this.sessionData.scrollDepth = Math.max(
      this.sessionData.scrollDepth,
      event.data.percentage
    );
  }

  // Behavior Score Updates
  updateBehaviorScores(event) {
    switch (event.type) {
      case 'gift_view':
        // Multiple gift views = explorer behavior
        if (this.sessionData.giftViews.size > 5) {
          this.userProfile.behaviorScore.explorer += 0.1;
        }
        break;

      case 'gift_click':
        // Quick clicks after viewing = decisive behavior
        const viewTime = event.data.viewDuration || 0;
        if (viewTime < 5000) { // Less than 5 seconds
          this.userProfile.behaviorScore.decisive += 0.2;
        }
        break;

      case 'testimonial_read':
        // Reading testimonials = researcher behavior
        this.userProfile.behaviorScore.researcher += 0.3;
        break;

      case 'search':
        // Multiple searches with refinement = researcher behavior
        if (this.sessionData.searchCount > 2) {
          this.userProfile.behaviorScore.researcher += 0.1;
        }
        break;

      case 'filter_use':
        // Using occasion filters = seasonal behavior
        if (event.data.filterType === 'occasion') {
          this.userProfile.behaviorScore.seasonal += 0.2;
        }
        break;
    }

    // Normalize scores to 0-100 range
    Object.keys(this.userProfile.behaviorScore).forEach(key => {
      this.userProfile.behaviorScore[key] = Math.min(100,
        Math.max(0, this.userProfile.behaviorScore[key] * 10)
      );
    });
  }

  // Pattern Detection
  detectPatterns(event) {
    const eventType = event.type;
    const timestamp = event.timestamp;

    // Detect rapid browsing patterns
    if (eventType === 'gift_view') {
      this.detectRapidBrowsing(timestamp);
    }

    // Detect comparison shopping patterns
    if (eventType === 'gift_view' || eventType === 'comparison_add') {
      this.detectComparisonShopping();
    }

    // Detect abandonment patterns
    this.detectAbandonmentRisk(timestamp);

    // Detect seasonal patterns
    if (event.data.category || event.data.occasion) {
      this.detectSeasonalBehavior(event);
    }
  }

  detectRapidBrowsing(timestamp) {
    const recentViews = this.eventQueue
      .filter(e => e.type === 'gift_view' && timestamp - e.timestamp < 60000)
      .length;

    if (recentViews > 10) {
      this.patterns.set('rapid_browsing', {
        detected: true,
        intensity: recentViews / 10,
        lastDetected: timestamp
      });
    }
  }

  detectComparisonShopping() {
    const comparisonEvents = this.userProfile.conversionFunnel.comparisons;
    const giftViews = this.userProfile.conversionFunnel.giftViews;

    if (giftViews > 0 && comparisonEvents / giftViews > 0.3) {
      this.patterns.set('comparison_shopper', {
        detected: true,
        intensity: comparisonEvents / giftViews,
        lastDetected: Date.now()
      });
    }
  }

  detectAbandonmentRisk(timestamp) {
    const timeSpent = timestamp - this.sessionData.startTime;
    const interactions = this.sessionData.interactions;

    // High time spent with low interactions suggests confusion/difficulty
    if (timeSpent > 300000 && interactions < 5) { // 5 minutes, few interactions
      this.patterns.set('abandonment_risk', {
        detected: true,
        intensity: 0.8,
        reason: 'low_engagement',
        lastDetected: timestamp
      });
    }

    // Many searches with no gift clicks suggests difficulty finding
    if (this.sessionData.searchCount > 3 && this.userProfile.conversionFunnel.clicks === 0) {
      this.patterns.set('abandonment_risk', {
        detected: true,
        intensity: 0.6,
        reason: 'search_frustration',
        lastDetected: timestamp
      });
    }
  }

  detectSeasonalBehavior(event) {
    const month = new Date().getMonth();
    const seasonalOccasions = {
      0: 'new-year', 1: 'valentine', 2: 'easter', 3: 'easter',
      4: 'mothers-day', 5: 'graduation', 6: 'summer', 7: 'summer',
      8: 'back-to-school', 9: 'halloween', 10: 'thanksgiving', 11: 'christmas'
    };

    const currentSeason = seasonalOccasions[month];

    if (event.data.occasion === currentSeason ||
        (event.data.category && this.isSeasonalCategory(event.data.category, currentSeason))) {

      this.patterns.set('seasonal_shopper', {
        detected: true,
        season: currentSeason,
        intensity: 0.7,
        lastDetected: Date.now()
      });
    }
  }

  isSeasonalCategory(category, season) {
    const seasonalCategories = {
      'valentine': ['jewelry', 'fashion', 'experiences'],
      'christmas': ['jewelry', 'tech', 'home', 'experiences'],
      'mothers-day': ['jewelry', 'beauty', 'fashion', 'experiences'],
      'graduation': ['tech', 'jewelry', 'experiences']
    };

    return seasonalCategories[season]?.includes(category) || false;
  }

  // Utility Methods
  getPriceRange(price) {
    if (price < 25) return 'under-25';
    if (price < 50) return '25-50';
    if (price < 100) return '50-100';
    if (price < 200) return '100-200';
    if (price < 500) return '200-500';
    return 'over-500';
  }

  getTimeOnPage() {
    return Date.now() - this.startTime;
  }

  // Analytics Insights
  generateInsights() {
    const insights = {
      userType: this.getUserType(),
      conversionProbability: this.calculateConversionProbability(),
      recommendedActions: this.getRecommendedActions(),
      patterns: Array.from(this.patterns.entries()),
      sessionSummary: this.getSessionSummary(),
      personalizations: this.getPersonalizationRecommendations()
    };

    return insights;
  }

  getUserType() {
    const scores = this.userProfile.behaviorScore;
    const maxScore = Math.max(...Object.values(scores));

    if (maxScore < 20) return 'new_user';

    const dominantBehavior = Object.entries(scores)
      .find(([_, score]) => score === maxScore)?.[0];

    return dominantBehavior || 'casual_browser';
  }

  calculateConversionProbability() {
    const funnel = this.userProfile.conversionFunnel;
    let probability = 0;

    // Base probability from funnel progression
    if (funnel.visits > 0) probability += 0.1;
    if (funnel.searches > 0) probability += 0.15;
    if (funnel.giftViews > 0) probability += 0.2;
    if (funnel.comparisons > 0) probability += 0.25;
    if (funnel.favorites > 0) probability += 0.15;

    // Behavior score multiplier
    const researcherScore = this.userProfile.behaviorScore.researcher / 100;
    const decisiveScore = this.userProfile.behaviorScore.decisive / 100;
    probability *= (1 + (researcherScore * 0.3) + (decisiveScore * 0.5));

    // Pattern adjustments
    if (this.patterns.has('abandonment_risk')) {
      probability *= 0.3;
    }
    if (this.patterns.has('comparison_shopper')) {
      probability *= 1.4;
    }

    return Math.min(1, Math.max(0, probability));
  }

  getRecommendedActions() {
    const actions = [];
    const userType = this.getUserType();
    const patterns = this.patterns;

    if (userType === 'new_user') {
      actions.push({
        type: 'show_popular_gifts',
        priority: 'high',
        message: 'Show trending gifts to build confidence'
      });
    }

    if (patterns.has('abandonment_risk')) {
      const risk = patterns.get('abandonment_risk');
      if (risk.reason === 'search_frustration') {
        actions.push({
          type: 'offer_help',
          priority: 'critical',
          message: 'Offer search assistance or guided recommendations'
        });
      }
    }

    if (patterns.has('comparison_shopper')) {
      actions.push({
        type: 'show_comparison_tool',
        priority: 'medium',
        message: 'Highlight comparison features'
      });
    }

    if (this.userProfile.behaviorScore.researcher > 60) {
      actions.push({
        type: 'show_detailed_info',
        priority: 'medium',
        message: 'Emphasize testimonials and detailed descriptions'
      });
    }

    return actions;
  }

  getSessionSummary() {
    return {
      duration: Date.now() - this.sessionData.startTime,
      pageViews: this.sessionData.pageViews,
      giftViews: this.sessionData.giftViews.size,
      searches: this.sessionData.searchCount,
      interactions: this.sessionData.interactions,
      scrollDepth: this.sessionData.scrollDepth,
      deviceType: this.sessionData.deviceInfo.touchSupported ? 'mobile' : 'desktop'
    };
  }

  getPersonalizationRecommendations() {
    const recommendations = [];

    // Category personalization
    const topCategories = Object.entries(this.userProfile.favoriteCategories)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category]) => category);

    if (topCategories.length > 0) {
      recommendations.push({
        type: 'preferred_categories',
        data: topCategories,
        weight: 0.3
      });
    }

    // Price personalization
    const topPriceRanges = Object.entries(this.userProfile.pricePreferences)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([range]) => range);

    if (topPriceRanges.length > 0) {
      recommendations.push({
        type: 'preferred_price_ranges',
        data: topPriceRanges,
        weight: 0.25
      });
    }

    // Behavioral personalization
    const userType = this.getUserType();
    recommendations.push({
      type: 'user_behavior_type',
      data: userType,
      weight: 0.2
    });

    return recommendations;
  }

  // Event batching and sending
  sendEvents() {
    if (this.eventQueue.length === 0) return;

    // In a real implementation, this would send to your analytics service
    console.log('📊 Sending analytics events:', this.eventQueue);

    // Clear the queue
    this.eventQueue = [];

    // Save user profile
    this.saveUserProfile();
  }

  // Cleanup and session end
  endSession() {
    this.trackEvent('session_end', {
      duration: Date.now() - this.sessionData.startTime,
      pageViews: this.sessionData.pageViews,
      interactions: this.sessionData.interactions
    });

    this.sendEvents();
    this.saveUserProfile();
  }
}

// Auto-initialize and export
export const behaviorAnalytics = new BehaviorAnalyticsEngine();

// Auto-track common events
if (typeof window !== 'undefined') {
  // Track page visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      behaviorAnalytics.endSession();
    }
  });

  // Track before page unload
  window.addEventListener('beforeunload', () => {
    behaviorAnalytics.endSession();
  });

  // Track scroll milestones
  let scrollMilestones = [25, 50, 75, 90];
  window.addEventListener('scroll', () => {
    const scrollPercentage = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;

    scrollMilestones = scrollMilestones.filter(milestone => {
      if (scrollPercentage >= milestone) {
        behaviorAnalytics.trackEvent('scroll_milestone', { percentage: milestone });
        return false; // Remove this milestone
      }
      return true;
    });
  });

  // Start session tracking
  behaviorAnalytics.trackEvent('session_start');
}