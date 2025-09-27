import React, { useState } from 'react';

const Wishlist = ({ onClose, onGiftClick, onRemoveFromFavorites }) => {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('giftgenius_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const handleRemove = (giftId) => {
    const updatedFavorites = favorites.filter(gift => gift.id !== giftId);
    setFavorites(updatedFavorites);
    localStorage.setItem('giftgenius_favorites', JSON.stringify(updatedFavorites));
    onRemoveFromFavorites && onRemoveFromFavorites(giftId);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to remove all items from your wishlist?')) {
      setFavorites([]);
      localStorage.setItem('giftgenius_favorites', JSON.stringify([]));
    }
  };

  const handleShare = () => {
    const wishlistText = `Check out my gift wishlist:\n${favorites.map(gift =>
      `• ${gift.title} - $${gift.price}`
    ).join('\n')}\n\nFind more gift ideas at ${window.location.origin}`;

    if (navigator.share) {
      navigator.share({
        title: 'My Gift Wishlist',
        text: wishlistText,
        url: window.location.origin
      });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(wishlistText);
      alert('Wishlist copied to clipboard!');
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = wishlistText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Wishlist copied to clipboard!');
    }
  };

  const calculateTotal = () => {
    return favorites.reduce((total, gift) => total + gift.price, 0).toFixed(2);
  };

  if (favorites.length === 0) {
    return (
      <div className="wishlist-modal">
        <div className="wishlist-content">
          <div className="wishlist-header">
            <h2>My Wishlist</h2>
            <button className="close-button" onClick={onClose}>✕</button>
          </div>

          <div className="empty-wishlist">
            <div className="empty-icon">💝</div>
            <h3>Your wishlist is empty</h3>
            <p>Start adding gifts you love to create your perfect wishlist!</p>
            <button className="browse-button" onClick={onClose}>
              Browse Gifts
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-modal">
      <div className="wishlist-content">
        <div className="wishlist-header">
          <h2>My Wishlist</h2>
          <div className="wishlist-actions">
            <button className="share-button" onClick={handleShare}>
              📤 Share
            </button>
            <button className="clear-button" onClick={handleClearAll}>
              🗑️ Clear All
            </button>
            <button className="close-button" onClick={onClose}>✕</button>
          </div>
        </div>

        <div className="wishlist-summary">
          <div className="wishlist-stats">
            <span className="item-count">{favorites.length} item{favorites.length !== 1 ? 's' : ''}</span>
            <span className="total-value">Total: ${calculateTotal()}</span>
          </div>
        </div>

        <div className="wishlist-grid">
          {favorites.map((gift) => (
            <div key={gift.id} className="wishlist-item">
              <div className="wishlist-item-image" onClick={() => onGiftClick(gift)}>
                <img src={gift.image_url} alt={gift.title} />
                <div className="wishlist-item-overlay">
                  <span>View Details</span>
                </div>
              </div>

              <div className="wishlist-item-info">
                <h3 className="wishlist-item-title" onClick={() => onGiftClick(gift)}>
                  {gift.title}
                </h3>
                <div className="wishlist-item-price">${gift.price}</div>
                <div className="wishlist-item-category">{gift.category}</div>
                <div className="wishlist-item-rating">
                  ⭐ {gift.success_rate}% success rate
                </div>
              </div>

              <div className="wishlist-item-actions">
                <button
                  className="remove-button"
                  onClick={() => handleRemove(gift.id)}
                  title="Remove from wishlist"
                >
                  ❤️ Remove
                </button>
                <button
                  className="view-button"
                  onClick={() => onGiftClick(gift)}
                >
                  👁️ View
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="wishlist-footer">
          <p className="wishlist-tip">
            💡 <strong>Tip:</strong> Share your wishlist with friends and family so they know exactly what you'd love!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;