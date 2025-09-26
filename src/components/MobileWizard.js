import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTouchGestures, TouchButton } from './TouchGestures';
import { CameraScanner } from './CameraIntegration';

// Mobile Gift Wizard State Management
export const useMobileWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [wizardData, setWizardData] = useState({
    recipient: {},
    occasion: {},
    preferences: {},
    budget: {},
    personality: {},
    relationship: {},
    scannedItems: []
  });
  const [isComplete, setIsComplete] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  const updateWizardData = useCallback((step, data) => {
    setWizardData(prev => ({
      ...prev,
      [step]: { ...prev[step], ...data }
    }));
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, wizardSteps.length - 1));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }, []);

  const goToStep = useCallback((stepIndex) => {
    setCurrentStep(Math.max(0, Math.min(stepIndex, wizardSteps.length - 1)));
  }, []);

  const generateRecommendations = useCallback(async () => {
    try {
      // Simulate API call for recommendations
      const mockRecommendations = await generateMockRecommendations(wizardData);
      setRecommendations(mockRecommendations);
      setIsComplete(true);
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
    }
  }, [wizardData]);

  return {
    currentStep,
    wizardData,
    isComplete,
    recommendations,
    updateWizardData,
    nextStep,
    prevStep,
    goToStep,
    generateRecommendations
  };
};

// Wizard Steps Configuration
const wizardSteps = [
  {
    id: 'recipient',
    title: 'Who is this gift for?',
    subtitle: 'Tell us about the recipient',
    icon: '👤'
  },
  {
    id: 'occasion',
    title: 'What\'s the occasion?',
    subtitle: 'Help us understand the context',
    icon: '🎉'
  },
  {
    id: 'relationship',
    title: 'Your relationship',
    subtitle: 'How do you know them?',
    icon: '❤️'
  },
  {
    id: 'personality',
    title: 'Their personality',
    subtitle: 'What are they like?',
    icon: '🌟'
  },
  {
    id: 'preferences',
    title: 'Interests & Hobbies',
    subtitle: 'What do they enjoy?',
    icon: '🎯'
  },
  {
    id: 'budget',
    title: 'Your budget',
    subtitle: 'What would you like to spend?',
    icon: '💰'
  },
  {
    id: 'results',
    title: 'Perfect matches!',
    subtitle: 'Here are your personalized recommendations',
    icon: '🎁'
  }
];

