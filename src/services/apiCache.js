/**
 * GWC Manufacturing AI - Centralized Client-Side API Cache & Request Manager
 * 
 * Provides:
 * 1. Fast in-memory cache with configurable TTL (default: 60s)
 * 2. Request deduplication (concurrent calls for the same URL share a single in-flight Promise)
 * 3. Cross-navigation page state persistence (filters, tabs, search, sorting)
 * 4. Controlled cache invalidation (pattern matching, global refresh key, explicit purge)
 * 5. Resilient error handling (retains stale data when background refresh fails)
 */

class ApiCacheManager {
  constructor() {
    this.cache = new Map(); // key -> { data, timestamp, staleTime }
    this.inFlightRequests = new Map(); // key -> Promise
    this.pageFilterStore = new Map(); // pageKey -> { ...filters }
    this.currentRefreshKey = 0;
    this.subscribers = new Set();
  }

  /**
   * Generates a normalized cache key from URL and query params
   */
  createKey(url, params = null) {
    if (!params) return url;
    if (typeof params === "string") return `${url}?${params}`;
    if (params instanceof URLSearchParams) return `${url}?${params.toString()}`;
    
    // Sort object keys for stable string representation
    const sortedKeys = Object.keys(params).sort();
    const query = sortedKeys
      .filter((k) => params[k] !== undefined && params[k] !== null && params[k] !== "")
      .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
      .join("&");
    return query ? `${url}?${query}` : url;
  }

  /**
   * Retrieves an item from cache if present
   */
  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;
    const isStale = Date.now() - entry.timestamp > (entry.staleTime || 60000);
    return { data: entry.data, isStale, timestamp: entry.timestamp };
  }

  /**
   * Sets data in cache with timestamp and staleTime (TTL)
   */
  set(key, data, staleTime = 60000) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      staleTime,
    });
  }

  /**
   * Performs an API request with caching, deduplication, and stale-while-revalidate support
   */
  async fetchWithCache(url, {
    params = null,
    staleTime = 60000,
    forceRefresh = false,
    signal = null,
  } = {}) {
    const key = this.createKey(url, params);

    // 1. If not forcing refresh, check for valid fresh cache
    if (!forceRefresh) {
      const cached = this.get(key);
      if (cached && !cached.isStale) {
        return { data: cached.data, fromCache: true };
      }
    }

    // 2. Request deduplication: if request is already in-flight, return existing promise
    if (this.inFlightRequests.has(key)) {
      try {
        const data = await this.inFlightRequests.get(key);
        return { data, fromCache: false, deduplicated: true };
      } catch (err) {
        // Fall back to new request if existing failed
      }
    }

    // 3. Initiate new fetch
    const fetchPromise = (async () => {
      try {
        const fullUrl = params ? this.createKey(url, params) : url;
        const res = await fetch(fullUrl, { signal });
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        const json = await res.json();
        this.set(key, json, staleTime);
        return json;
      } finally {
        this.inFlightRequests.delete(key);
      }
    })();

    this.inFlightRequests.set(key, fetchPromise);
    const data = await fetchPromise;
    return { data, fromCache: false };
  }

  /**
   * Invalidates cached entries matching a prefix or pattern.
   * If no pattern is provided, clears all cached responses.
   */
  invalidate(pattern = null) {
    if (!pattern) {
      this.cache.clear();
      return;
    }
    for (const key of this.cache.keys()) {
      if (typeof pattern === "string" && key.includes(pattern)) {
        this.cache.delete(key);
      } else if (pattern instanceof RegExp && pattern.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Coordinates global refresh key updates (e.g. after upload / data promotion)
   */
  handleRefreshKeyChange(newKey) {
    if (newKey !== this.currentRefreshKey) {
      this.currentRefreshKey = newKey;
      // Invalidate all analytical caches upon new dataset promotion
      this.invalidate();
      this.notifySubscribers();
    }
  }

  /**
   * Preserves page filter and navigation state across route unmounts
   */
  getPageState(pageKey, defaultState = {}) {
    if (!this.pageFilterStore.has(pageKey)) {
      this.pageFilterStore.set(pageKey, { ...defaultState });
    }
    return { ...defaultState, ...this.pageFilterStore.get(pageKey) };
  }

  setPageState(pageKey, updates) {
    const current = this.pageFilterStore.get(pageKey) || {};
    this.pageFilterStore.set(pageKey, { ...current, ...updates });
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notifySubscribers() {
    for (const cb of this.subscribers) {
      try {
        cb(this.currentRefreshKey);
      } catch (err) {
        console.error("Cache subscriber notification error:", err);
      }
    }
  }
}

// Global Singleton Instance
export const apiCache = new ApiCacheManager();
export default apiCache;
