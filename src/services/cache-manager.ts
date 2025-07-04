import { LRUCache } from 'lru-cache';
import crypto from 'crypto';

export interface CacheOptions {
  ttl?: number;
  maxSize?: number;
}

export class CacheManager {
  private cache: LRUCache<string, any>;
  
  constructor(options: CacheOptions = {}) {
    this.cache = new LRUCache({
      max: options.maxSize || 100 * 1024 * 1024, // 100MB default
      ttl: (options.ttl || 3600) * 1000, // Convert to milliseconds
      sizeCalculation: (value) => {
        return JSON.stringify(value).length;
      },
      updateAgeOnGet: true,
      updateAgeOnHas: false,
    });
  }

  generateKey(operation: string, params: any): string {
    const hash = crypto.createHash('sha256');
    hash.update(`${operation}:${JSON.stringify(params)}`);
    return hash.digest('hex');
  }

  async get<T>(key: string): Promise<T | undefined> {
    return this.cache.get(key) as T | undefined;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const options = ttl ? { ttl: ttl * 1000 } : undefined;
    this.cache.set(key, value, options);
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }

  async has(key: string): Promise<boolean> {
    return this.cache.has(key);
  }

  // Wrap an async function with caching
  async withCache<T>(
    key: string,
    fn: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== undefined) {
      return cached;
    }

    const result = await fn();
    await this.set(key, result, ttl);
    return result;
  }

  // Get cache statistics
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.cache.max,
      calculatedSize: this.cache.calculatedSize,
      hits: this.cache.hits,
      misses: this.cache.misses,
      hitRate: this.cache.hits / (this.cache.hits + this.cache.misses) || 0,
    };
  }
}

// Singleton instance
let cacheInstance: CacheManager | null = null;

export function getCacheManager(options?: CacheOptions): CacheManager {
  if (!cacheInstance) {
    cacheInstance = new CacheManager(options);
  }
  return cacheInstance;
}
