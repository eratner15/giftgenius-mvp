// Gift Recommendation Engine — local scoring logic (AI chat handled server-side via Claude)

class GiftRecommendationEngine {
  constructor() {
    // Gift matching algorithms
    this.occasionKeywords = {
      birthday: ['birthday', 'birth', 'celebrate', 'party', 'turning'],
      anniversary: ['anniversary', 'years together', 'relationship', 'romantic'],
      wedding: ['wedding', 'marriage', 'bride', 'groom', 'married'],
      christmas: ['christmas', 'holiday', 'xmas', 'festive', 'santa'],
      valentine: ['valentine', 'love', 'romantic', 'heart', 'romance'],
      graduation: ['graduation', 'graduate', 'school', 'college', 'degree'],
      retirement: ['retirement', 'retiring', 'career', 'work'],
      housewarming: ['housewarming', 'new home', 'moving', 'house'],
      baby: ['baby', 'newborn', 'shower', 'pregnancy', 'infant'],
      thank_you: ['thank you', 'thanks', 'grateful', 'appreciation']
    };

    this.relationshipKeywords = {
      mom: ['mom', 'mother', 'mama', 'mommy'],
      dad: ['dad', 'father', 'papa', 'daddy'],
      spouse: ['wife', 'husband', 'spouse', 'partner'],
      friend: ['friend', 'buddy', 'pal', 'bestie'],
      sibling: ['sister', 'brother', 'sibling'],
      colleague: ['coworker', 'colleague', 'boss', 'work'],
      child: ['son', 'daughter', 'kid', 'child']
    };

    this.interestKeywords = {
      tech: ['tech', 'technology', 'gadget', 'phone', 'computer', 'smart'],
      fitness: ['fitness', 'workout', 'gym', 'running', 'exercise', 'health'],
      cooking: ['cooking', 'kitchen', 'chef', 'food', 'baking', 'recipes'],
      reading: ['reading', 'books', 'literature', 'novel', 'author'],
      music: ['music', 'musician', 'guitar', 'piano', 'concert', 'band'],
      art: ['art', 'artist', 'painting', 'drawing', 'creative', 'crafty'],
      travel: ['travel', 'vacation', 'wanderlust', 'adventure', 'explore'],
      fashion: ['fashion', 'style', 'clothes', 'shopping', 'trendy'],
      outdoors: ['outdoors', 'hiking', 'camping', 'nature', 'adventure'],
      gaming: ['gaming', 'gamer', 'video games', 'console', 'pc gaming']
    };
  }

  // Smart gift recommendation based on user input
  async getSmartRecommendations(userInput, gifts, options = {}) {
    const analysis = this.analyzeUserInput(userInput);
    let recommendations = this.scoreGifts(gifts, analysis);

    // Apply additional filters if provided
    if (options.maxPrice) {
      recommendations = recommendations.filter(gift => gift.price <= options.maxPrice);
    }
    if (options.minPrice) {
      recommendations = recommendations.filter(gift => gift.price >= options.minPrice);
    }
    if (options.category) {
      recommendations = recommendations.filter(gift => gift.category === options.category);
    }

    // Sort by recommendation score
    recommendations.sort((a, b) => b.recommendationScore - a.recommendationScore);

    return {
      recommendations: recommendations.slice(0, options.limit || 6),
      analysis,
      confidence: this.calculateConfidence(analysis, recommendations)
    };
  }

