import React, { useState, useEffect } from 'react';

const GiftDeliveryExperience = ({ gift, onConfigureDelivery, onClose }) => {
  const [selectedOptions, setSelectedOptions] = useState({
    wrapping: null,
    delivery: null,
    timing: null,
    message: '',
    recipient: {},
    tracking: true
  });
  const [estimatedTotal, setEstimatedTotal] = useState(0);
  const [deliveryDate, setDeliveryDate] = useState(null);

  const wrappingOptions = [
    {
      id: 'premium_box',
      name: 'Premium Gift Box',
      description: 'Elegant black box with gold ribbon and tissue paper',
      price: 12.99,
      image: '🎁',
      features: ['Reusable box', 'Gold foil ribbon', 'Tissue paper', 'Gift tag']
    },
    {
      id: 'eco_friendly',
      name: 'Eco-Friendly Wrapping',
      description: 'Sustainable kraft paper with twine and dried flowers',
      price: 8.99,
      image: '🌿',
      features: ['Recycled materials', 'Biodegradable', 'Natural twine', 'Dried flower accent']
    },
    {
      id: 'luxury_themed',
      name: 'Luxury Themed Package',
      description: 'Custom theme matching the occasion with premium materials',
      price: 24.99,
      image: '💎',
      features: ['Custom theme design', 'Premium materials', 'Wax seal', 'Luxury ribbon']
    },
    {
      id: 'surprise_box',
      name: 'Multi-Layer Surprise',
      description: 'Multiple boxes within boxes for extended unwrapping joy',
      price: 18.99,
      image: '📦',
      features: ['3 nested boxes', 'Individual notes', 'Progressive reveals', 'Final surprise element']
    },
    {
      id: 'no_wrapping',
      name: 'No Gift Wrapping',
      description: 'Item ships in original packaging',
      price: 0,
      image: '📄',
      features: ['Original packaging', 'Fastest shipping', 'Eco-conscious option']
    }
  ];

  const deliveryOptions = [
    {
      id: 'standard',
      name: 'Standard Delivery',
      description: '5-7 business days',
      price: 0,
      icon: '📦',
      timeline: '5-7 days'
    },
    {
      id: 'express',
      name: 'Express Delivery',
      description: '2-3 business days',
      price: 9.99,
      icon: '🚀',
      timeline: '2-3 days'
    },
    {
      id: 'overnight',
      name: 'Overnight Delivery',
      description: 'Next business day',
      price: 24.99,
      icon: '⚡',
      timeline: '1 day'
    },
    {
      id: 'same_day',
      name: 'Same-Day Delivery',
      description: 'Within 6 hours (select cities)',
      price: 39.99,
      icon: '🏃‍♂️',
      timeline: '6 hours',
      limitation: 'Available in major cities only'
    },
    {
      id: 'scheduled',
      name: 'Scheduled Delivery',
      description: 'Deliver on a specific date and time',
      price: 14.99,
      icon: '⏰',
      timeline: 'Custom date'
    },
    {
      id: 'white_glove',
      name: 'White Glove Service',
      description: 'Premium setup and presentation service',
      price: 89.99,
      icon: '🤵',
      timeline: 'Scheduled',
      features: ['Professional setup', 'Gift presentation', 'Photo capture', 'Cleanup service']
    }
  ];

  const timingOptions = [
    {
      id: 'asap',
      name: 'As Soon As Possible',
      description: 'Fastest available option'
    },
    {
      id: 'specific_date',
      name: 'Specific Date',
      description: 'Choose exact delivery date'
    },
    {
      id: 'morning_surprise',
      name: 'Morning Surprise',
      description: 'Deliver between 8-10 AM'
    },
    {
      id: 'evening_delivery',
      name: 'Evening Delivery',
      description: 'Deliver between 6-8 PM'
    },
    {
      id: 'milestone_moment',
      name: 'Milestone Moment',
      description: 'Coordinate with special occasion timing'
    }
  ];

  useEffect(() => {
    calculateTotal();
    calculateDeliveryDate();
  }, [selectedOptions]);

  const calculateTotal = () => {
    let total = gift.price;

    if (selectedOptions.wrapping) {
      const wrapping = wrappingOptions.find(w => w.id === selectedOptions.wrapping);
      total += wrapping?.price || 0;
    }

    if (selectedOptions.delivery) {
      const delivery = deliveryOptions.find(d => d.id === selectedOptions.delivery);
      total += delivery?.price || 0;
    }

    setEstimatedTotal(total);
  };

  const calculateDeliveryDate = () => {
    if (!selectedOptions.delivery) return;

    const delivery = deliveryOptions.find(d => d.id === selectedOptions.delivery);
    const today = new Date();
    let deliveryDate = new Date(today);

    switch (delivery.id) {
      case 'standard':
        deliveryDate.setDate(today.getDate() + 6); // 5-7 days, use 6 as average
        break;
      case 'express':
        deliveryDate.setDate(today.getDate() + 3); // 2-3 days, use 3 as average
        break;
      case 'overnight':
        deliveryDate.setDate(today.getDate() + 1);
        break;
      case 'same_day':
        deliveryDate = today;
        break;
      case 'scheduled':
        // User will select custom date
        return;
      case 'white_glove':
        deliveryDate.setDate(today.getDate() + 2); // Requires scheduling
        break;
      default:
        deliveryDate.setDate(today.getDate() + 5);
    }

    setDeliveryDate(deliveryDate);
  };

  const handleOptionSelect = (category, optionId) => {
    setSelectedOptions(prev => ({
      ...prev,
      [category]: optionId
    }));
  };

  const handleRecipientUpdate = (field, value) => {
    setSelectedOptions(prev => ({
      ...prev,
      recipient: {
        ...prev.recipient,
        [field]: value
      }
    }));
  };

  const handleConfigureComplete = () => {
    const deliveryConfig = {
      gift,
      options: selectedOptions,
      estimatedTotal,
      deliveryDate,
      trackingEnabled: selectedOptions.tracking
    };

    onConfigureDelivery(deliveryConfig);
  };

  const getDeliveryPreview = () => {
    const wrapping = wrappingOptions.find(w => w.id === selectedOptions.wrapping);
    const delivery = deliveryOptions.find(d => d.id === selectedOptions.delivery);
    const timing = timingOptions.find(t => t.id === selectedOptions.timing);

    return {
      wrapping: wrapping?.name || 'Not selected',
      delivery: delivery?.name || 'Not selected',
      timing: timing?.name || 'Not selected',
      message: selectedOptions.message || 'No message'
    };
  };

  return (
    <div className="delivery-experience-overlay">
      <div className="delivery-experience-modal">
        <div className="delivery-header">
          <h2>🎁 Create Perfect Delivery Experience</h2>
          <p>Design every detail of how your gift will be received</p>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="delivery-content">
          {/* Gift Summary */}
          <div className="gift-summary">
            <img src={gift.image_url} alt={gift.title} className="gift-thumbnail" />
            <div className="gift-details">
              <h3>{gift.title}</h3>
              <p className="gift-price">${gift.price.toFixed(2)}</p>
            </div>
          </div>

          {/* Wrapping Options */}
          <div className="option-section">
            <h3>🎁 Gift Wrapping</h3>
            <div className="options-grid">
              {wrappingOptions.map(option => (
                <div
                  key={option.id}
                  className={`option-card ${selectedOptions.wrapping === option.id ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect('wrapping', option.id)}
                >
                  <div className="option-image">{option.image}</div>
                  <div className="option-content">
                    <h4>{option.name}</h4>
                    <p>{option.description}</p>
                    <div className="option-price">
                      {option.price > 0 ? `+$${option.price.toFixed(2)}` : 'FREE'}
                    </div>
                    <div className="option-features">
                      {option.features.map((feature, index) => (
                        <span key={index} className="feature-tag">{feature}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Options */}
          <div className="option-section">
            <h3>🚚 Delivery Speed</h3>
            <div className="options-grid">
              {deliveryOptions.map(option => (
                <div
                  key={option.id}
                  className={`option-card ${selectedOptions.delivery === option.id ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect('delivery', option.id)}
                >
                  <div className="option-icon">{option.icon}</div>
                  <div className="option-content">
                    <h4>{option.name}</h4>
                    <p>{option.description}</p>
                    <div className="option-timeline">{option.timeline}</div>
                    <div className="option-price">
                      {option.price > 0 ? `+$${option.price.toFixed(2)}` : 'FREE'}
                    </div>
                    {option.limitation && (
                      <div className="option-limitation">{option.limitation}</div>
                    )}
                    {option.features && (
                      <div className="option-features">
                        {option.features.map((feature, index) => (
                          <span key={index} className="feature-tag">{feature}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timing Options */}
          <div className="option-section">
            <h3>⏰ Delivery Timing</h3>
            <div className="timing-options">
              {timingOptions.map(option => (
                <label
                  key={option.id}
                  className={`timing-option ${selectedOptions.timing === option.id ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="timing"
                    value={option.id}
                    checked={selectedOptions.timing === option.id}
                    onChange={(e) => handleOptionSelect('timing', e.target.value)}
                  />
                  <div className="timing-content">
                    <h4>{option.name}</h4>
                    <p>{option.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Personal Message */}
          <div className="option-section">
            <h3>💌 Personal Message</h3>
            <textarea
              className="message-input"
              placeholder="Write a heartfelt message that will be included with your gift..."
              value={selectedOptions.message}
              onChange={(e) => setSelectedOptions(prev => ({ ...prev, message: e.target.value }))}
              maxLength={500}
            />
            <div className="character-count">
              {selectedOptions.message.length}/500 characters
            </div>
          </div>

          {/* Recipient Information */}
          <div className="option-section">
            <h3>📍 Recipient Details</h3>
            <div className="recipient-form">
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Recipient Name"
                  value={selectedOptions.recipient.name || ''}
                  onChange={(e) => handleRecipientUpdate('name', e.target.value)}
                />
                <input
                  type="email"
                  placeholder="Email (for delivery updates)"
                  value={selectedOptions.recipient.email || ''}
                  onChange={(e) => handleRecipientUpdate('email', e.target.value)}
                />
              </div>
              <input
                type="text"
                placeholder="Delivery Address"
                value={selectedOptions.recipient.address || ''}
                onChange={(e) => handleRecipientUpdate('address', e.target.value)}
              />
              <textarea
                placeholder="Special delivery instructions (optional)"
                value={selectedOptions.recipient.instructions || ''}
                onChange={(e) => handleRecipientUpdate('instructions', e.target.value)}
              />
            </div>
          </div>

          {/* Delivery Preview */}
          <div className="delivery-preview">
            <h3>📋 Delivery Summary</h3>
            <div className="preview-grid">
              <div className="preview-item">
                <span className="preview-label">Gift Wrapping:</span>
                <span className="preview-value">{getDeliveryPreview().wrapping}</span>
              </div>
              <div className="preview-item">
                <span className="preview-label">Delivery Speed:</span>
                <span className="preview-value">{getDeliveryPreview().delivery}</span>
              </div>
              <div className="preview-item">
                <span className="preview-label">Timing:</span>
                <span className="preview-value">{getDeliveryPreview().timing}</span>
              </div>
              {deliveryDate && (
                <div className="preview-item">
                  <span className="preview-label">Estimated Delivery:</span>
                  <span className="preview-value">{deliveryDate.toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Total Cost */}
          <div className="cost-summary">
            <div className="cost-breakdown">
              <div className="cost-item">
                <span>Gift: {gift.title}</span>
                <span>${gift.price.toFixed(2)}</span>
              </div>
              {selectedOptions.wrapping && selectedOptions.wrapping !== 'no_wrapping' && (
                <div className="cost-item">
                  <span>Gift Wrapping</span>
                  <span>+${wrappingOptions.find(w => w.id === selectedOptions.wrapping)?.price.toFixed(2)}</span>
                </div>
              )}
              {selectedOptions.delivery && (
                <div className="cost-item">
                  <span>Delivery</span>
                  <span>
                    {deliveryOptions.find(d => d.id === selectedOptions.delivery)?.price > 0
                      ? `+$${deliveryOptions.find(d => d.id === selectedOptions.delivery)?.price.toFixed(2)}`
                      : 'FREE'}
                  </span>
                </div>
              )}
              <div className="cost-total">
                <span>Total Experience</span>
                <span>${estimatedTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="delivery-actions">
            <button className="btn-back" onClick={onClose}>
              ← Back to Gift
            </button>
            <button
              className="btn-configure-delivery"
              onClick={handleConfigureComplete}
              disabled={!selectedOptions.wrapping || !selectedOptions.delivery}
            >
              Configure This Experience 🎁
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiftDeliveryExperience;