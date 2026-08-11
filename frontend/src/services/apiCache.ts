import { apiClient } from './api';

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

class ClientQueryCache {
  private cache = new Map<string, CacheItem<any>>();
  private defaultTTL = 120000; // 2 minutes in-memory TTL

  /**
   * Generates a unique key from URL and params
   */
  private getKey(url: string, params?: Record<string, any>): string {
    return `${url}_${JSON.stringify(params || {})}`;
  }

  /**
   * Get cached data if valid
   */
  get<T>(url: string, params?: Record<string, any>): T | null {
    const key = this.getKey(url, params);
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > this.defaultTTL) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  /**
   * Store data in client cache
   */
  set<T>(url: string, data: T, params?: Record<string, any>): void {
    const key = this.getKey(url, params);
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  /**
   * Invalidate matching keys (e.g. after mutations)
   */
  invalidate(urlPrefix: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(urlPrefix)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear all client cache
   */
  clear(): void {
    this.cache.clear();
  }
}

export const clientCache = new ClientQueryCache();

/**
 * Helper to fetch API data with instant client caching
 */
export async function getCachedData<T = any>(
  url: string,
  params?: Record<string, any>
): Promise<{ data: T; fromCache: boolean }> {
  const cached = clientCache.get<T>(url, params);
  if (cached !== null) {
    return { data: cached, fromCache: true };
  }

  const res = await apiClient.get(url, { params });
  if (res.data && res.data.success) {
    clientCache.set(url, res.data, params);
    return { data: res.data, fromCache: false };
  }

  return { data: res.data, fromCache: false };
}
