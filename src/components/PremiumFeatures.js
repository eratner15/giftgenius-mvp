import React, { useState, useEffect, useCallback, useMemo } from 'react';

// Premium Subscription Manager
export class PremiumSubscriptionManager {
  constructor() {
    this.subscriptionTiers = {
      free: {
        id: 'free',
        name: 'GiftGenius Free',
        price: 0,
        period: 'forever',
        features: [
          'Basic gift recommendations',
          'Limited testimonial access',
          '10 gift saves per month',
          'Standard search filters'
        ],
        limits: {
          savedGifts: 10,
          testimonialViews: 20,
          advancedFilters: false,
          conciergeAccess: false,
          analytics: false
        }
      },
      pro: {
        id: 'pro',
        name: 'GiftGenius Pro',
        price: 9.99,
        period: 'month',
        features: [
          'AI-powered personalized recommendations',
          'Unlimited gift saves and collections',
          'Premium testimonials and success stories',
          'Advanced search and filtering',
          'Personal gift calendar and reminders',
          'Gift success analytics',
          'Priority customer support',
          'Early access to new features'
        ],
        limits: {
          savedGifts: Infinity,
          testimonialViews: Infinity,
          advancedFilters: true,
          conciergeAccess: false,
          analytics: true
        },
        badge: 'MOST POPULAR'
      },
      concierge: {
        id: 'concierge',
        name: 'GiftGenius Concierge',
        price: 29.99,
        period: 'month',
        features: [
          'Everything in Pro',
          'Personal gift concierge service',
          '1-on-1 gift consultations',
          'Custom gift curation',
          'Relationship milestone tracking',
          'White-glove gift delivery',
          '24/7 premium support',
          'Exclusive luxury gift access'
        ],
        limits: {
          savedGifts: Infinity,
          testimonialViews: Infinity,
          advancedFilters: true,
          conciergeAccess: true,
          analytics: true
        },
        badge: 'PREMIUM'
      }
    };

    this.loadUserSubscription();
  }

  loadUserSubscription() {
    const saved = localStorage.getItem('giftgenius_subscription');
    this.currentSubscription = saved ? JSON.parse(saved) : {
      tier: 'free',
      expiresAt: null,
      features: this.subscriptionTiers.free.limits
    };
  }

  saveUserSubscription() {
    localStorage.setItem('giftgenius_subscription', JSON.stringify(this.currentSubscription));
  }

  getCurrentTier() {
    return this.currentSubscription.tier;
  }

  hasFeature(feature) {
    return this.currentSubscription.features[feature] === true ||
           this.currentSubscription.features[feature] === Infinity;
  }

  getFeatureLimit(feature) {
    return this.currentSubscription.features[feature] || 0;
  }

  upgradeTo(tierId) {
    const tier = this.subscriptionTiers[tierId];
    if (!tier) return false;

    this.currentSubscription = {
      tier: tierId,
      expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days
      features: tier.limits,
      purchasedAt: Date.now()
    };

    this.saveUserSubscription();
    return true;
  }

  isExpired() {
    if (!this.currentSubscription.expiresAt) return false;
    return Date.now() > this.currentSubscription.expiresAt;
  }
}

