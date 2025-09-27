import React, { useState, useEffect, useCallback, useMemo } from 'react';

// Social Sharing Manager
export class SocialSharingManager {
  constructor() {
    this.shareCount = 0;
    this.platforms = {
      twitter: {
        name: 'Twitter',
        icon: '𝕏',
        color: '#000000',
        urlTemplate: 'https://twitter.com/intent/tweet?text={text}&url={url}&hashtags={hashtags}'
      },
      facebook: {
        name: 'Facebook',
        icon: 'f',
        color: '#1877F2',
        urlTemplate: 'https://www.facebook.com/sharer/sharer.php?u={url}'
      },
      whatsapp: {
        name: 'WhatsApp',
        icon: '💬',
        color: '#25D366',
        urlTemplate: 'https://api.whatsapp.com/send?text={text}%20{url}'
      },
      pinterest: {
        name: 'Pinterest',
        icon: 'P',
        color: '#BD081C',
        urlTemplate: 'https://pinterest.com/pin/create/button/?url={url}&description={text}&media={image}'
      },
      email: {
        name: 'Email',
        icon: '✉️',
        color: '#4A5568',
        urlTemplate: 'mailto:?subject={subject}&body={text}%20{url}'
      },
      sms: {
        name: 'SMS',
        icon: '💌',
        color: '#10B981',
        urlTemplate: 'sms:?body={text}%20{url}'
      }
    };
  }

  generateShareUrl(platform, data) {
    const template = this.platforms[platform]?.urlTemplate;
    if (!template) return null;

    let url = template;
    Object.keys(data).forEach(key => {
      const value = encodeURIComponent(data[key] || '');
      url = url.replace(`{${key}}`, value);
    });

    return url;
  }

  trackShare(platform, gift) {
    this.shareCount++;

    // Track analytics
    if (window.gtag) {
      window.gtag('event', 'share', {
        method: platform,
        content_type: 'gift',
        item_id: gift?.id
      });
    }

    // Store share history
    const shareHistory = JSON.parse(localStorage.getItem('share_history') || '[]');
    shareHistory.push({
      platform,
      giftId: gift?.id,
      timestamp: Date.now()
    });
    localStorage.setItem('share_history', JSON.stringify(shareHistory.slice(-50)));

    return this.shareCount;
  }

  generateShareableContent(gift, type = 'gift') {
    const templates = {
      gift: {
        title: `Check out this amazing gift: ${gift.name || gift.title}`,
        text: `I found the perfect gift on GiftGenius! ${gift.name || gift.title} - ${gift.success_rate || 95}% success rate! 🎁`,
        hashtags: 'GiftGenius,PerfectGift,GiftIdeas'
      },
      list: {
        title: `My Gift List on GiftGenius`,
        text: `I've created a gift list on GiftGenius with amazing ideas! Check it out and help me choose! 🎁✨`,
        hashtags: 'GiftGenius,GiftList,GiftIdeas'
      },
      success: {
        title: `Gift Success Story!`,
        text: `Just gave the perfect gift using GiftGenius! ${gift.name || gift.title} was a huge hit! 🎉 Try it yourself:`,
        hashtags: 'GiftGenius,GiftSuccess,HappyPartner'
      },
      recommendation: {
        title: `Gift Recommendation for You`,
        text: `Found this on GiftGenius and thought of you! ${gift.name || gift.title} would be perfect! 💝`,
        hashtags: 'GiftGenius,GiftRecommendation,ThoughtfulGift'
      }
    };

    return templates[type] || templates.gift;
  }

  async shareNatively(data) {
    if (!navigator.share) {
      return { success: false, error: 'Native sharing not supported' };
    }

    try {
      await navigator.share({
        title: data.title,
        text: data.text,
        url: data.url
      });
      return { success: true };
    } catch (error) {
      if (error.name === 'AbortError') {
        return { success: false, error: 'Share cancelled' };
      }
      return { success: false, error: error.message };
    }
  }
}

// Social Share Button Component
export const SocialShareButton = ({
  gift,
  platform,
  type = 'gift',
  className = '',
  onShare,
  showLabel = false
}) => {
  const [isSharing, setIsSharing] = useState(false);
  const sharingManager = useMemo(() => new SocialSharingManager(), []);

  const handleShare = useCallback(async () => {
    setIsSharing(true);

    const content = sharingManager.generateShareableContent(gift, type);
    const shareUrl = window.location.href;

    const shareData = {
      text: content.text,
      url: shareUrl,
      hashtags: content.hashtags,
      subject: content.title,
      image: gift?.image_url || ''
    };

    const platformUrl = sharingManager.generateShareUrl(platform, shareData);

    if (platformUrl) {
      window.open(platformUrl, '_blank', 'width=600,height=400');
      sharingManager.trackShare(platform, gift);

      if (onShare) {
        onShare(platform, gift);
      }
    }

    setTimeout(() => setIsSharing(false), 1000);
  }, [gift, platform, type, onShare, sharingManager]);

  const platformInfo = sharingManager.platforms[platform];

  if (!platformInfo) return null;

  return (
    <button
      className={`social-share-btn ${platform} ${isSharing ? 'sharing' : ''} ${className}`}
      onClick={handleShare}
      style={{ backgroundColor: platformInfo.color }}
      title={`Share on ${platformInfo.name}`}
    >
      <span className="share-icon">{platformInfo.icon}</span>
      {showLabel && <span className="share-label">{platformInfo.name}</span>}
      {isSharing && <span className="share-spinner"></span>}
    </button>
  );
};

