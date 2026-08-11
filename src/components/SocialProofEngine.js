import React, { useState, useEffect } from 'react';

const SocialProofEngine = ({ gift, onUrgencyAction }) => {
  const [recentActivity, setRecentActivity] = useState([]);
  const [liveStats, setLiveStats] = useState({});
  const [urgencyTimer, setUrgencyTimer] = useState(null);
  const [showNotification, setShowNotification] = useState(false);

  // Generate realistic live activity
  useEffect(() => {
    const generateActivity = () => {
      const activities = [
        { type: 'purchase', name: 'Sarah M.', location: 'New York', time: '2 minutes ago' },
        { type: 'wishlist', name: 'Mike R.', location: 'California', time: '5 minutes ago' },
        { type: 'review', name: 'Emma L.', location: 'Texas', time: '8 minutes ago', rating: 5 },
        { type: 'purchase', name: 'James K.', location: 'Florida', time: '12 minutes ago' },
        { type: 'view', name: 'Anonymous', location: 'Illinois', time: '1 minute ago' }
      ];

      // Simulate real-time activity
      const interval = setInterval(() => {
        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        const newActivity = {
          ...randomActivity,
          id: Date.now(),
          time: 'Just now'
        };

        setRecentActivity(prev => [newActivity, ...prev.slice(0, 4)]);
      }, Math.random() * 30000 + 15000); // Every 15-45 seconds

      return () => clearInterval(interval);
    };

    generateActivity();
  }, []);

  // Generate live stats
  useEffect(() => {
    const updateStats = () => {
      setLiveStats({
        viewing: Math.floor(Math.random() * 45) + 15, // 15-60 people viewing
        purchased24h: Math.floor(Math.random() * 20) + 8, // 8-28 purchases
        stockLevel: Math.floor(Math.random() * 30) + 5, // 5-35 items left
        trending: Math.random() > 0.7, // 30% chance of trending
        flashSale: Math.random() > 0.8 // 20% chance of flash sale
      });
    };

    updateStats();
    const interval = setInterval(updateStats, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Urgency timer for flash sales
  useEffect(() => {
    if (liveStats.flashSale && !urgencyTimer) {
      const endTime = new Date(Date.now() + (Math.random() * 4 + 2) * 60 * 60 * 1000); // 2-6 hours
      setUrgencyTimer(endTime);
    }
  }, [liveStats.flashSale, urgencyTimer]);

  // Show periodic notifications
  useEffect(() => {
    const showNotifications = () => {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 4000);
    };

    const interval = setInterval(showNotifications, 45000); // Every 45 seconds
    return () => clearInterval(interval);
  }, []);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'purchase': return 'Buy';
      case 'wishlist': return 'Wish';
      case 'review': return 'Rev';
      case 'view': return 'View';
      default: return '--';
    }
  };

  const getActivityText = (activity) => {
    switch (activity.type) {
      case 'purchase':
        return `${activity.name} from ${activity.location} just purchased this`;
      case 'wishlist':
        return `${activity.name} from ${activity.location} added this to wishlist`;
      case 'review':
        return `${activity.name} from ${activity.location} left a ${activity.rating}/5 review`;
      case 'view':
        return `Someone from ${activity.location} is viewing this right now`;
      default:
        return `${activity.name} interacted with this gift`;
    }
  };

  const formatTimeLeft = (endTime) => {
    if (!endTime) return '';

    const now = new Date();
    const diff = endTime - now;

    if (diff <= 0) return 'EXPIRED';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="social-proof-engine">
      {/* Live Activity Feed */}
      <div className="live-activity">
        <div className="activity-header">
          <span className="live-indicator">LIVE</span>
          <span>Real-time Activity</span>
        </div>

        <div className="activity-feed">
          {recentActivity.map(activity => (
            <div key={activity.id} className="activity-item">
              <span className="activity-icon">{getActivityIcon(activity.type)}</span>
              <div className="activity-content">
                <div className="activity-text">{getActivityText(activity)}</div>
                <div className="activity-time">{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Stats Bar */}
      <div className="live-stats-bar">
        <div className="stat-item">
          <span className="stat-icon">Views</span>
          <span className="stat-value">{liveStats.viewing}</span>
          <span className="stat-label">viewing now</span>
        </div>

        <div className="stat-item">
          <span className="stat-icon">Sold</span>
          <span className="stat-value">{liveStats.purchased24h}</span>
          <span className="stat-label">sold today</span>
        </div>

        <div className="stat-item">
          <span className="stat-icon">Stock</span>
          <span className="stat-value">{liveStats.stockLevel}</span>
          <span className="stat-label">left in stock</span>
        </div>

        {liveStats.trending && (
          <div className="stat-item trending">
            <span className="stat-icon">HOT</span>
            <span className="stat-label">TRENDING</span>
          </div>
        )}
      </div>

      {/* Urgency Banners */}
      {liveStats.stockLevel < 10 && (
        <div className="urgency-banner stock-warning">
          <span className="urgency-icon">!</span>
          <span className="urgency-text">
            Only {liveStats.stockLevel} left! This popular gift is selling fast.
          </span>
        </div>
      )}

      {liveStats.flashSale && urgencyTimer && (
        <div className="urgency-banner flash-sale">
          <span className="urgency-icon">SALE</span>
          <div className="flash-sale-content">
            <span className="flash-sale-text">FLASH SALE: 25% OFF</span>
            <span className="flash-sale-timer">
              Ends in {formatTimeLeft(urgencyTimer)}
            </span>
          </div>
          <button
            className="claim-sale-btn"
            onClick={() => onUrgencyAction?.('flash_sale')}
          >
            Claim Now
          </button>
        </div>
      )}

      {/* Social Proof Notification */}
      {showNotification && recentActivity.length > 0 && (
        <div className="social-notification">
          <div className="notification-content">
            <span className="notification-icon">
              {getActivityIcon(recentActivity[0].type)}
            </span>
            <div className="notification-text">
              {getActivityText(recentActivity[0])}
            </div>
          </div>
          <button
            className="notification-close"
            onClick={() => setShowNotification(false)}
          >
            ×
          </button>
        </div>
      )}

      {/* Success Stories Carousel */}
      <div className="success-stories">
        <h4>Recent Gift Success Stories</h4>
        <div className="stories-carousel">
          <div className="story-card">
            <div className="story-rating">5/5</div>
            <p>"My mom literally cried happy tears! This was exactly what she didn't know she needed."</p>
            <div className="story-meta">
              <span className="story-author">- Jennifer K.</span>
              <span className="story-occasion">Mother's Day</span>
            </div>
          </div>

          <div className="story-card">
            <div className="story-rating">5/5</div>
            <p>"Best anniversary gift ever. My wife still talks about it months later!"</p>
            <div className="story-meta">
              <span className="story-author">- David M.</span>
              <span className="story-occasion">Anniversary</span>
            </div>
          </div>

          <div className="story-card">
            <div className="story-rating">5/5</div>
            <p>"I was so stressed about finding the perfect gift. This made me look like a hero!"</p>
            <div className="story-meta">
              <span className="story-author">- Alex R.</span>
              <span className="story-occasion">Birthday</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="trust-indicators">
        <div className="trust-item">
          <span className="trust-icon">OK</span>
          <span>30-Day Happiness Guarantee</span>
        </div>

        <div className="trust-item">
          <span className="trust-icon">Ship</span>
          <span>Free Shipping on Orders $50+</span>
        </div>

        <div className="trust-item">
          <span className="trust-icon">Wrap</span>
          <span>Free Gift Wrapping</span>
        </div>

        <div className="trust-item">
          <span className="trust-icon">Lock</span>
          <span>Secure Checkout</span>
        </div>
      </div>

      {/* Gift Success Rate */}
      <div className="success-rate-display">
        <div className="success-rate-header">
          <h4>Gift Success Rate</h4>
          <span className="success-percentage">96%</span>
        </div>

        <div className="success-bar">
          <div className="success-fill" style={{ width: '96%' }}></div>
        </div>

        <p className="success-description">
          96% of recipients reported this gift made them feel truly special and understood.
        </p>
      </div>
    </div>
  );
};

export default SocialProofEngine;