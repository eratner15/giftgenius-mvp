// Advanced AI-Powered Recommendation System
export class AdvancedRecommendationEngine {
  constructor(analytics) {
    this.analytics = analytics;
    this.behaviorWeights = {
      viewTime: 0.3,
      categoryAffinity: 0.25,
      priceConsistency: 0.2,
      searchPatterns: 0.15,
      seasonality: 0.1
    };
  }

  // Enhanced personalization with behavioral scoring
  calculatePersonalizationScore(gift) {
    const userData = this.analytics.data;
    let score = 0;

    // 1. Category Affinity Score (25%)
    const categoryScore = this.getCategoryAffinityScore(gift.category, userData);
    score += categoryScore * this.behaviorWeights.categoryAffinity;

    // 2. Price Preference Score (20%)
    const priceScore = this.getPriceConsistencyScore(gift.price, userData);
    score += priceScore * this.behaviorWeights.priceConsistency;

    // 3. View Time Engagement Score (30%)
    const viewTimeScore = this.getViewTimeScore(gift.id, userData);
    score += viewTimeScore * this.behaviorWeights.viewTime;

    // 4. Search Pattern Alignment (15%)
    const searchScore = this.getSearchPatternScore(gift, userData);
    score += searchScore * this.behaviorWeights.searchPatterns;

    // 5. Seasonal Context Score (10%)
    const seasonScore = this.getSeasonalityScore(gift);
    score += seasonScore * this.behaviorWeights.seasonality;

    // Normalize score to 0-100 range
    return Math.min(100, Math.max(0, score * 100));
  }

  getCategoryAffinityScore(category, userData) {
    const categoryInteractions = userData.categories[category] || 0;
    const totalInteractions = Object.values(userData.categories).reduce((sum, count) => sum + count, 0);

    if (totalInteractions === 0) return 0.5; // Neutral score for new users

    return Math.min(1, categoryInteractions / totalInteractions * 3); // Boost preferred categories
  }

  getPriceConsistencyScore(price, userData) {
    const priceRange = this.analytics.getPriceRange(price);
    const priceInteractions = userData.priceRanges[priceRange] || 0;
    const totalPriceInteractions = Object.values(userData.priceRanges).reduce((sum, count) => sum + count, 0);

    if (totalPriceInteractions === 0) return 0.5;

    return priceInteractions / totalPriceInteractions;
  }

  getViewTimeScore(giftId, userData) {
    const viewData = userData.giftViews[giftId];
    if (!viewData) return 0;

    const avgViewTime = viewData.totalTime / viewData.count;
    const baseEngagement = avgViewTime > 3000 ? 1 : avgViewTime / 3000;
    const frequencyBoost = Math.min(1, viewData.count / 5);

    return (baseEngagement * 0.7) + (frequencyBoost * 0.3);
  }

  getSearchPatternScore(gift, userData) {
    if (!userData.searches.length) return 0.5;

    const giftText = `${gift.name || gift.title} ${gift.description || ''} ${gift.category}`.toLowerCase();
    let matchScore = 0;

    userData.searches.forEach(search => {
      const query = search.query.toLowerCase();
      const words = query.split(' ').filter(word => word.length > 2);

      words.forEach(word => {
        if (giftText.includes(word)) {
          matchScore += 1 / userData.searches.length;
        }
      });
    });

    return Math.min(1, matchScore);
  }

  getSeasonalityScore(gift) {
    const month = new Date().getMonth();
    const giftText = `${gift.name || gift.title} ${gift.description || ''}`.toLowerCase();

    // Enhanced seasonal patterns
    const seasonalKeywords = {
      0: ['warm', 'cozy', 'winter', 'holiday', 'scarf', 'blanket'], // January
      1: ['valentine', 'love', 'romantic', 'couple', 'heart'], // February
      2: ['spring', 'fresh', 'easter', 'renewal', 'garden'], // March
      3: ['spring', 'fresh', 'outdoor', 'easter', 'new'], // April
      4: ['mother', 'mom', 'graduation', 'spring', 'flower'], // May
      5: ['summer', 'vacation', 'travel', 'outdoor', 'father'], // June
      6: ['summer', 'vacation', 'beach', 'outdoor', 'travel'], // July
      7: ['summer', 'vacation', 'beach', 'outdoor', 'travel'], // August
      8: ['back to school', 'autumn', 'fall', 'harvest'], // September
      9: ['autumn', 'fall', 'halloween', 'harvest', 'warm'], // October
      10: ['thanksgiving', 'gratitude', 'autumn', 'family'], // November
      11: ['christmas', 'holiday', 'winter', 'gift', 'festive'] // December
    };

    const currentKeywords = seasonalKeywords[month] || [];
    const matches = currentKeywords.filter(keyword => giftText.includes(keyword)).length;

    return matches / Math.max(1, currentKeywords.length);
  }

  // Smart recommendation categories
  getSmartRecommendations(allGifts, limit = 8) {
    const recommendations = allGifts.map(gift => ({
      ...gift,
      personalizedScore: this.calculatePersonalizationScore(gift),
      reason: this.getRecommendationReason(gift)
    }));

    return recommendations
      .sort((a, b) => b.personalizedScore - a.personalizedScore)
      .slice(0, limit);
  }

