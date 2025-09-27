import React, { useState, useEffect } from 'react';

const SocialProof = ({ variant = "ticker" }) => {
  const [currentStat, setCurrentStat] = useState(0);
  const [visible, setVisible] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(0);

  const stats = [
    { number: "52,847", label: "Happy Customers", icon: "😊" },
    { number: "98%", label: "Success Rate", icon: "🎯" },
    { number: "4.9/5", label: "Average Rating", icon: "⭐" },
    { number: "127", label: "Gifts Found Today", icon: "🎁" }
  ];

  const recentActivity = [
    { name: "Sarah M.", location: "NYC", action: "found the perfect anniversary gift", time: "2 minutes ago", gift: "Diamond Bracelet" },
    { name: "Mike R.", location: "LA", action: "bought a birthday surprise", time: "5 minutes ago", gift: "Smart Watch" },
    { name: "Emma T.", location: "London", action: "discovered a unique housewarming gift", time: "8 minutes ago", gift: "Aromatherapy Set" },
    { name: "David K.", location: "Toronto", action: "selected a wedding gift", time: "12 minutes ago", gift: "Wine Collection" },
    { name: "Lisa W.", location: "Sydney", action: "found a thank you gift", time: "15 minutes ago", gift: "Gourmet Chocolates" }
  ];

  const testimonialSnippets = [
    { text: "Finally found the perfect gift!", author: "Jennifer L.", rating: 5 },
    { text: "95% success rate is no joke - it worked!", author: "Mark S.", rating: 5 },
    { text: "Best gift recommendation site ever.", author: "Amanda R.", rating: 5 },
    { text: "Saved my marriage with the perfect anniversary gift.", author: "Tom H.", rating: 5 },
    { text: "My mom loved the gift so much she cried.", author: "Katie M.", rating: 5 }
  ];

  const mediaLogos = [
    { name: "TechCrunch", logo: "TC" },
    { name: "Product Hunt", logo: "PH" },
    { name: "BuzzFeed", logo: "BF" },
    { name: "Mashable", logo: "M" },
    { name: "The Verge", logo: "TV" }
  ];

  useEffect(() => {
    if (variant === "ticker") {
      const interval = setInterval(() => {
        setCurrentStat((prev) => (prev + 1) % stats.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [variant, stats.length]);

  useEffect(() => {
    if (variant === "floating-notification") {
      const showInterval = setInterval(() => {
        setCurrentActivity((prev) => (prev + 1) % recentActivity.length);
        setVisible(true);
        setTimeout(() => setVisible(false), 4000);
      }, 6000);

      return () => clearInterval(showInterval);
    }
  }, [variant, recentActivity.length]);

  if (variant === "ticker") {
    return (
      <div className="social-proof-ticker">
        <div className="ticker-item">
          <span className="ticker-icon">{stats[currentStat].icon}</span>
          <span className="ticker-number">{stats[currentStat].number}</span>
          <span className="ticker-label">{stats[currentStat].label}</span>
        </div>
      </div>
    );
  }

  if (variant === "activity") {
    return (
      <div className="social-proof-activity">
        <div className="activity-header">
          <span className="activity-pulse">🟢</span>
          <span>Live Activity</span>
        </div>
        <div className="activity-feed">
          {recentActivity.slice(0, 3).map((activity, index) => (
            <div key={index} className="activity-item">
              <div className="activity-avatar">
                {activity.name.charAt(0)}
              </div>
              <div className="activity-content">
                <span className="activity-name">{activity.name}</span>
                <span className="activity-location">from {activity.location}</span>
                <span className="activity-action">{activity.action}</span>
                <div className="activity-gift">🎁 {activity.gift}</div>
                <div className="activity-time">{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "testimonials") {
    return (
      <div className="social-proof-testimonials">
        <div className="testimonials-header">
          <h4>What Our Users Say</h4>
        </div>
        <div className="testimonials-list">
          {testimonialSnippets.slice(0, 3).map((testimonial, index) => (
            <div key={index} className="testimonial-snippet">
              <div className="snippet-rating">
                {Array(testimonial.rating).fill(0).map((_, i) => (
                  <span key={i} className="star">⭐</span>
                ))}
              </div>
              <p className="snippet-text">"{testimonial.text}"</p>
              <div className="snippet-author">- {testimonial.author}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "media") {
    return (
      <div className="social-proof-media">
        <div className="media-header">
          <span>Featured In</span>
        </div>
        <div className="media-logos">
          {mediaLogos.map((media, index) => (
            <div key={index} className="media-logo">
              <div className="logo-badge">{media.logo}</div>
              <span className="logo-name">{media.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "stats-grid") {
    return (
      <div className="social-proof-stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-number">{stat.number}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "floating-notification") {
    return (
      <div className={`floating-notification ${visible ? 'visible' : ''}`}>
        <div className="notification-content">
          <div className="notification-avatar">
            {recentActivity[currentActivity].name.charAt(0)}
          </div>
          <div className="notification-text">
            <strong>{recentActivity[currentActivity].name}</strong> from {recentActivity[currentActivity].location} just {recentActivity[currentActivity].action}
            <div className="notification-time">{recentActivity[currentActivity].time}</div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default SocialProof;