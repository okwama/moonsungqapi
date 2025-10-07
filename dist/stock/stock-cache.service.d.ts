import { Repository } from 'typeorm';
import { ClientStock } from '../entities/client-stock.entity';
export declare class StockCacheService {
    private clientStockRepository;
    private readonly logger;
    private _stockCache;
    private _lastCacheTime;
    private readonly _cacheDuration;
    constructor(clientStockRepository: Repository<ClientStock>);
    getCurrentStock(clientId: number, productId: number): Promise<number>;
    getBatchStock(clientId: number, productIds: number[]): Promise<Map<number, number>>;
    updateStockInCache(clientId: number, productId: number, newQuantity: number): void;
    invalidateStock(clientId: number, productId: number): void;
    invalidateClientStock(clientId: number): void;
    clearAllStockCache(): void;
    getCacheStats(): {
        totalEntries: number;
        clientCount: number;
        oldestEntry?: Date;
    };
}
