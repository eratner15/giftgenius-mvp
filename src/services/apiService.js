const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class APIService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const finalOptions = { ...defaultOptions, ...options };

    try {
      const response = await fetch(url, finalOptions);

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }

  // Gift recommendations
  async getGifts(filters = {}) {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });

    const endpoint = queryParams.toString() ? `/gifts?${queryParams.toString()}` : '/gifts';
    return this.request(endpoint);
  }

  // Get gift categories
  async getCategories() {
    return this.request('/categories');
  }

  // Get survey questions
  async getSurveyQuestions() {
    return this.request('/survey');
  }

  // Submit survey for recommendations
  async submitSurvey(surveyData) {
    return this.request('/survey-result', {
      method: 'POST',
      body: JSON.stringify(surveyData),
    });
  }

  // Get popular gifts analytics
  async getPopularGifts() {
    return this.request('/analytics/popular');
  }

  // Gift search with personalization
  async searchGifts(params) {
    const {
      query,
      category,
      minPrice,
      maxPrice,
      occasion,
      age,
      relationship,
      interests = []
    } = params;

    const filters = {
      category,
      minPrice,
      maxPrice,
      occasion,
      minAge: age ? Math.max(0, age - 5) : undefined,
      maxAge: age ? age + 5 : undefined,
      relationship_stage: relationship,
      limit: 20
    };

    return this.getGifts(filters);
  }

  // Premium features
  async getPremiumRecommendations(userData, preferences) {
    // For now, use regular recommendations but with enhanced filtering
    const filters = {
      category: preferences.category,
      minPrice: preferences.budgetMin,
      maxPrice: preferences.budgetMax,
      occasion: preferences.occasion,
      minAge: userData.age ? userData.age - 2 : undefined,
      maxAge: userData.age ? userData.age + 2 : undefined,
      relationship_stage: userData.relationship,
      minSuccessRate: 80, // Premium filter
      limit: 15
    };

    return this.getGifts(filters);
  }

  // Analytics tracking
  async trackGiftView(giftId) {
    // For now, just log locally - could be expanded to track in backend
    console.log('Gift viewed:', giftId);
    return Promise.resolve();
  }

  async trackGiftClick(giftId, source = 'recommendation') {
    // For now, just log locally
    console.log('Gift clicked:', giftId, 'from:', source);
    return Promise.resolve();
  }
}

export default new APIService();