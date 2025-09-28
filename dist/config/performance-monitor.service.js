"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PerformanceMonitorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceMonitorService = void 0;
const common_1 = require("@nestjs/common");
let PerformanceMonitorService = PerformanceMonitorService_1 = class PerformanceMonitorService {
    constructor() {
        this.logger = new common_1.Logger(PerformanceMonitorService_1.name);
        this.metrics = new Map();
    }
    startTimer(operation) {
        const startTime = Date.now();
        return () => {
            const endTime = Date.now();
            const duration = endTime - startTime;
            this.recordMetric(operation, duration);
        };
    }
    recordMetric(operation, duration) {
        const existing = this.metrics.get(operation) || { count: 0, totalTime: 0, avgTime: 0 };
        existing.count++;
        existing.totalTime += duration;
        existing.avgTime = existing.totalTime / existing.count;
        this.metrics.set(operation, existing);
        if (duration > 1000) {
            this.logger.warn(`🐌 Slow operation detected: ${operation} took ${duration}ms`);
        }
    }
    getMetrics() {
        const result = Array.from(this.metrics.entries()).map(([operation, data]) => ({
            operation,
            ...data,
            totalTimeFormatted: `${data.totalTime}ms`,
            avgTimeFormatted: `${Math.round(data.avgTime)}ms`
        }));
        return {
            totalOperations: this.metrics.size,
            metrics: result.sort((a, b) => b.avgTime - a.avgTime)
        };
    }
    getSlowestOperations(limit = 10) {
        return this.getMetrics().metrics.slice(0, limit);
    }
    clearMetrics() {
        this.metrics.clear();
        this.logger.log('Performance metrics cleared');
    }
    logPerformanceSummary() {
        const metrics = this.getMetrics();
        this.logger.log('📊 Performance Summary:');
        this.logger.log(`Total operations tracked: ${metrics.totalOperations}`);
        const slowest = this.getSlowestOperations(5);
        if (slowest.length > 0) {
            this.logger.log('🐌 Slowest operations:');
            slowest.forEach(metric => {
                this.logger.log(`  ${metric.operation}: ${metric.avgTimeFormatted} avg (${metric.count} calls)`);
            });
        }
    }
};
exports.PerformanceMonitorService = PerformanceMonitorService;
exports.PerformanceMonitorService = PerformanceMonitorService = PerformanceMonitorService_1 = __decorate([
    (0, common_1.Injectable)()
], PerformanceMonitorService);
//# sourceMappingURL=performance-monitor.service.js.map