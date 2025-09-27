import React, { useState } from 'react';

const QuickGiftFinder = ({ onComplete, onClose }) => {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    occasion: '',
    recipient: '',
    budget: '',
    interests: []
  });

  const occasions = [
    { id: 'birthday', emoji: '🎂', label: 'Birthday' },
    { id: 'anniversary', emoji: '💑', label: 'Anniversary' },
    { id: 'wedding', emoji: '💍', label: 'Wedding' },
    { id: 'holiday', emoji: '🎄', label: 'Holiday' },
    { id: 'thankyou', emoji: '🙏', label: 'Thank You' },
    { id: 'justthanks', emoji: '💝', label: 'Just Because' }
  ];

  const recipients = [
    { id: 'partner', emoji: '❤️', label: 'Partner/Spouse' },
    { id: 'parent', emoji: '👨‍👩‍👧', label: 'Parent' },
    { id: 'friend', emoji: '👯', label: 'Friend' },
    { id: 'coworker', emoji: '💼', label: 'Coworker' },
    { id: 'family', emoji: '👪', label: 'Family Member' },
    { id: 'other', emoji: '🎁', label: 'Someone Else' }
  ];

  const budgets = [
    { id: 'under50', label: 'Under $50', min: 0, max: 50 },
    { id: '50-100', label: '$50 - $100', min: 50, max: 100 },
    { id: '100-200', label: '$100 - $200', min: 100, max: 200 },
    { id: '200plus', label: '$200+', min: 200, max: 10000 }
  ];

  const interests = [
    { id: 'fashion', emoji: '👗', label: 'Fashion' },
    { id: 'tech', emoji: '📱', label: 'Technology' },
    { id: 'home', emoji: '🏠', label: 'Home Decor' },
    { id: 'food', emoji: '🍷', label: 'Food & Drink' },
    { id: 'beauty', emoji: '💄', label: 'Beauty' },
    { id: 'experiences', emoji: '🎭', label: 'Experiences' },
    { id: 'jewelry', emoji: '💎', label: 'Jewelry' },
    { id: 'unique', emoji: '✨', label: 'Unique Items' }
  ];

  const selectOption = (field, value) => {
    setAnswers({ ...answers, [field]: value });
    if (step < 4) {
      setTimeout(() => setStep(step + 1), 300);
    }
  };

  const toggleInterest = (interestId) => {
    const current = answers.interests;
    if (current.includes(interestId)) {
      setAnswers({ ...answers, interests: current.filter(i => i !== interestId) });
    } else {
      setAnswers({ ...answers, interests: [...current, interestId] });
    }
  };

  const handleComplete = () => {
    const selectedBudget = budgets.find(b => b.id === answers.budget);
    onComplete({
      occasion: answers.occasion,
      recipient: answers.recipient,
      minPrice: selectedBudget?.min || 0,
      maxPrice: selectedBudget?.max || 10000,
      interests: answers.interests
    });
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="finder-step">
            <h2 className="step-title">What's the occasion?</h2>
            <div className="options-grid">
              {occasions.map(option => (
                <button
                  key={option.id}
                  className={`option-card ${answers.occasion === option.id ? 'selected' : ''}`}
                  onClick={() => selectOption('occasion', option.id)}
                >
                  <span className="option-emoji">{option.emoji}</span>
                  <span className="option-label">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="finder-step">
            <h2 className="step-title">Who are you shopping for?</h2>
            <div className="options-grid">
              {recipients.map(option => (
                <button
                  key={option.id}
                  className={`option-card ${answers.recipient === option.id ? 'selected' : ''}`}
                  onClick={() => selectOption('recipient', option.id)}
                >
                  <span className="option-emoji">{option.emoji}</span>
                  <span className="option-label">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="finder-step">
            <h2 className="step-title">What's your budget?</h2>
            <div className="options-list">
              {budgets.map(option => (
                <button
                  key={option.id}
                  className={`option-button ${answers.budget === option.id ? 'selected' : ''}`}
                  onClick={() => selectOption('budget', option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="finder-step">
            <h2 className="step-title">What are they interested in?</h2>
            <p className="step-subtitle">Select all that apply</p>
            <div className="options-grid">
              {interests.map(option => (
                <button
                  key={option.id}
                  className={`option-card multi ${answers.interests.includes(option.id) ? 'selected' : ''}`}
                  onClick={() => toggleInterest(option.id)}
                >
                  <span className="option-emoji">{option.emoji}</span>
                  <span className="option-label">{option.label}</span>
                </button>
              ))}
            </div>
            <button
              className="complete-button"
              onClick={handleComplete}
              disabled={answers.interests.length === 0}
            >
              Find My Perfect Gifts ({answers.interests.length} selected)
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="gift-finder-modal">
      <div className="finder-overlay" onClick={onClose}></div>
      <div className="finder-content">
        <button className="close-button" onClick={onClose}>✕</button>

        <div className="progress-bar">
          {[1, 2, 3, 4].map(num => (
            <div
              key={num}
              className={`progress-step ${step >= num ? 'active' : ''} ${step === num ? 'current' : ''}`}
            >
              {step > num ? '✓' : num}
            </div>
          ))}
        </div>

        {renderStep()}

        {step > 1 && (
          <button className="back-button" onClick={() => setStep(step - 1)}>
            ← Back
          </button>
        )}
      </div>
    </div>
  );
};

export default QuickGiftFinder;