// Main Mobile Wizard Component
export const MobileGiftWizard = ({ onComplete, onClose, className = '' }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState('');
  const [showCamera, setShowCamera] = useState(false);

  const {
    currentStep,
    wizardData,
    isComplete,
    recommendations,
    updateWizardData,
    nextStep,
    prevStep,
    goToStep,
    generateRecommendations
  } = useMobileWizard();

  const containerRef = useRef(null);

  // Handle swipe navigation
  const handleSwipeLeft = useCallback(() => {
    if (currentStep < wizardSteps.length - 1) {
      setSlideDirection('left');
      setIsTransitioning(true);
      setTimeout(() => {
        nextStep();
        setIsTransitioning(false);
        setSlideDirection('');
      }, 300);
    }
  }, [currentStep, nextStep]);

  const handleSwipeRight = useCallback(() => {
    if (currentStep > 0) {
      setSlideDirection('right');
      setIsTransitioning(true);
      setTimeout(() => {
        prevStep();
        setIsTransitioning(false);
        setSlideDirection('');
      }, 300);
    }
  }, [currentStep, prevStep]);

  const [touchHandlers] = useTouchGestures({
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight,
    sensitivity: 100
  });

  // Auto-generate recommendations when reaching results step
  useEffect(() => {
    if (currentStep === wizardSteps.length - 1 && !isComplete) {
      generateRecommendations();
    }
  }, [currentStep, isComplete, generateRecommendations]);

  const currentStepData = wizardSteps[currentStep];
  const progress = ((currentStep + 1) / wizardSteps.length) * 100;

  return (
    <div className={`mobile-wizard ${className}`} {...touchHandlers} ref={containerRef}>
      {/* Header */}
      <div className="wizard-header">
        <div className="header-controls">
          <TouchButton
            variant="ghost"
            size="small"
            onClick={onClose}
            className="close-btn"
          >
            ✕
          </TouchButton>
          <div className="step-counter">
            {currentStep + 1} of {wizardSteps.length}
          </div>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div
        className={`wizard-content ${isTransitioning ? `sliding-${slideDirection}` : ''}`}
      >
        <div className="step-header">
          <div className="step-icon">{currentStepData.icon}</div>
          <h2 className="step-title">{currentStepData.title}</h2>
          <p className="step-subtitle">{currentStepData.subtitle}</p>
        </div>

        <div className="step-body">
          {renderStepContent(currentStepData.id, wizardData, updateWizardData, {
            onCameraOpen: () => setShowCamera(true),
            recommendations,
            isComplete
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="wizard-navigation">
        <div className="nav-dots">
          {wizardSteps.map((step, index) => (
            <button
              key={step.id}
              className={`nav-dot ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
              onClick={() => goToStep(index)}
            >
              <span className="dot-inner"></span>
            </button>
          ))}
        </div>

        <div className="nav-buttons">
          {currentStep > 0 && (
            <TouchButton
              variant="outline"
              onClick={prevStep}
              className="nav-btn prev-btn"
            >
              ← Back
            </TouchButton>
          )}

          {currentStep < wizardSteps.length - 1 ? (
            <TouchButton
              variant="primary"
              onClick={nextStep}
              className="nav-btn next-btn"
            >
              Next →
            </TouchButton>
          ) : isComplete ? (
            <TouchButton
              variant="primary"
              onClick={() => onComplete && onComplete(recommendations, wizardData)}
              className="nav-btn complete-btn"
            >
              View All Gifts
            </TouchButton>
          ) : (
            <div className="generating-message">
              <div className="spinner"></div>
              Generating recommendations...
            </div>
          )}
        </div>
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <div className="camera-modal">
          <CameraScanner
            onCapture={(imageData) => {
              updateWizardData('scannedItems', [
                ...wizardData.scannedItems,
                { image: imageData, timestamp: Date.now() }
              ]);
            }}
            onClose={() => setShowCamera(false)}
            className="wizard-camera"
          />
        </div>
      )}

      {/* Swipe Hints */}
      <div className="swipe-hints">
        {currentStep > 0 && (
          <div className="swipe-hint left">
            <span className="hint-arrow">←</span>
            <span className="hint-text">Swipe for previous</span>
          </div>
        )}
        {currentStep < wizardSteps.length - 1 && (
          <div className="swipe-hint right">
            <span className="hint-text">Swipe for next</span>
            <span className="hint-arrow">→</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Step Content Renderer
const renderStepContent = (stepId, wizardData, updateData, options) => {
  switch (stepId) {
    case 'recipient':
      return <RecipientStep data={wizardData.recipient} onUpdate={updateData} />;
    case 'occasion':
      return <OccasionStep data={wizardData.occasion} onUpdate={updateData} />;
    case 'relationship':
      return <RelationshipStep data={wizardData.relationship} onUpdate={updateData} />;
    case 'personality':
      return <PersonalityStep data={wizardData.personality} onUpdate={updateData} />;
    case 'preferences':
      return <PreferencesStep data={wizardData.preferences} onUpdate={updateData} onCameraOpen={options.onCameraOpen} />;
    case 'budget':
      return <BudgetStep data={wizardData.budget} onUpdate={updateData} />;
    case 'results':
      return <ResultsStep recommendations={options.recommendations} isComplete={options.isComplete} />;
    default:
      return <div>Step not found</div>;
  }
};

// Individual Step Components
const RecipientStep = ({ data, onUpdate }) => {
  const ageGroups = [
    { id: 'child', label: 'Child (0-12)', icon: '🧒' },
    { id: 'teen', label: 'Teenager (13-19)', icon: '🧑' },
    { id: 'young-adult', label: 'Young Adult (20-35)', icon: '👨' },
    { id: 'adult', label: 'Adult (36-55)', icon: '👩' },
    { id: 'senior', label: 'Senior (55+)', icon: '👴' }
  ];

  return (
    <div className="recipient-step">
      <div className="form-group">
        <label>Gender</label>
        <div className="option-grid">
          {['female', 'male', 'other'].map(gender => (
            <TouchButton
              key={gender}
              variant={data.gender === gender ? 'primary' : 'outline'}
              onClick={() => onUpdate('recipient', { gender })}
              className="option-btn"
            >
              {gender === 'female' ? '👩' : gender === 'male' ? '👨' : '👤'}
              <span>{gender.charAt(0).toUpperCase() + gender.slice(1)}</span>
            </TouchButton>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Age Group</label>
        <div className="option-list">
          {ageGroups.map(age => (
            <TouchButton
              key={age.id}
              variant={data.ageGroup === age.id ? 'primary' : 'outline'}
              onClick={() => onUpdate('recipient', { ageGroup: age.id })}
              className="option-btn full-width"
            >
              <span className="option-icon">{age.icon}</span>
              <span className="option-label">{age.label}</span>
            </TouchButton>
          ))}
        </div>
      </div>
    </div>
  );
};

const OccasionStep = ({ data, onUpdate }) => {
  const occasions = [
    { id: 'birthday', label: 'Birthday', icon: '🎂' },
    { id: 'anniversary', label: 'Anniversary', icon: '💕' },
    { id: 'christmas', label: 'Christmas', icon: '🎄' },
    { id: 'valentines', label: "Valentine's Day", icon: '💝' },
    { id: 'graduation', label: 'Graduation', icon: '🎓' },
    { id: 'wedding', label: 'Wedding', icon: '💒' },
    { id: 'baby-shower', label: 'Baby Shower', icon: '👶' },
    { id: 'thank-you', label: 'Thank You', icon: '🙏' },
    { id: 'just-because', label: 'Just Because', icon: '✨' }
  ];

  return (
    <div className="occasion-step">
      <div className="option-grid">
        {occasions.map(occasion => (
          <TouchButton
            key={occasion.id}
            variant={data.occasion === occasion.id ? 'primary' : 'outline'}
            onClick={() => onUpdate('occasion', {
              occasion: occasion.id,
              label: occasion.label
            })}
            className="occasion-btn"
          >
            <div className="occasion-icon">{occasion.icon}</div>
            <div className="occasion-label">{occasion.label}</div>
          </TouchButton>
        ))}
      </div>

      {data.occasion && (
        <div className="form-group">
          <label>Any specific date?</label>
          <input
            type="date"
            value={data.date || ''}
            onChange={(e) => onUpdate('occasion', { date: e.target.value })}
            className="date-input"
          />
        </div>
      )}
    </div>
  );
};

const RelationshipStep = ({ data, onUpdate }) => {
  const relationships = [
    { id: 'spouse', label: 'Spouse/Partner', icon: '💑' },
    { id: 'family', label: 'Family Member', icon: '👨‍👩‍👧‍👦' },
    { id: 'friend', label: 'Close Friend', icon: '👫' },
    { id: 'colleague', label: 'Colleague', icon: '👔' },
    { id: 'acquaintance', label: 'Acquaintance', icon: '🤝' },
    { id: 'child', label: 'My Child', icon: '👶' },
    { id: 'parent', label: 'My Parent', icon: '👨‍👩‍👧' },
    { id: 'other', label: 'Other', icon: '💭' }
  ];

  return (
    <div className="relationship-step">
      <div className="option-grid">
        {relationships.map(rel => (
          <TouchButton
            key={rel.id}
            variant={data.relationship === rel.id ? 'primary' : 'outline'}
            onClick={() => onUpdate('relationship', {
              relationship: rel.id,
              label: rel.label
            })}
            className="relationship-btn"
          >
            <div className="rel-icon">{rel.icon}</div>
            <div className="rel-label">{rel.label}</div>
          </TouchButton>
        ))}
      </div>
    </div>
  );
};

const PersonalityStep = ({ data, onUpdate }) => {
  const traits = [
    'Creative', 'Practical', 'Adventurous', 'Homebody', 'Tech-savvy',
    'Traditional', 'Trendy', 'Minimalist', 'Maximalist', 'Eco-conscious',
    'Luxury-loving', 'Budget-conscious', 'Social', 'Private', 'Artistic'
  ];

  const toggleTrait = (trait) => {
    const current = data.traits || [];
    const updated = current.includes(trait)
      ? current.filter(t => t !== trait)
      : [...current, trait];
    onUpdate('personality', { traits: updated });
  };

  return (
    <div className="personality-step">
      <p className="instruction">Select all that describe them:</p>
      <div className="trait-grid">
        {traits.map(trait => (
          <TouchButton
            key={trait}
            variant={(data.traits || []).includes(trait) ? 'primary' : 'outline'}
            onClick={() => toggleTrait(trait)}
            className="trait-btn"
          >
            {trait}
          </TouchButton>
        ))}
      </div>
    </div>
  );
};

const PreferencesStep = ({ data, onUpdate, onCameraOpen }) => {
  const categories = [
    { id: 'fashion', label: 'Fashion & Accessories', icon: '👗' },
    { id: 'tech', label: 'Technology', icon: '📱' },
    { id: 'home', label: 'Home & Garden', icon: '🏡' },
    { id: 'sports', label: 'Sports & Fitness', icon: '⚽' },
    { id: 'books', label: 'Books & Learning', icon: '📚' },
    { id: 'art', label: 'Art & Crafts', icon: '🎨' },
    { id: 'music', label: 'Music & Audio', icon: '🎵' },
    { id: 'food', label: 'Food & Cooking', icon: '🍳' },
    { id: 'travel', label: 'Travel & Adventure', icon: '✈️' },
    { id: 'beauty', label: 'Beauty & Wellness', icon: '💅' }
  ];

  const toggleCategory = (categoryId) => {
    const current = data.categories || [];
    const updated = current.includes(categoryId)
      ? current.filter(c => c !== categoryId)
      : [...current, categoryId];
    onUpdate('preferences', { categories: updated });
  };

  return (
    <div className="preferences-step">
      <div className="scan-option">
        <TouchButton
          variant="outline"
          onClick={onCameraOpen}
          className="scan-btn"
        >
          📷 Scan something they love
        </TouchButton>
      </div>

      <div className="divider">
        <span>or select interests</span>
      </div>

      <div className="category-grid">
        {categories.map(category => (
          <TouchButton
            key={category.id}
            variant={(data.categories || []).includes(category.id) ? 'primary' : 'outline'}
            onClick={() => toggleCategory(category.id)}
            className="category-btn"
          >
            <div className="cat-icon">{category.icon}</div>
            <div className="cat-label">{category.label}</div>
          </TouchButton>
        ))}
      </div>
    </div>
  );
};

const BudgetStep = ({ data, onUpdate }) => {
  const budgetRanges = [
    { id: 'under-25', label: 'Under $25', icon: '💵' },
    { id: '25-50', label: '$25 - $50', icon: '💴' },
    { id: '50-100', label: '$50 - $100', icon: '💶' },
    { id: '100-250', label: '$100 - $250', icon: '💷' },
    { id: '250-500', label: '$250 - $500', icon: '💸' },
    { id: 'over-500', label: 'Over $500', icon: '💰' }
  ];

  return (
    <div className="budget-step">
      <div className="budget-options">
        {budgetRanges.map(budget => (
          <TouchButton
            key={budget.id}
            variant={data.range === budget.id ? 'primary' : 'outline'}
            onClick={() => onUpdate('budget', {
              range: budget.id,
              label: budget.label
            })}
            className="budget-btn"
          >
            <div className="budget-icon">{budget.icon}</div>
            <div className="budget-label">{budget.label}</div>
          </TouchButton>
        ))}
      </div>

      <div className="form-group">
        <label>Special notes about budget?</label>
        <textarea
          value={data.notes || ''}
          onChange={(e) => onUpdate('budget', { notes: e.target.value })}
          placeholder="e.g., willing to spend more for the perfect gift..."
          className="notes-input"
        />
      </div>
    </div>
  );
};

const ResultsStep = ({ recommendations, isComplete }) => {
  if (!isComplete) {
    return (
      <div className="results-loading">
        <div className="loading-animation">
          <div className="gift-boxes">
            <div className="gift-box">🎁</div>
            <div className="gift-box">🎁</div>
            <div className="gift-box">🎁</div>
          </div>
        </div>
        <h3>Finding perfect gifts...</h3>
        <p>Analyzing your preferences to find the best matches</p>
      </div>
    );
  }

  return (
    <div className="results-step">
      <div className="results-summary">
        <h3>We found {recommendations.length} perfect matches!</h3>
        <p>Based on your preferences, here are our top recommendations:</p>
      </div>

      <div className="recommendation-preview">
        {recommendations.slice(0, 3).map((gift, index) => (
          <div key={index} className="preview-card">
            <img
              src={gift.image_url || '/api/placeholder/100/100'}
              alt={gift.name}
              className="preview-image"
            />
            <div className="preview-info">
              <h4>{gift.name}</h4>
              <p className="preview-price">${gift.price}</p>
              <div className="match-score">
                {Math.round(gift.match_score)}% match
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="results-stats">
        <div className="stat">
          <span className="stat-number">{recommendations.length}</span>
          <span className="stat-label">Total Matches</span>
        </div>
        <div className="stat">
          <span className="stat-number">{Math.round(recommendations.reduce((sum, r) => sum + r.match_score, 0) / recommendations.length)}%</span>
          <span className="stat-label">Avg Match</span>
        </div>
      </div>
    </div>
  );
};

// Mock recommendation generator
const generateMockRecommendations = async (wizardData) => {
  await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay

  const mockGifts = [
    { name: 'Wireless Earbuds', price: 129.99, match_score: 95, image_url: null },
    { name: 'Silk Scarf', price: 89.99, match_score: 92, image_url: null },
    { name: 'Smart Watch', price: 299.99, match_score: 90, image_url: null },
    { name: 'Artisan Chocolate Box', price: 45.99, match_score: 88, image_url: null },
    { name: 'Cozy Blanket', price: 79.99, match_score: 85, image_url: null },
    { name: 'Essential Oil Set', price: 69.99, match_score: 83, image_url: null }
  ];

  return mockGifts;
};

export default MobileGiftWizard;