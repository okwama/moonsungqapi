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
var DatabaseHealthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseHealthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let DatabaseHealthService = DatabaseHealthService_1 = class DatabaseHealthService {
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.logger = new common_1.Logger(DatabaseHealthService_1.name);
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 15;
        this.reconnectDelay = 3000;
        this.isReconnecting = false;
        this.lastSuccessfulCheck = null;
    }
    async onModuleInit() {
        this.startHealthCheck();
    }
    startHealthCheck() {
        this.healthCheckInterval = setInterval(async () => {
            await this.checkDatabaseHealth();
        }, 15000);
    }
    async checkDatabaseHealth() {
        try {
            if (this.isReconnecting) {
                return;
            }
            await Promise.race([
                this.dataSource.query('SELECT 1'),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Health check timeout')), 5000))
            ]);
            this.reconnectAttempts = 0;
            this.lastSuccessfulCheck = new Date();
            this.logger.debug('Database connection is healthy');
        }
        catch (error) {
            this.logger.error('Database health check failed:', error.message);
            await this.handleConnectionError();
        }
    }
    async handleConnectionError() {
        if (this.isReconnecting) {
            return;
        }
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            this.logger.error('Max reconnection attempts reached. Stopping health checks.');
            clearInterval(this.healthCheckInterval);
            return;
        }
        this.isReconnecting = true;
        this.reconnectAttempts++;
        this.logger.warn(`Attempting to reconnect to database (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        try {
            if (this.dataSource.isInitialized) {
                await this.dataSource.destroy();
                this.logger.log('Database connection destroyed');
            }
            const backoffDelay = Math.min(this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts - 1), 30000);
            this.logger.log(`Waiting ${backoffDelay}ms before reconnection...`);
            await new Promise(resolve => setTimeout(resolve, backoffDelay));
            await this.dataSource.initialize();
            this.logger.log('Database reconnection successful');
            this.reconnectAttempts = 0;
            this.lastSuccessfulCheck = new Date();
        }
        catch (error) {
            this.logger.error(`Reconnection attempt ${this.reconnectAttempts} failed:`, error.message);
        }
        finally {
            this.isReconnecting = false;
        }
    }
    async isHealthy() {
        try {
            await this.dataSource.query('SELECT 1');
            return true;
        }
        catch (error) {
            this.logger.error('Database health check failed:', error.message);
            return false;
        }
    }
    async getConnectionInfo() {
        return {
            isInitialized: this.dataSource.isInitialized,
            isConnected: this.dataSource.isInitialized,
            reconnectAttempts: this.reconnectAttempts,
            maxReconnectAttempts: this.maxReconnectAttempts,
            isReconnecting: this.isReconnecting,
            lastSuccessfulCheck: this.lastSuccessfulCheck,
            timeSinceLastCheck: this.lastSuccessfulCheck
                ? Date.now() - this.lastSuccessfulCheck.getTime()
                : null,
        };
    }
    onModuleDestroy() {
        if (this.healthCheckInterval) {
            clearInterval(this.healthCheckInterval);
        }
    }
};
exports.DatabaseHealthService = DatabaseHealthService;
exports.DatabaseHealthService = DatabaseHealthService = DatabaseHealthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], DatabaseHealthService);
//# sourceMappingURL=database-health.service.js.map