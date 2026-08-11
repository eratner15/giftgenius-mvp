import React, { useEffect, useState } from 'react';
import AffiliateTracker from '../utils/affiliateTracker';

const AffiliateManager = ({ children }) => {
  const [tracker, setTracker] = useState(null);

  useEffect(() => {
    // Initialize affiliate tracking
    const affiliateTracker = AffiliateTracker.init();
    setTracker(affiliateTracker);

    // Set up global affiliate link handling
    const handleAffiliateClick = (event) => {
      const target = event.target.closest('[data-affiliate-link]');
      if (!target) return;

      event.preventDefault();

      const giftData = {
        id: target.dataset.giftId,
        title: target.dataset.giftTitle,
        price: parseFloat(target.dataset.giftPrice),
        category: target.dataset.giftCategory,
        affiliateUrl: target.dataset.affiliateLink,
        source: target.dataset.source || 'gift_card'
      };

      // Track the affiliate click with full attribution
      const clickData = affiliateTracker.trackAffiliateClick(giftData.id, giftData);

      // Add a small delay to ensure tracking fires
      setTimeout(() => {
        window.open(giftData.affiliateUrl, '_blank', 'noopener,noreferrer');
      }, 100);

      // Show success message to user
      showAffiliateClickFeedback(giftData.title);
    };

    // Set up exit intent tracking for lead capture
    const handleExitIntent = (event) => {
      if (event.clientY <= 0 && !sessionStorage.getItem('exit_intent_shown')) {
        sessionStorage.setItem('exit_intent_shown', 'true');
        affiliateTracker.trackInteraction('exit_intent', {
          timeOnPage: affiliateTracker.getTimeOnPage(),
          leadScore: affiliateTracker.leadScore,
          conversionProbability: affiliateTracker.conversionProbability
        });

        // Trigger exit intent popup if high-value lead
        if (affiliateTracker.conversionProbability > 0.5) {
          showExitIntentCapture();
        }
      }
    };

    // Set up scroll depth tracking
    let maxScrollDepth = 0;
    const handleScroll = () => {
      const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;

        // Track milestone scroll depths
        if ([25, 50, 75, 90].includes(scrollDepth)) {
          affiliateTracker.trackInteraction('scroll_depth', {
            depth: scrollDepth,
            timeOnPage: affiliateTracker.getTimeOnPage()
          });
        }
      }
    };

    // Add event listeners
    document.addEventListener('click', handleAffiliateClick);
    document.addEventListener('mouseleave', handleExitIntent);
    document.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.removeEventListener('click', handleAffiliateClick);
      document.removeEventListener('mouseleave', handleExitIntent);
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const showAffiliateClickFeedback = (giftTitle) => {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = 'affiliate-toast';
    toast.innerHTML = `
      <div class="toast-content">
        <div class="toast-icon">🎁</div>
        <div class="toast-message">
          <strong>Great choice!</strong><br>
          Opening ${giftTitle} for you...
        </div>
      </div>
    `;

    // Add toast styles
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #0ea5e9, #3b82f6);
      color: white;
      padding: 16px 20px;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(14, 165, 233, 0.3);
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
      max-width: 300px;
    `;

    document.body.appendChild(toast);

    // Remove after 3 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => toast.remove(), 300);
      }
    }, 3000);
  };

  const showExitIntentCapture = () => {
    // Create exit intent modal
    const modal = document.createElement('div');
    modal.className = 'exit-intent-modal';
    modal.innerHTML = `
      <div class="modal-overlay" onclick="this.parentElement.remove()">
        <div class="modal-content" onclick="event.stopPropagation()">
          <button class="modal-close" onclick="this.closest('.exit-intent-modal').remove()">×</button>
          <div class="modal-header">
            <h2>🎁 Wait! Don't Miss Out</h2>
            <p>Get notified when your favorite gifts go on sale</p>
          </div>
          <form class="exit-intent-form" onsubmit="handleExitIntentSubmit(event)">
            <input type="email" placeholder="Enter your email" required>
            <button type="submit">Get Sale Alerts</button>
          </form>
          <div class="modal-benefits">
            <div>✅ Exclusive deals & discounts</div>
            <div>✅ Price drop notifications</div>
            <div>✅ New gift recommendations</div>
          </div>
        </div>
      </div>
    `;

    // Add modal styles
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      z-index: 20000;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.3s ease-out;
    `;

    document.body.appendChild(modal);

    // Handle form submission
    window.handleExitIntentSubmit = (event) => {
      event.preventDefault();
      const email = event.target.querySelector('input[type="email"]').value;

      // Track email capture
      if (tracker) {
        tracker.trackInteraction('email_captured', {
          source: 'exit_intent',
          email: email,
          leadScore: tracker.leadScore,
          conversionProbability: tracker.conversionProbability
        });
      }

      // Show success message
      event.target.innerHTML = `
        <div class="success-message">
          <h3>🎉 You're all set!</h3>
          <p>We'll notify you about deals on gifts you love</p>
        </div>
      `;

      // Remove modal after 2 seconds
      setTimeout(() => modal.remove(), 2000);
    };
  };

  return <>{children}</>;
};

// Enhanced GiftCard component with affiliate tracking
export const TrackedGiftCard = ({ gift, onClick, source = 'gift_grid' }) => {
  const handleClick = (event) => {
    // Check if it's an affiliate link click
    if (event.target.closest('.btn-buy-now')) {
      // This will be handled by the global click handler
      return;
    }

    // Regular gift card click for modal
    if (onClick) onClick(gift);
  };

  return (
    <div className="gift-card enhanced-button" onClick={handleClick}>
      <div className="gift-image-container">
        <img src={gift.image_url} alt={gift.title} />
        {gift.success_rate >= 95 && (
          <span className="gift-badge hot">HOT</span>
        )}
      </div>

      <div className="gift-card-content">
        <h3>{gift.title}</h3>
        <p className="gift-description">{gift.description}</p>

        <div className="price-row">
          <span className="price">${gift.price?.toFixed(2)}</span>
          <span className="delivery">Free shipping</span>
        </div>

        <div className="rating-row">
          <div className="hearts">
            {'❤️'.repeat(Math.round(gift.success_rate / 20))}
          </div>
          <span className="success-text">
            {gift.success_rate}% success rate
          </span>
        </div>

        <div className="gift-card-actions">
          <button className="btn-view-details">
            View Details
          </button>
          <a
            href="#"
            className="btn-buy-now"
            data-affiliate-link={gift.affiliate_link || `https://amazon.com/dp/example?tag=giftgenius-20`}
            data-gift-id={gift.id}
            data-gift-title={gift.title}
            data-gift-price={gift.price}
            data-gift-category={gift.category}
            data-source={source}
          >
            Buy Now 🛒
          </a>
        </div>
      </div>
    </div>
  );
};

// Enhanced search tracking
export const SearchTracker = ({ onSearch }) => {
  const handleSearch = (searchQuery) => {
    // Track search interaction
    if (window.affiliateTracker) {
      window.affiliateTracker.trackInteraction('search_performed', {
        query: searchQuery,
        timestamp: Date.now()
      });
    }

    if (onSearch) onSearch(searchQuery);
  };

  return { handleSearch };
};

// Enhanced quiz tracking
export const QuizTracker = {
  trackQuizStart: (quizType) => {
    if (window.affiliateTracker) {
      window.affiliateTracker.trackInteraction('quiz_started', {
        quizType,
        timestamp: Date.now()
      });
    }
  },

  trackQuizComplete: (quizType, results) => {
    if (window.affiliateTracker) {
      window.affiliateTracker.trackInteraction('quiz_completed', {
        quizType,
        results,
        timestamp: Date.now()
      });
    }
  },

  trackQuizStep: (step, answer) => {
    if (window.affiliateTracker) {
      window.affiliateTracker.trackInteraction('quiz_step', {
        step,
        answer,
        timestamp: Date.now()
      });
    }
  }
};

// CSS for tracking components
const trackingStyles = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .affiliate-toast .toast-content {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .toast-icon {
    font-size: 24px;
  }

  .exit-intent-modal .modal-content {
    background: white;
    padding: 32px;
    border-radius: 16px;
    max-width: 400px;
    width: 90%;
    text-align: center;
    position: relative;
  }

  .modal-close {
    position: absolute;
    top: 16px;
    right: 16px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
  }

  .modal-header h2 {
    margin: 0 0 8px 0;
    color: #1a202c;
  }

  .exit-intent-form {
    margin: 24px 0;
  }

  .exit-intent-form input {
    width: 100%;
    padding: 12px;
    margin-bottom: 16px;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 16px;
  }

  .exit-intent-form button {
    width: 100%;
    padding: 12px;
    background: linear-gradient(135deg, #0ea5e9, #3b82f6);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
  }

  .modal-benefits {
    text-align: left;
    margin-top: 24px;
  }

  .modal-benefits div {
    margin: 8px 0;
    color: #4a5568;
  }
`;

// Add styles to document
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = trackingStyles;
  document.head.appendChild(styleElement);
}

export default AffiliateManager;