import React, { useState, useEffect } from 'react';
import PremiumLoader from './PremiumLoader';

const PersonalityQuiz = ({ onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    setProgress((currentStep / quizSteps.length) * 100);
  }, [currentStep]);

  const quizSteps = [
    {
      id: 'shopping_style',
      title: 'What\'s Your Shopping Style?',
      subtitle: 'Tell us how you prefer to shop',
      type: 'single',
      options: [
        {
          id: 'quick_decisive',
          text: 'Quick & Decisive',
          description: 'I know what I want and get it fast',
          icon: 'Fast',
          personality: 'efficient'
        },
        {
          id: 'thorough_researcher',
          text: 'Thorough Researcher',
          description: 'I research everything before buying',
          icon: 'R',
          personality: 'analytical'
        },
        {
          id: 'emotional_buyer',
          text: 'Emotional Buyer',
          description: 'I buy based on how I feel',
          icon: 'E',
          personality: 'empathetic'
        },
        {
          id: 'budget_conscious',
          text: 'Budget-Conscious',
          description: 'I always look for the best deals',
          icon: '$',
          personality: 'practical'
        }
      ]
    },
    {
      id: 'gift_motivation',
      title: 'What Motivates Your Gift Giving?',
      subtitle: 'Understanding your motivation helps us recommend better',
      type: 'single',
      options: [
        {
          id: 'show_love',
          text: 'Showing Love & Appreciation',
          description: 'I want them to feel valued',
          icon: 'Love',
          weight: { empathetic: 3, thoughtful: 2 }
        },
        {
          id: 'surprise_delight',
          text: 'Creating Surprise & Delight',
          description: 'I love seeing their reaction',
          icon: 'Joy',
          weight: { creative: 3, spontaneous: 2 }
        },
        {
          id: 'practical_help',
          text: 'Providing Practical Value',
          description: 'I want to give something useful',
          icon: 'Tool',
          weight: { practical: 3, analytical: 2 }
        },
        {
          id: 'social_obligation',
          text: 'Meeting Social Expectations',
          description: 'It\'s important to give appropriate gifts',
          icon: 'Social',
          weight: { traditional: 3, efficient: 2 }
        }
      ]
    },
    {
      id: 'decision_factors',
      title: 'What Factors Matter Most?',
      subtitle: 'Select all that influence your gift decisions',
      type: 'multiple',
      options: [
        {
          id: 'recipient_personality',
          text: 'Recipient\'s Personality',
          icon: 'P',
          weight: { empathetic: 2, thoughtful: 2 }
        },
        {
          id: 'gift_uniqueness',
          text: 'Uniqueness & Originality',
          icon: '*',
          weight: { creative: 3, artistic: 2 }
        },
        {
          id: 'practical_value',
          text: 'Practical Value',
          icon: 'PV',
          weight: { practical: 3, efficient: 1 }
        },
        {
          id: 'price_point',
          text: 'Price & Budget',
          icon: '$',
          weight: { practical: 2, analytical: 2 }
        },
        {
          id: 'brand_quality',
          text: 'Brand & Quality',
          icon: 'BQ',
          weight: { traditional: 2, analytical: 2 }
        },
        {
          id: 'presentation',
          text: 'Presentation & Packaging',
          icon: 'PP',
          weight: { artistic: 3, thoughtful: 2 }
        }
      ]
    },
    {
      id: 'shopping_preferences',
      title: 'How Do You Prefer to Shop?',
      subtitle: 'Your shopping habits reveal your style',
      type: 'single',
      options: [
        {
          id: 'online_convenience',
          text: 'Online for Convenience',
          description: 'Quick, easy, and efficient',
          icon: 'Web',
          weight: { efficient: 3, practical: 2 }
        },
        {
          id: 'in_store_experience',
          text: 'In-Store Experience',
          description: 'I like to touch and feel products',
          icon: 'Store',
          weight: { traditional: 2, analytical: 2 }
        },
        {
          id: 'boutique_unique',
          text: 'Boutique & Unique Stores',
          description: 'I seek special, one-of-a-kind items',
          icon: 'Art',
          weight: { creative: 3, artistic: 3 }
        },
        {
          id: 'recommendations',
          text: 'Follow Recommendations',
          description: 'I trust reviews and suggestions',
          icon: 'Rec',
          weight: { social: 3, practical: 1 }
        }
      ]
    },
    {
      id: 'gift_categories',
      title: 'Which Gift Categories Excite You?',
      subtitle: 'Select your top 3 favorite gift types',
      type: 'multiple',
      maxSelections: 3,
      options: [
        {
          id: 'tech_gadgets',
          text: 'Tech & Gadgets',
          icon: 'Tech',
          weight: { innovative: 3, practical: 2 }
        },
        {
          id: 'art_craft',
          text: 'Art & Crafts',
          icon: 'Art',
          weight: { artistic: 3, creative: 3 }
        },
        {
          id: 'books_learning',
          text: 'Books & Learning',
          icon: 'Book',
          weight: { intellectual: 3, thoughtful: 2 }
        },
        {
          id: 'fashion_accessories',
          text: 'Fashion & Accessories',
          icon: 'Style',
          weight: { stylish: 3, social: 2 }
        },
        {
          id: 'home_living',
          text: 'Home & Living',
          icon: 'Home',
          weight: { practical: 3, traditional: 2 }
        },
        {
          id: 'experiences',
          text: 'Experiences & Activities',
          icon: 'Exp',
          weight: { adventurous: 3, creative: 2 }
        },
        {
          id: 'wellness_self_care',
          text: 'Wellness & Self-Care',
          icon: 'Well',
          weight: { empathetic: 3, thoughtful: 3 }
        },
        {
          id: 'food_gourmet',
          text: 'Food & Gourmet',
          icon: 'Food',
          weight: { sensory: 3, social: 2 }
        }
      ]
    },
    {
      id: 'personality_traits',
      title: 'Which Traits Describe You Best?',
      subtitle: 'Select all that apply to you',
      type: 'multiple',
      options: [
        {
          id: 'detail_oriented',
          text: 'Detail-Oriented',
          icon: 'Detail',
          weight: { analytical: 3, thoughtful: 2 }
        },
        {
          id: 'spontaneous',
          text: 'Spontaneous',
          icon: 'Spont',
          weight: { spontaneous: 3, creative: 2 }
        },
        {
          id: 'empathetic',
          text: 'Empathetic',
          icon: 'Emp',
          weight: { empathetic: 3, social: 2 }
        },
        {
          id: 'innovative',
          text: 'Innovative',
          icon: 'Innov',
          weight: { innovative: 3, creative: 2 }
        },
        {
          id: 'traditional',
          text: 'Traditional',
          icon: 'Trad',
          weight: { traditional: 3, practical: 1 }
        },
        {
          id: 'adventurous',
          text: 'Adventurous',
          icon: 'Adv',
          weight: { adventurous: 3, spontaneous: 2 }
        },
        {
          id: 'organized',
          text: 'Organized',
          icon: 'Org',
          weight: { efficient: 3, analytical: 2 }
        },
        {
          id: 'artistic',
          text: 'Artistic',
          icon: 'Art',
          weight: { artistic: 3, creative: 3 }
        }
      ]
    }
  ];

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentStep < quizSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      analyzePersonality();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const analyzePersonality = () => {
    setIsAnalyzing(true);

    // Simulate analysis delay
    setTimeout(() => {
      const personality = calculatePersonality();
      setIsAnalyzing(false);
      onComplete(personality);
    }, 3000);
  };

  const calculatePersonality = () => {
    const traits = {
      analytical: 0,
      creative: 0,
      empathetic: 0,
      practical: 0,
      traditional: 0,
      innovative: 0,
      spontaneous: 0,
      efficient: 0,
      artistic: 0,
      social: 0,
      thoughtful: 0,
      adventurous: 0
    };

    // Calculate trait scores based on answers
    Object.entries(answers).forEach(([questionId, answer]) => {
      const question = quizSteps.find(step => step.id === questionId);

      if (Array.isArray(answer)) {
        // Multiple selection answers
        answer.forEach(answerId => {
          const option = question.options.find(opt => opt.id === answerId);
          if (option?.weight) {
            Object.entries(option.weight).forEach(([trait, score]) => {
              traits[trait] += score;
            });
          }
        });
      } else {
        // Single selection answers
        const option = question.options.find(opt => opt.id === answer);
        if (option?.weight) {
          Object.entries(option.weight).forEach(([trait, score]) => {
            traits[trait] += score;
          });
        }
        if (option?.personality) {
          traits[option.personality] += 3;
        }
      }
    });

    // Find dominant traits
    const sortedTraits = Object.entries(traits)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);

    const personalityProfile = {
      primaryTrait: sortedTraits[0][0],
      secondaryTrait: sortedTraits[1][0],
      tertiaryTrait: sortedTraits[2][0],
      scores: traits,
      recommendations: generateRecommendations(sortedTraits),
      giftPreferences: generateGiftPreferences(answers, sortedTraits)
    };

    return personalityProfile;
  };

  const generateRecommendations = (traits) => {
    const recommendations = {
      analytical: {
        title: 'The Thoughtful Analyst',
        description: 'You love researching and finding the perfect gift through careful consideration.',
        giftStyle: 'Quality over quantity, well-researched choices',
        categories: ['Tech & Gadgets', 'Books & Learning', 'Home & Living'],
        tips: ['Read reviews thoroughly', 'Compare features and specs', 'Consider long-term value']
      },
      creative: {
        title: 'The Creative Innovator',
        description: 'You enjoy unique, artistic gifts that spark imagination and creativity.',
        giftStyle: 'Original, handmade, or limited edition items',
        categories: ['Art & Crafts', 'Experiences', 'Fashion & Accessories'],
        tips: ['Look for one-of-a-kind pieces', 'Support local artists', 'Consider DIY elements']
      },
      empathetic: {
        title: 'The Heartfelt Giver',
        description: 'You focus on the emotional connection and what will truly touch their heart.',
        giftStyle: 'Personalized, meaningful, and emotionally resonant',
        categories: ['Wellness & Self-Care', 'Personalized Items', 'Memory Keepsakes'],
        tips: ['Add personal touches', 'Include heartfelt notes', 'Consider their dreams and aspirations']
      },
      practical: {
        title: 'The Practical Helper',
        description: 'You prefer gifts that provide real value and solve everyday problems.',
        giftStyle: 'Functional, useful, and high-quality everyday items',
        categories: ['Home & Living', 'Tech & Gadgets', 'Organization'],
        tips: ['Focus on daily usefulness', 'Choose quality brands', 'Consider their lifestyle needs']
      }
    };

    return recommendations[traits[0][0]] || recommendations.practical;
  };

  const generateGiftPreferences = (answers, traits) => {
    const preferences = {
      priceRange: 'moderate',
      giftTypes: [],
      occasions: ['birthday', 'anniversary', 'holiday'],
      personalityMatch: traits[0][0],
      filters: {
        categories: [],
        features: [],
        style: traits[0][0]
      }
    };

    // Set preferences based on answers
    if (answers.gift_categories) {
      preferences.giftTypes = answers.gift_categories;
      preferences.filters.categories = answers.gift_categories;
    }

    if (answers.decision_factors) {
      if (answers.decision_factors.includes('price_point')) {
        preferences.priceRange = 'budget';
      }
      if (answers.decision_factors.includes('brand_quality')) {
        preferences.filters.features.push('premium', 'brand_name');
      }
      if (answers.decision_factors.includes('gift_uniqueness')) {
        preferences.filters.features.push('unique', 'limited_edition');
      }
    }

    return preferences;
  };

  const currentQuestion = quizSteps[currentStep];
  const isLastStep = currentStep === quizSteps.length - 1;
  const canProceed = answers[currentQuestion.id] &&
    (currentQuestion.type !== 'multiple' || answers[currentQuestion.id].length > 0);

  if (isAnalyzing) {
    return (
      <div className="personality-quiz-overlay">
        <div className="quiz-modal analyzing">
          <div className="analysis-content">
            <PremiumLoader
              type="morphing"
              size="large"
              color="primary"
              text="Analyzing your personality..."
            />
            <div className="analysis-steps">
              <div className="analysis-step active">
                <span className="step-icon">1</span>
                <span className="step-text">Processing your responses...</span>
              </div>
              <div className="analysis-step active">
                <span className="step-icon">2</span>
                <span className="step-text">Identifying your gift personality...</span>
              </div>
              <div className="analysis-step active">
                <span className="step-icon">3</span>
                <span className="step-text">Generating personalized recommendations...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`personality-quiz-overlay ${isVisible ? 'visible' : ''}`}>
      <div className="quiz-modal">
        <div className="quiz-header">
          <div className="quiz-progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="progress-text">
              Step {currentStep + 1} of {quizSteps.length}
            </div>
          </div>
          <button
            className="close-quiz"
            onClick={onClose}
            aria-label="Close quiz"
          >
            ✕
          </button>
        </div>

        <div className="quiz-content">
          <div className="question-header">
            <h2 className="question-title">{currentQuestion.title}</h2>
            <p className="question-subtitle">{currentQuestion.subtitle}</p>
          </div>

          <div className="question-options">
            {currentQuestion.type === 'single' ? (
              <div className="single-select-options">
                {currentQuestion.options.map(option => (
                  <button
                    key={option.id}
                    className={`option-card ${
                      answers[currentQuestion.id] === option.id ? 'selected' : ''
                    }`}
                    onClick={() => handleAnswer(currentQuestion.id, option.id)}
                  >
                    <div className="option-icon">{option.icon}</div>
                    <div className="option-content">
                      <div className="option-text">{option.text}</div>
                      {option.description && (
                        <div className="option-description">{option.description}</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="multiple-select-options">
                {currentQuestion.maxSelections && (
                  <div className="selection-hint">
                    Select up to {currentQuestion.maxSelections} options
                  </div>
                )}
                <div className="options-grid">
                  {currentQuestion.options.map(option => {
                    const isSelected = answers[currentQuestion.id]?.includes(option.id);
                    const currentSelections = answers[currentQuestion.id]?.length || 0;
                    const canSelect = !currentQuestion.maxSelections ||
                      currentSelections < currentQuestion.maxSelections || isSelected;

                    return (
                      <button
                        key={option.id}
                        className={`option-tag ${isSelected ? 'selected' : ''} ${
                          !canSelect ? 'disabled' : ''
                        }`}
                        onClick={() => {
                          if (!canSelect) return;

                          const currentAnswers = answers[currentQuestion.id] || [];
                          let newAnswers;

                          if (isSelected) {
                            newAnswers = currentAnswers.filter(id => id !== option.id);
                          } else {
                            newAnswers = [...currentAnswers, option.id];
                          }

                          handleAnswer(currentQuestion.id, newAnswers);
                        }}
                        disabled={!canSelect}
                      >
                        <span className="tag-icon">{option.icon}</span>
                        <span className="tag-text">{option.text}</span>
                        {isSelected && <span className="selected-check">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="quiz-navigation">
          <button
            className="nav-btn secondary"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            ← Previous
          </button>

          <div className="nav-dots">
            {quizSteps.map((_, index) => (
              <div
                key={index}
                className={`nav-dot ${index === currentStep ? 'active' : ''} ${
                  index < currentStep ? 'completed' : ''
                }`}
              />
            ))}
          </div>

          <button
            className="nav-btn primary"
            onClick={handleNext}
            disabled={!canProceed}
          >
            {isLastStep ? 'Analyze My Style' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalityQuiz;