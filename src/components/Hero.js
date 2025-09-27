import React from 'react';

const Hero = ({ onScenarioSelect }) => {
  const scenarios = [
    {
      id: 'birthday',
      emoji: '🎂',
      title: 'Birthday',
      description: 'Make their day special',
      color: '#ec4899'
    },
    {
      id: 'anniversary',
      emoji: '💑',
      title: 'Anniversary',
      description: 'Celebrate your love',
      color: '#ef4444'
    },
    {
      id: 'wedding',
      emoji: '💍',
      title: 'Wedding',
      description: 'Perfect for couples',
      color: '#f59e0b'
    },
    {
      id: 'holiday',
      emoji: '🎄',
      title: 'Holiday',
      description: 'Spread joy this season',
      color: '#10b981'
    },
    {
      id: 'thankyou',
      emoji: '🙏',
      title: 'Thank You',
      description: 'Show appreciation',
      color: '#6366f1'
    },
    {
      id: 'justthanks',
      emoji: '💝',
      title: 'Just Because',
      description: 'Surprise someone',
      color: '#8b5cf6'
    }
  ];

  return (
    <div className="hero-new">
      <div className="hero-background">
        <div className="hero-gradient"></div>
      </div>

      <div className="hero-content-new">
        <div className="hero-badge">
          <span className="badge-icon">✨</span>
          <span>Trusted by 50,000+ gift givers</span>
        </div>

        <h1 className="hero-title">
          Find the Perfect Gift
          <br />
          <span className="hero-title-gradient">For Any Occasion</span>
        </h1>

        <p className="hero-description">
          Answer a few quick questions and we'll match you with gifts that have a 95% success rate.
          No more guessing, no more gift cards.
        </p>

        <div className="hero-cta">
          <button className="cta-primary" onClick={() => onScenarioSelect('wizard')}>
            <span className="cta-icon">🎯</span>
            Start Gift Finder
            <span className="cta-arrow">→</span>
          </button>
          <button className="cta-secondary" onClick={() => onScenarioSelect('browse')}>
            Browse All Gifts
          </button>
        </div>

        <div className="quick-scenarios">
          <p className="scenarios-label">Or jump to a specific occasion:</p>
          <div className="scenarios-grid">
            {scenarios.map(scenario => (
              <button
                key={scenario.id}
                className="scenario-card"
                onClick={() => onScenarioSelect(scenario.id)}
                style={{ '--scenario-color': scenario.color }}
              >
                <span className="scenario-emoji">{scenario.emoji}</span>
                <div className="scenario-info">
                  <div className="scenario-title">{scenario.title}</div>
                  <div className="scenario-description">{scenario.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="trust-stats">
          <div className="stat">
            <div className="stat-value">50K+</div>
            <div className="stat-label">Happy Customers</div>
          </div>
          <div className="stat">
            <div className="stat-value">95%</div>
            <div className="stat-label">Success Rate</div>
          </div>
          <div className="stat">
            <div className="stat-value">29</div>
            <div className="stat-label">Curated Gifts</div>
          </div>
          <div className="stat">
            <div className="stat-value">4.9★</div>
            <div className="stat-label">Average Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;