import React, { useState, useEffect, useMemo } from 'react';

// Viral Challenge Manager
export class ChallengeManager {
  constructor() {
    this.activeChallenges = [];
    this.userProgress = new Map();
    this.leaderboard = [];
    this.achievements = [];
  }

  getChallenges() {
    return [
      {
        id: 'perfect_streak',
        name: '🔥 Perfect Gift Streak',
        description: 'Give 3 perfect gifts in a row (95%+ success rate)',
        type: 'streak',
        target: 3,
        reward: { badge: '🏆', discount: 25, points: 500 },
        duration: 30, // days
        participants: 1247,
        trending: true
      },
      {
        id: 'budget_master',
        name: '💰 Budget Master Challenge',
        description: 'Find amazing gifts under $50 that get 5-star reactions',
        type: 'budget',
        target: 5,
        maxPrice: 50,
        reward: { badge: '💎', cashback: 10, points: 300 },
        duration: 14,
        participants: 892
      },
      {
        id: 'gift_guru',
        name: '🧙 Gift Guru Quest',
        description: 'Help 10 friends find perfect gifts using your referral',
        type: 'referral',
        target: 10,
        reward: { badge: '👑', freeGift: true, points: 1000 },
        duration: 60,
        participants: 456
      },
      {
        id: 'seasonal_surprise',
        name: '🎄 Seasonal Surprise Sprint',
        description: 'Complete holiday shopping for 5 people in one week',
        type: 'seasonal',
        target: 5,
        reward: { badge: '🎅', discount: 30, points: 600 },
        duration: 7,
        participants: 2103,
        trending: true
      },
      {
        id: 'trend_setter',
        name: '✨ Trend Setter Challenge',
        description: 'Be first to gift 3 trending items that go viral',
        type: 'trending',
        target: 3,
        reward: { badge: '🚀', influencerStatus: true, points: 800 },
        duration: 21,
        participants: 634
      }
    ];
  }

  joinChallenge(challengeId, userId) {
    const challenge = this.activeChallenges.find(c => c.id === challengeId);
    if (!challenge) return null;

    const progress = {
      userId,
      challengeId,
      startedAt: Date.now(),
      current: 0,
      target: challenge.target,
      completed: false,
      milestones: []
    };

    this.userProgress.set(`${userId}_${challengeId}`, progress);
    this.saveProgress();

    return progress;
  }

  updateProgress(userId, challengeId, increment = 1) {
    const key = `${userId}_${challengeId}`;
    const progress = this.userProgress.get(key);

    if (!progress || progress.completed) return null;

    progress.current += increment;

    // Check for milestone
    const milestonePercentage = (progress.current / progress.target) * 100;
    if (milestonePercentage >= 25 && !progress.milestones.includes(25)) {
      progress.milestones.push(25);
      this.triggerMilestone(userId, challengeId, 25);
    }
    if (milestonePercentage >= 50 && !progress.milestones.includes(50)) {
      progress.milestones.push(50);
      this.triggerMilestone(userId, challengeId, 50);
    }
    if (milestonePercentage >= 75 && !progress.milestones.includes(75)) {
      progress.milestones.push(75);
      this.triggerMilestone(userId, challengeId, 75);
    }

    // Check for completion
    if (progress.current >= progress.target) {
      progress.completed = true;
      progress.completedAt = Date.now();
      this.awardRewards(userId, challengeId);
      this.updateLeaderboard(userId, challengeId);
    }

    this.userProgress.set(key, progress);
    this.saveProgress();

    return progress;
  }

  triggerMilestone(userId, challengeId, percentage) {
    // Trigger celebration animation
    const event = new CustomEvent('challenge-milestone', {
      detail: { userId, challengeId, percentage }
    });
    window.dispatchEvent(event);
  }

  awardRewards(userId, challengeId) {
    const challenge = this.activeChallenges.find(c => c.id === challengeId);
    if (!challenge) return;

    // Store rewards
    const rewards = JSON.parse(localStorage.getItem('user_rewards') || '{}');
    if (!rewards[userId]) rewards[userId] = [];

    rewards[userId].push({
      challengeId,
      rewards: challenge.reward,
      earnedAt: Date.now()
    });

    localStorage.setItem('user_rewards', JSON.stringify(rewards));

    // Trigger celebration
    const event = new CustomEvent('challenge-completed', {
      detail: { userId, challengeId, rewards: challenge.reward }
    });
    window.dispatchEvent(event);
  }

