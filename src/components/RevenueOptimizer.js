import React, { useState, useEffect } from 'react';

const RevenueOptimizer = ({ gift, onOptimizedLink, onTrackEvent }) => {
  const [optimizedData, setOptimizedData] = useState(null);
  const [conversionBoosts, setConversionBoosts] = useState([]);
  const [urgencyLevel, setUrgencyLevel] = useState('medium');

  // Revenue optimization algorithms
  useEffect(() => {
    if (gift) {
      optimizeRevenue(gift);
    }
  }, [gift]);

  const optimizeRevenue = (gift) => {
    const optimization = {
      originalPrice: gift.price,
      optimizedPrice: calculateOptimalPrice(gift),
      affiliateRate: getAffiliateRate(gift),
      conversionProbability: calculateConversionRate(gift),
      revenueProjection: calculateRevenueProjection(gift),
      urgencyTriggers: generateUrgencyTriggers(gift),
      socialProofScore: calculateSocialProofScore(gift),
      personalizedDiscount: calculatePersonalizedDiscount(gift)
    };

    setOptimizedData(optimization);
    generateConversionBoosts(optimization);
  };

  const calculateOptimalPrice = (gift) => {
    // Price optimization based on psychological pricing principles
    const basePrice = gift.price;

    // Apply charm pricing (prices ending in 9, 95, 97)
    if (basePrice % 1 === 0) {
      return basePrice - 0.01; // $50.00 -> $49.99
    }

    // Bundle pricing optimization
    if (basePrice > 100) {
      return Math.floor(basePrice / 10) * 10 - 3; // $127 -> $117
    }

    return basePrice;
  };

  const getAffiliateRate = (gift) => {
    // Commission rates vary by category and price point
    const categoryRates = {
      'tech': 3.5,
      'jewelry': 8.0,
      'home': 4.5,
      'fashion': 6.0,
      'books': 2.5,
      'experiences': 12.0
    };

    const baseRate = categoryRates[gift.category] || 5.0;

    // Higher rates for premium items
    if (gift.price > 200) return baseRate * 1.3;
    if (gift.price < 25) return baseRate * 0.8;

    return baseRate;
  };

  const calculateConversionRate = (gift) => {
    let score = 65; // Base conversion rate

    // Price psychology
    if (gift.price < 50) score += 15;
    if (gift.price > 200) score -= 10;

    // Social proof factors
    if (gift.success_rate > 90) score += 12;
    if (gift.total_reviews > 100) score += 8;

    // Urgency factors
    if (gift.limited_stock) score += 10;
    if (gift.flash_sale) score += 15;

    return Math.min(score, 98);
  };

  const calculateRevenueProjection = (gift) => {
    const conversionRate = optimizedData?.conversionProbability || 70;
    const affiliateRate = optimizedData?.affiliateRate || 5;
    const price = gift.price;

    const dailyViews = Math.floor(Math.random() * 100) + 20; // 20-120 views per day
    const dailyConversions = (dailyViews * conversionRate) / 100;
    const dailyRevenue = dailyConversions * price * (affiliateRate / 100);

    return {
      daily: dailyRevenue,
      weekly: dailyRevenue * 7,
      monthly: dailyRevenue * 30,
      conversions: dailyConversions
    };
  };

  const generateUrgencyTriggers = (gift) => {
    const triggers = [];

    if (gift.limited_stock) {
      triggers.push({
        type: 'scarcity',
        message: `Only ${gift.stock_count || Math.floor(Math.random() * 15) + 3} left in stock!`,
        impact: 'high'
      });
    }

    if (gift.flash_sale) {
      triggers.push({
        type: 'time_limited',
        message: 'Flash Sale ends in 4 hours!',
        impact: 'very_high'
      });
    }

    // Social pressure
    triggers.push({
      type: 'social_pressure',
      message: `${Math.floor(Math.random() * 30) + 15} people bought this in the last 24 hours`,
      impact: 'medium'
    });

    // Seasonal urgency
    const today = new Date();
    const holidays = getUpcomingHolidays(today);
    if (holidays.length > 0) {
      triggers.push({
        type: 'seasonal',
        message: `Order by Dec 20th for ${holidays[0]} delivery`,
        impact: 'high'
      });
    }

    return triggers;
  };

  const calculateSocialProofScore = (gift) => {
    let score = 0;

    // Review metrics
    score += Math.min(gift.total_reviews / 10, 25); // Max 25 points
    score += gift.rating * 5; // Max 25 points (5-star rating)
    score += Math.min(gift.success_rate, 30); // Max 30 points

    // Social signals
    if (gift.celebrity_endorsed) score += 20;
    if (gift.viral_on_social) score += 15;
    if (gift.media_featured) score += 10;

    return Math.min(score, 100);
  };

  const calculatePersonalizedDiscount = (gift) => {
    // Dynamic pricing based on user behavior
    const userSegment = getUserSegment(); // New, returning, VIP
    const giftCategory = gift.category;
    const pricePoint = gift.price;

    let discount = 0;

    if (userSegment === 'new') {
      discount = 10; // Welcome discount
    } else if (userSegment === 'returning') {
      discount = 5; // Loyalty discount
    } else if (userSegment === 'vip') {
      discount = 15; // VIP discount
    }

    // Category-specific promotions
    if (giftCategory === 'jewelry' && pricePoint > 100) {
      discount += 5; // Premium jewelry bonus
    }

    return Math.min(discount, 25); // Max 25% discount
  };

  const getUserSegment = () => {
    // Simulate user segmentation
    const segments = ['new', 'returning', 'vip'];
    return segments[Math.floor(Math.random() * segments.length)];
  };

  const getUpcomingHolidays = (date) => {
    // Simple holiday detection
    const month = date.getMonth();
    const day = date.getDate();

    const holidays = [];

    if (month === 11) holidays.push('Christmas'); // December
    if (month === 1 && day < 15) holidays.push("Valentine's Day"); // February
    if (month === 4) holidays.push("Mother's Day"); // May
    if (month === 5) holidays.push("Father's Day"); // June

    return holidays;
  };

  const generateConversionBoosts = (optimization) => {
    const boosts = [
      {
        type: 'price_anchoring',
        title: 'Smart Pricing',
        description: `Optimized to $${optimization.optimizedPrice.toFixed(2)} for maximum appeal`,
        impact: '+12% conversion'
      },
      {
        type: 'urgency_placement',
        title: 'Strategic Urgency',
        description: 'Urgency messages placed at optimal decision points',
        impact: '+18% conversion'
      },
      {
        type: 'social_proof_boost',
        title: 'Social Validation',
        description: `${optimization.socialProofScore}/100 social proof score`,
        impact: '+15% conversion'
      },
      {
        type: 'affiliate_optimization',
        title: 'Revenue Maximization',
        description: `${optimization.affiliateRate}% commission rate optimized`,
        impact: `$${optimization.revenueProjection.daily.toFixed(2)}/day projected`
      }
    ];

    setConversionBoosts(boosts);
  };

  const handleOptimizedPurchase = () => {
    const optimizedLink = generateOptimizedAffiliateLink(gift, optimizedData);

    // Track conversion event
    onTrackEvent?.('optimized_purchase_click', {
      gift_id: gift.id,
      optimization_data: optimizedData,
      urgency_level: urgencyLevel,
      conversion_probability: optimizedData.conversionProbability
    });

    onOptimizedLink?.(optimizedLink, optimizedData);
  };

  const generateOptimizedAffiliateLink = (gift, optimization) => {
    // Enhanced affiliate link with tracking parameters
    const baseLink = gift.affiliate_link || `https://amazon.com/dp/${gift.id}`;

    const trackingParams = {
      tag: 'giftgenius-20', // Amazon affiliate tag
      creative: 'GG_OPT', // Campaign identifier
      creativeASIN: gift.id,
      linkCode: 'as2',
      ref: `gg_opt_${optimization.conversionProbability}`,
      camp: '1789',
      creative: '9325'
    };

    const paramString = Object.entries(trackingParams)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    return `${baseLink}${baseLink.includes('?') ? '&' : '?'}${paramString}`;
  };

  if (!optimizedData) return null;

  return (
    <div className="revenue-optimizer">
      <div className="optimization-header">
        <h4>🚀 Revenue Optimization Active</h4>
        <div className="conversion-score">
          <span className="score">{optimizedData.conversionProbability}%</span>
          <span className="score-label">Conversion Probability</span>
        </div>
      </div>

      <div className="revenue-metrics">
        <div className="metric">
          <span className="metric-label">Daily Revenue</span>
          <span className="metric-value">${optimizedData.revenueProjection.daily.toFixed(2)}</span>
        </div>
        <div className="metric">
          <span className="metric-label">Commission Rate</span>
          <span className="metric-value">{optimizedData.affiliateRate}%</span>
        </div>
        <div className="metric">
          <span className="metric-label">Social Proof</span>
          <span className="metric-value">{optimizedData.socialProofScore}/100</span>
        </div>
      </div>

      <div className="conversion-boosts">
        <h5>Active Conversion Boosts</h5>
        {conversionBoosts.map((boost, index) => (
          <div key={index} className="boost-item">
            <div className="boost-content">
              <strong>{boost.title}</strong>
              <p>{boost.description}</p>
            </div>
            <div className="boost-impact">{boost.impact}</div>
          </div>
        ))}
      </div>

      {optimizedData.personalizedDiscount > 0 && (
        <div className="personalized-offer">
          <div className="offer-badge">PERSONALIZED OFFER</div>
          <div className="offer-content">
            <span className="discount-percentage">{optimizedData.personalizedDiscount}% OFF</span>
            <span className="offer-description">Special discount just for you!</span>
          </div>
        </div>
      )}

      <div className="urgency-triggers">
        {optimizedData.urgencyTriggers.map((trigger, index) => (
          <div key={index} className={`urgency-item ${trigger.impact}`}>
            <span className="urgency-icon">⚡</span>
            <span className="urgency-message">{trigger.message}</span>
          </div>
        ))}
      </div>

      <button className="optimized-purchase-btn" onClick={handleOptimizedPurchase}>
        🎯 Get Optimized Deal - ${optimizedData.optimizedPrice.toFixed(2)}
      </button>
    </div>
  );
};

export default RevenueOptimizer;