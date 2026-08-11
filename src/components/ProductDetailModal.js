import React, { useState, useEffect } from 'react';

const ProductDetailModal = ({ gift, onClose, onAddToFavorites, isFavorited }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!gift) return null;

  const getRating = (successRate) => {
    return (Math.round((successRate || 0) / 20 * 10) / 10).toFixed(1);
  };

  const handleShare = (platform) => {
    const url = `${window.location.origin}/products/${gift.id}`;
    const text = `Check out this gift idea: ${gift.title} - $${gift.price}`;

    switch (platform) {
      case 'copy':
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent(gift.title)}&body=${encodeURIComponent(text + '\n\n' + url)}`;
        break;
      default:
        break;
    }
    setShowShareMenu(false);
  };

  const mockReviews = [
    {
      id: 1,
      name: 'Sarah M.',
      rating: 5,
      date: '2 weeks ago',
      text: 'Absolutely perfect! My partner loved it. The quality exceeded expectations.',
      verified: true
    },
    {
      id: 2,
      name: 'Michael T.',
      rating: 5,
      date: '1 month ago',
      text: 'Great gift for my mom\'s birthday. She was thrilled! Fast shipping too.',
      verified: true
    },
    {
      id: 3,
      name: 'Jessica R.',
      rating: 4,
      date: '1 month ago',
      text: 'Very nice quality. Slightly pricier than expected but worth it for the reaction.',
      verified: true
    }
  ];

  return (
    <div className="product-modal">
      <div className="modal-overlay" onClick={onClose}></div>

      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="modal-body">
          {/* Left Side - Images */}
          <div className="product-images">
            <div className="main-image">
              <img
                src={gift.image_url || 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600&h=600&fit=crop'}
                alt={gift.title}
              />
              <div className="image-badges">
                {gift.success_rate >= 95 && (
                  <span className="badge hot">HOT</span>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Details */}
          <div className="product-details">
            <div className="product-header">
              <h1 className="product-title">{gift.title}</h1>

              <div className="product-actions">
                <button
                  className={`favorite-btn ${isFavorited ? 'favorited' : ''}`}
                  onClick={() => onAddToFavorites(gift)}
                  title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={isFavorited ? "var(--color-accent)" : "none"} stroke={isFavorited ? "var(--color-accent)" : "currentColor"} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                </button>

                <div className="share-wrapper">
                  <button
                    className="share-btn"
                    onClick={() => setShowShareMenu(!showShareMenu)}
                  >
                    Share
                  </button>

                  {showShareMenu && (
                    <div className="share-menu">
                      <button onClick={() => handleShare('copy')}>Copy Link</button>
                      <button onClick={() => handleShare('facebook')}>Facebook</button>
                      <button onClick={() => handleShare('twitter')}>Twitter</button>
                      <button onClick={() => handleShare('email')}>Email</button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="product-rating">
              <span className="rating-text" style={{fontWeight: 700, color: 'var(--color-text)'}}>
                {getRating(gift.success_rate)}/5
              </span>
              <span className="rating-text">
                {gift.success_rate}% success rate &middot; {gift.total_reviews?.toLocaleString()} reviews
              </span>
            </div>

            <div className="product-price">
              <span className="price">${gift.price.toFixed(2)}</span>
              <span className="delivery">✓ Free Shipping</span>
            </div>

            <div className="product-description">
              <h3>About This Gift</h3>
              <p>{gift.description}</p>
            </div>

            <div className="product-highlights">
              <h3>Why People Love It</h3>
              <ul>
                <li>&mdash; {gift.success_rate}% of recipients loved this gift</li>
                <li>&mdash; Fast & free delivery</li>
                <li>&mdash; Gift wrapping available</li>
                <li>&mdash; Easy returns within 30 days</li>
              </ul>
            </div>

            <div className="product-cta">
              <button className="btn-primary btn-large">
                View on Amazon →
              </button>
              <p className="cta-note">We earn a small commission from purchases</p>
            </div>

            {/* Reviews Section */}
            <div className="product-reviews">
              <h3>Top Reviews</h3>
              {mockReviews.map(review => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <div className="review-author">
                      <strong>{review.name}</strong>
                      {review.verified && <span className="verified">✓ Verified</span>}
                    </div>
                    <div className="review-meta">
                      <span className="review-rating">{review.rating}/5</span>
                      <span className="review-date">{review.date}</span>
                    </div>
                  </div>
                  <p className="review-text">{review.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;