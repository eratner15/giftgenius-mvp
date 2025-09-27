// Offline Data Synchronization System
// Using native IndexedDB API for better compatibility

// Database configuration
const DB_NAME = 'GiftGeniusOffline';
const DB_VERSION = 1;
const STORES = {
  searchQueries: 'searchQueries',
  userPreferences: 'userPreferences',
  favoriteGifts: 'favoriteGifts',
  analytics: 'analytics',
  comparisonData: 'comparisonData',
  wizardData: 'wizardData',
  cachedGifts: 'cachedGifts'
};

// Initialize IndexedDB
let dbPromise = null;

const initDB = async () => {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        // Search queries store
        if (!db.objectStoreNames.contains(STORES.searchQueries)) {
          const searchStore = db.createObjectStore(STORES.searchQueries, {
            keyPath: 'id',
            autoIncrement: true
          });
          searchStore.createIndex('timestamp', 'timestamp');
          searchStore.createIndex('synced', 'synced');
        }

        // User preferences store
        if (!db.objectStoreNames.contains(STORES.userPreferences)) {
          const prefStore = db.createObjectStore(STORES.userPreferences, {
            keyPath: 'id'
          });
          prefStore.createIndex('timestamp', 'timestamp');
        }

        // Favorite gifts store
        if (!db.objectStoreNames.contains(STORES.favoriteGifts)) {
          const favStore = db.createObjectStore(STORES.favoriteGifts, {
            keyPath: 'giftId'
          });
          favStore.createIndex('timestamp', 'timestamp');
          favStore.createIndex('synced', 'synced');
        }

        // Analytics events store
        if (!db.objectStoreNames.contains(STORES.analytics)) {
          const analyticsStore = db.createObjectStore(STORES.analytics, {
            keyPath: 'id',
            autoIncrement: true
          });
          analyticsStore.createIndex('timestamp', 'timestamp');
          analyticsStore.createIndex('synced', 'synced');
          analyticsStore.createIndex('eventType', 'eventType');
        }

        // Comparison data store
        if (!db.objectStoreNames.contains(STORES.comparisonData)) {
          const compStore = db.createObjectStore(STORES.comparisonData, {
            keyPath: 'id',
            autoIncrement: true
          });
          compStore.createIndex('timestamp', 'timestamp');
        }

        // Wizard data store
        if (!db.objectStoreNames.contains(STORES.wizardData)) {
          const wizardStore = db.createObjectStore(STORES.wizardData, {
            keyPath: 'sessionId'
          });
          wizardStore.createIndex('timestamp', 'timestamp');
          wizardStore.createIndex('completed', 'completed');
        }

        // Cached gifts store
        if (!db.objectStoreNames.contains(STORES.cachedGifts)) {
          const cacheStore = db.createObjectStore(STORES.cachedGifts, {
            keyPath: 'id'
          });
          cacheStore.createIndex('timestamp', 'timestamp');
          cacheStore.createIndex('category', 'category');
        }
      };
    });
  }
  return dbPromise;
};

// Offline Data Manager Class
export class OfflineDataManager {
  constructor() {
    this.db = null;
    this.isOnline = navigator.onLine;
    this.syncQueue = [];
    this.issyncing = false;

    this.init();
    this.setupEventListeners();
  }

  async init() {
    try {
      this.db = await initDB();
      console.log('Offline database initialized');

      // Attempt initial sync if online
      if (this.isOnline) {
        this.syncAll();
      }
    } catch (error) {
      console.error('Failed to initialize offline database:', error);
    }
  }

