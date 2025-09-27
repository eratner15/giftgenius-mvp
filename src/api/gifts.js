// API Service Layer for GiftGenius Backend
const API_BASE_URL = process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://api-876makour-eratner15s-projects.vercel.app' // New Vercel functions API
    : 'http://localhost:3001'); // Local development

class ApiService {
  async request(url, options = {}) {
    const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;

    const response = await fetch(fullUrl, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // Get all gifts with optional filters
  async getGifts(filters = {}) {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });

    const queryString = params.toString();
    const url = `/api/gifts${queryString ? `?${queryString}` : ''}`;

    return this.request(url);
  }

  // Get a specific gift by ID
  async getGift(id) {
    return this.request(`/api/gifts/${id}`);
  }

  // Get all categories
  async getCategories() {
    return this.request('/api/categories');
  }

  // Track analytics events
  async trackEvent(eventData) {
    return this.request('/api/analytics/track', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/api/health');
  }

  // Fallback to local data if API is unavailable
  async getGiftsWithFallback(filters = {}) {
    try {
      return await this.getGifts(filters);
    } catch (error) {
      console.warn('API unavailable, using fallback data:', error.message);

      // Import and use sample data
      const { getSampleGifts } = await import('../data/sampleGifts');
      const data = getSampleGifts();

      // Apply client-side filtering if needed
      let filteredGifts = data.gifts || [];

      if (filters.category) {
        filteredGifts = filteredGifts.filter(gift =>
          gift.category === filters.category
        );
      }

      if (filters.maxPrice) {
        filteredGifts = filteredGifts.filter(gift =>
          gift.price <= filters.maxPrice
        );
      }

      if (filters.minSuccessRate) {
        filteredGifts = filteredGifts.filter(gift =>
          (gift.successRate || 0) >= filters.minSuccessRate
        );
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredGifts = filteredGifts.filter(gift =>
          (gift.name || gift.title || '').toLowerCase().includes(searchTerm) ||
          (gift.category || '').toLowerCase().includes(searchTerm) ||
          (gift.description || '').toLowerCase().includes(searchTerm)
        );
      }

      return {
        gifts: filteredGifts,
        total: filteredGifts.length,
        page: 1,
        totalPages: 1
      };
    }
  }
}

// Create a singleton instance
const apiService = new ApiService();

// Export individual functions for easier use
export const getGifts = (filters) => apiService.getGiftsWithFallback(filters);
export const getGift = (id) => apiService.getGift(id);
export const getCategories = () => apiService.getCategories();
export const trackEvent = (eventData) => apiService.trackEvent(eventData);
export const healthCheck = () => apiService.healthCheck();

// Export the service instance as well
export default apiService;