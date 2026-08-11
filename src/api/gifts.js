// API Service Layer for GiftGenius (Using Massive Gift Database)
import { massiveGiftDatabase } from '../data/massive-gift-database';

// Amazon Associates Configuration
const AMAZON_ASSOCIATE_TAG = 'giftgenius-20'; // TODO: Replace with your actual Amazon Associate ID
const AMAZON_BASE_URL = 'https://www.amazon.com/dp/';

class ApiService {
  async mockGiftsAPI(url, options = {}) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Parse query parameters
    const urlObj = new URL(url, 'http://localhost');
    const params = urlObj.searchParams;

    let gifts = [...massiveGiftDatabase];

    // Add affiliate links to each gift
    gifts = gifts.map(gift => ({
      ...gift,
      affiliate_link: this.generateAffiliateLink(gift),
      buy_now_link: this.generateBuyNowLink(gift)
    }));

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

  // Generate affiliate link based on network
  generateAffiliateLink(gift) {
    const affiliateIds = {
      amazon: AMAZON_ASSOCIATE_TAG,
      etsy: 'giftgenius-etsy',
      nordstrom: 'giftgenius',
      sephora: 'giftgenius',
      williams_sonoma: 'giftgenius'
    };

    const network = gift.affiliate_network || 'amazon';
    const tag = affiliateIds[network] || affiliateIds.amazon;

    // Direct product URL if available
    if (gift.product_url) {
      const sep = gift.product_url.includes('?') ? '&' : '?';
      return `${gift.product_url}${sep}ref=${tag}`;
    }

    // Amazon ASIN link
    if (network === 'amazon' && gift.asin) {
      return `${AMAZON_BASE_URL}${gift.asin}?tag=${tag}`;
    }

    // Better search query: include category + brand when available
    const parts = [gift.title];
    if (gift.category && !gift.title.toLowerCase().includes(gift.category)) {
      parts.push(gift.category);
    }
    const searchQuery = encodeURIComponent(parts.join(' '));
    return `https://www.amazon.com/s?k=${searchQuery}&tag=${tag}`;
  }

  // Generate "Buy Now" CTA link
  generateBuyNowLink(gift) {
    return this.generateAffiliateLink(gift);
  }

  // Track affiliate click (for analytics)
  async trackAffiliateClick(giftId, network) {
    // In production, send to analytics service
    console.log(`Affiliate click tracked: Gift ${giftId} on ${network}`);

    // Track with Google Analytics if available
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'affiliate_click', {
        gift_id: giftId,
        affiliate_network: network,
        event_category: 'ecommerce',
        event_label: 'affiliate_conversion'
      });
    }

    return { success: true };
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