// Subscription Upgrade Modal
export const SubscriptionUpgradeModal = ({ isOpen, onClose, onUpgrade, currentTier = 'free' }) => {
  const [selectedTier, setSelectedTier] = useState('pro');
  const [billingPeriod, setBillingPeriod] = useState('monthly');

  const subscriptionManager = useMemo(() => new PremiumSubscriptionManager(), []);

  const handleUpgrade = () => {
    onUpgrade(selectedTier, billingPeriod);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="subscription-modal-overlay">
      <div className="subscription-modal">
        <div className="subscription-header">
          <h2>🚀 Upgrade to GiftGenius Pro</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="billing-toggle">
          <div className="toggle-group">
            <button
              className={`toggle-btn ${billingPeriod === 'monthly' ? 'active' : ''}`}
              onClick={() => setBillingPeriod('monthly')}
            >
              Monthly
            </button>
            <button
              className={`toggle-btn ${billingPeriod === 'yearly' ? 'active' : ''}`}
              onClick={() => setBillingPeriod('yearly')}
            >
              Yearly
              <span className="discount-badge">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="subscription-tiers">
          {Object.values(subscriptionManager.subscriptionTiers).map(tier => {
            const isCurrentTier = tier.id === currentTier;
            const yearlyPrice = billingPeriod === 'yearly' ? tier.price * 10 : tier.price;
            const monthlyPrice = billingPeriod === 'yearly' ? yearlyPrice / 12 : tier.price;

            return (
              <div
                key={tier.id}
                className={`tier-card ${tier.id} ${selectedTier === tier.id ? 'selected' : ''} ${isCurrentTier ? 'current' : ''}`}
                onClick={() => !isCurrentTier && setSelectedTier(tier.id)}
              >
                {tier.badge && <div className="tier-badge">{tier.badge}</div>}

                <div className="tier-header">
                  <h3>{tier.name}</h3>
                  <div className="tier-price">
                    {tier.price === 0 ? (
                      <span className="price-free">Free</span>
                    ) : (
                      <>
                        <span className="price-amount">${monthlyPrice.toFixed(2)}</span>
                        <span className="price-period">/month</span>
                        {billingPeriod === 'yearly' && (
                          <span className="price-savings">
                            Save ${(tier.price * 12 - yearlyPrice).toFixed(2)}/year
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="tier-features">
                  {tier.features.map((feature, index) => (
                    <div key={index} className="feature-item">
                      <span className="feature-check">✓</span>
                      <span className="feature-text">{feature}</span>
                    </div>
                  ))}
                </div>

                {isCurrentTier && (
                  <div className="current-plan">Current Plan</div>
                )}
              </div>
            );
          })}
        </div>

        <div className="subscription-footer">
          <button className="btn-secondary" onClick={onClose}>
            Maybe Later
          </button>
          <button
            className="btn-primary upgrade-btn"
            onClick={handleUpgrade}
            disabled={selectedTier === currentTier}
          >
            {selectedTier === currentTier ? 'Current Plan' : `Upgrade to ${subscriptionManager.subscriptionTiers[selectedTier]?.name}`}
          </button>
        </div>

        <div className="subscription-benefits">
          <div className="benefit-item">
            <span className="benefit-icon">🔒</span>
            <span>30-day money-back guarantee</span>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">📱</span>
            <span>Cancel anytime</span>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">⚡</span>
            <span>Instant access to all features</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Premium Feature Gate
export const PremiumFeatureGate = ({
  feature,
  children,
  fallback,
  subscriptionManager,
  onUpgradePrompt
}) => {
  const hasAccess = subscriptionManager.hasFeature(feature);

  if (hasAccess) {
    return children;
  }

  return (
    <div className="premium-gate">
      <div className="premium-gate-content">
        <div className="premium-icon">👑</div>
        <h3>Premium Feature</h3>
        <p>Upgrade to GiftGenius Pro to unlock this feature</p>
        <button className="btn-premium" onClick={onUpgradePrompt}>
          Upgrade Now
        </button>
      </div>
      {fallback && (
        <div className="premium-fallback">
          {fallback}
        </div>
      )}
    </div>
  );
};

// Personal Gift Concierge
export const PersonalGiftConcierge = ({ subscriptionManager }) => {
  const [consultationRequests, setConsultationRequests] = useState([]);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestForm, setRequestForm] = useState({
    occasion: '',
    partnerDetails: '',
    budget: '',
    preferences: '',
    deadline: '',
    urgency: 'normal'
  });

  const submitConsultationRequest = useCallback((formData) => {
    const request = {
      id: `req_${Date.now()}`,
      ...formData,
      status: 'pending',
      createdAt: Date.now(),
      estimatedResponse: Date.now() + (2 * 60 * 60 * 1000) // 2 hours
    };

    setConsultationRequests(prev => [request, ...prev]);
    setShowRequestForm(false);
    setRequestForm({
      occasion: '',
      partnerDetails: '',
      budget: '',
      preferences: '',
      deadline: '',
      urgency: 'normal'
    });
  }, []);

  return (
    <div className="concierge-service">
      <div className="concierge-header">
        <div className="concierge-title">
          <h2>🎩 Personal Gift Concierge</h2>
          <p>Get expert 1-on-1 gift recommendations from our specialists</p>
        </div>

        <button
          className="btn-primary"
          onClick={() => setShowRequestForm(true)}
        >
          Request Consultation
        </button>
      </div>

      {/* Active Requests */}
      {consultationRequests.length > 0 && (
        <div className="consultation-requests">
          <h3>Your Consultation Requests</h3>
          {consultationRequests.map(request => (
            <div key={request.id} className="request-card">
              <div className="request-header">
                <div className="request-info">
                  <h4>{request.occasion}</h4>
                  <span className={`status-badge ${request.status}`}>
                    {request.status}
                  </span>
                </div>
                <div className="request-time">
                  {new Date(request.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="request-details">
                <p><strong>Budget:</strong> ${request.budget}</p>
                <p><strong>Deadline:</strong> {request.deadline}</p>
                <div className="request-response-time">
                  Expected response: {new Date(request.estimatedResponse).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Request Form Modal */}
      {showRequestForm && (
        <div className="consultation-modal-overlay">
          <div className="consultation-modal">
            <div className="consultation-modal-header">
              <h3>Request Personal Consultation</h3>
              <button
                className="close-btn"
                onClick={() => setShowRequestForm(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              submitConsultationRequest(requestForm);
            }}>
              <div className="form-group">
                <label>What's the occasion?</label>
                <select
                  value={requestForm.occasion}
                  onChange={(e) => setRequestForm(prev => ({...prev, occasion: e.target.value}))}
                  required
                >
                  <option value="">Select occasion</option>
                  <option value="anniversary">Anniversary</option>
                  <option value="birthday">Birthday</option>
                  <option value="valentine">Valentine's Day</option>
                  <option value="christmas">Christmas</option>
                  <option value="apology">Apology</option>
                  <option value="just-because">Just Because</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Tell us about your partner</label>
                <textarea
                  value={requestForm.partnerDetails}
                  onChange={(e) => setRequestForm(prev => ({...prev, partnerDetails: e.target.value}))}
                  placeholder="Age, interests, style preferences, relationship length, etc."
                  rows={3}
                  required
                />
              </div>

              <div className="form-group">
                <label>Budget Range</label>
                <select
                  value={requestForm.budget}
                  onChange={(e) => setRequestForm(prev => ({...prev, budget: e.target.value}))}
                  required
                >
                  <option value="">Select budget</option>
                  <option value="under-50">Under $50</option>
                  <option value="50-100">$50 - $100</option>
                  <option value="100-250">$100 - $250</option>
                  <option value="250-500">$250 - $500</option>
                  <option value="500-plus">$500+</option>
                </select>
              </div>

              <div className="form-group">
                <label>Special preferences or requirements</label>
                <textarea
                  value={requestForm.preferences}
                  onChange={(e) => setRequestForm(prev => ({...prev, preferences: e.target.value}))}
                  placeholder="Allergies, dislikes, specific brands, personalization needs, etc."
                  rows={2}
                />
              </div>

              <div className="form-group">
                <label>When do you need this?</label>
                <input
                  type="date"
                  value={requestForm.deadline}
                  onChange={(e) => setRequestForm(prev => ({...prev, deadline: e.target.value}))}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="form-group">
                <label>Urgency Level</label>
                <div className="urgency-options">
                  {[
                    { value: 'normal', label: 'Normal', time: '2-4 hours' },
                    { value: 'urgent', label: 'Urgent', time: '1-2 hours', cost: '+$10' },
                    { value: 'emergency', label: 'Emergency', time: '30 minutes', cost: '+$25' }
                  ].map(option => (
                    <label key={option.value} className="urgency-option">
                      <input
                        type="radio"
                        value={option.value}
                        checked={requestForm.urgency === option.value}
                        onChange={(e) => setRequestForm(prev => ({...prev, urgency: e.target.value}))}
                      />
                      <div className="urgency-info">
                        <span className="urgency-label">{option.label}</span>
                        <span className="urgency-time">{option.time}</span>
                        {option.cost && <span className="urgency-cost">{option.cost}</span>}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="consultation-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowRequestForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Service Features */}
      <div className="concierge-features">
        <div className="feature-card">
          <div className="feature-icon">👨‍💼</div>
          <h4>Expert Consultants</h4>
          <p>Certified relationship and gift specialists</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🎯</div>
          <h4>Personalized Curation</h4>
          <p>Custom recommendations based on your unique situation</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h4>Fast Response</h4>
          <p>Get expert advice within hours, not days</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">💝</div>
          <h4>Success Guaranteed</h4>
          <p>100% satisfaction or your money back</p>
        </div>
      </div>
    </div>
  );
};

// Premium Analytics Dashboard
export const PremiumAnalyticsDashboard = ({ subscriptionManager }) => {
  const [analyticsData, setAnalyticsData] = useState({
    giftingStats: {
      totalGiftsViewed: 247,
      averageTimeSpent: '3m 42s',
      favoriteCategories: ['jewelry', 'experiences', 'fashion'],
      successRate: 94,
      partnerSatisfaction: 4.8
    },
    giftHistory: [
      {
        id: 1,
        occasion: 'Anniversary',
        gift: 'Diamond Necklace',
        date: '2024-02-14',
        success: true,
        partnerRating: 5,
        cost: 299
      },
      {
        id: 2,
        occasion: 'Birthday',
        gift: 'Spa Day Experience',
        date: '2024-01-15',
        success: true,
        partnerRating: 5,
        cost: 150
      }
    ],
    insights: [
      {
        type: 'trend',
        title: 'Your gift style is evolving',
        description: 'You\'ve shown 40% more interest in experience gifts this month',
        actionable: true
      },
      {
        type: 'prediction',
        title: 'Upcoming opportunity',
        description: 'Valentine\'s Day is in 23 days - start browsing romantic gifts now',
        actionable: true
      }
    ]
  });

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <h2>📊 Your Gift Analytics</h2>
        <p>Insights to make you an even better gift-giver</p>
      </div>

      {/* Key Stats */}
      <div className="analytics-stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3>{analyticsData.giftingStats.successRate}%</h3>
            <p>Success Rate</p>
            <span className="stat-trend positive">+5% this month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3>{analyticsData.giftingStats.partnerSatisfaction}</h3>
            <p>Partner Rating</p>
            <span className="stat-trend positive">+0.3 this year</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👀</div>
          <div className="stat-content">
            <h3>{analyticsData.giftingStats.totalGiftsViewed}</h3>
            <p>Gifts Explored</p>
            <span className="stat-trend">This month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-content">
            <h3>{analyticsData.giftingStats.averageTimeSpent}</h3>
            <p>Avg. Browse Time</p>
            <span className="stat-trend">Per session</span>
          </div>
        </div>
      </div>

      {/* Gift History */}
      <div className="analytics-section">
        <h3>🎁 Your Gift History</h3>
        <div className="gift-history-list">
          {analyticsData.giftHistory.map(gift => (
            <div key={gift.id} className="history-item">
              <div className="history-info">
                <h4>{gift.gift}</h4>
                <p>{gift.occasion} • {new Date(gift.date).toLocaleDateString()}</p>
              </div>
              <div className="history-stats">
                <div className="rating">
                  {'⭐'.repeat(gift.partnerRating)}
                </div>
                <div className="cost">${gift.cost}</div>
                <div className={`success-badge ${gift.success ? 'success' : 'neutral'}`}>
                  {gift.success ? '✅ Success' : '⚠️ Learning'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights & Recommendations */}
      <div className="analytics-section">
        <h3>💡 Personalized Insights</h3>
        <div className="insights-list">
          {analyticsData.insights.map((insight, index) => (
            <div key={index} className={`insight-card ${insight.type}`}>
              <div className="insight-content">
                <h4>{insight.title}</h4>
                <p>{insight.description}</p>
              </div>
              {insight.actionable && (
                <button className="btn-insight">Take Action</button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Category Preferences */}
      <div className="analytics-section">
        <h3>🏷️ Your Favorite Categories</h3>
        <div className="category-preferences">
          {analyticsData.giftingStats.favoriteCategories.map((category, index) => (
            <div key={category} className="category-bar">
              <div className="category-info">
                <span className="category-name">{category}</span>
                <span className="category-percentage">{85 - (index * 15)}%</span>
              </div>
              <div className="category-progress">
                <div
                  className="category-fill"
                  style={{ width: `${85 - (index * 15)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default {
  PremiumSubscriptionManager,
  SubscriptionUpgradeModal,
  PremiumFeatureGate,
  PersonalGiftConcierge,
  PremiumAnalyticsDashboard
};