  updateLeaderboard(userId, challengeId) {
    const entry = {
      userId,
      challengeId,
      completedAt: Date.now(),
      rank: this.leaderboard.length + 1
    };

    this.leaderboard.push(entry);
    this.leaderboard.sort((a, b) => a.completedAt - b.completedAt);

    // Update ranks
    this.leaderboard.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    localStorage.setItem('challenge_leaderboard', JSON.stringify(this.leaderboard));
  }

  getLeaderboard(challengeId) {
    return this.leaderboard
      .filter(entry => !challengeId || entry.challengeId === challengeId)
      .slice(0, 10);
  }

  saveProgress() {
    const progressData = Array.from(this.userProgress.entries());
    localStorage.setItem('challenge_progress', JSON.stringify(progressData));
  }

  loadProgress() {
    const stored = localStorage.getItem('challenge_progress');
    if (stored) {
      this.userProgress = new Map(JSON.parse(stored));
    }

    const leaderboardData = localStorage.getItem('challenge_leaderboard');
    if (leaderboardData) {
      this.leaderboard = JSON.parse(leaderboardData);
    }

    this.activeChallenges = this.getChallenges();
  }
}

// Viral Challenge Card Component
export const ViralChallengeCard = ({ challenge, userId, onJoin, onShare }) => {
  const [progress, setProgress] = useState(null);
  const [isJoined, setIsJoined] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const manager = useMemo(() => new ChallengeManager(), []);

  useEffect(() => {
    manager.loadProgress();
    const userProgress = manager.userProgress.get(`${userId}_${challenge.id}`);
    if (userProgress) {
      setProgress(userProgress);
      setIsJoined(true);
    }
  }, [userId, challenge.id, manager]);

  const handleJoin = () => {
    const newProgress = manager.joinChallenge(challenge.id, userId);
    setProgress(newProgress);
    setIsJoined(true);

    if (onJoin) onJoin(challenge);
  };

  const progressPercentage = progress ? (progress.current / progress.target) * 100 : 0;

  return (
    <div className={`viral-challenge-card ${challenge.trending ? 'trending' : ''}`}>
      {challenge.trending && (
        <div className="trending-badge">
          🔥 TRENDING
        </div>
      )}

      <div className="challenge-header">
        <h3 className="challenge-name">{challenge.name}</h3>
        <div className="challenge-participants">
          <span className="participant-count">{challenge.participants}</span>
          <span className="participant-label">participants</span>
        </div>
      </div>

      <p className="challenge-description">{challenge.description}</p>

      {isJoined && progress ? (
        <div className="challenge-progress">
          <div className="progress-info">
            <span className="progress-current">{progress.current}</span>
            <span className="progress-separator">/</span>
            <span className="progress-target">{progress.target}</span>
            <span className="progress-label">completed</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${Math.min(100, progressPercentage)}%` }}
            >
              {progressPercentage >= 25 && <span className="milestone m25">✓</span>}
              {progressPercentage >= 50 && <span className="milestone m50">✓</span>}
              {progressPercentage >= 75 && <span className="milestone m75">✓</span>}
            </div>
          </div>
          {progress.completed && (
            <div className="completion-badge">
              🎉 COMPLETED!
            </div>
          )}
        </div>
      ) : (
        <div className="challenge-preview">
          <div className="challenge-stats">
            <div className="stat">
              <span className="stat-icon">🎯</span>
              <span className="stat-value">{challenge.target}</span>
              <span className="stat-label">Goal</span>
            </div>
            <div className="stat">
              <span className="stat-icon">⏱️</span>
              <span className="stat-value">{challenge.duration}d</span>
              <span className="stat-label">Duration</span>
            </div>
          </div>
        </div>
      )}

      <div className="challenge-rewards">
        <h4>Rewards:</h4>
        <div className="reward-items">
          {challenge.reward.badge && (
            <div className="reward-item">
              <span className="reward-icon">{challenge.reward.badge}</span>
              <span className="reward-label">Badge</span>
            </div>
          )}
          {challenge.reward.discount && (
            <div className="reward-item">
              <span className="reward-value">{challenge.reward.discount}%</span>
              <span className="reward-label">Discount</span>
            </div>
          )}
          {challenge.reward.points && (
            <div className="reward-item">
              <span className="reward-value">{challenge.reward.points}</span>
              <span className="reward-label">Points</span>
            </div>
          )}
          {challenge.reward.freeGift && (
            <div className="reward-item">
              <span className="reward-icon">🎁</span>
              <span className="reward-label">Free Gift</span>
            </div>
          )}
        </div>
      </div>

      <div className="challenge-actions">
        {!isJoined ? (
          <button className="join-challenge-btn" onClick={handleJoin}>
            Join Challenge
          </button>
        ) : (
          <button
            className="view-details-btn"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'Hide' : 'View'} Details
          </button>
        )}

        <button
          className="share-challenge-btn"
          onClick={() => onShare && onShare(challenge)}
        >
          📤 Share
        </button>
      </div>

      {showDetails && (
        <div className="challenge-details">
          <div className="detail-section">
            <h5>How to Win:</h5>
            <ol>
              <li>Join the challenge</li>
              <li>Complete the required tasks</li>
              <li>Track your progress</li>
              <li>Claim your rewards!</li>
            </ol>
          </div>

          <div className="detail-section">
            <h5>Tips:</h5>
            <ul>
              <li>Share with friends for bonus points</li>
              <li>Complete milestones for extra rewards</li>
              <li>Check daily for new opportunities</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

// Challenge Leaderboard Component
export const ChallengeLeaderboard = ({ challengeId, currentUserId }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [timeFilter, setTimeFilter] = useState('all');
  const manager = useMemo(() => new ChallengeManager(), []);

  useEffect(() => {
    manager.loadProgress();
    const entries = manager.getLeaderboard(challengeId);

    const enrichedEntries = entries.map((entry, index) => ({
      ...entry,
      username: `User${entry.userId.substring(0, 4)}`,
      avatar: `${entry.userId.charAt(0).toUpperCase()}`,
      points: 1000 - (index * 100),
      badges: Math.floor(Math.random() * 5) + 1
    }));

    setLeaderboard(enrichedEntries);
  }, [challengeId, timeFilter, manager]);

  return (
    <div className="challenge-leaderboard">
      <div className="leaderboard-header">
        <h2>🏆 Challenge Leaderboard</h2>
        <div className="leaderboard-filters">
          <button
            className={`filter-btn ${timeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setTimeFilter('all')}
          >
            All Time
          </button>
          <button
            className={`filter-btn ${timeFilter === 'week' ? 'active' : ''}`}
            onClick={() => setTimeFilter('week')}
          >
            This Week
          </button>
          <button
            className={`filter-btn ${timeFilter === 'today' ? 'active' : ''}`}
            onClick={() => setTimeFilter('today')}
          >
            Today
          </button>
        </div>
      </div>

      <div className="leaderboard-list">
        {leaderboard.map((entry, index) => (
          <div
            key={`${entry.userId}_${entry.challengeId}`}
            className={`leaderboard-entry ${entry.userId === currentUserId ? 'current-user' : ''}`}
          >
            <div className="rank">
              {entry.rank === 1 && '🥇'}
              {entry.rank === 2 && '🥈'}
              {entry.rank === 3 && '🥉'}
              {entry.rank > 3 && entry.rank}
            </div>

            <div className="user-avatar">{entry.avatar}</div>

            <div className="user-info">
              <div className="username">{entry.username}</div>
              <div className="user-stats">
                <span className="stat-badges">🏅 {entry.badges}</span>
                <span className="stat-points">⭐ {entry.points}</span>
              </div>
            </div>

            <div className="completion-time">
              {new Date(entry.completedAt).toLocaleDateString()}
            </div>
          </div>
        ))}

        {leaderboard.length === 0 && (
          <div className="empty-leaderboard">
            <p>No completions yet. Be the first!</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Achievement Gallery Component
export const AchievementGallery = ({ userId }) => {
  const [achievements, setAchievements] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const allAchievements = [
    { id: 'first_gift', name: 'First Gift', icon: '🎁', description: 'Gave your first gift', earned: true, rarity: 'common' },
    { id: 'perfect_10', name: 'Perfect 10', icon: '💯', description: '10 successful gifts in a row', earned: true, rarity: 'rare' },
    { id: 'trend_setter', name: 'Trend Setter', icon: '🚀', description: 'Started a gift trend', earned: false, rarity: 'epic' },
    { id: 'gift_guru', name: 'Gift Guru', icon: '🧙', description: 'Master of gift giving', earned: false, rarity: 'legendary' },
    { id: 'budget_hero', name: 'Budget Hero', icon: '💰', description: 'Found 50 gifts under $25', earned: true, rarity: 'uncommon' },
    { id: 'speed_demon', name: 'Speed Demon', icon: '⚡', description: 'Completed shopping in record time', earned: false, rarity: 'rare' },
    { id: 'social_butterfly', name: 'Social Butterfly', icon: '🦋', description: 'Shared 25 gifts with friends', earned: true, rarity: 'uncommon' },
    { id: 'collector', name: 'The Collector', icon: '📦', description: 'Collected 100 gift ideas', earned: false, rarity: 'epic' }
  ];

  useEffect(() => {
    let filtered = allAchievements;
    if (selectedCategory === 'earned') {
      filtered = allAchievements.filter(a => a.earned);
    } else if (selectedCategory === 'locked') {
      filtered = allAchievements.filter(a => !a.earned);
    }
    setAchievements(filtered);
  }, [selectedCategory, allAchievements]);

  const getRarityColor = (rarity) => {
    const colors = {
      common: '#9CA3AF',
      uncommon: '#10B981',
      rare: '#3B82F6',
      epic: '#8B5CF6',
      legendary: '#F59E0B'
    };
    return colors[rarity] || colors.common;
  };

  return (
    <div className="achievement-gallery">
      <div className="gallery-header">
        <h2>🏆 Your Achievements</h2>
        <div className="achievement-stats">
          <span className="earned-count">
            {allAchievements.filter(a => a.earned).length}/{allAchievements.length}
          </span>
          <span className="earned-label">Unlocked</span>
        </div>
      </div>

      <div className="gallery-filters">
        <button
          className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          All
        </button>
        <button
          className={`filter-btn ${selectedCategory === 'earned' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('earned')}
        >
          Earned
        </button>
        <button
          className={`filter-btn ${selectedCategory === 'locked' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('locked')}
        >
          Locked
        </button>
      </div>

      <div className="achievement-grid">
        {achievements.map(achievement => (
          <div
            key={achievement.id}
            className={`achievement-card ${achievement.earned ? 'earned' : 'locked'}`}
            style={{
              borderColor: achievement.earned ? getRarityColor(achievement.rarity) : '#E5E7EB'
            }}
          >
            <div className="achievement-icon">
              {achievement.earned ? achievement.icon : '🔒'}
            </div>
            <h4 className="achievement-name">{achievement.name}</h4>
            <p className="achievement-description">{achievement.description}</p>
            <div
              className="achievement-rarity"
              style={{ color: getRarityColor(achievement.rarity) }}
            >
              {achievement.rarity.toUpperCase()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Gamification Progress Bar Component
export const GamificationProgress = ({ userId }) => {
  const [level, setLevel] = useState(1);
  const [experience, setExperience] = useState(0);
  const [nextLevelXP, setNextLevelXP] = useState(100);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    // Load user progress
    const progress = JSON.parse(localStorage.getItem('user_gamification') || '{}');
    if (progress[userId]) {
      setLevel(progress[userId].level || 1);
      setExperience(progress[userId].xp || 0);
      setStreak(progress[userId].streak || 0);
    }

    // Calculate XP for next level
    setNextLevelXP(level * 100);
  }, [userId, level]);

  const progressPercentage = (experience / nextLevelXP) * 100;

  return (
    <div className="gamification-progress">
      <div className="level-info">
        <div className="level-badge">
          <span className="level-number">LVL {level}</span>
        </div>
        <div className="progress-details">
          <div className="xp-info">
            <span className="current-xp">{experience}</span>
            <span className="xp-separator">/</span>
            <span className="next-level-xp">{nextLevelXP} XP</span>
          </div>
          <div className="progress-bar">
            <div
              className="xp-fill"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {streak > 0 && (
        <div className="streak-indicator">
          <span className="streak-icon">🔥</span>
          <span className="streak-count">{streak}</span>
          <span className="streak-label">day streak</span>
        </div>
      )}
    </div>
  );
};

const ViralChallengesExports = {
  ChallengeManager,
  ViralChallengeCard,
  ChallengeLeaderboard,
  AchievementGallery,
  GamificationProgress
};

export default ViralChallengesExports;