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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceController = void 0;
const common_1 = require("@nestjs/common");
const performance_service_1 = require("./performance.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let PerformanceController = class PerformanceController {
    constructor(performanceService) {
        this.performanceService = performanceService;
    }
    async getPerformanceStats() {
        return {
            success: true,
            data: this.performanceService.getSystemPerformance(),
        };
    }
    async getDatabaseStats() {
        const stats = await this.performanceService.getDatabaseStats();
        return {
            success: true,
            data: stats,
        };
    }
    async getHealthCheck() {
        const dbStats = await this.performanceService.getDatabaseStats();
        const performance = this.performanceService.getSystemPerformance();
        const isHealthy = dbStats.status === 'healthy' &&
            performance.summary.slowCallRate < 10;
        return {
            success: true,
            status: isHealthy ? 'healthy' : 'degraded',
            data: {
                database: dbStats,
                performance: performance.summary,
                timestamp: new Date().toISOString(),
            },
        };
    }
    async getAllMetrics() {
        return {
            success: true,
            data: {
                system: this.performanceService.getSystemPerformance(),
                database: await this.performanceService.getDatabaseStats(),
                timestamp: new Date().toISOString(),
            },
        };
    }
};
exports.PerformanceController = PerformanceController;
__decorate([
    (0, common_1.Get)('performance'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PerformanceController.prototype, "getPerformanceStats", null);
__decorate([
    (0, common_1.Get)('database'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PerformanceController.prototype, "getDatabaseStats", null);
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PerformanceController.prototype, "getHealthCheck", null);
__decorate([
    (0, common_1.Get)('metrics'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PerformanceController.prototype, "getAllMetrics", null);
exports.PerformanceController = PerformanceController = __decorate([
    (0, common_1.Controller)('monitoring'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [performance_service_1.PerformanceService])
], PerformanceController);
//# sourceMappingURL=performance.controller.js.map