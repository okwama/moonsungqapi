"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var StockCacheService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockCacheService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const client_stock_entity_1 = require("../entities/client-stock.entity");
let StockCacheService = StockCacheService_1 = class StockCacheService {
    constructor(clientStockRepository) {
        this.clientStockRepository = clientStockRepository;
        this.logger = new common_1.Logger(StockCacheService_1.name);
        this._stockCache = new Map();
        this._lastCacheTime = new Map();
        this._cacheDuration = 5 * 60 * 1000;
    }
    async getCurrentStock(clientId, productId) {
        const cacheKey = `${clientId}:${productId}`;
        const cachedQuantity = this._stockCache.get(cacheKey);
        const lastCacheTime = this._lastCacheTime.get(cacheKey);
        if (cachedQuantity !== undefined && lastCacheTime &&
            (Date.now() - lastCacheTime.getTime() < this._cacheDuration)) {
            this.logger.debug(`Using cached stock for client ${clientId}, product ${productId}: ${cachedQuantity}`);
            return cachedQuantity;
        }
        this.logger.debug(`Fetching fresh stock for client ${clientId}, product ${productId}`);
        const stockRecord = await this.clientStockRepository.findOne({
            where: { clientId, productId }
        });
        const currentStock = stockRecord ? stockRecord.quantity : 0;
        this._stockCache.set(cacheKey, currentStock);
        this._lastCacheTime.set(cacheKey, new Date());
        this.logger.debug(`Stock fetched and cached: client ${clientId}, product ${productId}: ${currentStock}`);
        return currentStock;
    }
    async getBatchStock(clientId, productIds) {
        const results = new Map();
        const uncachedProducts = [];
        for (const productId of productIds) {
            const cacheKey = `${clientId}:${productId}`;
            const cachedQuantity = this._stockCache.get(cacheKey);
            const lastCacheTime = this._lastCacheTime.get(cacheKey);
            if (cachedQuantity !== undefined && lastCacheTime &&
                (Date.now() - lastCacheTime.getTime() < this._cacheDuration)) {
                results.set(productId, cachedQuantity);
                this.logger.debug(`Using cached stock for client ${clientId}, product ${productId}: ${cachedQuantity}`);
            }
            else {
                uncachedProducts.push(productId);
            }
        }
        if (uncachedProducts.length > 0) {
            this.logger.debug(`Fetching fresh stock for ${uncachedProducts.length} products for client ${clientId}`);
            const stockRecords = await this.clientStockRepository.find({
                where: {
                    clientId,
                    productId: { $in: uncachedProducts }
                }
            });
            for (const productId of uncachedProducts) {
                const stockRecord = stockRecords.find(s => s.productId === productId);
                const currentStock = stockRecord ? stockRecord.quantity : 0;
                results.set(productId, currentStock);
                const cacheKey = `${clientId}:${productId}`;
                this._stockCache.set(cacheKey, currentStock);
                this._lastCacheTime.set(cacheKey, new Date());
            }
        }
        return results;
    }
    updateStockInCache(clientId, productId, newQuantity) {
        const cacheKey = `${clientId}:${productId}`;
        this._stockCache.set(cacheKey, newQuantity);
        this._lastCacheTime.set(cacheKey, new Date());
        this.logger.debug(`Stock cache updated: client ${clientId}, product ${productId}: ${newQuantity}`);
    }
    invalidateStock(clientId, productId) {
        const cacheKey = `${clientId}:${productId}`;
        this._stockCache.delete(cacheKey);
        this._lastCacheTime.delete(cacheKey);
        this.logger.debug(`Stock cache invalidated: client ${clientId}, product ${productId}`);
    }
    invalidateClientStock(clientId) {
        const keysToDelete = [];
        for (const key of this._stockCache.keys()) {
            if (key.startsWith(`${clientId}:`)) {
                keysToDelete.push(key);
            }
        }
        keysToDelete.forEach(key => {
            this._stockCache.delete(key);
            this._lastCacheTime.delete(key);
        });
        this.logger.debug(`Stock cache invalidated for client ${clientId}: ${keysToDelete.length} entries cleared`);
    }
    clearAllStockCache() {
        this._stockCache.clear();
        this._lastCacheTime.clear();
        this.logger.log('All stock cache cleared');
    }
    getCacheStats() {
        const totalEntries = this._stockCache.size;
        const clients = new Set();
        let oldestEntry;
        for (const key of this._stockCache.keys()) {
            const clientId = key.split(':')[0];
            clients.add(clientId);
        }
        for (const date of this._lastCacheTime.values()) {
            if (!oldestEntry || date < oldestEntry) {
                oldestEntry = date;
            }
        }
        return {
            totalEntries,
            clientCount: clients.size,
            oldestEntry
        };
    }
};
exports.StockCacheService = StockCacheService;
exports.StockCacheService = StockCacheService = StockCacheService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(client_stock_entity_1.ClientStock)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], StockCacheService);
//# sourceMappingURL=stock-cache.service.js.map