  setupEventListeners() {
    // Network status listeners
    window.addEventListener('online', () => {
      console.log('Device back online - starting sync');
      this.isOnline = true;
      this.syncAll();
    });

    window.addEventListener('offline', () => {
      console.log('Device offline - data will be queued');
      this.isOnline = false;
    });

    // Visibility change listener for background sync
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.isOnline) {
        this.syncAll();
      }
    });
  }

  // Save search query offline
  async saveSearchQuery(query, filters = {}) {
    if (!this.db) await this.init();

    const searchData = {
      query,
      filters,
      timestamp: Date.now(),
      synced: false,
      userId: this.getUserId()
    };

    try {
      const transaction = this.db.transaction([STORES.searchQueries], 'readwrite');
      const store = transaction.objectStore(STORES.searchQueries);
      await store.add(searchData);
      console.log('Search query saved offline');

      // Try to sync immediately if online
      if (this.isOnline) {
        this.syncSearchQueries();
      }

      return searchData;
    } catch (error) {
      console.error('Failed to save search query offline:', error);
      throw error;
    }
  }

  // Save user preferences offline
  async saveUserPreferences(preferences) {
    if (!this.db) await this.init();

    const prefData = {
      id: 'user_preferences',
      preferences,
      timestamp: Date.now(),
      userId: this.getUserId()
    };

    try {
      await this.db.put(STORES.userPreferences, prefData);
      console.log('User preferences saved offline');

      if (this.isOnline) {
        this.syncUserPreferences();
      }

      return prefData;
    } catch (error) {
      console.error('Failed to save user preferences offline:', error);
      throw error;
    }
  }

  // Save favorite gift offline
  async saveFavoriteGift(giftId, giftData) {
    if (!this.db) await this.init();

    const favoriteData = {
      giftId,
      giftData,
      timestamp: Date.now(),
      synced: false,
      userId: this.getUserId()
    };

    try {
      await this.db.put(STORES.favoriteGifts, favoriteData);
      console.log('Favorite gift saved offline');

      if (this.isOnline) {
        this.syncFavoriteGifts();
      }

      return favoriteData;
    } catch (error) {
      console.error('Failed to save favorite gift offline:', error);
      throw error;
    }
  }

  // Track analytics event offline
  async trackAnalyticsEvent(eventType, eventData) {
    if (!this.db) await this.init();

    const analyticsData = {
      eventType,
      eventData,
      timestamp: Date.now(),
      synced: false,
      userId: this.getUserId(),
      sessionId: this.getSessionId(),
      url: window.location.pathname,
      userAgent: navigator.userAgent
    };

    try {
      await this.db.add(STORES.analytics, analyticsData);
      console.log('Analytics event saved offline');

      if (this.isOnline) {
        this.syncAnalytics();
      }

      return analyticsData;
    } catch (error) {
      console.error('Failed to save analytics event offline:', error);
      throw error;
    }
  }

  // Save wizard session data
  async saveWizardData(sessionId, stepData, isComplete = false) {
    if (!this.db) await this.init();

    const wizardData = {
      sessionId,
      stepData,
      completed: isComplete,
      timestamp: Date.now(),
      userId: this.getUserId()
    };

    try {
      await this.db.put(STORES.wizardData, wizardData);
      console.log('Wizard data saved offline');

      return wizardData;
    } catch (error) {
      console.error('Failed to save wizard data offline:', error);
      throw error;
    }
  }

  // Cache gift data for offline viewing
  async cacheGiftData(gifts) {
    if (!this.db) await this.init();

    const transaction = this.db.transaction(STORES.cachedGifts, 'readwrite');
    const store = transaction.objectStore(STORES.cachedGifts);

    try {
      const promises = gifts.map(gift => {
        const cacheData = {
          id: gift.id,
          ...gift,
          cachedAt: Date.now()
        };
        return store.put(cacheData);
      });

      await Promise.all(promises);
      console.log(`${gifts.length} gifts cached offline`);
    } catch (error) {
      console.error('Failed to cache gift data:', error);
      throw error;
    }
  }

  // Get cached gifts for offline viewing
  async getCachedGifts(limit = 50) {
    if (!this.db) await this.init();

    try {
      const transaction = this.db.transaction(STORES.cachedGifts, 'readonly');
      const store = transaction.objectStore(STORES.cachedGifts);
      const index = store.index('timestamp');

      const gifts = await index.getAll();
      return gifts
        .sort((a, b) => b.cachedAt - a.cachedAt)
        .slice(0, limit);
    } catch (error) {
      console.error('Failed to get cached gifts:', error);
      return [];
    }
  }

  // Sync all data when coming back online
  async syncAll() {
    if (this.isSyncing || !this.isOnline) return;

    this.isSyncing = true;
    console.log('Starting comprehensive sync...');

    try {
      await Promise.all([
        this.syncSearchQueries(),
        this.syncUserPreferences(),
        this.syncFavoriteGifts(),
        this.syncAnalytics()
      ]);
      console.log('All data synced successfully');
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      this.isSyncing = false;
    }
  }

  // Sync search queries
  async syncSearchQueries() {
    if (!this.db) return;

    try {
      const transaction = this.db.transaction(STORES.searchQueries, 'readonly');
      const store = transaction.objectStore(STORES.searchQueries);
      const index = store.index('synced');
      const unsyncedQueries = await index.getAll(false);

      for (const query of unsyncedQueries) {
        try {
          await this.sendToServer('/api/search/track', query);
          await this.markAsSynced(STORES.searchQueries, query.id);
        } catch (error) {
          console.error('Failed to sync search query:', error);
        }
      }

      console.log(`${unsyncedQueries.length} search queries synced`);
    } catch (error) {
      console.error('Search queries sync failed:', error);
    }
  }

  // Sync user preferences
  async syncUserPreferences() {
    if (!this.db) return;

    try {
      const prefs = await this.db.get(STORES.userPreferences, 'user_preferences');
      if (prefs) {
        await this.sendToServer('/api/user/preferences', prefs);
        console.log('User preferences synced');
      }
    } catch (error) {
      console.error('User preferences sync failed:', error);
    }
  }

  // Sync favorite gifts
  async syncFavoriteGifts() {
    if (!this.db) return;

    try {
      const transaction = this.db.transaction(STORES.favoriteGifts, 'readonly');
      const store = transaction.objectStore(STORES.favoriteGifts);
      const index = store.index('synced');
      const unsyncedFavorites = await index.getAll(false);

      for (const favorite of unsyncedFavorites) {
        try {
          await this.sendToServer('/api/favorites', favorite);
          await this.markAsSynced(STORES.favoriteGifts, favorite.giftId);
        } catch (error) {
          console.error('Failed to sync favorite gift:', error);
        }
      }

      console.log(`${unsyncedFavorites.length} favorite gifts synced`);
    } catch (error) {
      console.error('Favorite gifts sync failed:', error);
    }
  }

  // Sync analytics events
  async syncAnalytics() {
    if (!this.db) return;

    try {
      const transaction = this.db.transaction(STORES.analytics, 'readonly');
      const store = transaction.objectStore(STORES.analytics);
      const index = store.index('synced');
      const unsyncedEvents = await index.getAll(false);

      // Batch analytics events for efficiency
      const batchSize = 10;
      for (let i = 0; i < unsyncedEvents.length; i += batchSize) {
        const batch = unsyncedEvents.slice(i, i + batchSize);

        try {
          await this.sendToServer('/api/analytics/batch', { events: batch });

          // Mark all events in batch as synced
          for (const event of batch) {
            await this.markAsSynced(STORES.analytics, event.id);
          }
        } catch (error) {
          console.error('Failed to sync analytics batch:', error);
        }
      }

      console.log(`${unsyncedEvents.length} analytics events synced`);
    } catch (error) {
      console.error('Analytics sync failed:', error);
    }
  }

  // Mark item as synced
  async markAsSynced(storeName, id) {
    if (!this.db) return;

    try {
      const transaction = this.db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const item = await store.get(id);

      if (item) {
        item.synced = true;
        item.syncedAt = Date.now();
        await store.put(item);
      }
    } catch (error) {
      console.error('Failed to mark as synced:', error);
    }
  }

  // Send data to server
  async sendToServer(endpoint, data) {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    return response.json();
  }

  // Get storage info
  async getStorageInfo() {
    if (!this.db) await this.init();

    const info = {};

    try {
      for (const storeName of Object.values(STORES)) {
        const transaction = this.db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const count = await store.count();
        info[storeName] = { count };

        if (storeName === STORES.analytics) {
          const unsyncedIndex = store.index('synced');
          const unsyncedCount = await unsyncedIndex.count(false);
          info[storeName].unsynced = unsyncedCount;
        }
      }

      // Estimate storage usage
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        info.storage = {
          used: estimate.usage,
          quota: estimate.quota,
          percentage: Math.round((estimate.usage / estimate.quota) * 100)
        };
      }

      return info;
    } catch (error) {
      console.error('Failed to get storage info:', error);
      return {};
    }
  }

  // Clear old data to free up space
  async cleanupOldData(maxAge = 30 * 24 * 60 * 60 * 1000) { // 30 days
    if (!this.db) return;

    const cutoffTime = Date.now() - maxAge;

    try {
      for (const storeName of Object.values(STORES)) {
        const transaction = this.db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);

        if (store.indexNames.contains('timestamp')) {
          const index = store.index('timestamp');
          let cursor = await index.openCursor(IDBKeyRange.upperBound(cutoffTime));

          let deletedCount = 0;
          while (cursor) {
            if (cursor.value.synced || storeName === STORES.cachedGifts) {
              await cursor.delete();
              deletedCount++;
            }
            cursor = await cursor.continue();
          }

          if (deletedCount > 0) {
            console.log(`Cleaned up ${deletedCount} old records from ${storeName}`);
          }
        }
      }
    } catch (error) {
      console.error('Cleanup failed:', error);
    }
  }

  // Utility methods
  getUserId() {
    return localStorage.getItem('giftgenius_user_id') || 'anonymous';
  }

  getSessionId() {
    if (!sessionStorage.getItem('giftgenius_session_id')) {
      sessionStorage.setItem('giftgenius_session_id',
        Date.now().toString() + Math.random().toString(36).substr(2, 9)
      );
    }
    return sessionStorage.getItem('giftgenius_session_id');
  }

  // Check if device is online
  isDeviceOnline() {
    return this.isOnline;
  }

  // Get sync status
  getSyncStatus() {
    return {
      isOnline: this.isOnline,
      isSyncing: this.isSyncing,
      lastSyncAttempt: this.lastSyncAttempt,
      pendingSync: this.syncQueue.length
    };
  }
}

// Create singleton instance
export const offlineManager = new OfflineDataManager();

// Convenience functions for common operations
export const saveOffline = {
  search: (query, filters) => offlineManager.saveSearchQuery(query, filters),
  preferences: (prefs) => offlineManager.saveUserPreferences(prefs),
  favorite: (giftId, giftData) => offlineManager.saveFavoriteGift(giftId, giftData),
  analytics: (eventType, data) => offlineManager.trackAnalyticsEvent(eventType, data),
  wizard: (sessionId, data, complete) => offlineManager.saveWizardData(sessionId, data, complete),
  cache: (gifts) => offlineManager.cacheGiftData(gifts)
};

export const getOffline = {
  gifts: (limit) => offlineManager.getCachedGifts(limit),
  storageInfo: () => offlineManager.getStorageInfo(),
  syncStatus: () => offlineManager.getSyncStatus()
};

export const syncOffline = {
  all: () => offlineManager.syncAll(),
  cleanup: (maxAge) => offlineManager.cleanupOldData(maxAge)
};

export default offlineManager;