  // Analyze user input to extract gift criteria
  analyzeUserInput(input) {
    const lowerInput = input.toLowerCase();
    const analysis = {
      occasion: null,
      relationship: null,
      interests: [],
      budget: null,
      urgency: 'normal',
      sentiment: 'neutral'
    };

    // Extract occasion
    for (const [occasion, keywords] of Object.entries(this.occasionKeywords)) {
      if (keywords.some(keyword => lowerInput.includes(keyword))) {
        analysis.occasion = occasion;
        break;
      }
    }

    // Extract relationship
    for (const [relationship, keywords] of Object.entries(this.relationshipKeywords)) {
      if (keywords.some(keyword => lowerInput.includes(keyword))) {
        analysis.relationship = relationship;
        break;
      }
    }

    // Extract interests
    for (const [interest, keywords] of Object.entries(this.interestKeywords)) {
      if (keywords.some(keyword => lowerInput.includes(keyword))) {
        analysis.interests.push(interest);
      }
    }

    // Extract budget
    const budgetMatch = input.match(/\$?(\d+)/);
    if (budgetMatch) {
      analysis.budget = parseInt(budgetMatch[1]);
    }

    // Detect urgency
    if (lowerInput.includes('urgent') || lowerInput.includes('asap') || lowerInput.includes('tomorrow')) {
      analysis.urgency = 'high';
    } else if (lowerInput.includes('soon') || lowerInput.includes('next week')) {
      analysis.urgency = 'medium';
    }

    return analysis;
  }

  // Score gifts based on analysis
  scoreGifts(gifts, analysis) {
    return gifts.map(gift => {
      let score = gift.success_rate || 50; // Base score from success rate
      const reasons = [];

      // Occasion matching
      if (analysis.occasion && gift.occasion && gift.occasion.includes(analysis.occasion)) {
        score += 25;
        reasons.push(`Perfect for ${analysis.occasion}`);
      }

      // Category/Interest matching
      if (analysis.interests.length > 0) {
        const categoryMap = {
          tech: 'tech',
          fitness: 'unique',
          cooking: 'home',
          reading: 'unique',
          music: 'unique',
          art: 'unique',
          travel: 'experiences',
          fashion: 'fashion',
          outdoors: 'experiences',
          gaming: 'tech'
        };

        for (const interest of analysis.interests) {
          if (categoryMap[interest] === gift.category) {
            score += 20;
            reasons.push(`Matches ${interest} interest`);
          }
        }
      }

      // Relationship matching
      if (analysis.relationship && gift.recipient) {
        const relationshipMap = {
          mom: ['mom', 'mother', 'parent'],
          dad: ['dad', 'father', 'parent'],
          spouse: ['wife', 'husband', 'partner'],
          friend: ['friend'],
          sibling: ['sister', 'brother'],
          colleague: ['coworker'],
          child: ['son', 'daughter', 'child']
        };

        const expectedRecipients = relationshipMap[analysis.relationship] || [];
        if (expectedRecipients.some(r => gift.recipient.includes(r))) {
          score += 15;
          reasons.push(`Great for ${analysis.relationship}`);
        }
      }

      // Budget matching
      if (analysis.budget) {
        if (gift.price <= analysis.budget) {
          if (gift.price >= analysis.budget * 0.7) {
            score += 10; // Sweet spot
            reasons.push('Perfect price range');
          } else {
            score += 5; // Under budget
            reasons.push('Under budget');
          }
        } else {
          score -= 20; // Over budget penalty
        }
      }

      // Quality indicators
      if (gift.success_rate >= 90) {
        score += 10;
        reasons.push('Highly rated choice');
      }

      if (gift.total_reviews > 1000) {
        score += 5;
        reasons.push('Popular choice');
      }

      return {
        ...gift,
        recommendationScore: Math.min(100, score),
        recommendationReasons: reasons
      };
    });
  }

  // Calculate confidence in recommendations
  calculateConfidence(analysis, recommendations) {
    let confidence = 50; // Base confidence

    if (analysis.occasion) confidence += 20;
    if (analysis.relationship) confidence += 15;
    if (analysis.interests.length > 0) confidence += 10;
    if (analysis.budget) confidence += 10;

    if (recommendations.length > 0 && recommendations[0].recommendationScore > 80) {
      confidence += 15;
    }

    return Math.min(100, confidence);
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

// Create a singleton instance
const giftEngine = new GiftRecommendationEngine();

// Export individual functions for easier use
export const getSmartRecommendations = (userInput, gifts, options) => giftEngine.getSmartRecommendations(userInput, gifts, options);
export const analyzeUserInput = (input) => giftEngine.analyzeUserInput(input);

// Export the service instance as well
export default giftEngine;