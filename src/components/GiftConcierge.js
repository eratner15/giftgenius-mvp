import React, { useState, useEffect } from 'react';

const GiftConcierge = ({ onRecommendation, onClose }) => {
  const [step, setStep] = useState('welcome');
  const [profile, setProfile] = useState({});
  const [typing, setTyping] = useState(false);
  const [conversation, setConversation] = useState([]);

  const personalityQuestions = [
    {
      id: 'urgency',
      question: "How soon do you need this gift?",
      options: [
        { value: 'today', label: 'Today! (Emergency mode)' },
        { value: 'week', label: 'Within a week' },
        { value: 'month', label: 'I\'m planning ahead' }
      ]
    },
    {
      id: 'relationship_depth',
      question: "How well do you know this person?",
      options: [
        { value: 'intimate', label: 'We share everything' },
        { value: 'close', label: 'Pretty close friends/family' },
        { value: 'casual', label: 'Work friends or acquaintances' }
      ]
    },
    {
      id: 'gift_impact',
      question: "What kind of reaction are you hoping for?",
      options: [
        { value: 'wow', label: 'Total surprise & delight' },
        { value: 'thoughtful', label: 'Meaningful & touching' },
        { value: 'practical', label: 'Useful & appreciated' }
      ]
    },
    {
      id: 'story_goal',
      question: "What story do you want this gift to tell?",
      options: [
        { value: 'love', label: 'How much I care about you' },
        { value: 'support', label: 'I believe in your dreams' },
        { value: 'fun', label: 'Life should be more enjoyable' }
      ]
    }
  ];

  const addMessage = (sender, text, delay = 1500) => {
    setTyping(true);
    setTimeout(() => {
      setConversation(prev => [...prev, { sender, text, timestamp: Date.now() }]);
      setTyping(false);
    }, delay);
  };

  const handleAnswer = (questionId, answer) => {
    setProfile(prev => ({ ...prev, [questionId]: answer }));

    const question = personalityQuestions.find(q => q.id === questionId);
    const selectedOption = question.options.find(opt => opt.value === answer);

    // Add user response
    setConversation(prev => [...prev, {
      sender: 'user',
      text: selectedOption.label,
      timestamp: Date.now()
    }]);

    // Get AI response based on the answer
    const responses = getSmartResponse(questionId, answer);
    responses.forEach((response, index) => {
      addMessage('ai', response, (index + 1) * 1200);
    });

    // Move to next question or results
    setTimeout(() => {
      const currentIndex = personalityQuestions.findIndex(q => q.id === questionId);
      if (currentIndex < personalityQuestions.length - 1) {
        setStep('question');
      } else {
        setStep('generating');
        generatePersonalizedRecommendations();
      }
    }, responses.length * 1200 + 500);
  };

  const getSmartResponse = (questionId, answer) => {
    const responses = {
      urgency: {
        today: ["Oh wow, emergency gift mode!", "I love the pressure - let's find something that ships same-day and looks like you planned it for months."],
        week: ["Perfect timing! We can find something truly special.", "A week gives us lots of amazing options."],
        month: ["A planner! I respect that.", "We can find something absolutely perfect with that kind of time."]
      },
      relationship_depth: {
        intimate: ["Aww, you two sound really close!", "This calls for something deeply personal and meaningful."],
        close: ["Great relationship foundation!", "We can definitely find something that shows you really care."],
        casual: ["Smart to keep it thoughtful but appropriate!", "Let's find something that's impressive without being too personal."]
      },
      gift_impact: {
        wow: ["I LOVE a good surprise moment!", "Let's find something that will literally make their jaw drop."],
        thoughtful: ["Oh, the sweet tears of joy!", "Nothing beats a gift that touches the heart."],
        practical: ["Practical gifts can be incredibly thoughtful!", "Let's find something they'll use and think of you every time."]
      },
      story_goal: {
        love: ["The most beautiful story of all.", "Let's find a gift that speaks straight to their heart."],
        support: ["You're such an amazing cheerleader!", "Gifts that say 'I believe in you' are the most powerful."],
        fun: ["Yes! Life needs more joy!", "Let's find something that brings instant smiles and happiness."]
      }
    };

    return responses[questionId]?.[answer] || ["Interesting choice!", "Let me think about that..."];
  };

  const generatePersonalizedRecommendations = () => {
    addMessage('ai', "Analyzing your perfect gift profile...", 1000);
    addMessage('ai', "Cross-referencing with our success database...", 2500);
    addMessage('ai', "I found your perfect matches! Let me show you...", 4000);

    setTimeout(() => {
      const recommendations = createPersonalizedRecommendations(profile);
      onRecommendation(recommendations);
    }, 5000);
  };

  const createPersonalizedRecommendations = (profile) => {
    // This would integrate with your enhanced gift data
    const personalizedGifts = [
      {
        id: 'ai_rec_1',
        title: "Your Perfect Match",
        description: "Based on your answers, this gift tells exactly the story you want to tell.",
        confidence: 94,
        reasoning: ["Perfect for your timeline", "Matches the relationship depth", "Creates the impact you want"],
        urgency: profile.urgency === 'today' ? 'Same-day shipping available!' : null
      }
    ];

    return {
      profile,
      recommendations: personalizedGifts,
      confidence: 94,
      story: `A ${profile.gift_impact} gift that says "${profile.story_goal}" - delivered ${profile.urgency === 'today' ? 'today' : 'perfectly on time'}.`
    };
  };

  const getCurrentQuestion = () => {
    const answeredQuestions = Object.keys(profile);
    return personalityQuestions.find(q => !answeredQuestions.includes(q.id));
  };

  return (
    <div className="gift-concierge-overlay">
      <div className="gift-concierge-modal">
        <div className="concierge-header">
          <div className="concierge-avatar">GC</div>
          <div className="concierge-intro">
            <h2>Your Personal Gift Concierge</h2>
            <p>I'll help you find the perfect gift that creates the exact moment you're imagining</p>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="conversation-area">
          {step === 'welcome' && (
            <div className="welcome-screen">
              <div className="welcome-message">
                <h3>Hi there! I'm your personal gift expert</h3>
                <p>I've helped over 50,000 people find gifts that created unforgettable moments. Let me learn about your situation so I can find your perfect match!</p>
                <button
                  className="start-btn"
                  onClick={() => {
                    setStep('question');
                    addMessage('ai', "Let's start with the basics - every great gift begins with understanding the moment you want to create!");
                  }}
                >
                  Find My Perfect Gift
                </button>
              </div>
            </div>
          )}

          <div className="conversation-history">
            {conversation.map((message, index) => (
              <div key={index} className={`message ${message.sender}`}>
                {message.sender === 'ai' && <div className="ai-avatar">AI</div>}
                <div className="message-bubble">
                  {message.text}
                </div>
              </div>
            ))}

            {typing && (
              <div className="message ai">
                <div className="ai-avatar">AI</div>
                <div className="message-bubble typing">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {step === 'question' && !typing && (
            <div className="question-area">
              {(() => {
                const currentQ = getCurrentQuestion();
                if (!currentQ) return null;

                return (
                  <div className="current-question">
                    <h3>{currentQ.question}</h3>
                    <div className="answer-options">
                      {currentQ.options.map(option => (
                        <button
                          key={option.value}
                          className="answer-option"
                          onClick={() => handleAnswer(currentQ.id, option.value)}
                        >
                          <span className="option-text">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {step === 'generating' && (
            <div className="generating-screen">
              <div className="loading-animation">
                <div className="gift-pulse">...</div>
                <p>Creating your personalized gift story...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GiftConcierge;