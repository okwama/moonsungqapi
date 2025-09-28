export declare class ProductsCacheService {
    private readonly logger;
    private cache;
    private readonly DEFAULT_TTL;
    get<T>(key: string): T | null;
    set<T>(key: string, data: T, ttl?: number): void;
    generateProductsKey(clientId?: number): string;
    generateStockKey(productId: number): string;
    clearPattern(pattern: string): void;
    clearAll(): void;
    getStats(): {
        totalEntries: number;
        validEntries: number;
        expiredEntries: number;
        memoryUsage: string;
    };
    private estimateMemoryUsage;
}
