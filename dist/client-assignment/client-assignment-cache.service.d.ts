export declare class ClientAssignmentCacheService {
    private cache;
    private readonly TTL;
    getOrSet<T>(key: string, fn: () => Promise<T>, ttl?: number): Promise<T>;
    invalidate(keyOrPattern: string): void;
    clearAll(): void;
    getStats(): {
        size: number;
        keys: string[];
    };
    private scheduleCleanup;
    private cleanupExpired;
}
