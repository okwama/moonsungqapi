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
var PerformanceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let PerformanceService = PerformanceService_1 = class PerformanceService {
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.logger = new common_1.Logger(PerformanceService_1.name);
        this.performanceMetrics = new Map();
    }
    trackApiCall(endpoint, duration, success = true) {
        const metric = {
            endpoint,
            duration,
            success,
            timestamp: new Date().toISOString(),
        };
        if (!this.performanceMetrics.has(endpoint)) {
            this.performanceMetrics.set(endpoint, []);
        }
        const metrics = this.performanceMetrics.get(endpoint);
        metrics.push(metric);
        if (metrics.length > 100) {
            metrics.splice(0, metrics.length - 100);
        }
        if (duration > 1000) {
            this.logger.warn(`🐌 Slow API call: ${endpoint} took ${duration}ms`);
        }
    }
    getEndpointStats(endpoint) {
        const metrics = this.performanceMetrics.get(endpoint) || [];
        if (metrics.length === 0) {
            return null;
        }
        const durations = metrics.map(m => m.duration);
        const successCount = metrics.filter(m => m.success).length;
        return {
            endpoint,
            totalCalls: metrics.length,
            successRate: (successCount / metrics.length) * 100,
            averageDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
            minDuration: Math.min(...durations),
            maxDuration: Math.max(...durations),
            slowCalls: metrics.filter(m => m.duration > 1000).length,
            lastUpdated: new Date().toISOString(),
        };
    }
    async getDatabaseStats() {
        try {
            const startTime = Date.now();
            const [dbStatus] = await this.dataSource.query('SHOW STATUS LIKE "Threads_connected"');
            const [uptime] = await this.dataSource.query('SHOW STATUS LIKE "Uptime"');
            const [queries] = await this.dataSource.query('SHOW STATUS LIKE "Questions"');
            const [slowQueries] = await this.dataSource.query('SHOW STATUS LIKE "Slow_queries"');
            const responseTime = Date.now() - startTime;
            return {
                status: 'healthy',
                responseTime: `${responseTime}ms`,
                connections: parseInt(dbStatus.Value),
                uptime: parseInt(uptime.Value),
                totalQueries: parseInt(queries.Value),
                slowQueries: parseInt(slowQueries.Value),
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            this.logger.error('Failed to get database stats:', error);
            return {
                status: 'error',
                error: error.message,
                timestamp: new Date().toISOString(),
            };
        }
    }
    getSystemPerformance() {
        const allEndpoints = Array.from(this.performanceMetrics.keys());
        const endpointStats = allEndpoints.map(endpoint => this.getEndpointStats(endpoint));
        const totalCalls = endpointStats.reduce((sum, stats) => sum + (stats?.totalCalls || 0), 0);
        const avgDuration = endpointStats.reduce((sum, stats) => sum + (stats?.averageDuration || 0), 0) / endpointStats.length;
        const slowCalls = endpointStats.reduce((sum, stats) => sum + (stats?.slowCalls || 0), 0);
        return {
            summary: {
                totalEndpoints: allEndpoints.length,
                totalCalls,
                averageDuration: avgDuration || 0,
                slowCalls,
                slowCallRate: totalCalls > 0 ? (slowCalls / totalCalls) * 100 : 0,
            },
            endpoints: endpointStats.filter(stats => stats !== null),
            timestamp: new Date().toISOString(),
        };
    }
    clearOldMetrics() {
        const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000);
        for (const [endpoint, metrics] of this.performanceMetrics.entries()) {
            const filteredMetrics = metrics.filter(metric => new Date(metric.timestamp) > cutoffTime);
            if (filteredMetrics.length === 0) {
                this.performanceMetrics.delete(endpoint);
            }
            else {
                this.performanceMetrics.set(endpoint, filteredMetrics);
            }
        }
        this.logger.log(`🧹 Cleared old performance metrics. Active endpoints: ${this.performanceMetrics.size}`);
    }
};
exports.PerformanceService = PerformanceService;
exports.PerformanceService = PerformanceService = PerformanceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], PerformanceService);
//# sourceMappingURL=performance.service.js.map