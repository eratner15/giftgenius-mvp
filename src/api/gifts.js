// API Service Layer for GiftGenius (Using Local Data)
import { enhancedGifts } from '../data/enhanced-gifts';

class ApiService {
  async mockGiftsAPI(url, options = {}) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Parse query parameters
    const urlObj = new URL(url, 'http://localhost');
    const params = urlObj.searchParams;

    let gifts = [...enhancedGifts];

    // Apply filters
    if (params.get('category')) {
      gifts = gifts.filter(gift => gift.category === params.get('category'));
    }

    if (params.get('minPrice')) {
      const minPrice = parseFloat(params.get('minPrice'));
      gifts = gifts.filter(gift => gift.price >= minPrice);
    }

    if (params.get('maxPrice')) {
      const maxPrice = parseFloat(params.get('maxPrice'));
      gifts = gifts.filter(gift => gift.price <= maxPrice);
    }

    if (params.get('search')) {
      const searchTerm = params.get('search').toLowerCase();
      gifts = gifts.filter(gift =>
        gift.title.toLowerCase().includes(searchTerm) ||
        gift.description.toLowerCase().includes(searchTerm)
      );
    }

    // Sort by success rate
    gifts.sort((a, b) => b.success_rate - a.success_rate);

    const limit = parseInt(params.get('limit')) || 50;
    const offset = parseInt(params.get('offset')) || 0;
    const paginatedGifts = gifts.slice(offset, offset + limit);

    return {
      gifts: paginatedGifts,
      pagination: {
        total: gifts.length,
        count: paginatedGifts.length,
        limit,
        offset,
        has_more: offset + paginatedGifts.length < gifts.length
      },
      processing_time_ms: 50
    };
  }

  async request(url, options = {}) {
    // Mock API using local data instead of external requests
    if (url.includes('/api/gifts')) {
      return this.mockGiftsAPI(url, options);
    }

    // For other requests, simulate network delay and return mock data
    await new Promise(resolve => setTimeout(resolve, 100));
    return { success: true, data: [] };
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
    return await this.getGifts(filters);
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