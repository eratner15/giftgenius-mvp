import React, { useState, useRef, useEffect } from 'react';
import { massiveGiftDatabase } from '../data/massive-gift-database';

const AIGiftingExpert = ({ onClose, gifts, onRecommendGift }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: "Hi! I'm your personal gift expert. Tell me about who you're shopping for and I'll help you find the perfect gift. What's the occasion?",
      timestamp: new Date(),
      type: 'welcome'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState([
    "Birthday gift for my mom who loves gardening",
    "Anniversary surprise for my tech-savvy husband",
    "Thank you gift for a colleague under $50",
    "Christmas gift for teenage daughter"
  ]);
  const [conversationContext, setConversationContext] = useState({
    recipient: '',
    occasion: '',
    budget: '',
    interests: [],
    relationship: ''
  });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions = [
    { label: 'Birthday', value: 'birthday gift' },
    { label: 'Anniversary', value: 'anniversary gift' },
    { label: 'Holiday', value: 'holiday gift' },
    { label: 'Thank You', value: 'thank you gift' },
    { label: 'Graduation', value: 'graduation gift' },
    { label: 'Baby Shower', value: 'baby shower gift' }
  ];

  const extractContext = (message) => {
    const lowerMessage = message.toLowerCase();
    const context = { ...conversationContext };

    const occasions = ['birthday', 'anniversary', 'christmas', 'holiday', 'graduation', 'wedding', 'valentine', "mother's day", "father's day"];
    occasions.forEach(occasion => {
      if (lowerMessage.includes(occasion)) context.occasion = occasion;
    });

    const relationships = ['mom', 'dad', 'wife', 'husband', 'girlfriend', 'boyfriend', 'friend', 'colleague', 'boss', 'sister', 'brother', 'daughter', 'son'];
    relationships.forEach(rel => {
      if (lowerMessage.includes(rel)) {
        context.recipient = rel;
        context.relationship = rel;
      }
    });

    const budgetMatch = lowerMessage.match(/\$(\d+)|under (\d+)|(\d+) dollars/);
    if (budgetMatch) {
      context.budget = budgetMatch[1] || budgetMatch[2] || budgetMatch[3];
    }

    const interests = ['tech', 'cooking', 'reading', 'fitness', 'travel', 'art', 'music', 'gaming', 'fashion', 'gardening', 'sports'];
    interests.forEach(interest => {
      if (lowerMessage.includes(interest) && !context.interests.includes(interest)) {
        context.interests = [...context.interests, interest];
      }
    });

    setConversationContext(context);
    return context;
  };

  const generateFollowUpQuestions = (context) => {
    const questions = [];
    if (!context.budget) questions.push("What's your budget for this gift?");
    if (!context.recipient) questions.push("Who is this gift for?");
    if (!context.occasion) questions.push("What's the special occasion?");
    if (context.interests.length === 0) questions.push("What are their hobbies or interests?");
    return questions;
  };

  const lookupGifts = (ids) => {
    return ids
      .map(id => massiveGiftDatabase.find(g => g.id === id))
      .filter(Boolean);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    const context = extractContext(currentInput);

    try {
      // Build history from past messages
      const history = messages
        .filter(m => m.role === 'user' || (m.role === 'assistant' && m.type !== 'welcome'))
        .map(m => ({ role: m.role, content: m.content }));

      const res = await fetch('/gifts/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput, history })
      });

      if (!res.ok) throw new Error(`API error ${res.status}`);

      const data = await res.json();
      const recommendations = lookupGifts(data.recommendedIds || []);

      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        recommendations: recommendations.length > 0 ? recommendations : undefined,
        type: 'recommendation'
      };

      setMessages(prev => [...prev, assistantMessage]);

      const followUp = generateFollowUpQuestions(context);
      if (followUp.length > 0) setSuggestedQuestions(followUp);

    } catch (error) {
      console.error('AI response error:', error);

      // Fallback: show popular gifts
      const fallbackMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: "I'm having trouble connecting right now, but let me show you some popular gifts that might work!",
        timestamp: new Date(),
        recommendations: (gifts || []).slice(0, 3)
      };

      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (action) => {
    setInput(action.value);
  };

  const handleSuggestedQuestion = (question) => {
    setInput(question);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleRecommendationClick = (gift) => {
    onRecommendGift?.(gift);
  };

  return (
    <div className="ai-chat-overlay">
      <div className="ai-chat-container">
        <div className="ai-chat-header">
          <div className="ai-header-content">
            <div className="ai-avatar-container">
              <div className="ai-avatar">
                <span className="ai-avatar-icon">AI</span>
                <div className="ai-status-indicator"></div>
              </div>
              <div className="ai-info">
                <h3>AI Gift Expert</h3>
                <p className="ai-status">Online • Ready to help</p>
              </div>
            </div>
            <button className="ai-close-btn" onClick={onClose}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="quick-actions-bar">
          <div className="quick-actions-scroll">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className="quick-action-btn"
                onClick={() => handleQuickAction(action)}
              >
                <span className="action-label">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="ai-chat-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message-wrapper ${message.role}`}>
              {message.role === 'assistant' && (
                <div className="message-avatar">
                  <span>AI</span>
                </div>
              )}

              <div className={`message-bubble ${message.type || ''}`}>
                <p className="message-content">{message.content}</p>

                {message.recommendations && message.recommendations.length > 0 && (
                  <div className="gift-recommendations">
                    {message.recommendations.map((gift, index) => (
                      <div
                        key={index}
                        className="recommendation-card"
                        onClick={() => handleRecommendationClick(gift)}
                      >
                        <img src={gift.image_url} alt={gift.title} />
                        <div className="recommendation-info">
                          <h4>{gift.title}</h4>
                          <p className="recommendation-description">
                            {gift.description?.slice(0, 60)}...
                          </p>
                          <div className="recommendation-meta">
                            <span className="price">${gift.price}</span>
                            <span className="rating">★ {gift.rating}</span>
                            {gift.success_rate > 90 && (
                              <span className="popular-badge">Popular</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <span className="message-time">
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              {message.role === 'user' && (
                <div className="message-avatar user-avatar">
                  <span>You</span>
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="message-wrapper assistant">
              <div className="message-avatar">
                <span>AI</span>
              </div>
              <div className="message-bubble typing-bubble">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {suggestedQuestions.length > 0 && (
          <div className="suggested-questions">
            <p className="suggestions-label">Suggestions:</p>
            <div className="questions-scroll">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  className="suggested-question-btn"
                  onClick={() => handleSuggestedQuestion(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="ai-chat-input-area">
          <div className="input-container">
            <textarea
              className="ai-chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe who you're shopping for..."
              rows={1}
            />
            <button
              className="ai-send-btn"
              onClick={handleSendMessage}
              disabled={!input.trim() || isTyping}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M2 10L17 2L13 18L11 11L2 10Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
          <p className="input-helper">Press Enter to send • Shift+Enter for new line</p>
        </div>
      </div>
    </div>
  );
};

export default AIGiftingExpert;
