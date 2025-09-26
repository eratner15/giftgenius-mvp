import React, { useState, useEffect, useCallback } from 'react';

// Urgency and Scarcity Engine
export class UrgencyEngine {
  constructor() {
    this.urgencyFactors = {
      timeBasedEvents: this.getTimeBasedEvents(),
      stockLevels: new Map(),
      popularityTrends: new Map(),
      deliveryConstraints: this.getDeliveryConstraints()
    };
  }

  getTimeBasedEvents() {
    const now = new Date();
    const events = [];

    // Valentine's Day urgency
    const valentines = new Date(now.getFullYear(), 1, 14); // February 14
    if (this.daysBetween(now, valentines) <= 14 && this.daysBetween(now, valentines) >= 0) {
      events.push({
        type: 'valentine',
        daysLeft: this.daysBetween(now, valentines),
        urgency: 'high',
        message: `Only ${this.daysBetween(now, valentines)} days until Valentine's Day!`
      });
    }

    // Christmas urgency
    const christmas = new Date(now.getFullYear(), 11, 25); // December 25
    if (this.daysBetween(now, christmas) <= 30 && this.daysBetween(now, christmas) >= 0) {
      events.push({
        type: 'christmas',
        daysLeft: this.daysBetween(now, christmas),
        urgency: this.daysBetween(now, christmas) <= 7 ? 'critical' : 'high',
        message: `${this.daysBetween(now, christmas)} days until Christmas!`
      });
    }

    // Mother's Day (second Sunday in May)
    const mothersDay = this.getMothersDayDate(now.getFullYear());
    if (this.daysBetween(now, mothersDay) <= 14 && this.daysBetween(now, mothersDay) >= 0) {
      events.push({
        type: 'mothers-day',
        daysLeft: this.daysBetween(now, mothersDay),
        urgency: 'high',
        message: `${this.daysBetween(now, mothersDay)} days until Mother's Day!`
      });
    }

    return events;
  }

