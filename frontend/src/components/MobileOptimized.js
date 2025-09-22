import React, { useState, useEffect } from 'react';

// Enhanced Mobile Navigation Component
export const MobileNavigation = ({
  showSearch,
  onSearchToggle,
  searchQuery,
  onSearchChange,
  activeFilters,
  onClearFilters
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`mobile-nav ${isScrolled ? 'mobile-nav-scrolled' : ''}`}>
      <div className="mobile-nav-content">
        <div className="mobile-nav-header">
          <h1 className="mobile-logo">🎁 GiftGenius</h1>
          <button
            className="mobile-search-toggle"
            onClick={onSearchToggle}
            aria-label="Toggle search"
          >
            {showSearch ? '✕' : '🔍'}
          </button>
        </div>

        {showSearch && (
          <div className="mobile-search-container">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search perfect gifts..."
              className="mobile-search-input"
              autoFocus
            />
            {activeFilters.length > 0 && (
              <button
                className="mobile-clear-filters"
                onClick={onClearFilters}
              >
                Clear {activeFilters.length} filter{activeFilters.length !== 1 ? 's' : ''}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced Gift Card for Mobile
export const MobileGiftCard = ({ gift, onSelect, isSelected }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => setImageLoaded(true);
  const handleImageError = () => setImageError(true);

  const handleCardInteraction = (e) => {
    // Add haptic feedback for mobile devices
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    onSelect(gift);
  };

  return (
    <div
      className={`mobile-gift-card ${isSelected ? 'selected' : ''}`}
      onClick={handleCardInteraction}
      onTouchStart={(e) => e.currentTarget.classList.add('touch-active')}
      onTouchEnd={(e) => e.currentTarget.classList.remove('touch-active')}
    >
      <div className="mobile-gift-image-container">
        {!imageLoaded && !imageError && (
          <div className="mobile-image-skeleton">
            <div className="skeleton-shimmer"></div>
          </div>
        )}
        {!imageError ? (
          <img
            src={gift.image_url}
            alt={gift.title}
            className={`mobile-gift-image ${imageLoaded ? 'loaded' : ''}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="mobile-image-fallback">
            🎁
          </div>
        )}

        {gift.success_rate >= 90 && (
          <div className="mobile-success-badge">
            ⭐ {gift.success_rate}% Success
          </div>
        )}
      </div>

      <div className="mobile-gift-content">
        <h3 className="mobile-gift-title">{gift.title}</h3>
        <div className="mobile-gift-price">${gift.price}</div>

        <div className="mobile-gift-stats">
          <div className="mobile-rating">
            {'💖'.repeat(Math.round(gift.success_rate / 20))}
            <span className="mobile-rating-text">
              {gift.total_reviews} review{gift.total_reviews !== 1 ? 's' : ''}
            </span>
          </div>
          {gift.delivery_days <= 2 && (
            <div className="mobile-fast-delivery">
              ⚡ Fast delivery
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Mobile-Optimized Filter Panel
export const MobileFilterPanel = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  categories
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="mobile-filter-overlay" onClick={onClose}></div>
      <div className="mobile-filter-panel">
        <div className="mobile-filter-header">
          <h3>Filter Gifts</h3>
          <button onClick={onClose} className="mobile-filter-close">✕</button>
        </div>

        <div className="mobile-filter-content">
          <div className="mobile-filter-section">
            <label className="mobile-filter-label">Price Range</label>
            <div className="mobile-price-inputs">
              <input
                type="number"
                placeholder="Min $"
                value={filters.minPrice || ''}
                onChange={(e) => onFilterChange('minPrice', e.target.value)}
                className="mobile-price-input"
              />
              <span className="mobile-price-separator">to</span>
              <input
                type="number"
                placeholder="Max $"
                value={filters.maxPrice || ''}
                onChange={(e) => onFilterChange('maxPrice', e.target.value)}
                className="mobile-price-input"
              />
            </div>
          </div>

          <div className="mobile-filter-section">
            <label className="mobile-filter-label">Category</label>
            <div className="mobile-category-grid">
              {categories.map(category => (
                <button
                  key={category.category}
                  className={`mobile-category-button ${
                    filters.category === category.category ? 'active' : ''
                  }`}
                  onClick={() => onFilterChange('category',
                    filters.category === category.category ? '' : category.category
                  )}
                >
                  <span className="category-icon">{category.icon}</span>
                  <span className="category-name">{category.displayName}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mobile-filter-section">
            <label className="mobile-filter-label">Occasion</label>
            <select
              value={filters.occasion || ''}
              onChange={(e) => onFilterChange('occasion', e.target.value)}
              className="mobile-select"
            >
              <option value="">Any occasion</option>
              <option value="birthday">Birthday</option>
              <option value="anniversary">Anniversary</option>
              <option value="christmas">Christmas</option>
              <option value="valentines">Valentine's Day</option>
              <option value="just-because">Just Because</option>
            </select>
          </div>
        </div>

        <div className="mobile-filter-footer">
          <button
            onClick={() => {
              onFilterChange('reset');
              onClose();
            }}
            className="mobile-filter-reset"
          >
            Reset All
          </button>
          <button
            onClick={onClose}
            className="mobile-filter-apply"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
};

// Swipeable Gift Detail Modal for Mobile
export const MobileGiftDetail = ({ gift, isOpen, onClose, onNext, onPrev, hasNext, hasPrev }) => {
  const [startX, setStartX] = useState(null);
  const [currentX, setCurrentX] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !startX) return;
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!isDragging || !startX || !currentX) {
      setIsDragging(false);
      setStartX(null);
      setCurrentX(null);
      return;
    }

    const diff = startX - currentX;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0 && hasNext) {
        onNext();
      } else if (diff < 0 && hasPrev) {
        onPrev();
      }
    }

    setIsDragging(false);
    setStartX(null);
    setCurrentX(null);
  };

  if (!isOpen || !gift) return null;

  return (
    <div className="mobile-detail-overlay">
      <div
        className="mobile-detail-modal"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="mobile-detail-header">
          <button onClick={onClose} className="mobile-detail-close">✕</button>
          <div className="mobile-detail-nav">
            {hasPrev && (
              <button onClick={onPrev} className="mobile-detail-prev">‹</button>
            )}
            {hasNext && (
              <button onClick={onNext} className="mobile-detail-next">›</button>
            )}
          </div>
        </div>

        <div className="mobile-detail-content">
          <img
            src={gift.image_url}
            alt={gift.title}
            className="mobile-detail-image"
          />

          <div className="mobile-detail-info">
            <h2 className="mobile-detail-title">{gift.title}</h2>
            <div className="mobile-detail-price">${gift.price}</div>

            <div className="mobile-detail-stats">
              <div className="mobile-stat">
                <span className="mobile-stat-label">Success Rate</span>
                <span className="mobile-stat-value">{gift.success_rate}%</span>
              </div>
              <div className="mobile-stat">
                <span className="mobile-stat-label">Reviews</span>
                <span className="mobile-stat-value">{gift.total_reviews}</span>
              </div>
              <div className="mobile-stat">
                <span className="mobile-stat-label">Delivery</span>
                <span className="mobile-stat-value">{gift.delivery_days} days</span>
              </div>
            </div>

            <p className="mobile-detail-description">{gift.description}</p>

            <div className="mobile-detail-actions">
              <button
                className="mobile-buy-button"
                onClick={() => window.open(gift.affiliate_url, '_blank')}
              >
                Buy Now at {gift.retailer}
              </button>
              <button className="mobile-save-button">
                💖 Save for Later
              </button>
            </div>
          </div>
        </div>

        {isDragging && (
          <div className="mobile-swipe-indicator">
            {currentX && startX && (
              <div className={`swipe-hint ${currentX > startX ? 'left' : 'right'}`}>
                {currentX > startX ? '← Previous' : 'Next →'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Pull-to-Refresh Component
export const PullToRefresh = ({ onRefresh, children }) => {
  const [startY, setStartY] = useState(null);
  const [currentY, setCurrentY] = useState(null);
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleTouchStart = (e) => {
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e) => {
    if (!startY || window.scrollY > 0) return;

    const currentY = e.touches[0].clientY;
    setCurrentY(currentY);

    if (currentY > startY) {
      setIsPulling(true);
      e.preventDefault();
    }
  };

  const handleTouchEnd = async () => {
    if (!isPulling || !startY || !currentY) {
      reset();
      return;
    }

    const pullDistance = currentY - startY;
    if (pullDistance > 100) {
      setIsRefreshing(true);
      await onRefresh();
      setIsRefreshing(false);
    }

    reset();
  };

  const reset = () => {
    setStartY(null);
    setCurrentY(null);
    setIsPulling(false);
  };

  const pullDistance = isPulling && startY && currentY ? Math.max(0, currentY - startY) : 0;

  return (
    <div
      className="pull-to-refresh-container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {(isPulling || isRefreshing) && (
        <div
          className="pull-to-refresh-indicator"
          style={{ height: Math.min(pullDistance, 60) }}
        >
          <div className={`refresh-icon ${isRefreshing ? 'spinning' : ''}`}>
            ↻
          </div>
          <span className="refresh-text">
            {isRefreshing ? 'Refreshing...' : pullDistance > 60 ? 'Release to refresh' : 'Pull to refresh'}
          </span>
        </div>
      )}
      {children}
    </div>
  );
};

export default {
  MobileNavigation,
  MobileGiftCard,
  MobileFilterPanel,
  MobileGiftDetail,
  PullToRefresh
};