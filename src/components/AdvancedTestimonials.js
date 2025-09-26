import React, { useState, useEffect } from 'react';

// Advanced Testimonial Sentiment Analyzer
export class TestimonialAnalyzer {
  constructor() {
    this.sentimentWords = {
      positive: [
        'amazing', 'wonderful', 'perfect', 'fantastic', 'excellent', 'brilliant',
        'outstanding', 'incredible', 'fabulous', 'superb', 'magnificent', 'delighted',
        'thrilled', 'impressed', 'satisfied', 'pleased', 'happy', 'joy', 'love',
        'beautiful', 'gorgeous', 'stunning', 'elegant', 'quality', 'recommend'
      ],
      negative: [
        'terrible', 'awful', 'horrible', 'disappointing', 'waste', 'regret',
        'poor', 'cheap', 'flimsy', 'broken', 'defective', 'useless', 'hate',
        'annoying', 'frustrated', 'angry', 'upset', 'dissatisfied', 'problem'
      ],
      emotional: [
        'tears', 'crying', 'emotional', 'touched', 'moved', 'speechless',
        'surprised', 'shocked', 'grateful', 'thankful', 'blessed', 'lucky',
        'precious', 'treasure', 'memory', 'special', 'meaningful', 'heartfelt'
      ]
    };

    this.occasions = [
      'birthday', 'anniversary', 'wedding', 'graduation', 'christmas', 'valentine',
      'mother', 'father', 'holiday', 'thanksgiving', 'easter', 'hanukkah'
    ];
  }

  analyzeSentiment(text) {
    const words = text.toLowerCase().split(/\W+/);
    let positiveScore = 0;
    let negativeScore = 0;
    let emotionalScore = 0;

    words.forEach(word => {
      if (this.sentimentWords.positive.includes(word)) positiveScore++;
      if (this.sentimentWords.negative.includes(word)) negativeScore++;
      if (this.sentimentWords.emotional.includes(word)) emotionalScore++;
    });

    const totalWords = words.length;
    const sentiment = {
      positive: positiveScore / totalWords,
      negative: negativeScore / totalWords,
      emotional: emotionalScore / totalWords,
      overall: (positiveScore - negativeScore) / totalWords
    };

    return {
      ...sentiment,
      label: this.getSentimentLabel(sentiment.overall),
      intensity: Math.abs(sentiment.overall)
    };
  }

  getSentimentLabel(score) {
    if (score > 0.1) return 'very-positive';
    if (score > 0.05) return 'positive';
    if (score < -0.05) return 'negative';
    return 'neutral';
  }

  extractOccasion(text) {
    const lowerText = text.toLowerCase();
    for (const occasion of this.occasions) {
      if (lowerText.includes(occasion)) {
        return occasion;
      }
    }
    return null;
  }

  categorizeTestimonial(text, gift) {
    const categories = [];

    // Quality mentions
    if (/quality|well.made|durable|sturdy/i.test(text)) {
      categories.push('quality');
    }

    // Value mentions
    if (/worth|value|price|afford|cheap|expensive/i.test(text)) {
      categories.push('value');
    }

    // Delivery mentions
    if (/delivery|shipping|arrived|fast|quick|slow/i.test(text)) {
      categories.push('delivery');
    }

    // Gift reaction
    if (/loved|reaction|surprise|face|expression|happy|smile/i.test(text)) {
      categories.push('recipient-reaction');
    }

    // Appearance
    if (/beautiful|gorgeous|pretty|elegant|stylish|looks/i.test(text)) {
      categories.push('appearance');
    }

    return categories;
  }

  generateInsights(testimonials) {
    const insights = {
      totalCount: testimonials.length,
      averageSentiment: 0,
      topCategories: {},
      commonOccasions: {},
      sentimentDistribution: { positive: 0, negative: 0, neutral: 0 },
      emotionalIntensity: 0
    };

    let totalSentiment = 0;
    let totalEmotional = 0;

    testimonials.forEach(testimonial => {
      const sentiment = this.analyzeSentiment(testimonial.text);
      const categories = this.categorizeTestimonial(testimonial.text);
      const occasion = this.extractOccasion(testimonial.text);

      totalSentiment += sentiment.overall;
      totalEmotional += sentiment.emotional;

      insights.sentimentDistribution[sentiment.label === 'very-positive' ? 'positive' : sentiment.label]++;

      categories.forEach(category => {
        insights.topCategories[category] = (insights.topCategories[category] || 0) + 1;
      });

      if (occasion) {
        insights.commonOccasions[occasion] = (insights.commonOccasions[occasion] || 0) + 1;
      }
    });

    insights.averageSentiment = totalSentiment / testimonials.length;
    insights.emotionalIntensity = totalEmotional / testimonials.length;

    return insights;
  }
}

