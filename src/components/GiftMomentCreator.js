import React, { useState, useEffect } from 'react';

const GiftMomentCreator = ({ gift, onCreateMoment, onClose }) => {
  const [step, setStep] = useState('occasion');
  const [momentData, setMomentData] = useState({});
  const [preview, setPreview] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const occasions = [
    {
      id: 'birthday',
      title: 'Birthday Surprise',
      description: 'Make their special day unforgettable',
      moments: [
        'The moment they realize you remembered their favorite thing',
        'When they unwrap something they\'ve secretly wanted',
        'The smile that says "you really know me"'
      ]
    },
    {
      id: 'anniversary',
      title: 'Anniversary Celebration',
      description: 'Celebrate your journey together',
      moments: [
        'Reliving your favorite memories together',
        'Creating a new tradition you\'ll both treasure',
        'The look of pure love and appreciation'
      ]
    },
    {
      id: 'graduation',
      title: 'Achievement Recognition',
      description: 'Honor their hard work and success',
      moments: [
        'The pride in their eyes as they realize you believe in them',
        'A gift that says "you\'re ready for what\'s next"',
        'Celebrating the beginning of their new chapter'
      ]
    },
    {
      id: 'just_because',
      title: 'Just Because',
      description: 'Random acts of thoughtfulness',
      moments: [
        'The total surprise of unexpected kindness',
        'Brightening an ordinary day with extraordinary care',
        'The realization that someone was thinking of them'
      ]
    },
    {
      id: 'apology',
      title: 'Making Things Right',
      description: 'Thoughtful gestures of reconciliation',
      moments: [
        'The moment they realize you truly understand',
        'When actions speak louder than words',
        'The beginning of healing and moving forward'
      ]
    },
    {
      id: 'encouragement',
      title: 'Support & Encouragement',
      description: 'Show you believe in their dreams',
      moments: [
        'The boost of confidence when they needed it most',
        'Knowing someone believes in their potential',
        'The motivation to keep pursuing their goals'
      ]
    }
  ];

  const deliveryStyles = [
    {
      id: 'surprise_box',
      title: 'Surprise Box Experience',
      description: 'Multi-layered unboxing with personalized notes',
      preview: 'Box > Note > Gift > Reveal',
      details: 'Custom packaging with layers of anticipation, personal notes, and the perfect reveal moment'
    },
    {
      id: 'treasure_hunt',
      title: 'Treasure Hunt Adventure',
      description: 'Turn gift-giving into a fun discovery journey',
      preview: 'Map > Search > Target > Prize',
      details: 'Create clues and hide the gift for an interactive experience they\'ll never forget'
    },
    {
      id: 'story_telling',
      title: 'Story-Telling Delivery',
      description: 'Each element tells part of your story together',
      preview: 'Story > Memory > Heart > Gift',
      details: 'Weave memories and meaning into every aspect of the presentation'
    },
    {
      id: 'scheduled_surprise',
      title: 'Perfectly Timed Surprise',
      description: 'Delivered at the most meaningful moment',
      preview: 'Time > Target > Surprise > Joy',
      details: 'Coordinate delivery for maximum emotional impact and surprise'
    }
  ];

  const personalizationOptions = [
    {
      id: 'custom_message',
      title: 'Personal Message',
      description: 'Handwritten note that captures your feelings',
      icon: 'Aa'
    },
    {
      id: 'photo_memories',
      title: 'Photo Memories',
      description: 'Include photos of your favorite moments together',
      icon: 'IMG'
    },
    {
      id: 'custom_packaging',
      title: 'Custom Packaging',
      description: 'Themed wrapping that tells your story',
      icon: 'PKG'
    },
    {
      id: 'surprise_elements',
      title: 'Extra Surprises',
      description: 'Small additional touches that show you care',
      icon: '+'
    }
  ];

  const handleOccasionSelect = (occasion) => {
    setMomentData({ ...momentData, occasion });
    setStep('delivery');
  };

  const handleDeliverySelect = (delivery) => {
    setMomentData({ ...momentData, delivery });
    setStep('personalization');
  };

  const handlePersonalizationToggle = (option) => {
    const personalization = momentData.personalization || [];
    const updated = personalization.includes(option.id)
      ? personalization.filter(id => id !== option.id)
      : [...personalization, option.id];

    setMomentData({ ...momentData, personalization: updated });
  };

  const generateMomentPreview = async () => {
    setIsGenerating(true);
    setStep('preview');

    // Simulate AI moment generation
    setTimeout(() => {
      const preview = {
        title: `${momentData.occasion.title} with ${gift.title}`,
        story: generateMomentStory(),
        timeline: generateTimeline(),
        impact: calculateEmotionalImpact(),
        cost: calculateTotalCost()
      };
      setPreview(preview);
      setIsGenerating(false);
    }, 3000);
  };

  const generateMomentStory = () => {
    const occasion = occasions.find(o => o.id === momentData.occasion.id);
    const delivery = deliveryStyles.find(d => d.id === momentData.delivery.id);

    return `Picture this: ${occasion.moments[0].toLowerCase()}. With our ${delivery.title.toLowerCase()}, the ${gift.title} becomes more than a gift—it becomes a story they'll tell for years. ${delivery.details}`;
  };

  const generateTimeline = () => {
    return [
      { time: 'Day -3', event: 'We begin crafting your personalized gift experience' },
      { time: 'Day -1', event: 'Final touches and quality check completed' },
      { time: 'Delivery Day', event: 'The perfect moment arrives, exactly as planned' },
      { time: 'Forever', event: 'A memory that lasts a lifetime' }
    ];
  };

  const calculateEmotionalImpact = () => {
    let score = 85; // Base score for the gift
    if (momentData.personalization?.length > 2) score += 10;
    if (momentData.delivery.id === 'treasure_hunt') score += 8;
    if (momentData.occasion.id === 'just_because') score += 5;
    return Math.min(score, 99);
  };

  const calculateTotalCost = () => {
    let total = gift.price;
    if (momentData.personalization?.includes('custom_packaging')) total += 15;
    if (momentData.personalization?.includes('photo_memories')) total += 12;
    if (momentData.delivery.id === 'treasure_hunt') total += 25;
    return total;
  };

  const handleCreateMoment = () => {
    onCreateMoment({
      gift,
      moment: momentData,
      preview,
      totalCost: preview.cost
    });
  };

  return (
    <div className="gift-moment-overlay">
      <div className="gift-moment-modal">
        <div className="moment-header">
          <h2>Create a Gift Moment</h2>
          <p>Turn your gift into an unforgettable experience</p>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="moment-progress">
          <div className={`progress-step ${step === 'occasion' ? 'active' : step === 'delivery' || step === 'personalization' || step === 'preview' ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Occasion</div>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step === 'delivery' ? 'active' : step === 'personalization' || step === 'preview' ? 'completed' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Delivery</div>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step === 'personalization' ? 'active' : step === 'preview' ? 'completed' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">Personal</div>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step === 'preview' ? 'active' : ''}`}>
            <div className="step-number">4</div>
            <div className="step-label">Preview</div>
          </div>
        </div>

        <div className="moment-content">
          {step === 'occasion' && (
            <div className="occasion-selector">
              <h3>What's the occasion?</h3>
              <p>Help us understand the story you want to tell</p>

              <div className="occasions-grid">
                {occasions.map(occasion => (
                  <div
                    key={occasion.id}
                    className="occasion-card"
                    onClick={() => handleOccasionSelect(occasion)}
                  >
                    <h4>{occasion.title}</h4>
                    <p>{occasion.description}</p>
                    <div className="moment-preview">
                      <em>"{occasion.moments[0]}"</em>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 'delivery' && (
            <div className="delivery-selector">
              <h3>How should we deliver this moment?</h3>
              <p>Choose the experience that matches your vision</p>

              <div className="delivery-options">
                {deliveryStyles.map(delivery => (
                  <div
                    key={delivery.id}
                    className="delivery-option"
                    onClick={() => handleDeliverySelect(delivery)}
                  >
                    <div className="delivery-preview">{delivery.preview}</div>
                    <div className="delivery-content">
                      <h4>{delivery.title}</h4>
                      <p>{delivery.description}</p>
                      <div className="delivery-details">{delivery.details}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 'personalization' && (
            <div className="personalization-selector">
              <h3>Add personal touches</h3>
              <p>Select the elements that will make this moment uniquely yours</p>

              <div className="personalization-grid">
                {personalizationOptions.map(option => (
                  <div
                    key={option.id}
                    className={`personalization-option ${
                      momentData.personalization?.includes(option.id) ? 'selected' : ''
                    }`}
                    onClick={() => handlePersonalizationToggle(option)}
                  >
                    <div className="option-icon">{option.icon}</div>
                    <h4>{option.title}</h4>
                    <p>{option.description}</p>
                    {momentData.personalization?.includes(option.id) && (
                      <div className="selected-indicator">✓</div>
                    )}
                  </div>
                ))}
              </div>

              <div className="personalization-actions">
                <button
                  className="generate-preview-btn"
                  onClick={generateMomentPreview}
                  disabled={!momentData.personalization?.length}
                >
                  Generate Your Moment Preview
                </button>
              </div>
            </div>
          )}

          {step === 'preview' && (
            <div className="moment-preview-section">
              {isGenerating ? (
                <div className="generating-preview">
                  <div className="preview-loader">
                    <div className="magic-wand">...</div>
                    <h3>Crafting your perfect moment...</h3>
                    <p>Our gift experts are designing an experience tailored just for you</p>
                  </div>
                </div>
              ) : (
                <div className="final-preview">
                  <div className="preview-header">
                    <h3>{preview.title}</h3>
                    <div className="impact-score">
                      <span className="score">{preview.impact}%</span>
                      <span className="score-label">Emotional Impact</span>
                    </div>
                  </div>

                  <div className="moment-story">
                    <h4>Your Gift Story</h4>
                    <p>{preview.story}</p>
                  </div>

                  <div className="moment-timeline">
                    <h4>Experience Timeline</h4>
                    {preview.timeline.map((item, index) => (
                      <div key={index} className="timeline-item">
                        <div className="timeline-time">{item.time}</div>
                        <div className="timeline-event">{item.event}</div>
                      </div>
                    ))}
                  </div>

                  <div className="moment-investment">
                    <div className="cost-breakdown">
                      <div className="cost-item">
                        <span>Gift: {gift.title}</span>
                        <span>${gift.price}</span>
                      </div>
                      {momentData.personalization?.includes('custom_packaging') && (
                        <div className="cost-item">
                          <span>Custom Packaging</span>
                          <span>$15</span>
                        </div>
                      )}
                      {momentData.personalization?.includes('photo_memories') && (
                        <div className="cost-item">
                          <span>Photo Memories</span>
                          <span>$12</span>
                        </div>
                      )}
                      <div className="cost-total">
                        <span>Total Investment</span>
                        <span>${preview.cost}</span>
                      </div>
                    </div>
                  </div>

                  <div className="preview-actions">
                    <button className="create-moment-btn" onClick={handleCreateMoment}>
                      Create This Moment
                    </button>
                    <button className="modify-btn" onClick={() => setStep('occasion')}>
                      Modify Experience
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GiftMomentCreator;