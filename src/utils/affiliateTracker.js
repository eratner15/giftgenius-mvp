// Advanced Affiliate Marketing & Lead Generation Tracking System

class AffiliateTracker {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.userId = this.getUserId();
    this.startTime = Date.now();
    this.interactions = [];
    this.leadScore = 0;
    this.conversionProbability = 0;
  }

  // Generate unique session ID
  generateSessionId() {
    return 'sess_' + Math.random().toString(36).substr(2, 16) + Date.now();
  }

  // Get or create user ID
  getUserId() {
    let userId = localStorage.getItem('giftgenius_user_id');
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substr(2, 16);
      localStorage.setItem('giftgenius_user_id', userId);
    }
    return userId;
  }

  // Track user interactions for lead scoring
  trackInteraction(type, data = {}) {
    const interaction = {
      type,
      timestamp: Date.now(),
      sessionTime: Date.now() - this.startTime,
      data,
      url: window.location.href,
      referrer: document.referrer
    };

    this.interactions.push(interaction);
    this.updateLeadScore(type, data);
    this.calculateConversionProbability();

    // Store in localStorage for persistence
    this.saveToStorage();

    // Send to analytics
    this.sendToAnalytics(interaction);

    return interaction;
  }

  // Advanced lead scoring algorithm
  updateLeadScore(type, data) {
    const scoreMap = {
      'page_view': 1,
      'quiz_started': 5,
      'quiz_completed': 15,
      'gift_clicked': 8,
      'gift_favorited': 12,
      'affiliate_link_clicked': 25,
      'email_captured': 30,
      'return_visit': 10,
      'deep_engagement': 20, // 3+ minutes on page
      'search_performed': 7,
      'filter_applied': 6,
      'social_share': 15,
      'price_comparison': 18,
      'reviews_read': 10
    };

    const baseScore = scoreMap[type] || 0;
    let multiplier = 1;

    // Apply multipliers based on context
    if (data.priceRange === 'over-100') multiplier += 0.3;
    if (data.occasion === 'anniversary' || data.occasion === 'wedding') multiplier += 0.2;
    if (this.getTimeOnPage() > 180000) multiplier += 0.4; // 3+ minutes
    if (this.interactions.filter(i => i.type === 'return_visit').length > 2) multiplier += 0.5;

    this.leadScore += Math.round(baseScore * multiplier);
  }

  // Calculate conversion probability using machine learning-like scoring
  calculateConversionProbability() {
    const factors = {
      leadScore: Math.min(this.leadScore / 100, 1) * 0.3,
      timeOnSite: Math.min(this.getTimeOnPage() / 300000, 1) * 0.2, // 5 minutes max
      interactionDepth: Math.min(this.interactions.length / 20, 1) * 0.2,
      quizCompleted: this.interactions.some(i => i.type === 'quiz_completed') ? 0.15 : 0,
      returnVisitor: this.isReturningUser() ? 0.15 : 0
    };

    this.conversionProbability = Math.min(
      Object.values(factors).reduce((sum, factor) => sum + factor, 0),
      0.95
    );
  }

  // Track affiliate link clicks with advanced attribution
  trackAffiliateClick(giftId, affiliateData = {}) {
    const clickData = {
      giftId,
      source: this.getTrafficSource(),
      landingPage: this.getLandingPage(),
      sessionDuration: this.getTimeOnPage(),
      leadScore: this.leadScore,
      conversionProbability: this.conversionProbability,
      userSegment: this.getUserSegment(),
      ...affiliateData
    };

    // Track the click
    this.trackInteraction('affiliate_link_clicked', clickData);

    // Set conversion attribution cookie
    this.setConversionCookie(giftId, clickData);

    // Fire Google Analytics enhanced ecommerce event
    if (window.gtag) {
      window.gtag('event', 'select_item', {
        item_list_id: clickData.category || 'general',
        item_list_name: clickData.categoryName || 'Gift Recommendations',
        items: [{
          item_id: giftId,
          item_name: clickData.title,
          item_category: clickData.category,
          price: clickData.price,
          quantity: 1
        }]
      });

      // Track as potential purchase
      window.gtag('event', 'begin_checkout', {
        currency: 'USD',
        value: clickData.price || 0,
        items: [{
          item_id: giftId,
          item_name: clickData.title,
          price: clickData.price
        }]
      });
    }

    // Fire Facebook Pixel event
    if (window.fbq) {
      window.fbq('track', 'InitiateCheckout', {
        value: clickData.price || 0,
        currency: 'USD',
        content_ids: [giftId],
        content_type: 'product'
      });
    }

    return clickData;
  }

  // Advanced user segmentation for personalization
  getUserSegment() {
    const segments = [];

    // Behavioral segments
    if (this.leadScore > 50) segments.push('high_intent');
    if (this.conversionProbability > 0.7) segments.push('ready_to_buy');
    if (this.isReturningUser()) segments.push('returning_visitor');

    // Engagement segments
    const avgTimePerPage = this.getTimeOnPage() / this.interactions.filter(i => i.type === 'page_view').length;
    if (avgTimePerPage > 120000) segments.push('engaged_reader');

    // Purchase behavior segments
    const expensiveClicks = this.interactions.filter(i =>
      i.type === 'gift_clicked' && i.data.price > 100
    ).length;
    if (expensiveClicks > 2) segments.push('premium_buyer');

    return segments;
  }

  // Traffic source attribution
  getTrafficSource() {
    const referrer = document.referrer;
    const utmSource = new URLSearchParams(window.location.search).get('utm_source');

    if (utmSource) return utmSource;
    if (!referrer) return 'direct';
    if (referrer.includes('google.com')) return 'google_organic';
    if (referrer.includes('facebook.com')) return 'facebook';
    if (referrer.includes('instagram.com')) return 'instagram';
    if (referrer.includes('pinterest.com')) return 'pinterest';
    if (referrer.includes('reddit.com')) return 'reddit';

    return 'referral';
  }

  // Get user's landing page
  getLandingPage() {
    return localStorage.getItem('giftgenius_landing_page') || window.location.pathname;
  }

  // Time on page calculation
  getTimeOnPage() {
    return Date.now() - this.startTime;
  }

  // Check if returning user
  isReturningUser() {
    const visitCount = parseInt(localStorage.getItem('giftgenius_visit_count') || '0');
    return visitCount > 1;
  }

  // Set conversion attribution cookie
  setConversionCookie(giftId, clickData) {
    const conversionData = {
      giftId,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      source: clickData.source,
      leadScore: this.leadScore
    };

    // Set cookie that expires in 30 days
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `giftgenius_conversion=${JSON.stringify(conversionData)}; expires=${expires}; path=/`;
  }

  // Save tracking data to localStorage
  saveToStorage() {
    const trackingData = {
      sessionId: this.sessionId,
      userId: this.userId,
      interactions: this.interactions,
      leadScore: this.leadScore,
      conversionProbability: this.conversionProbability,
      lastUpdated: Date.now()
    };

    localStorage.setItem('giftgenius_tracking', JSON.stringify(trackingData));
  }

  // Send data to analytics service
  async sendToAnalytics(interaction) {
    try {
      // This would send to your analytics backend
      const payload = {
        sessionId: this.sessionId,
        userId: this.userId,
        interaction,
        leadScore: this.leadScore,
        conversionProbability: this.conversionProbability,
        userSegment: this.getUserSegment(),
        timestamp: Date.now()
      };

      // In production, you'd send this to your analytics API
      // await fetch('/api/analytics/track', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload)
      // });

      console.log('Analytics Event:', payload);
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }

  // Get lead quality score (A, B, C, D)
  getLeadQuality() {
    if (this.conversionProbability > 0.7) return 'A';
    if (this.conversionProbability > 0.5) return 'B';
    if (this.conversionProbability > 0.3) return 'C';
    return 'D';
  }

  // Get personalized recommendations based on behavior
  getPersonalizedTriggers() {
    const triggers = [];

    if (this.conversionProbability > 0.6 && !this.interactions.some(i => i.type === 'email_captured')) {
      triggers.push({
        type: 'email_capture',
        urgency: 'high',
        message: 'Get notified when this item goes on sale!'
      });
    }

    if (this.leadScore > 30 && this.getTimeOnPage() > 300000) {
      triggers.push({
        type: 'exit_intent',
        urgency: 'medium',
        message: 'Wait! Get 10% off your first purchase'
      });
    }

    return triggers;
  }

  // Initialize tracking on page load
  static init() {
    const tracker = new AffiliateTracker();

    // Track page view
    tracker.trackInteraction('page_view', {
      url: window.location.href,
      title: document.title
    });

    // Track returning visitor
    const visitCount = parseInt(localStorage.getItem('giftgenius_visit_count') || '0') + 1;
    localStorage.setItem('giftgenius_visit_count', visitCount.toString());

    if (visitCount > 1) {
      tracker.trackInteraction('return_visit', { visitCount });
    }

    // Set landing page if first visit
    if (!localStorage.getItem('giftgenius_landing_page')) {
      localStorage.setItem('giftgenius_landing_page', window.location.pathname);
    }

    // Track deep engagement after 3 minutes
    setTimeout(() => {
      tracker.trackInteraction('deep_engagement', {
        timeOnPage: tracker.getTimeOnPage()
      });
    }, 180000);

    return tracker;
  }
}

export default AffiliateTracker;