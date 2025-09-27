import React, { useState, useRef, useEffect } from 'react';
import openAIService from '../services/openai';

const AIGiftingExpert = ({ onClose, gifts, onRecommendGift }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: "Hi! I'm your AI Gifting Expert 🎁. I've helped thousands find the perfect gift. Tell me about who you're shopping for and I'll give you personalized recommendations!",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simple AI response generator (you can integrate real AI API later)
  const generateAIResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();

    // Detect keywords and recommend gifts
    let response = '';
    let recommendedGifts = [];

    // Budget detection
    const budgetMatch = userMessage.match(/\$?(\d+)/);
    const budget = budgetMatch ? parseInt(budgetMatch[1]) : null;

    // Category detection
    if (lowerMessage.includes('tech') || lowerMessage.includes('gadget') || lowerMessage.includes('electronic')) {
      recommendedGifts = gifts.filter(g => g.category === 'tech');
      response = "Great choice! Tech gifts are always popular. ";
    } else if (lowerMessage.includes('jewelry') || lowerMessage.includes('necklace') || lowerMessage.includes('bracelet')) {
      recommendedGifts = gifts.filter(g => g.category === 'jewelry');
      response = "Jewelry is such a thoughtful and lasting gift! ";
    } else if (lowerMessage.includes('home') || lowerMessage.includes('house') || lowerMessage.includes('decor')) {
      recommendedGifts = gifts.filter(g => g.category === 'home');
      response = "Home gifts are perfect for making their space more comfortable! ";
    } else if (lowerMessage.includes('experience') || lowerMessage.includes('date') || lowerMessage.includes('memory')) {
      recommendedGifts = gifts.filter(g => g.category === 'experiences');
      response = "Experiences create lasting memories - what a wonderful idea! ";
    } else if (lowerMessage.includes('food') || lowerMessage.includes('chocolate') || lowerMessage.includes('coffee') || lowerMessage.includes('wine')) {
      recommendedGifts = gifts.filter(g => g.category === 'food');
      response = "Food gifts are always appreciated by foodies! ";
    } else if (lowerMessage.includes('fashion') || lowerMessage.includes('clothes') || lowerMessage.includes('style')) {
      recommendedGifts = gifts.filter(g => g.category === 'fashion');
      response = "Fashion gifts show you pay attention to their style! ";
    } else if (lowerMessage.includes('unique') || lowerMessage.includes('special') || lowerMessage.includes('personalized')) {
      recommendedGifts = gifts.filter(g => g.category === 'unique');
      response = "Unique gifts show extra thought and care! ";
    }

    // Occasion detection
    if (lowerMessage.includes('birthday')) {
      response += "For birthdays, I recommend something that celebrates their personality. ";
    } else if (lowerMessage.includes('anniversary')) {
      response += "Anniversaries call for something romantic and meaningful. ";
    } else if (lowerMessage.includes('wedding')) {
      response += "Wedding gifts should be practical yet memorable for the couple. ";
    } else if (lowerMessage.includes('thank you') || lowerMessage.includes('thanks')) {
      response += "A thank you gift should be thoughtful without being overwhelming. ";
    }

    // Recipient detection
    if (lowerMessage.includes('mom') || lowerMessage.includes('mother')) {
      response += "Moms love gifts that show you appreciate everything they do. ";
    } else if (lowerMessage.includes('dad') || lowerMessage.includes('father')) {
      response += "Dads often appreciate practical gifts they can use. ";
    } else if (lowerMessage.includes('wife') || lowerMessage.includes('husband') || lowerMessage.includes('partner')) {
      response += "Your partner will appreciate something that shows how well you know them. ";
    } else if (lowerMessage.includes('friend')) {
      response += "Friend gifts should be fun and reflect your shared interests. ";
    } else if (lowerMessage.includes('boss') || lowerMessage.includes('coworker')) {
      response += "Professional gifts should be tasteful and not too personal. ";
    }

    // Budget filter
    if (budget && recommendedGifts.length > 0) {
      recommendedGifts = recommendedGifts.filter(g => g.price <= budget * 1.2); // 20% over budget is ok
      response += `I'm keeping things around your $${budget} budget. `;
    }

    // Generic responses if no matches
    if (recommendedGifts.length === 0) {
      if (lowerMessage.includes('help') || lowerMessage.includes('hi') || lowerMessage.includes('hello')) {
        return "I'd love to help you find the perfect gift! Could you tell me:\n• Who are you shopping for?\n• What's the occasion?\n• Do you have a budget in mind?\n• What are their interests or hobbies?";
      }

      // Show some popular gifts
      recommendedGifts = gifts
        .sort((a, b) => b.success_rate - a.success_rate)
        .slice(0, 3);
      response = "Let me show you some of our most popular gifts that have high success rates! ";
    }

    // Limit to top 3 recommendations
    recommendedGifts = recommendedGifts.slice(0, 3);

    if (recommendedGifts.length > 0) {
      response += `\n\nHere are my top ${recommendedGifts.length} recommendation${recommendedGifts.length > 1 ? 's' : ''}:`;
    } else {
      response += "\n\nCould you tell me more about the person and occasion? I'll find the perfect gift!";
    }

    return { response, gifts: recommendedGifts };
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    try {
      // Prepare messages for OpenAI API (exclude recommendations and metadata)
      const apiMessages = [...messages, userMessage].map(m => ({
        role: m.role,
        content: m.content
      }));

      const { response, gifts: recommendedGifts } = await openAIService.getChatResponse(apiMessages, gifts);

      const aiMessage = {
        id: messages.length + 2,
        role: 'assistant',
        content: response,
        recommendations: recommendedGifts,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);

      // Fallback to local response if API fails
      const { response, gifts: recommendedGifts } = generateAIResponse(currentInput);

      const aiMessage = {
        id: messages.length + 2,
        role: 'assistant',
        content: response + '\n\n(Note: Using offline mode)',
        recommendations: recommendedGifts,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickPrompts = [
    "Gift for my wife's birthday under $200",
    "Anniversary gift for parents",
    "Tech gift for dad",
    "Unique gift for best friend"
  ];

  return (
    <div className="ai-chat-widget">
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="ai-avatar">🤖</div>
          <div>
            <h3>AI Gifting Expert</h3>
            <span className="status">● Online</span>
          </div>
        </div>
        <button className="chat-close" onClick={onClose}>✕</button>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.role}`}>
            {message.role === 'assistant' && (
              <div className="message-avatar">🤖</div>
            )}
            <div className="message-content">
              <p>{message.content}</p>

              {message.recommendations && message.recommendations.length > 0 && (
                <div className="gift-recommendations">
                  {message.recommendations.map((gift) => (
                    <div
                      key={gift.id}
                      className="mini-gift-card"
                      onClick={() => onRecommendGift(gift)}
                    >
                      <img src={gift.image_url} alt={gift.title} />
                      <div className="mini-gift-info">
                        <div className="mini-gift-title">{gift.title}</div>
                        <div className="mini-gift-price">${gift.price}</div>
                        <div className="mini-gift-rating">
                          {gift.success_rate}% success rate
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {message.role === 'user' && (
              <div className="message-avatar user">👤</div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="message assistant">
            <div className="message-avatar">🤖</div>
            <div className="message-content typing">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {messages.length <= 1 && (
        <div className="quick-prompts">
          <p>Try asking:</p>
          {quickPrompts.map((prompt, index) => (
            <button
              key={index}
              className="quick-prompt"
              onClick={() => setInput(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      <div className="chat-input">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Describe who you're shopping for..."
          rows={1}
        />
        <button
          className="send-button"
          onClick={handleSend}
          disabled={!input.trim()}
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default AIGiftingExpert;