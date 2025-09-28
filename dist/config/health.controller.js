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
exports.HealthController = void 0;
const common_1 = require("@nestjs/common");
const database_health_service_1 = require("./database-health.service");
const database_connection_service_1 = require("./database-connection.service");
const performance_monitor_service_1 = require("./performance-monitor.service");
let HealthController = class HealthController {
    constructor(databaseHealthService, databaseConnectionService, performanceMonitorService) {
        this.databaseHealthService = databaseHealthService;
        this.databaseConnectionService = databaseConnectionService;
        this.performanceMonitorService = performanceMonitorService;
    }
    async getHealth() {
        const dbHealthy = await this.databaseHealthService.isHealthy();
        const connectionInfo = await this.databaseHealthService.getConnectionInfo();
        const connectionStatus = this.databaseConnectionService.getConnectionStatus();
        return {
            status: dbHealthy ? 'healthy' : 'unhealthy',
            timestamp: new Date().toISOString(),
            database: {
                healthy: dbHealthy,
                ...connectionInfo,
                ...connectionStatus,
            },
            uptime: process.uptime(),
            memory: process.memoryUsage(),
        };
    }
    async getDatabaseHealth() {
        const healthy = await this.databaseHealthService.isHealthy();
        const connectionInfo = await this.databaseHealthService.getConnectionInfo();
        const connectionStatus = this.databaseConnectionService.getConnectionStatus();
        return {
            healthy,
            ...connectionInfo,
            ...connectionStatus,
            timestamp: new Date().toISOString(),
        };
    }
    async testConnection() {
        const isConnected = await this.databaseConnectionService.testConnection();
        return {
            connected: isConnected,
            timestamp: new Date().toISOString(),
        };
    }
    async getPerformanceMetrics() {
        const metrics = this.performanceMonitorService.getMetrics();
        const slowest = this.performanceMonitorService.getSlowestOperations(10);
        return {
            timestamp: new Date().toISOString(),
            ...metrics,
            slowestOperations: slowest,
        };
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "getHealth", null);
__decorate([
    (0, common_1.Get)('database'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "getDatabaseHealth", null);
__decorate([
    (0, common_1.Get)('test-connection'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "testConnection", null);
__decorate([
    (0, common_1.Get)('performance'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "getPerformanceMetrics", null);
exports.HealthController = HealthController = __decorate([
    (0, common_1.Controller)('health'),
    __metadata("design:paramtypes", [database_health_service_1.DatabaseHealthService,
        database_connection_service_1.DatabaseConnectionService,
        performance_monitor_service_1.PerformanceMonitorService])
], HealthController);
//# sourceMappingURL=health.controller.js.map