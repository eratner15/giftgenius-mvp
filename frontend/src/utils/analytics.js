// User Behavior Analytics
export class UserAnalytics {
  constructor() {
    this.data = this.loadData();
  }

  loadData() {
    const saved = localStorage.getItem('giftgenius_analytics');
    return saved ? JSON.parse(saved) : {
      sessions: 0,
      totalTime: 0,
      giftViews: {},
      searches: [],
      categories: {},
      priceRanges: {},
      lastVisit: null,
      preferences: {},
      interactions: []
    };
  }

  saveData() {
    localStorage.setItem('giftgenius_analytics', JSON.stringify(this.data));
  }

  trackSession() {
    this.data.sessions++;
    this.data.lastVisit = Date.now();
    this.saveData();
  }

  trackGiftView(giftId, duration = 1000) {
    if (!this.data.giftViews[giftId]) {
      this.data.giftViews[giftId] = { count: 0, totalTime: 0 };
    }
    this.data.giftViews[giftId].count++;
    this.data.giftViews[giftId].totalTime += duration;
    this.saveData();
  }

  trackSearch(query, results) {
    this.data.searches.push({
      query,
      results: results.length,
      timestamp: Date.now()
    });
    this.saveData();
  }

  trackCategoryInterest(category) {
    this.data.categories[category] = (this.data.categories[category] || 0) + 1;
    this.saveData();
  }

  trackPriceInterest(price) {
    const range = this.getPriceRange(price);
    this.data.priceRanges[range] = (this.data.priceRanges[range] || 0) + 1;
    this.saveData();
  }

  getPriceRange(price) {
    if (price < 25) return 'under25';
    if (price < 50) return '25to50';
    if (price < 100) return '50to100';
    if (price < 200) return '100to200';
    return 'over200';
  }

  getPreferredCategories() {
    return Object.entries(this.data.categories)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category]) => category);
  }

  getPreferredPriceRange() {
    const ranges = Object.entries(this.data.priceRanges)
      .sort((a, b) => b[1] - a[1]);
    return ranges.length > 0 ? ranges[0][0] : 'any';
  }

  isReturningUser() {
    return this.data.sessions > 1;
  }

  getPersonalizationScore(gift) {
    let score = 0;

    // Category preference
    if (this.data.categories[gift.category]) {
      score += this.data.categories[gift.category] * 10;
    }

    // Price preference
    const priceRange = this.getPriceRange(gift.price);
    if (this.data.priceRanges[priceRange]) {
      score += this.data.priceRanges[priceRange] * 5;
    }

    // Previous views
    if (this.data.giftViews[gift.id]) {
      score += this.data.giftViews[gift.id].count * 3;
    }

    return score;
  }
}

// Recommendation Engine
export class RecommendationEngine {
  constructor(analytics) {
    this.analytics = analytics;
  }

  getSimilarGifts(gift, allGifts, limit = 4) {
    return allGifts
      .filter(g => g.id !== gift.id)
      .map(g => ({
        ...g,
        similarity: this.calculateSimilarity(gift, g)
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
  }

  calculateSimilarity(gift1, gift2) {
    let score = 0;

    // Category match
    if (gift1.category === gift2.category) score += 30;

    // Price similarity
    const priceDiff = Math.abs(gift1.price - gift2.price);
    const maxPrice = Math.max(gift1.price, gift2.price);
    if (maxPrice > 0) {
      score += (1 - priceDiff / maxPrice) * 20;
    }

    // Success rate similarity
    const successDiff = Math.abs((gift1.successRate || 0) - (gift2.successRate || 0));
    score += (1 - successDiff / 100) * 15;

    // Testimonial similarity
    if (gift1.testimonials && gift2.testimonials) {
      const commonWords = this.getCommonWords(
        gift1.testimonials.map(t => t.text).join(' '),
        gift2.testimonials.map(t => t.text).join(' ')
      );
      score += commonWords * 5;
    }

    return score;
  }

  getCommonWords(text1, text2) {
    const words1 = text1.toLowerCase().split(/\W+/).filter(w => w.length > 3);
    const words2 = text2.toLowerCase().split(/\W+/).filter(w => w.length > 3);

    const set1 = new Set(words1);
    const set2 = new Set(words2);

    let common = 0;
    set1.forEach(word => {
      if (set2.has(word)) common++;
    });

    return common;
  }

  getPersonalizedGifts(allGifts, limit = 6) {
    if (!this.analytics.isReturningUser()) {
      return allGifts
        .sort((a, b) => (b.successRate || 0) - (a.successRate || 0))
        .slice(0, limit);
    }

    return allGifts
      .map(gift => ({
        ...gift,
        personalizedScore: this.analytics.getPersonalizationScore(gift)
      }))
      .sort((a, b) => b.personalizedScore - a.personalizedScore)
      .slice(0, limit);
  }

  getTrendingGifts(allGifts, limit = 4) {
    return allGifts
      .filter(gift => gift.successRate && gift.successRate >= 85)
      .map(gift => ({
        ...gift,
        trendingScore: (gift.successRate || 0) + Math.random() * 10
      }))
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, limit);
  }

  getContextualGifts(allGifts, limit = 4) {
    const month = new Date().getMonth();
    const season = this.getSeason(month);

    // Simple seasonal filtering
    const contextualKeywords = {
      winter: ['warm', 'cozy', 'holiday', 'christmas'],
      spring: ['fresh', 'new', 'garden', 'outdoor'],
      summer: ['vacation', 'travel', 'beach', 'outdoor'],
      fall: ['autumn', 'harvest', 'thanksgiving', 'warm']
    };

    const keywords = contextualKeywords[season] || [];

    return allGifts
      .filter(gift => {
        const text = `${gift.name || gift.title} ${gift.description || ''}`.toLowerCase();
        return keywords.some(keyword => text.includes(keyword));
      })
      .slice(0, limit);
  }

  getSeason(month) {
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'fall';
    return 'winter';
  }
}

// Social Proof Manager
export class SocialProofManager {
  constructor() {
    this.activities = [];
    this.names = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn'];
    this.actions = [
      'just purchased',
      'is viewing',
      'added to favorites',
      'recommended',
      'left a review for'
    ];
  }

  generateRealtimeActivity(allGifts) {
    if (allGifts.length === 0) return;

    const gift = allGifts[Math.floor(Math.random() * allGifts.length)];
    const name = this.names[Math.floor(Math.random() * this.names.length)];
    const action = this.actions[Math.floor(Math.random() * this.actions.length)];

    const activity = {
      id: Date.now(),
      name,
      action,
      gift: gift.name || gift.title,
      time: 'just now',
      trending: Math.random() > 0.8
    };

    this.activities.unshift(activity);

    // Keep only recent activities
    if (this.activities.length > 5) {
      this.activities = this.activities.slice(0, 5);
    }

    // Update times
    this.activities.forEach((activity, index) => {
      if (index === 0) {
        activity.time = 'just now';
      } else {
        activity.time = `${index} min ago`;
      }
    });
  }

  getActivities() {
    return this.activities;
  }

  getRecentPurchases() {
    // Simulate recent purchases
    return Math.floor(Math.random() * 15) + 5;
  }
}