  getRecommendationReason(gift) {
    const userData = this.analytics.data;
    const reasons = [];

    // Category-based reasons
    if (userData.categories[gift.category] > 2) {
      reasons.push(`You love ${gift.category} gifts`);
    }

    // Price-based reasons
    const priceRange = this.analytics.getPriceRange(gift.price);
    if (userData.priceRanges[priceRange] > 1) {
      reasons.push('Perfect price range for you');
    }

    // Previous interaction reasons
    if (userData.giftViews[gift.id]) {
      reasons.push('You viewed this before');
    }

    // Search pattern reasons
    const searchScore = this.getSearchPatternScore(gift, userData);
    if (searchScore > 0.3) {
      reasons.push('Matches your search interests');
    }

    // Seasonal reasons
    const seasonScore = this.getSeasonalityScore(gift);
    if (seasonScore > 0.5) {
      reasons.push('Perfect for this season');
    }

    // Default reason
    if (reasons.length === 0) {
      if (gift.successRate && gift.successRate > 90) {
        reasons.push('Highly recommended by others');
      } else {
        reasons.push('Trending now');
      }
    }

    return reasons[0]; // Return the most relevant reason
  }

  // Dynamic gift clustering
  createGiftClusters(allGifts) {
    const clusters = {
      'for-her': [],
      'for-him': [],
      'luxury': [],
      'budget-friendly': [],
      'experiential': [],
      'practical': [],
      'romantic': [],
      'tech-savvy': []
    };

    allGifts.forEach(gift => {
      const text = `${gift.name || gift.title} ${gift.description || ''}`.toLowerCase();

      // Cluster assignment logic
      if (text.includes('her') || text.includes('woman') || gift.category === 'jewelry' || gift.category === 'beauty') {
        clusters['for-her'].push(gift);
      }

      if (text.includes('him') || text.includes('man') || gift.category === 'tech') {
        clusters['for-him'].push(gift);
      }

      if (gift.price > 150) {
        clusters['luxury'].push(gift);
      } else if (gift.price < 50) {
        clusters['budget-friendly'].push(gift);
      }

      if (gift.category === 'experiences') {
        clusters['experiential'].push(gift);
      }

      if (text.includes('love') || text.includes('romantic') || gift.category === 'jewelry') {
        clusters['romantic'].push(gift);
      }

      if (gift.category === 'tech' || text.includes('smart') || text.includes('electronic')) {
        clusters['tech-savvy'].push(gift);
      }

      if (gift.category === 'home' || text.includes('useful') || text.includes('practical')) {
        clusters['practical'].push(gift);
      }
    });

    return clusters;
  }

  // Collaborative filtering simulation
  getCollaborativeRecommendations(allGifts, currentGift, limit = 4) {
    // Find gifts frequently viewed together
    const userData = this.analytics.data;
    const currentViews = userData.giftViews[currentGift.id];

    if (!currentViews) {
      return this.getSimilarGifts(currentGift, allGifts, limit);
    }

    // Simulate "users who viewed this also viewed" logic
    const relatedGifts = allGifts
      .filter(gift => gift.id !== currentGift.id)
      .map(gift => {
        let collaborativeScore = 0;

        // Category similarity bonus
        if (gift.category === currentGift.category) {
          collaborativeScore += 0.4;
        }

        // Price similarity bonus
        const priceDiff = Math.abs(gift.price - currentGift.price);
        const priceBonus = Math.max(0, 1 - (priceDiff / currentGift.price));
        collaborativeScore += priceBonus * 0.3;

        // Success rate similarity
        const successDiff = Math.abs((gift.successRate || 0) - (currentGift.successRate || 0));
        collaborativeScore += Math.max(0, 1 - (successDiff / 100)) * 0.3;

        return {
          ...gift,
          collaborativeScore
        };
      })
      .sort((a, b) => b.collaborativeScore - a.collaborativeScore)
      .slice(0, limit);

    return relatedGifts;
  }

  // Content-based recommendation enhancement
  getSimilarGifts(gift, allGifts, limit = 4) {
    const similarities = allGifts
      .filter(g => g.id !== gift.id)
      .map(g => ({
        ...g,
        similarity: this.calculateEnhancedSimilarity(gift, g)
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);

    return similarities;
  }

  calculateEnhancedSimilarity(gift1, gift2) {
    let score = 0;

    // Category match (30%)
    if (gift1.category === gift2.category) score += 30;

    // Price similarity (25%)
    const priceDiff = Math.abs(gift1.price - gift2.price);
    const avgPrice = (gift1.price + gift2.price) / 2;
    if (avgPrice > 0) {
      score += (1 - priceDiff / avgPrice) * 25;
    }

    // Success rate similarity (20%)
    const successDiff = Math.abs((gift1.successRate || 0) - (gift2.successRate || 0));
    score += (1 - successDiff / 100) * 20;

    // Occasion similarity (15%)
    if (gift1.occasion === gift2.occasion) score += 15;

    // Text similarity (10%)
    const textSimilarity = this.calculateTextSimilarity(
      `${gift1.name || gift1.title} ${gift1.description || ''}`,
      `${gift2.name || gift2.title} ${gift2.description || ''}`
    );
    score += textSimilarity * 10;

    return score;
  }

  calculateTextSimilarity(text1, text2) {
    const words1 = text1.toLowerCase().split(/\W+/).filter(w => w.length > 3);
    const words2 = text2.toLowerCase().split(/\W+/).filter(w => w.length > 3);

    const set1 = new Set(words1);
    const set2 = new Set(words2);

    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);

    return union.size > 0 ? intersection.size / union.size : 0;
  }
}