// OpenAI API Service for AI Gifting Expert
// Note: In production, API calls should go through your backend to protect API keys

class OpenAIService {
  constructor() {
    // In production, use environment variable and backend proxy
    this.apiKey = process.env.REACT_APP_OPENAI_API_KEY || '';
    this.apiEndpoint = 'https://api.openai.com/v1/chat/completions';
    this.useRealAPI = !!this.apiKey && this.apiKey.length > 0;
  }

  async getChatResponse(messages, gifts) {
    if (!this.useRealAPI) {
      // Fallback to local logic if no API key
      return this.getLocalResponse(messages[messages.length - 1].content, gifts);
    }

    try {
      const systemPrompt = `You are an expert gift advisor helping customers find the perfect gift.

Available gifts catalog:
${gifts.slice(0, 20).map(g => `- ${g.title} ($${g.price}) - ${g.category} - ${g.description.substring(0, 100)}`).join('\n')}

Guidelines:
- Ask clarifying questions about recipient, occasion, budget, and interests
- Recommend 1-3 specific gifts from the catalog
- Explain WHY each gift would be perfect
- Be warm, enthusiastic, and helpful
- Keep responses concise (2-3 sentences)
- Format gift recommendations as: "**[Gift Title]** - [Why it's perfect]"`;

      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages
          ],
          temperature: 0.7,
          max_tokens: 300
        })
      });

      if (!response.ok) {
        console.error('OpenAI API error:', response.status);
        return this.getLocalResponse(messages[messages.length - 1].content, gifts);
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      // Extract gift recommendations from response
      const recommendedGifts = this.extractGiftRecommendations(aiResponse, gifts);

      return {
        response: aiResponse,
        gifts: recommendedGifts
      };

    } catch (error) {
      console.error('Error calling OpenAI:', error);
      // Fallback to local logic
      return this.getLocalResponse(messages[messages.length - 1].content, gifts);
    }
  }

  extractGiftRecommendations(responseText, gifts) {
    const recommendations = [];

    // Look for gift titles in the response
    gifts.forEach(gift => {
      const titleWords = gift.title.toLowerCase().split(' ');
      const responseWords = responseText.toLowerCase();

      // Check if multiple words from the title appear in the response
      const matchCount = titleWords.filter(word =>
        word.length > 3 && responseWords.includes(word)
      ).length;

      if (matchCount >= 2 || responseWords.includes(gift.title.toLowerCase())) {
        recommendations.push(gift);
      }
    });

    // If no matches, return top rated gifts
    if (recommendations.length === 0) {
      return gifts
        .sort((a, b) => b.success_rate - a.success_rate)
        .slice(0, 3);
    }

    return recommendations.slice(0, 3);
  }

  getLocalResponse(userMessage, gifts) {
    // Enhanced local fallback logic
    const lowerMessage = userMessage.toLowerCase();
    let response = '';
    let recommendedGifts = [];

    // Budget detection
    const budgetMatch = userMessage.match(/\$?(\d+)/);
    const budget = budgetMatch ? parseInt(budgetMatch[1]) : null;

    // Category detection with better matching
    const categoryMap = {
      tech: ['tech', 'gadget', 'electronic', 'phone', 'watch', 'airpods', 'ipad'],
      jewelry: ['jewelry', 'necklace', 'bracelet', 'ring', 'earring', 'diamond'],
      home: ['home', 'house', 'decor', 'pillow', 'blanket', 'diffuser'],
      experiences: ['experience', 'date', 'memory', 'spa', 'wine', 'balloon'],
      food: ['food', 'chocolate', 'coffee', 'wine', 'truffle', 'gourmet'],
      fashion: ['fashion', 'clothes', 'handbag', 'scarf', 'watch', 'style'],
      beauty: ['beauty', 'makeup', 'skincare', 'perfume', 'cosmetic'],
      unique: ['unique', 'special', 'personalized', 'custom', 'star map', 'portrait']
    };

    let detectedCategory = null;
    for (const [category, keywords] of Object.entries(categoryMap)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        detectedCategory = category;
        recommendedGifts = gifts.filter(g => g.category === category);
        break;
      }
    }

    // Occasion-based responses
    if (lowerMessage.includes('birthday')) {
      response = "Birthdays are special! I'll find something they'll absolutely love. ";
    } else if (lowerMessage.includes('anniversary')) {
      response = "How romantic! Let me suggest some memorable anniversary gifts. ";
    } else if (lowerMessage.includes('mom') || lowerMessage.includes('mother')) {
      response = "Moms deserve the best! Here are some thoughtful options. ";
    } else if (lowerMessage.includes('wife') || lowerMessage.includes('husband')) {
      response = "Your partner will love these! ";
    }

    // Add category-specific response
    if (detectedCategory) {
      const categoryResponses = {
        tech: "Tech gifts are always exciting! ",
        jewelry: "Jewelry is timeless and elegant! ",
        home: "Home gifts add comfort and style! ",
        experiences: "Experiences create lasting memories! ",
        food: "Gourmet gifts are delicious and thoughtful! ",
        fashion: "Fashion gifts show great taste! ",
        beauty: "Beauty products are pampering and luxurious! ",
        unique: "Unique gifts show you put extra thought into it! "
      };
      response += categoryResponses[detectedCategory] || '';
    }

    // Budget filtering
    if (budget && recommendedGifts.length > 0) {
      recommendedGifts = recommendedGifts.filter(g => g.price <= budget * 1.2);
      response += `Keeping it around your $${budget} budget. `;
    }

    // Sort by success rate and limit
    if (recommendedGifts.length > 0) {
      recommendedGifts = recommendedGifts
        .sort((a, b) => b.success_rate - a.success_rate)
        .slice(0, 3);
      response += `\n\nHere are my top ${recommendedGifts.length} recommendation${recommendedGifts.length > 1 ? 's' : ''}:`;
    } else {
      // Default to top rated
      recommendedGifts = gifts
        .sort((a, b) => b.success_rate - a.success_rate)
        .slice(0, 3);
      response = "Let me show you some of our most popular gifts with amazing success rates!";
    }

    return { response, gifts: recommendedGifts };
  }
}

export default new OpenAIService();