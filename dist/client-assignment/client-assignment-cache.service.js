"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientAssignmentCacheService = void 0;
const common_1 = require("@nestjs/common");
let ClientAssignmentCacheService = class ClientAssignmentCacheService {
    constructor() {
        this.cache = new Map();
        this.TTL = 5 * 60 * 1000;
    }
    async getOrSet(key, fn, ttl = this.TTL) {
        const now = Date.now();
        const cached = this.cache.get(key);
        if (cached && cached.expiry > now) {
            console.log(`⚡ Cache HIT for key: ${key}`);
            return cached.data;
        }
        console.log(`🔄 Cache MISS for key: ${key} - fetching from DB`);
        const data = await fn();
        this.cache.set(key, {
            data,
            expiry: now + ttl,
        });
        this.scheduleCleanup();
        return data;
    }
    invalidate(keyOrPattern) {
        if (keyOrPattern.includes('*')) {
            const pattern = keyOrPattern.replace(/\*/g, '.*');
            const regex = new RegExp(pattern);
            for (const key of this.cache.keys()) {
                if (regex.test(key)) {
                    this.cache.delete(key);
                }
            }
            console.log(`🗑️ Invalidated cache entries matching: ${keyOrPattern}`);
        }
        else {
            this.cache.delete(keyOrPattern);
            console.log(`🗑️ Invalidated cache key: ${keyOrPattern}`);
        }
    }
    clearAll() {
        this.cache.clear();
        console.log('🗑️ All cache cleared');
    }
    getStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys()),
        };
    }
    scheduleCleanup() {
        if (this.cache.size > 1000) {
            this.cleanupExpired();
        }
    }
    cleanupExpired() {
        const now = Date.now();
        let cleaned = 0;
        for (const [key, value] of this.cache.entries()) {
            if (value.expiry <= now) {
                this.cache.delete(key);
                cleaned++;
            }
        }
        if (cleaned > 0) {
            console.log(`🧹 Cleaned ${cleaned} expired cache entries`);
        }
    }
};
exports.ClientAssignmentCacheService = ClientAssignmentCacheService;
exports.ClientAssignmentCacheService = ClientAssignmentCacheService = __decorate([
    (0, common_1.Injectable)()
], ClientAssignmentCacheService);
//# sourceMappingURL=client-assignment-cache.service.js.map