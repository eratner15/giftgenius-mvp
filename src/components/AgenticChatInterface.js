import React, { useState, useEffect, useRef } from 'react';
import { massiveGiftDatabase } from '../data/massive-gift-database';
import './AgenticChatInterface.css';

const AgenticChatInterface = ({ onClose, initialMessage = null }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!sessionStarted) {
      const welcomeMessage = {
        id: 'welcome',
        role: 'assistant',
        content: "Hi! I'm your AI gift assistant. I'll help you find the perfect gift by understanding exactly what you're looking for. What's the occasion, and who are you shopping for?",
        timestamp: Date.now(),
        type: 'welcome'
      };
      setMessages([welcomeMessage]);
      setSessionStarted(true);
    }

    if (initialMessage && sessionStarted && messages.length === 1) {
      handleSendMessage(initialMessage);
    }
  }, [initialMessage, sessionStarted, messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const lookupGifts = (ids) => {
    return ids
      .map(id => massiveGiftDatabase.find(g => g.id === id))
      .filter(Boolean);
  };

  const handleSendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim() || isTyping) return;

    const userMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: messageText.trim(),
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Build history from past messages (skip welcome)
      const history = messages
        .filter(m => m.role === 'user' || (m.role === 'assistant' && m.type !== 'welcome'))
        .map(m => ({ role: m.role, content: m.content }));

      const res = await fetch('/gifts/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText.trim(), history })
      });

      if (!res.ok) throw new Error(`API error ${res.status}`);

      const data = await res.json();
      const recommendations = lookupGifts(data.recommendedIds || []);

      const assistantMessage = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        content: data.response,
        timestamp: Date.now(),
        recommendations,
        type: 'response'
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: "I'm sorry, I'm having trouble right now. Please try again in a moment, or feel free to browse our gift recommendations manually.",
        timestamp: Date.now(),
        type: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleGiftClick = (recommendation) => {
    if (window.affiliateTracker) {
      window.affiliateTracker.trackAffiliateClick(recommendation.id, {
        ...recommendation,
        source: 'ai_agent',
        sessionContext: 'agentic_chat'
      });
    }
    if (recommendation.affiliateUrl || recommendation.affiliate_link) {
      window.open(recommendation.affiliateUrl || recommendation.affiliate_link, '_blank');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessage = (content) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  };

  if (isMinimized) {
    return (
      <div className="agentic-chat-minimized" onClick={() => setIsMinimized(false)}>
        <div className="chat-icon" style={{fontWeight: 700, fontSize: 14}}>AI</div>
        <span>AI Gift Assistant</span>
        {isTyping && <div className="typing-indicator-mini">●●●</div>}
      </div>
    );
  }

  return (
    <div className="agentic-chat-container">
      <div className="chat-header">
        <div className="header-left">
          <div className="ai-avatar" style={{fontWeight: 700, fontSize: 14}}>AI</div>
          <div className="header-info">
            <h3>AI Gift Assistant</h3>
            <span className={`status ${isTyping ? 'typing' : 'online'}`}>
              {isTyping ? 'Thinking...' : 'Online'}
            </span>
          </div>
        </div>
        <div className="header-actions">
          <button
            className="minimize-btn"
            onClick={() => setIsMinimized(true)}
            title="Minimize chat"
          >
            &minus;
          </button>
          <button
            className="close-btn"
            onClick={onClose}
            title="Close chat"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.role}`}>
            <div className="message-content">
              <div
                className="message-text"
                dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
              />

              {message.recommendations && message.recommendations.length > 0 && (
                <div className="ai-recommendations">
                  <h4>My Recommendations:</h4>
                  <div className="recommendations-grid">
                    {message.recommendations.map((rec, index) => (
                      <div key={`${message.id}_rec_${index}`} className="recommendation-card">
                        <div className="rec-image">
                          <img
                            src={rec.image_url}
                            alt={rec.title}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/100x100?text=Gift';
                            }}
                          />
                        </div>
                        <div className="rec-content">
                          <h5>{rec.title}</h5>
                          <p className="rec-price">${rec.price}</p>
                          <p className="rec-reason">{rec.description?.slice(0, 80)}</p>
                          {rec.rating && (
                            <div className="rec-rating">
                              {rec.rating}/5
                            </div>
                          )}
                          <button
                            className="rec-button"
                            onClick={() => handleGiftClick(rec)}
                          >
                            View Gift →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <span className="message-time">
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="message assistant typing">
            <div className="message-content">
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

      <div className="chat-input-container">
        <div className="quick-actions">
          <button
            className="quick-action-btn"
            onClick={() => handleSendMessage("I need gift ideas for my mom's birthday under $50")}
          >
            Birthday for Mom
          </button>
          <button
            className="quick-action-btn"
            onClick={() => handleSendMessage("What are some good Christmas gifts this year?")}
          >
            Christmas Ideas
          </button>
          <button
            className="quick-action-btn"
            onClick={() => handleSendMessage("I need a last-minute gift that can arrive quickly")}
          >
            Last Minute Gift
          </button>
        </div>

        <div className="input-area">
          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about gifts... (e.g., 'I need a birthday gift for my 25-year-old sister who loves cooking')"
            disabled={isTyping}
            rows="1"
            style={{ resize: 'none' }}
          />
          <button
            className="send-button"
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || isTyping}
          >
            {isTyping ? '...' : '→'}
          </button>
        </div>

        <div className="chat-footer">
          <span className="powered-by">
            Powered by Claude AI • <span className="privacy-link">Privacy Policy</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default AgenticChatInterface;