// Smart Testimonial Filter Component
export const SmartTestimonialFilter = ({ testimonials, onFilterChange, analyzer }) => {
  const [activeFilters, setActiveFilters] = useState([]);
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    if (testimonials.length > 0) {
      const testimonialInsights = analyzer.generateInsights(testimonials);
      setInsights(testimonialInsights);
    }
  }, [testimonials, analyzer]);

  const filterOptions = [
    { id: 'positive', label: '😊 Positive', type: 'sentiment' },
    { id: 'emotional', label: '❤️ Emotional', type: 'sentiment' },
    { id: 'quality', label: '⭐ Quality Focus', type: 'category' },
    { id: 'value', label: '💰 Value Focus', type: 'category' },
    { id: 'recipient-reaction', label: '🎉 Great Reactions', type: 'category' },
    { id: 'recent', label: '🕒 Recent Reviews', type: 'time' }
  ];

  const handleFilterToggle = (filterId) => {
    const newFilters = activeFilters.includes(filterId)
      ? activeFilters.filter(f => f !== filterId)
      : [...activeFilters, filterId];

    setActiveFilters(newFilters);

    // Apply filters
    let filtered = testimonials;

    if (newFilters.includes('positive')) {
      filtered = filtered.filter(t => analyzer.analyzeSentiment(t.text).overall > 0.05);
    }

    if (newFilters.includes('emotional')) {
      filtered = filtered.filter(t => analyzer.analyzeSentiment(t.text).emotional > 0.02);
    }

    if (newFilters.includes('quality')) {
      filtered = filtered.filter(t => analyzer.categorizeTestimonial(t.text).includes('quality'));
    }

    if (newFilters.includes('value')) {
      filtered = filtered.filter(t => analyzer.categorizeTestimonial(t.text).includes('value'));
    }

    if (newFilters.includes('recipient-reaction')) {
      filtered = filtered.filter(t => analyzer.categorizeTestimonial(t.text).includes('recipient-reaction'));
    }

    if (newFilters.includes('recent')) {
      const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(t => new Date(t.date || Date.now()) > thirtyDaysAgo);
    }

    onFilterChange(filtered);
  };

  if (!insights) return null;

  return (
    <div className="smart-testimonial-filter">
      <div className="filter-header">
        <h3>📊 Review Insights</h3>
        <div className="insights-summary">
          <div className="insight-stat">
            <span className="stat-value">{insights.totalCount}</span>
            <span className="stat-label">Total Reviews</span>
          </div>
          <div className="insight-stat">
            <span className="stat-value">{Math.round(insights.averageSentiment * 100 + 50)}%</span>
            <span className="stat-label">Satisfaction</span>
          </div>
          <div className="insight-stat">
            <span className="stat-value">{insights.sentimentDistribution.positive}</span>
            <span className="stat-label">Positive Reviews</span>
          </div>
        </div>
      </div>

      <div className="filter-options">
        <h4>Filter Reviews:</h4>
        <div className="filter-buttons">
          {filterOptions.map(option => (
            <button
              key={option.id}
              className={`filter-btn ${activeFilters.includes(option.id) ? 'active' : ''}`}
              onClick={() => handleFilterToggle(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="active-filters">
          <span>Active filters:</span>
          {activeFilters.map(filterId => (
            <span key={filterId} className="active-filter-tag">
              {filterOptions.find(opt => opt.id === filterId)?.label}
              <button onClick={() => handleFilterToggle(filterId)}>×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// Enhanced Testimonial Card
export const EnhancedTestimonialCard = ({ testimonial, analyzer, showAnalysis = false }) => {
  const [expanded, setExpanded] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    if (showAnalysis) {
      const sentiment = analyzer.analyzeSentiment(testimonial.text);
      const categories = analyzer.categorizeTestimonial(testimonial.text);
      const occasion = analyzer.extractOccasion(testimonial.text);

      setAnalysis({ sentiment, categories, occasion });
    }
  }, [testimonial, analyzer, showAnalysis]);

  const getSentimentEmoji = (label) => {
    switch (label) {
      case 'very-positive': return '🌟';
      case 'positive': return '😊';
      case 'negative': return '😕';
      default: return '😐';
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'quality': '⭐',
      'value': '💰',
      'delivery': '🚚',
      'recipient-reaction': '🎉',
      'appearance': '✨'
    };
    return icons[category] || '📝';
  };

  const truncatedText = testimonial.text.length > 150
    ? testimonial.text.substring(0, 150) + '...'
    : testimonial.text;

  return (
    <div className="enhanced-testimonial-card">
      <div className="testimonial-header">
        <div className="author-info">
          <div className="author-avatar">
            {testimonial.author[0].toUpperCase()}
          </div>
          <div className="author-details">
            <h4 className="author-name">{testimonial.author}</h4>
            <div className="testimonial-meta">
              <span className="rating">
                {'★'.repeat(testimonial.rating || 5)}
              </span>
              {analysis && (
                <span className="sentiment-indicator">
                  {getSentimentEmoji(analysis.sentiment.label)}
                </span>
              )}
            </div>
          </div>
        </div>

        {analysis && analysis.occasion && (
          <div className="occasion-badge">
            {analysis.occasion}
          </div>
        )}
      </div>

      <div className="testimonial-content">
        <p className="testimonial-text">
          {expanded ? testimonial.text : truncatedText}
        </p>

        {testimonial.text.length > 150 && (
          <button
            className="expand-btn"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}

        {analysis && analysis.categories.length > 0 && (
          <div className="testimonial-categories">
            {analysis.categories.map(category => (
              <span key={category} className="category-tag">
                {getCategoryIcon(category)} {category.replace('-', ' ')}
              </span>
            ))}
          </div>
        )}
      </div>

      {analysis && showAnalysis && (
        <div className="testimonial-analysis">
          <div className="sentiment-score">
            <div className="score-bar">
              <div
                className="score-fill"
                style={{
                  width: `${Math.abs(analysis.sentiment.overall) * 100}%`,
                  backgroundColor: analysis.sentiment.overall > 0 ? '#10B981' : '#EF4444'
                }}
              />
            </div>
            <span className="score-label">
              {analysis.sentiment.label} ({Math.round(analysis.sentiment.intensity * 100)}%)
            </span>
          </div>
        </div>
      )}

      <div className="testimonial-footer">
        <span className="testimonial-date">
          {new Date(testimonial.date || Date.now()).toLocaleDateString()}
        </span>
        {testimonial.verified && (
          <span className="verified-badge">
            ✓ Verified Purchase
          </span>
        )}
      </div>
    </div>
  );
};

// Testimonial Insights Dashboard
export const TestimonialInsightsDashboard = ({ testimonials, analyzer }) => {
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    if (testimonials.length > 0) {
      const analysisResults = analyzer.generateInsights(testimonials);
      setInsights(analysisResults);
    }
  }, [testimonials, analyzer]);

  if (!insights) return null;

  const topCategories = Object.entries(insights.topCategories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const topOccasions = Object.entries(insights.commonOccasions)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div className="testimonial-insights-dashboard">
      <h3>🎯 Review Analysis</h3>

      <div className="insights-grid">
        <div className="insight-card">
          <h4>Satisfaction Score</h4>
          <div className="big-metric">
            {Math.round(insights.averageSentiment * 100 + 50)}%
          </div>
          <p>Overall customer satisfaction</p>
        </div>

        <div className="insight-card">
          <h4>Emotional Impact</h4>
          <div className="big-metric">
            {Math.round(insights.emotionalIntensity * 1000) / 10}
          </div>
          <p>Emotional response intensity</p>
        </div>

        <div className="insight-card">
          <h4>Top Themes</h4>
          <div className="themes-list">
            {topCategories.map(([category, count]) => (
              <div key={category} className="theme-item">
                <span className="theme-name">{category.replace('-', ' ')}</span>
                <span className="theme-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="insight-card">
          <h4>Popular Occasions</h4>
          <div className="occasions-list">
            {topOccasions.map(([occasion, count]) => (
              <div key={occasion} className="occasion-item">
                <span className="occasion-name">{occasion}</span>
                <span className="occasion-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="sentiment-distribution">
        <h4>Review Distribution</h4>
        <div className="distribution-chart">
          <div className="bar positive" style={{ flex: insights.sentimentDistribution.positive }}>
            <span>Positive ({insights.sentimentDistribution.positive})</span>
          </div>
          <div className="bar neutral" style={{ flex: insights.sentimentDistribution.neutral }}>
            <span>Neutral ({insights.sentimentDistribution.neutral})</span>
          </div>
          <div className="bar negative" style={{ flex: insights.sentimentDistribution.negative }}>
            <span>Negative ({insights.sentimentDistribution.negative})</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialAnalyzer;