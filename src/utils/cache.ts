/**
 * Redis-based cache for API responses using Upstash
 */
import { Redis } from "@upstash/redis";

// Default cache TTL: 10 minutes (in milliseconds)
const DEFAULT_TTL = 10 * 60 * 1000;

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

// Cache item structure for storing metadata
interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

/**
 * Get an item from the cache
 * @param key - Cache key
 * @returns The cached data or null if not found/expired
 */
export async function getCachedData<T>(key: string): Promise<T | null> {
  try {
    // Get data from Redis
    const item = await redis.get<CacheItem<T>>(key);

    // No cache hit
    if (!item) {
      return null;
    }

    // Check if expired (we keep this check as a safeguard, though Redis handles expiry)
    if (Date.now() > item.expiresAt) {
      await redis.del(key); // Clean up expired item
      return null;
    }

    return item.data;
  } catch (error) {
    console.error("Redis cache error (getCachedData):", error);
    return null; // Fallback gracefully on Redis errors
  }
}

/**
 * Set an item in the cache
 * @param key - Cache key
 * @param data - Data to cache
 * @param ttl - Time to live in milliseconds (defaults to 10 minutes)
 */
export async function setCachedData<T>(
  key: string,
  data: T,
  ttl: number = DEFAULT_TTL
): Promise<void> {
  try {
    const now = Date.now();

    // Store data with metadata
    const item: CacheItem<T> = {
      data,
      timestamp: now,
      expiresAt: now + ttl,
    };

    // Store in Redis with expiration
    await redis.set(key, item, {
      ex: Math.ceil(ttl / 1000), // Convert ms to seconds for Redis expiration
    });
  } catch (error) {
    console.error("Redis cache error (setCachedData):", error);
    // Fallback gracefully on Redis errors
  }
}

/**
 * Clear an item from the cache
 * @param key - Cache key
 */
export async function clearCache(key: string): Promise<void> {
  try {
    await redis.del(key);
  } catch (error) {
    console.error("Redis cache error (clearCache):", error);
  }
}

/**
 * Clear all expired items from the cache
 * Note: Redis handles expiration automatically, so this is mostly a no-op
 */
export async function clearExpiredCache(): Promise<void> {
  // Redis handles expiration automatically
  // This method is kept for API compatibility
  return;
}

/**
 * Get cache stats (for debugging)
 * @returns Object with cache statistics (approximation)
 */
export async function getCacheStats() {
  try {
    // Get all keys matching our pattern (simplified)
    const keys = await redis.keys("strava_*");

    return {
      totalItems: keys.length,
      activeItems: keys.length, // With Redis, we don't track expired items separately
      expiredItems: 0, // Redis automatically removes expired items
    };
  } catch (error) {
    console.error("Redis cache error (getCacheStats):", error);
    return {
      totalItems: 0,
      activeItems: 0,
      expiredItems: 0,
      error: true,
    };
  }
}

/**
 * Helper function to cache API requests
 * @param cacheKey - Key to store the data under
 * @param fetchFn - Async function to fetch the data if not cached
 * @param ttl - Cache TTL in milliseconds
 * @returns The cached or freshly fetched data
 */
export async function cachedFetch<T>(
  cacheKey: string,
  fetchFn: () => Promise<T>,
  ttl: number = DEFAULT_TTL
): Promise<T> {
  try {
    // Try to get from cache first
    const cachedData = await getCachedData<T>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // Not in cache or expired, fetch fresh data
    const freshData = await fetchFn();

    // Store in cache
    await setCachedData(cacheKey, freshData, ttl);

    return freshData;
  } catch (error) {
    console.error("Redis caching error:", error);
    // If Redis fails, fall back to directly fetching the data
    return fetchFn();
  }
}
