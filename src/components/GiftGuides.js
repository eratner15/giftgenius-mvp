import React, { useState, useEffect } from 'react';
import { gifts } from '../data/gifts';
import OptimizedImage from './OptimizedImage';

const GiftGuides = ({ onSelectGuide, onGiftClick }) => {
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');
  const [trendingItems, setTrendingItems] = useState([]);

  // Real-time urgency timer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const diff = endOfDay - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeft(`${hours}h ${minutes}m`);
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Simulate trending algorithm
  useEffect(() => {
    const trending = gifts
      .filter(gift => gift.tags?.includes('viral') || gift.success_rate > 95)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    setTrendingItems(trending);
  }, []);

  const giftGuides = [
    {
      id: 'viral-tiktok',
      title: 'Viral TikTok Gifts',
      subtitle: 'Everyone\'s talking about these',
      description: 'Gifts that are breaking the internet right now',
      urgency: 'Trending for next 8 hours only',
      gradient: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
      tags: ['viral', 'trending'],
      stats: '2.3M views this week'
    },
    {
      id: 'luxury-memories',
      title: 'Luxury Memory Makers',
      subtitle: 'Heirloom gifts that last forever',
      description: 'Investment pieces that become family treasures',
      urgency: 'Custom orders close in 48hrs',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      tags: ['luxury', 'custom'],
      stats: '97% become family heirlooms'
    },
    {
      id: 'budget-luxury',
      title: 'Luxury on a Budget',
      subtitle: 'Under $50 but feels expensive',
      description: 'Premium gifts that won\'t break the bank',
      urgency: 'Flash sale ends today',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      tags: ['budget', 'premium'],
      stats: 'Save up to 40% today'
    },
    {
      id: 'last-minute',
      title: 'Emergency Gift Heroes',
      subtitle: 'Same-day shipping available',
      description: 'Last-minute gifts that look intentional',
      urgency: 'Order by 2PM for today delivery',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      tags: ['fast-shipping', 'emergency'],
      stats: '2-hour delivery in major cities'
    },
    {
      id: 'emotional-impact',
      title: 'Happy Tears Guaranteed',
      subtitle: 'Gifts that create unforgettable moments',
      description: 'Personalized gifts that touch hearts deeply',
      urgency: 'Limited personalization slots',
      gradient: 'linear-gradient(135deg, #a8e6cf 0%, #88d8a3 100%)',
      tags: ['personalized', 'emotional'],
      stats: '94% report happy tears'
    },
    {
      id: 'experience-gifts',
      title: 'Experience Adventures',
      subtitle: 'Memories over material things',
      description: 'Adventures and experiences they\'ll never forget',
      urgency: 'Booking calendar filling fast',
      gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      tags: ['experience', 'adventure'],
      stats: 'Book 3 months in advance'
    }
  ];

  const getGuideGifts = (guideId) => {
    const guide = giftGuides.find(g => g.id === guideId);
    if (!guide) return [];

    return gifts.filter(gift => {
      return guide.tags.some(tag =>
        gift.tags?.includes(tag) ||
        gift.category.toLowerCase().includes(tag) ||
        (tag === 'budget' && gift.price < 50) ||
        (tag === 'luxury' && gift.price > 200) ||
        (tag === 'viral' && gift.success_rate > 95) ||
        (tag === 'fast-shipping' && gift.shipping?.includes('same-day')) ||
        (tag === 'personalized' && gift.customization)
      );
    }).slice(0, 8);
  };

  const handleGuideClick = (guide) => {
    setSelectedGuide(guide);
    onSelectGuide?.(guide, getGuideGifts(guide.id));
  };

  if (selectedGuide) {
    const guideGifts = getGuideGifts(selectedGuide.id);

    return (
      <div className="gift-guide-detail">
        <div className="guide-header" style={{ background: selectedGuide.gradient }}>
          <button className="back-btn" onClick={() => setSelectedGuide(null)}>
            ← Back to Guides
          </button>
          <div className="guide-hero">
            <h1>{selectedGuide.title}</h1>
            <p>{selectedGuide.description}</p>
            <div className="urgency-banner">
              {selectedGuide.urgency}
            </div>
          </div>
        </div>

        <div className="guide-content">
          <div className="guide-stats">
            <div className="stat">
              <span className="stat-number">{guideGifts.length}</span>
              <span className="stat-label">Curated Gifts</span>
            </div>
            <div className="stat">
              <span className="stat-number">98%</span>
              <span className="stat-label">Success Rate</span>
            </div>
            <div className="stat">
              <span className="stat-number">{selectedGuide.stats}</span>
              <span className="stat-label">Impact</span>
            </div>
          </div>

          <div className="gifts-grid">
            {guideGifts.map(gift => (
              <div key={gift.id} className="guide-gift-card" onClick={() => onGiftClick(gift)}>
                <div className="gift-image">
                  <OptimizedImage src={gift.image_url} alt={gift.title} className="guide-gift-image" lazy={true} />
                  {gift.tags?.includes('viral') && (
                    <div className="viral-badge">VIRAL</div>
                  )}
                  {gift.limited_stock && (
                    <div className="stock-badge">Only {gift.stock_count} left!</div>
                  )}
                </div>
                <div className="gift-info">
                  <h3>{gift.title}</h3>
                  <p>{gift.description.slice(0, 60)}...</p>
                  <div className="gift-meta">
                    <span className="price">${gift.price}</span>
                    <span className="rating">★ {gift.rating}</span>
                  </div>
                  <div className="success-indicator">
                    <div className="success-bar">
                      <div
                        className="success-fill"
                        style={{ width: `${gift.success_rate}%` }}
                      ></div>
                    </div>
                    <span>{gift.success_rate}% love this gift</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="gift-guides">
      <div className="guides-header">
        <h2>Curated Gift Guides</h2>
        <p>Expert-curated collections that guarantee gift-giving success</p>

        <div className="trending-alert">
          <div className="alert-content">
            <span className="alert-icon">!</span>
            <div className="alert-text">
              <strong>Trending Alert:</strong> {trendingItems.length} gifts going viral right now
            </div>
            <div className="alert-timer">
              Ends in {timeLeft}
            </div>
          </div>
        </div>
      </div>

      <div className="guides-grid">
        {giftGuides.map(guide => (
          <div
            key={guide.id}
            className="guide-card"
            onClick={() => handleGuideClick(guide)}
            style={{ background: guide.gradient }}
          >
            <div className="guide-card-content">
              <h3>{guide.title}</h3>
              <p className="guide-subtitle">{guide.subtitle}</p>
              <p className="guide-description">{guide.description}</p>

              <div className="guide-urgency">
                {guide.urgency}
              </div>

              <div className="guide-stats-preview">
                <span>{guide.stats}</span>
              </div>

              <button className="explore-btn">
                Explore Collection →
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="trending-showcase">
        <h3>Trending Right Now</h3>
        <div className="trending-grid">
          {trendingItems.map(gift => (
            <div key={gift.id} className="trending-item" onClick={() => onGiftClick(gift)}>
              <OptimizedImage src={gift.image_url} alt={gift.title} className="guide-gift-image" lazy={true} />
              <div className="trending-overlay">
                <div className="viral-pulse">HOT</div>
                <span>${gift.price}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="trending-note">These gifts are being shared across social media right now</p>
      </div>
    </div>
  );
};

export default GiftGuides;