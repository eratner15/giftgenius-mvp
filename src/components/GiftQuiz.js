import React, { useState } from 'react';
import { getSmartRecommendations } from '../services/openai';

const GiftQuiz = ({ gifts, onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  const quizSteps = [
    {
      id: 'relationship',
      question: 'Who are you shopping for?',
      type: 'single',
      options: [
        { value: 'mom', label: 'Mom/Mother' },
        { value: 'dad', label: 'Dad/Father' },
        { value: 'spouse', label: 'Spouse/Partner' },
        { value: 'friend', label: 'Friend' },
        { value: 'sibling', label: 'Brother/Sister' },
        { value: 'colleague', label: 'Colleague' },
        { value: 'child', label: 'Son/Daughter' }
      ]
    },
    {
      id: 'occasion',
      question: 'What\'s the occasion?',
      type: 'single',
      options: [
        { value: 'birthday', label: 'Birthday' },
        { value: 'anniversary', label: 'Anniversary' },
        { value: 'wedding', label: 'Wedding' },
        { value: 'christmas', label: 'Christmas/Holiday' },
        { value: 'valentine', label: 'Valentine\'s Day' },
        { value: 'graduation', label: 'Graduation' },
        { value: 'thank_you', label: 'Thank You' },
        { value: 'just_because', label: 'Just Because' }
      ]
    },
    {
      id: 'interests',
      question: 'What are they interested in? (Select all that apply)',
      type: 'multiple',
      options: [
        { value: 'tech', label: 'Technology' },
        { value: 'fitness', label: 'Fitness & Health' },
        { value: 'cooking', label: 'Cooking & Food' },
        { value: 'reading', label: 'Books & Reading' },
        { value: 'music', label: 'Music' },
        { value: 'art', label: 'Art & Crafts' },
        { value: 'travel', label: 'Travel' },
        { value: 'fashion', label: 'Fashion & Style' },
        { value: 'outdoors', label: 'Outdoors & Nature' },
        { value: 'gaming', label: 'Gaming' }
      ]
    },
    {
      id: 'budget',
      question: 'What\'s your budget?',
      type: 'single',
      options: [
        { value: '25', label: 'Under $25' },
        { value: '50', label: '$25 - $50' },
        { value: '100', label: '$50 - $100' },
        { value: '200', label: '$100 - $200' },
        { value: '500', label: '$200+' },
        { value: 'no_limit', label: 'No specific limit' }
      ]
    },
    {
      id: 'style',
      question: 'What\'s their style preference?',
      type: 'single',
      options: [
        { value: 'practical', label: 'Practical & Useful' },
        { value: 'luxury', label: 'Luxury & Premium' },
        { value: 'unique', label: 'Unique & Personal' },
        { value: 'trendy', label: 'Trendy & Modern' },
        { value: 'classic', label: 'Classic & Timeless' },
        { value: 'fun', label: 'Fun & Quirky' }
      ]
    }
  ];

  const handleAnswer = (stepId, value) => {
    if (quizSteps[currentStep].type === 'multiple') {
      const currentValues = answers[stepId] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];

      setAnswers(prev => ({ ...prev, [stepId]: newValues }));
    } else {
      setAnswers(prev => ({ ...prev, [stepId]: value }));
    }
  };

  const nextStep = () => {
    if (currentStep < quizSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleQuizComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleQuizComplete = async () => {
    setLoading(true);

    try {
      // Convert answers to a natural language query
      const query = buildQueryFromAnswers(answers);

      // Get smart recommendations
      const result = await getSmartRecommendations(query, gifts, {
        maxPrice: answers.budget === 'no_limit' ? undefined : parseInt(answers.budget),
        limit: 8
      });

      onComplete({
        answers,
        recommendations: result.recommendations,
        analysis: result.analysis,
        confidence: result.confidence,
        query
      });
    } catch (error) {
      console.error('Quiz completion error:', error);
      // Fallback to basic filtering
      onComplete({
        answers,
        recommendations: gifts.slice(0, 8),
        analysis: { confidence: 50 },
        query: 'General gift recommendations'
      });
    } finally {
      setLoading(false);
    }
  };

  const buildQueryFromAnswers = (answers) => {
    let query = '';

    if (answers.relationship && answers.occasion) {
      query += `Gift for my ${answers.relationship} for ${answers.occasion}`;
    } else if (answers.relationship) {
      query += `Gift for my ${answers.relationship}`;
    } else if (answers.occasion) {
      query += `${answers.occasion} gift`;
    } else {
      query += 'Gift recommendation';
    }

    if (answers.interests && answers.interests.length > 0) {
      query += ` who likes ${answers.interests.join(', ')}`;
    }

    if (answers.budget && answers.budget !== 'no_limit') {
      query += ` under $${answers.budget}`;
    }

    if (answers.style) {
      query += ` with ${answers.style} style`;
    }

    return query;
  };

  const currentStepData = quizSteps[currentStep];
  const isLastStep = currentStep === quizSteps.length - 1;
  const canProceed = answers[currentStepData.id] &&
    (currentStepData.type === 'single' || answers[currentStepData.id].length > 0);

  return (
    <div className="gift-quiz-overlay">
      <div className="gift-quiz-modal">
        <div className="quiz-header">
          <h2>Find Your Perfect Gift</h2>
          <button className="quiz-close" onClick={onClose}>×</button>
        </div>

        <div className="quiz-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${((currentStep + 1) / quizSteps.length) * 100}%` }}
            />
          </div>
          <span className="progress-text">
            Step {currentStep + 1} of {quizSteps.length}
          </span>
        </div>

        <div className="quiz-content">
          <h3 className="quiz-question">{currentStepData.question}</h3>

          <div className={`quiz-options ${currentStepData.type === 'multiple' ? 'multiple' : 'single'}`}>
            {currentStepData.options.map(option => {
              const isSelected = currentStepData.type === 'multiple'
                ? (answers[currentStepData.id] || []).includes(option.value)
                : answers[currentStepData.id] === option.value;

              return (
                <button
                  key={option.value}
                  className={`quiz-option ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleAnswer(currentStepData.id, option.value)}
                >
                  <span className="option-label">{option.label}</span>
                  {currentStepData.type === 'multiple' && isSelected && (
                    <span className="option-check">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="quiz-actions">
          <button
            className="btn-quiz-back"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            Back
          </button>

          <button
            className={`btn-quiz-next ${!canProceed ? 'disabled' : ''}`}
            onClick={nextStep}
            disabled={!canProceed || loading}
          >
            {loading ? 'Finding Gifts...' : isLastStep ? 'Get Recommendations' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GiftQuiz;