import { Injectable, Logger } from '@nestjs/common';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsCacheService {
  private readonly logger = new Logger(ProductsCacheService.name);
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Get cached data
   */
  get<T>(key: string): T | null {
    const cached = this.cache.get(key);
    
    if (!cached) {
      return null;
    }

    // Check if cache is expired
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      this.logger.debug(`Cache expired for key: ${key}`);
      return null;
    }

    this.logger.debug(`Cache hit for key: ${key}`);
    return cached.data as T;
  }

  /**
   * Set cached data
   */
  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
    this.logger.debug(`Cache set for key: ${key}, TTL: ${ttl}ms`);
  }

  /**
   * Generate cache key for products
   */
  generateProductsKey(clientId?: number): string {
    return `products:${clientId || 'all'}`;
  }

  /**
   * Generate cache key for product stock
   */
  generateStockKey(productId: number): string {
    return `stock:${productId}`;
  }

  /**
   * Clear cache by pattern
   */
  clearPattern(pattern: string): void {
    const keysToDelete = Array.from(this.cache.keys()).filter(key => 
      key.includes(pattern)
    );
    
    keysToDelete.forEach(key => {
      this.cache.delete(key);
    });
    
    this.logger.debug(`Cleared ${keysToDelete.length} cache entries matching pattern: ${pattern}`);
  }

  /**
   * Clear all cache
   */
  clearAll(): void {
    this.cache.clear();
    this.logger.debug('All cache cleared');
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;

    for (const [key, cached] of this.cache.entries()) {
      if (now - cached.timestamp > cached.ttl) {
        expiredEntries++;
      } else {
        validEntries++;
      }
    }

    return {
      totalEntries: this.cache.size,
      validEntries,
      expiredEntries,
      memoryUsage: this.estimateMemoryUsage()
    };
  }

  /**
   * Estimate memory usage of cache
   */
  private estimateMemoryUsage(): string {
    const size = JSON.stringify(Array.from(this.cache.entries())).length;
    const kb = Math.round(size / 1024);
    return `${kb} KB`;
  }
}