// Share Modal Component
export const ShareModal = ({ gift, isOpen, onClose, onShare }) => {
  const [shareType, setShareType] = useState('gift');
  const [customMessage, setCustomMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const sharingManager = new SocialSharingManager();

  const shareUrl = `${window.location.origin}/gift/${gift?.id || ''}`;

  const handleNativeShare = async () => {
    const content = sharingManager.generateShareableContent(gift, shareType);
    const result = await sharingManager.shareNatively({
      title: content.title,
      text: customMessage || content.text,
      url: shareUrl
    });

    if (result.success) {
      sharingManager.trackShare('native', gift);
      if (onShare) onShare('native', gift);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      sharingManager.trackShare('clipboard', gift);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="share-modal-backdrop" onClick={onClose}>
      <div className="share-modal-content" onClick={e => e.stopPropagation()}>
        <div className="share-modal-header">
          <h2>Share This Gift</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="share-modal-body">
          <div className="gift-preview">
            <img
              src={gift?.image_url || '/api/placeholder/100/100'}
              alt={gift?.name || gift?.title}
              className="gift-preview-image"
            />
            <div className="gift-preview-info">
              <h3>{gift?.name || gift?.title}</h3>
              <p>${gift?.price}</p>
            </div>
          </div>

          <div className="share-type-selector">
            <label>Share as:</label>
            <div className="type-options">
              {['gift', 'success', 'recommendation'].map(type => (
                <button
                  key={type}
                  className={`type-option ${shareType === type ? 'active' : ''}`}
                  onClick={() => setShareType(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="custom-message">
            <label>Add a personal message (optional):</label>
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="What makes this gift special..."
              rows="3"
            />
          </div>

          <div className="share-platforms">
            <h3>Share via:</h3>
            <div className="platform-grid">
              {Object.keys(sharingManager.platforms).map(platform => (
                <SocialShareButton
                  key={platform}
                  gift={gift}
                  platform={platform}
                  type={shareType}
                  onShare={onShare}
                  showLabel={true}
                />
              ))}
            </div>
          </div>

          {navigator.share && (
            <button className="native-share-btn" onClick={handleNativeShare}>
              <span>📤</span> Share with your apps
            </button>
          )}

          <div className="share-link">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="share-url-input"
            />
            <button
              className={`copy-btn ${copied ? 'copied' : ''}`}
              onClick={copyToClipboard}
            >
              {copied ? '✓ Copied!' : '📋 Copy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Social Proof Ticker Component
export const SocialProofTicker = ({ activities = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (activities.length === 0) return;

    const interval = setInterval(() => {
      setIsVisible(false);

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % activities.length);
        setIsVisible(true);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, [activities.length]);

  if (activities.length === 0) return null;

  const activity = activities[currentIndex];

  return (
    <div className={`social-proof-ticker ${isVisible ? 'visible' : ''}`}>
      <div className="ticker-content">
        <span className="ticker-icon">
          {activity.type === 'purchase' ? '🛍️' :
           activity.type === 'share' ? '📤' :
           activity.type === 'view' ? '👀' : '🎁'}
        </span>
        <span className="ticker-text">
          <strong>{activity.user}</strong> {activity.action} <em>{activity.item}</em>
        </span>
        <span className="ticker-time">{activity.time}</span>
      </div>
    </div>
  );
};

// Gift Success Story Component
export const GiftSuccessStory = ({ story, onShare, onInspire }) => {
  const [likes, setLikes] = useState(story.likes || 0);
  const [hasLiked, setHasLiked] = useState(false);

  const handleLike = () => {
    if (!hasLiked) {
      setLikes(likes + 1);
      setHasLiked(true);

      // Save to local storage
      const likedStories = JSON.parse(localStorage.getItem('liked_stories') || '[]');
      likedStories.push(story.id);
      localStorage.setItem('liked_stories', JSON.stringify(likedStories));
    }
  };

  return (
    <div className="success-story-card">
      <div className="story-header">
        <div className="story-author">
          <div className="author-avatar">
            {story.author.charAt(0).toUpperCase()}
          </div>
          <div className="author-info">
            <h4>{story.author}</h4>
            <p className="story-date">{story.date}</p>
          </div>
        </div>
        <div className="story-badge">
          ✨ Success Story
        </div>
      </div>

      <div className="story-content">
        <h3>{story.title}</h3>
        <p>{story.description}</p>

        {story.gift && (
          <div className="story-gift">
            <img
              src={story.gift.image_url || '/api/placeholder/60/60'}
              alt={story.gift.name}
            />
            <div className="gift-info">
              <h5>{story.gift.name}</h5>
              <p>${story.gift.price}</p>
            </div>
          </div>
        )}

        <div className="story-metrics">
          <div className="metric">
            <span className="metric-icon">❤️</span>
            <span className="metric-label">Partner's Reaction:</span>
            <span className="metric-value">{story.reaction || 'Ecstatic!'}</span>
          </div>
          <div className="metric">
            <span className="metric-icon">⭐</span>
            <span className="metric-label">Success Rating:</span>
            <span className="metric-value">{story.rating || 10}/10</span>
          </div>
        </div>
      </div>

      <div className="story-actions">
        <button
          className={`like-btn ${hasLiked ? 'liked' : ''}`}
          onClick={handleLike}
        >
          <span className="like-icon">{hasLiked ? '❤️' : '🤍'}</span>
          <span className="like-count">{likes}</span>
        </button>

        <button
          className="inspire-btn"
          onClick={() => onInspire && onInspire(story)}
        >
          💡 Get Similar Gift
        </button>

        <SocialShareButton
          gift={story.gift}
          platform="twitter"
          type="success"
          onShare={onShare}
          className="story-share-btn"
        />
      </div>
    </div>
  );
};

// Referral Widget Component
export const ReferralWidget = ({ userId, onReferralSuccess }) => {
  const [referralCode, setReferralCode] = useState('');
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    successfulReferrals: 0,
    rewardsEarned: 0
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Generate or fetch referral code
    const code = `GIFT${userId?.substring(0, 6)?.toUpperCase() || 'GENIUS'}`;
    setReferralCode(code);

    // Load referral stats
    const stats = JSON.parse(localStorage.getItem('referral_stats') || '{}');
    setReferralStats(stats);
  }, [userId]);

  const referralUrl = `${window.location.origin}?ref=${referralCode}`;

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const shareReferral = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join me on GiftGenius!',
          text: `Use my code ${referralCode} to get 20% off your first gift! Find perfect gifts every time with GiftGenius.`,
          url: referralUrl
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
    }
  };

  return (
    <div className="referral-widget">
      <div className="referral-header">
        <h3>🎁 Invite Friends & Earn Rewards</h3>
        <p>Share GiftGenius and get 20% off for each friend who joins!</p>
      </div>

      <div className="referral-code-section">
        <div className="code-display">
          <label>Your Referral Code:</label>
          <div className="code-box">
            <span className="code">{referralCode}</span>
            <button
              className={`copy-code-btn ${copied ? 'copied' : ''}`}
              onClick={copyReferralLink}
            >
              {copied ? '✓' : '📋'}
            </button>
          </div>
        </div>
      </div>

      <div className="referral-stats">
        <div className="stat">
          <span className="stat-number">{referralStats.totalReferrals}</span>
          <span className="stat-label">Friends Invited</span>
        </div>
        <div className="stat">
          <span className="stat-number">{referralStats.successfulReferrals}</span>
          <span className="stat-label">Joined</span>
        </div>
        <div className="stat">
          <span className="stat-number">${referralStats.rewardsEarned}</span>
          <span className="stat-label">Rewards Earned</span>
        </div>
      </div>

      <div className="referral-actions">
        <button className="share-referral-btn" onClick={shareReferral}>
          📤 Share Invite
        </button>

        <div className="social-referral-buttons">
          {['whatsapp', 'facebook', 'twitter', 'email'].map(platform => (
            <SocialShareButton
              key={platform}
              gift={{ name: 'GiftGenius Invitation' }}
              platform={platform}
              type="recommendation"
              className="referral-social-btn"
            />
          ))}
        </div>
      </div>

      <div className="referral-benefits">
        <h4>How it works:</h4>
        <ul>
          <li>Share your unique code with friends</li>
          <li>They get 20% off their first gift</li>
          <li>You get 20% off your next purchase</li>
          <li>Earn bonus rewards for 5+ referrals!</li>
        </ul>
      </div>
    </div>
  );
};

const SocialSharingExports = {
  SocialSharingManager,
  SocialShareButton,
  ShareModal,
  SocialProofTicker,
  GiftSuccessStory,
  ReferralWidget
};

export default SocialSharingExports;