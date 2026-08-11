/**
 * High-performance In-Memory Query Cache Utility
 * Provides sub-millisecond data retrieval for frequently accessed GET APIs.
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class InMemoryCache {
  private cache = new Map<string, CacheEntry<any>>();

  /**
   * Set a cached key with a Time-To-Live (TTL) in milliseconds
   */
  set<T>(key: string, data: T, ttlMs: number = 60000): void {
    const expiresAt = Date.now() + ttlMs;
    this.cache.set(key, { data, expiresAt });
  }

  /**
   * Get cached data if present and not expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Invalidate specific keys or keys matching a prefix pattern
   */
  invalidatePattern(prefix: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear entire cache store
   */
  flush(): void {
    this.cache.clear();
  }
}

export const queryCache = new InMemoryCache();
