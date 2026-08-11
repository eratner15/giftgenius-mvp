import React, { useState, useEffect } from 'react';

const EngagementLayer = ({ gifts, currentUser, onInteraction }) => {
  const [activeEngagement, setActiveEngagement] = useState(null);
  const [sessionStats, setSessionStats] = useState({
    timeSpent: 0,
    giftsViewed: 0,
    engagementLevel: 'browsing'
  });
  const [showMotivation, setShowMotivation] = useState(false);
  const [achievementProgress, setAchievementProgress] = useState({});

  // Engagement triggers and psychological moments
  const engagementTriggers = [
    {
      id: 'time_pressure',
      condition: () => sessionStats.timeSpent > 120 && sessionStats.giftsViewed < 3,
      content: {
        title: "⏰ Decision Paralysis Alert!",
        message: "You've been browsing for 2 minutes. Let me help you cut through the noise with 3 perfect matches.",
        action: "Get Instant Recommendations",
        urgency: "high"
      }
    },
    {
      id: 'success_motivation',
      condition: () => sessionStats.giftsViewed >= 5,
      content: {
        title: "🎯 You're on the Right Track!",
        message: "You're clearly taking this seriously. That's exactly the mindset that creates legendary gift moments.",
        action: "See Why These Work",
        urgency: "medium"
      }
    },
    {
      id: 'social_proof',
      condition: () => sessionStats.engagementLevel === 'comparing',
      content: {
        title: "💡 Smart Move!",
        message: "Comparing options? You're thinking like a gift-giving pro. 94% of people who compare get better reactions.",
        action: "Complete Your Analysis",
        urgency: "low"
      }
    },
    {
      id: 'exit_intent',
      condition: () => sessionStats.timeSpent > 60 && sessionStats.giftsViewed === 0,
      content: {
        title: "🚨 Wait! Don't Leave Empty-Handed",
        message: "I can solve your gift challenge in under 60 seconds. What's the occasion?",
        action: "60-Second Solution",
        urgency: "high"
      }
    }
  ];

  const achievements = [
    {
      id: 'gift_explorer',
      title: 'Gift Explorer',
      description: 'Viewed 10+ gifts',
      icon: '🗺️',
      threshold: 10,
      current: sessionStats.giftsViewed
    },
    {
      id: 'thoughtful_shopper',
      title: 'Thoughtful Shopper',
      description: 'Spent 5+ minutes researching',
      icon: '🧠',
      threshold: 300,
      current: sessionStats.timeSpent
    },
    {
      id: 'comparison_master',
      title: 'Comparison Master',
      description: 'Used comparison features',
      icon: '⚖️',
      threshold: 1,
      current: sessionStats.engagementLevel === 'comparing' ? 1 : 0
    }
  ];

  const motivationalMessages = [
    {
      context: 'browsing',
      messages: [
        "💎 Every legendary gift-giver started exactly where you are now...",
        "🎯 You're 3 clicks away from becoming their favorite person...",
        "⚡ The perfect gift is hiding in plain sight. I'll help you find it..."
      ]
    },
    {
      context: 'deciding',
      messages: [
        "🏆 Great gifts aren't accidents - they're strategic choices...",
        "💡 Your gut feeling + data = gift-giving mastery...",
        "🎪 This is the moment that transforms you from gift-giver to gift legend..."
      ]
    },
    {
      context: 'committed',
      messages: [
        "🚀 You're in the zone! This is how gift legends are born...",
        "⭐ Your attention to detail will pay off in their reaction...",
        "🔥 You're about to create a memory they'll treasure forever..."
      ]
    }
  ];

  useEffect(() => {
    // Session timer
    const timer = setInterval(() => {
      setSessionStats(prev => ({
        ...prev,
        timeSpent: prev.timeSpent + 1
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Check for engagement triggers
    engagementTriggers.forEach(trigger => {
      if (trigger.condition() && !activeEngagement) {
        setActiveEngagement(trigger);
      }
    });

    // Update achievement progress
    const progress = {};
    achievements.forEach(achievement => {
      progress[achievement.id] = Math.min(100, (achievement.current / achievement.threshold) * 100);
    });
    setAchievementProgress(progress);
  }, [sessionStats]);

  const handleEngagementAction = (actionType) => {
    setActiveEngagement(null);
    if (onInteraction) {
      onInteraction(actionType, activeEngagement);
    }
  };

  const showRandomMotivation = () => {
    const contextMessages = motivationalMessages.find(m => m.context === sessionStats.engagementLevel)?.messages || [];
    if (contextMessages.length > 0) {
      const randomMessage = contextMessages[Math.floor(Math.random() * contextMessages.length)];
      setShowMotivation(randomMessage);
      setTimeout(() => setShowMotivation(false), 4000);
    }
  };

  return (
    <>
      {/* Active Engagement Popup */}
      {activeEngagement && (
        <div className={`engagement-popup ${activeEngagement.content.urgency}-urgency`}>
          <div className="engagement-content">
            <h3>{activeEngagement.content.title}</h3>
            <p>{activeEngagement.content.message}</p>
            <div className="engagement-actions">
              <button
                className="btn-engagement-primary"
                onClick={() => handleEngagementAction(activeEngagement.id)}
              >
                {activeEngagement.content.action}
              </button>
              <button
                className="btn-engagement-dismiss"
                onClick={() => setActiveEngagement(null)}
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Motivational Flash Messages */}
      {showMotivation && (
        <div className="motivation-flash">
          <span className="motivation-text">{showMotivation}</span>
        </div>
      )}

      {/* Session Progress Indicator */}
      <div className="session-progress">
        <div className="progress-stats">
          <span className="stat">
            <span className="stat-icon">⏱️</span>
            <span className="stat-value">{Math.floor(sessionStats.timeSpent / 60)}:{(sessionStats.timeSpent % 60).toString().padStart(2, '0')}</span>
          </span>
          <span className="stat">
            <span className="stat-icon">👀</span>
            <span className="stat-value">{sessionStats.giftsViewed}</span>
          </span>
          <span className="stat">
            <span className="stat-icon">🎯</span>
            <span className="stat-value">{sessionStats.engagementLevel}</span>
          </span>
        </div>
      </div>

      {/* Achievement Progress */}
      <div className="achievement-tracker">
        {achievements.map(achievement => (
          <div key={achievement.id} className="achievement-item">
            <span className="achievement-icon">{achievement.icon}</span>
            <div className="achievement-progress">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${achievementProgress[achievement.id] || 0}%` }}
                ></div>
              </div>
              <span className="progress-label">{achievement.title}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Motivation Trigger */}
      <button
        className="motivation-trigger"
        onClick={showRandomMotivation}
        title="Need some motivation?"
      >
        💪
      </button>

      {/* Live Activity Feed */}
      <div className="live-activity-feed">
        <div className="activity-header">
          <span className="activity-icon">⚡</span>
          <span className="activity-title">Live Activity</span>
        </div>
        <div className="activity-stream">
          <div className="activity-item">
            <span className="activity-time">2 min ago</span>
            <span className="activity-text">Sarah found her perfect anniversary gift</span>
            <span className="activity-emotion">💕</span>
          </div>
          <div className="activity-item">
            <span className="activity-time">5 min ago</span>
            <span className="activity-text">Mike saved his forgotten birthday situation</span>
            <span className="activity-emotion">🎯</span>
          </div>
          <div className="activity-item">
            <span className="activity-time">8 min ago</span>
            <span className="activity-text">Emma became the office gift legend</span>
            <span className="activity-emotion">🏆</span>
          </div>
        </div>
      </div>

      {/* Interactive Help Bubbles */}
      <div className="help-bubbles">
        <div className="help-bubble tip" onClick={() => showRandomMotivation()}>
          <span className="bubble-icon">💡</span>
          <span className="bubble-text">Tip</span>
        </div>
        <div className="help-bubble support">
          <span className="bubble-icon">🎯</span>
          <span className="bubble-text">Expert Help</span>
        </div>
      </div>
    </>
  );
};

export default EngagementLayer;