  daysBetween(date1, date2) {
    const diffTime = date2.getTime() - date1.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getMothersDayDate(year) {
    const may = new Date(year, 4, 1); // May 1st
    const firstSunday = 7 - may.getDay();
    return new Date(year, 4, firstSunday + 7); // Second Sunday
  }

  getDeliveryConstraints() {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 6 = Saturday
    const hour = now.getHours();

    let constraints = [];

    // Same day delivery cutoff
    if (hour < 12) {
      constraints.push({
        type: 'same-day',
        cutoff: '12:00 PM',
        remaining: 12 - hour,
        urgency: 'medium'
      });
    }

    // Next day delivery for weekend orders
    if (dayOfWeek === 5 && hour > 14) { // Friday after 2 PM
      constraints.push({
        type: 'weekend-shipping',
        message: 'Order by 2 PM Friday for Monday delivery',
        urgency: 'low'
      });
    }

    return constraints;
  }

  calculateUrgencyScore(gift) {
    let urgencyScore = 0;
    let urgencyReasons = [];

    // Time-based event urgency
    this.urgencyFactors.timeBasedEvents.forEach(event => {
      if (this.isGiftRelevantForEvent(gift, event.type)) {
        urgencyScore += event.urgency === 'critical' ? 40 : 30;
        urgencyReasons.push(`${event.message}`);
      }
    });

    // Popularity-based urgency (simulated)
    if (gift.successRate > 90) {
      urgencyScore += 20;
      urgencyReasons.push('🔥 Highly popular gift');
    }

    // Stock level urgency (simulated)
    const stockLevel = this.simulateStockLevel(gift.id);
    if (stockLevel === 'low') {
      urgencyScore += 25;
      urgencyReasons.push('⚠️ Limited availability');
    } else if (stockLevel === 'very-low') {
      urgencyScore += 35;
      urgencyReasons.push('🚨 Only few left in stock!');
    }

    // Price point urgency
    if (gift.price < 50) {
      urgencyScore += 10;
      urgencyReasons.push('💰 Great value - won\'t last long');
    }

    return {
      score: Math.min(100, urgencyScore),
      level: this.getUrgencyLevel(urgencyScore),
      reasons: urgencyReasons.slice(0, 2) // Show max 2 reasons
    };
  }

  simulateStockLevel(giftId) {
    // Simulate stock levels based on gift ID
    const hash = giftId * 31 % 100;
    if (hash < 15) return 'very-low';
    if (hash < 35) return 'low';
    return 'normal';
  }

  isGiftRelevantForEvent(gift, eventType) {
    const giftText = `${gift.name || gift.title} ${gift.description || ''} ${gift.category}`.toLowerCase();

    const eventRelevance = {
      'valentine': ['romantic', 'love', 'valentine', 'jewelry', 'couple', 'rose'],
      'christmas': ['holiday', 'christmas', 'festive', 'winter', 'family', 'cozy'],
      'mothers-day': ['mother', 'mom', 'maternal', 'beauty', 'jewelry', 'spa']
    };

    const keywords = eventRelevance[eventType] || [];
    return keywords.some(keyword => giftText.includes(keyword)) ||
           (eventType === 'valentine' && gift.category === 'jewelry') ||
           (eventType === 'mothers-day' && ['beauty', 'jewelry', 'fashion'].includes(gift.category));
  }

  getUrgencyLevel(score) {
    if (score >= 70) return 'critical';
    if (score >= 40) return 'high';
    if (score >= 20) return 'medium';
    return 'low';
  }
}

// Urgency Indicator Component
export const UrgencyIndicator = ({ gift, urgencyEngine }) => {
  const [urgency, setUrgency] = useState(null);

  useEffect(() => {
    if (gift && urgencyEngine) {
      const urgencyData = urgencyEngine.calculateUrgencyScore(gift);
      setUrgency(urgencyData);
    }
  }, [gift, urgencyEngine]);

  if (!urgency || urgency.level === 'low') return null;

  const getUrgencyStyle = (level) => {
    const styles = {
      'critical': {
        background: 'linear-gradient(135deg, #EF4444, #DC2626)',
        animation: 'pulse-critical 1s infinite'
      },
      'high': {
        background: 'linear-gradient(135deg, #F59E0B, #D97706)',
        animation: 'pulse-high 2s infinite'
      },
      'medium': {
        background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
        animation: 'none'
      }
    };
    return styles[level] || styles.medium;
  };

  return (
    <div className="urgency-indicator" style={getUrgencyStyle(urgency.level)}>
      <div className="urgency-content">
        <span className="urgency-icon">
          {urgency.level === 'critical' ? '🔥' : urgency.level === 'high' ? '⚡' : '📈'}
        </span>
        <div className="urgency-text">
          {urgency.reasons.map((reason, index) => (
            <div key={index} className="urgency-reason">{reason}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Social Proof Enhancement Engine
export class SocialProofEngine {
  constructor() {
    this.proofTypes = {
      recentPurchases: new Map(),
      currentViewers: new Map(),
      customerSatisfaction: new Map(),
      expertRecommendations: new Map()
    };
    this.updateInterval = null;
  }

  generateRecentPurchases(gifts) {
    const names = [
      'Sarah M.', 'David K.', 'Jennifer L.', 'Michael R.', 'Ashley T.',
      'Ryan P.', 'Jessica W.', 'Chris B.', 'Amanda H.', 'Tyler J.',
      'Michelle S.', 'Brandon D.', 'Stephanie C.', 'Kevin M.', 'Lauren A.'
    ];

    const timeframes = [
      'just now', '2 minutes ago', '5 minutes ago', '8 minutes ago',
      '12 minutes ago', '15 minutes ago', '18 minutes ago', '25 minutes ago'
    ];

    const locations = [
      'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix',
      'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose',
      'Austin', 'Jacksonville', 'San Francisco', 'Columbus', 'Charlotte'
    ];

    gifts.forEach(gift => {
      if (Math.random() > 0.6) { // 40% chance of having recent purchases
        const purchaseCount = Math.floor(Math.random() * 8) + 1;
        const recentPurchases = [];

        for (let i = 0; i < Math.min(3, purchaseCount); i++) {
          recentPurchases.push({
            name: names[Math.floor(Math.random() * names.length)],
            location: locations[Math.floor(Math.random() * locations.length)],
            time: timeframes[Math.floor(Math.random() * timeframes.length)],
            verified: Math.random() > 0.7
          });
        }

        this.proofTypes.recentPurchases.set(gift.id, {
          total: purchaseCount,
          recent: recentPurchases,
          lastUpdated: Date.now()
        });
      }
    });
  }

  generateCurrentViewers(gifts) {
    gifts.forEach(gift => {
      const viewerCount = Math.floor(Math.random() * 25) + 3; // 3-27 viewers
      this.proofTypes.currentViewers.set(gift.id, {
        count: viewerCount,
        trend: Math.random() > 0.5 ? 'increasing' : 'stable',
        lastUpdated: Date.now()
      });
    });
  }

  generateExpertRecommendations(gifts) {
    const experts = [
      { name: 'Gift Guide Weekly', type: 'publication' },
      { name: 'Holiday Helper', type: 'blog' },
      { name: 'Best Gifts 2024', type: 'review-site' },
      { name: 'Gift Expert Sarah', type: 'influencer' },
      { name: 'Present Perfect', type: 'blog' }
    ];

    gifts.forEach(gift => {
      if (Math.random() > 0.8) { // 20% chance of expert recommendation
        const expert = experts[Math.floor(Math.random() * experts.length)];
        this.proofTypes.expertRecommendations.set(gift.id, {
          expert: expert.name,
          type: expert.type,
          quote: this.generateExpertQuote(gift),
          rating: Math.floor(Math.random() * 2) + 4 // 4 or 5 stars
        });
      }
    });
  }

  generateExpertQuote(gift) {
    const quotes = [
      "A standout choice for gift-givers",
      "Consistently rated as a top pick",
      "Perfect balance of quality and value",
      "Recommended by our editorial team",
      "A gift that never disappoints",
      "Exceptional quality and presentation",
      "One of our most recommended items"
    ];

    return quotes[Math.floor(Math.random() * quotes.length)];
  }

  getSocialProofScore(giftId) {
    let score = 0;

    // Recent purchases boost
    const purchases = this.proofTypes.recentPurchases.get(giftId);
    if (purchases) {
      score += Math.min(30, purchases.total * 3);
    }

    // Current viewers boost
    const viewers = this.proofTypes.currentViewers.get(giftId);
    if (viewers) {
      score += Math.min(20, viewers.count);
      if (viewers.trend === 'increasing') score += 10;
    }

    // Expert recommendation boost
    if (this.proofTypes.expertRecommendations.has(giftId)) {
      score += 40;
    }

    return Math.min(100, score);
  }

  startRealTimeUpdates(gifts) {
    this.updateInterval = setInterval(() => {
      // Update viewer counts
      gifts.forEach(gift => {
        const viewers = this.proofTypes.currentViewers.get(gift.id);
        if (viewers) {
          const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
          viewers.count = Math.max(1, viewers.count + change);
          viewers.trend = change > 0 ? 'increasing' : change < 0 ? 'decreasing' : 'stable';
          viewers.lastUpdated = Date.now();
        }
      });

      // Occasionally add new recent purchases
      if (Math.random() > 0.7) {
        const randomGift = gifts[Math.floor(Math.random() * gifts.length)];
        const purchases = this.proofTypes.recentPurchases.get(randomGift.id);
        if (purchases) {
          purchases.recent.unshift({
            name: 'Someone',
            location: 'Just now',
            time: 'just now',
            verified: true
          });
          purchases.recent = purchases.recent.slice(0, 3); // Keep only 3 recent
          purchases.total += 1;
        }
      }
    }, 15000); // Update every 15 seconds
  }

  stopRealTimeUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }
}

// Social Proof Display Component
export const SocialProofDisplay = ({ gift, socialProofEngine, compact = false }) => {
  const [proofData, setProofData] = useState({});
  const [updateTrigger, setUpdateTrigger] = useState(0);

  useEffect(() => {
    if (!gift || !socialProofEngine) return;

    const purchases = socialProofEngine.proofTypes.recentPurchases.get(gift.id);
    const viewers = socialProofEngine.proofTypes.currentViewers.get(gift.id);
    const expert = socialProofEngine.proofTypes.expertRecommendations.get(gift.id);

    setProofData({ purchases, viewers, expert });
  }, [gift, socialProofEngine, updateTrigger]);

  // Update component when social proof data changes
  useEffect(() => {
    const interval = setInterval(() => {
      setUpdateTrigger(prev => prev + 1);
    }, 16000); // Slightly offset from the engine update

    return () => clearInterval(interval);
  }, []);

  if (compact) {
    return (
      <div className="social-proof-compact">
        {proofData.viewers && (
          <div className="viewers-compact">
            👀 {proofData.viewers.count} viewing
          </div>
        )}
        {proofData.purchases && proofData.purchases.total > 0 && (
          <div className="purchases-compact">
            🛒 {proofData.purchases.total} purchased recently
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="social-proof-display">
      {proofData.expert && (
        <div className="expert-recommendation">
          <div className="expert-header">
            <span className="expert-badge">✨ Expert Pick</span>
            <div className="expert-rating">
              {'★'.repeat(proofData.expert.rating)}
            </div>
          </div>
          <div className="expert-quote">"{proofData.expert.quote}"</div>
          <div className="expert-source">— {proofData.expert.expert}</div>
        </div>
      )}

      {proofData.viewers && (
        <div className="current-viewers">
          <div className="viewers-header">
            <span className="viewers-icon">👥</span>
            <span className="viewers-count">{proofData.viewers.count} people</span>
            <span className="viewers-text">viewing this gift</span>
          </div>
          {proofData.viewers.trend === 'increasing' && (
            <div className="trend-indicator">📈 Interest increasing</div>
          )}
        </div>
      )}

      {proofData.purchases && proofData.purchases.recent.length > 0 && (
        <div className="recent-purchases">
          <div className="purchases-header">
            <span className="purchases-icon">🛒</span>
            <span className="purchases-text">Recent purchases:</span>
          </div>
          <div className="purchases-list">
            {proofData.purchases.recent.map((purchase, index) => (
              <div key={index} className="purchase-item">
                <span className="purchase-name">{purchase.name}</span>
                <span className="purchase-location">from {purchase.location}</span>
                <span className="purchase-time">{purchase.time}</span>
                {purchase.verified && <span className="verified-icon">✓</span>}
              </div>
            ))}
          </div>
          {proofData.purchases.total > 3 && (
            <div className="purchases-more">
              +{proofData.purchases.total - 3} more in the last 24 hours
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Conversion-Focused CTA Component
export const ConversionCTA = ({ gift, urgencyEngine, socialProofEngine, onAction }) => {
  const [ctaData, setCTAData] = useState({});

  useEffect(() => {
    if (gift && urgencyEngine && socialProofEngine) {
      const urgency = urgencyEngine.calculateUrgencyScore(gift);
      const socialScore = socialProofEngine.getSocialProofScore(gift.id);

      setCTAData({
        urgency,
        socialScore,
        primaryAction: 'View Gift Details',
        secondaryAction: 'Add to Favorites'
      });
    }
  }, [gift, urgencyEngine, socialProofEngine]);

  const getCTAStyle = () => {
    if (!ctaData.urgency) return {};

    const styles = {
      'critical': {
        background: 'linear-gradient(135deg, #EF4444, #DC2626)',
        boxShadow: '0 4px 20px rgba(239, 68, 68, 0.4)',
        animation: 'pulse-cta 1s infinite'
      },
      'high': {
        background: 'linear-gradient(135deg, #F59E0B, #D97706)',
        boxShadow: '0 4px 20px rgba(245, 158, 11, 0.4)',
      },
      'medium': {
        background: 'linear-gradient(135deg, #6B46C1, #553C9A)',
        boxShadow: '0 4px 20px rgba(107, 70, 193, 0.4)',
      }
    };

    return styles[ctaData.urgency.level] || styles.medium;
  };

  const getCTAText = () => {
    if (!ctaData.urgency) return 'View Details';

    const texts = {
      'critical': '🔥 Get This Gift Now!',
      'high': '⚡ Secure This Gift',
      'medium': '✨ View Gift Details'
    };

    return texts[ctaData.urgency.level] || 'View Details';
  };

  return (
    <div className="conversion-cta">
      <button
        className={`primary-cta ${ctaData.urgency?.level || 'medium'}`}
        style={getCTAStyle()}
        onClick={() => onAction('primary', gift)}
      >
        <span className="cta-text">{getCTAText()}</span>
        {ctaData.socialScore > 50 && (
          <span className="cta-social-indicator">
            👥 Popular Choice
          </span>
        )}
      </button>

      <button
        className="secondary-cta"
        onClick={() => onAction('secondary', gift)}
      >
        <span className="heart-icon">♡</span>
        <span>Save for Later</span>
      </button>

      {ctaData.urgency && ctaData.urgency.reasons.length > 0 && (
        <div className="cta-urgency-reasons">
          {ctaData.urgency.reasons.slice(0, 1).map((reason, index) => (
            <div key={index} className="urgency-reason-small">
              {reason}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { UrgencyEngine, SocialProofEngine };