import React, { useState } from 'react';

const Testimonials = () => {
  const [email, setEmail] = useState('');
  const [story, setStory] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Track submission for analytics
    if (window.gtag) {
      window.gtag('event', 'story_submission', {
        event_category: 'engagement',
        event_label: 'share_story'
      });
    }
    setSubmitted(true);
    // Here you would normally send to your email service
  };

  const realStats = [
    { number: "113", label: "Curated Gifts" },
    { number: "8", label: "Categories" },
    { number: "Free", label: "To Use" },
    { number: "24/7", label: "Available" }
  ];

  if (submitted) {
    return (
      <section className="testimonials-section">
        <div className="testimonials-container">
          <div className="success-message">
            <h2>Thank You! 🎉</h2>
            <p>We've received your story and will be in touch soon with your 25% discount code!</p>
            <div className="gift-icon">🎁</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        <div className="testimonials-header">
          <h2>Share Your Gift Success Story</h2>
          <p>Tell us about a gift that made someone's day and get 25% off your next purchase</p>
        </div>

        {/* Real Stats Section */}
        <div className="testimonials-stats">
          {realStats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Story Submission Form */}
        <div className="story-submission">
          <div className="story-form-container">
            <div className="form-header">
              <h3>Share Your Story & Save 25%</h3>
              <p>Help other gift-givers by sharing your success story</p>
            </div>

            <form onSubmit={handleSubmit} className="story-form">
              <div className="form-group">
                <label htmlFor="story">Your Gift Success Story</label>
                <textarea
                  id="story"
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  placeholder="Tell us about a gift that was a huge hit! What was the occasion? Who was it for? What made it special?"
                  rows="6"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Your Email (for 25% discount code)</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>

              <button type="submit" className="submit-story-btn">
                Share My Story & Get 25% Off
              </button>

              <p className="form-disclaimer">
                We'll never spam you. One-time discount code via email only.
              </p>
            </form>
          </div>

          <div className="story-benefits">
            <h4>Why Share Your Story?</h4>
            <ul>
              <li>🎁 Get 25% off your next gift purchase</li>
              <li>💝 Help others find perfect gifts</li>
              <li>⭐ Build a community of thoughtful gift-givers</li>
              <li>📧 Join our exclusive gift ideas newsletter</li>
            </ul>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="trust-indicators">
          <div className="trust-item">
            <div className="trust-icon">🔒</div>
            <div className="trust-text">Secure & Private</div>
          </div>
          <div className="trust-item">
            <div className="trust-icon">📧</div>
            <div className="trust-text">No Spam Promise</div>
          </div>
          <div className="trust-item">
            <div className="trust-icon">💝</div>
            <div className="trust-text">Real Gift Ideas</div>
          </div>
          <div className="trust-item">
            <div className="trust-icon">🚀</div>
            <div className="trust-text">Instant Discount</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;