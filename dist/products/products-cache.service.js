"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ProductsCacheService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsCacheService = void 0;
const common_1 = require("@nestjs/common");
let ProductsCacheService = ProductsCacheService_1 = class ProductsCacheService {
    constructor() {
        this.logger = new common_1.Logger(ProductsCacheService_1.name);
        this.cache = new Map();
        this.DEFAULT_TTL = 5 * 60 * 1000;
    }
    get(key) {
        const cached = this.cache.get(key);
        if (!cached) {
            return null;
        }
        if (Date.now() - cached.timestamp > cached.ttl) {
            this.cache.delete(key);
            this.logger.debug(`Cache expired for key: ${key}`);
            return null;
        }
        this.logger.debug(`Cache hit for key: ${key}`);
        return cached.data;
    }
    set(key, data, ttl = this.DEFAULT_TTL) {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl
        });
        this.logger.debug(`Cache set for key: ${key}, TTL: ${ttl}ms`);
    }
    generateProductsKey(clientId) {
        return `products:${clientId || 'all'}`;
    }
    generateStockKey(productId) {
        return `stock:${productId}`;
    }
    clearPattern(pattern) {
        const keysToDelete = Array.from(this.cache.keys()).filter(key => key.includes(pattern));
        keysToDelete.forEach(key => {
            this.cache.delete(key);
        });
        this.logger.debug(`Cleared ${keysToDelete.length} cache entries matching pattern: ${pattern}`);
    }
    clearAll() {
        this.cache.clear();
        this.logger.debug('All cache cleared');
    }
    getStats() {
        const now = Date.now();
        let validEntries = 0;
        let expiredEntries = 0;
        for (const [key, cached] of this.cache.entries()) {
            if (now - cached.timestamp > cached.ttl) {
                expiredEntries++;
            }
            else {
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
    estimateMemoryUsage() {
        const size = JSON.stringify(Array.from(this.cache.entries())).length;
        const kb = Math.round(size / 1024);
        return `${kb} KB`;
    }
};
exports.ProductsCacheService = ProductsCacheService;
exports.ProductsCacheService = ProductsCacheService = ProductsCacheService_1 = __decorate([
    (0, common_1.Injectable)()
], ProductsCacheService);
//# sourceMappingURL=products-cache.service.js.map