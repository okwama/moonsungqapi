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
var DatabaseConnectionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConnectionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let DatabaseConnectionService = DatabaseConnectionService_1 = class DatabaseConnectionService {
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.logger = new common_1.Logger(DatabaseConnectionService_1.name);
    }
    async executeQuery(query, parameters, maxRetries = 3) {
        let lastError;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                this.logger.debug(`Executing query (attempt ${attempt}/${maxRetries}): ${query.substring(0, 100)}...`);
                if (!this.dataSource.isInitialized) {
                    this.logger.warn('Database not initialized, attempting to initialize...');
                    await this.dataSource.initialize();
                }
                const result = await this.dataSource.query(query, parameters);
                return result;
            }
            catch (error) {
                lastError = error;
                this.logger.warn(`Query attempt ${attempt} failed:`, error.message);
                if (this.isConnectionError(error)) {
                    if (attempt < maxRetries) {
                        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
                        this.logger.log(`Retrying in ${delay}ms...`);
                        await new Promise(resolve => setTimeout(resolve, delay));
                        continue;
                    }
                }
                else {
                    throw error;
                }
            }
        }
        throw lastError;
    }
    async executeTransaction(operation, maxRetries = 3) {
        let lastError;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            const queryRunner = this.dataSource.createQueryRunner();
            try {
                await queryRunner.connect();
                await queryRunner.startTransaction();
                this.logger.debug(`Starting transaction (attempt ${attempt}/${maxRetries})`);
                const result = await operation(queryRunner);
                await queryRunner.commitTransaction();
                this.logger.debug('Transaction committed successfully');
                return result;
            }
            catch (error) {
                lastError = error;
                this.logger.warn(`Transaction attempt ${attempt} failed:`, error.message);
                try {
                    await queryRunner.rollbackTransaction();
                    this.logger.debug('Transaction rolled back');
                }
                catch (rollbackError) {
                    this.logger.error('Failed to rollback transaction:', rollbackError.message);
                }
                if (this.isConnectionError(error)) {
                    if (attempt < maxRetries) {
                        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
                        this.logger.log(`Retrying transaction in ${delay}ms...`);
                        await new Promise(resolve => setTimeout(resolve, delay));
                        continue;
                    }
                }
                else {
                    throw error;
                }
            }
            finally {
                await queryRunner.release();
            }
        }
        throw lastError;
    }
    isConnectionError(error) {
        const connectionErrorMessages = [
            'Pool is closed',
            'Connection lost',
            'Connection terminated',
            'ECONNRESET',
            'ENOTFOUND',
            'ETIMEDOUT',
            'Connection refused',
            'Can\'t add new command when connection is in closed state',
            'Connection is closed',
            'MySQL server has gone away',
        ];
        const errorMessage = error.message?.toLowerCase() || '';
        return connectionErrorMessages.some(msg => errorMessage.includes(msg.toLowerCase()));
    }
    async testConnection() {
        try {
            await this.executeQuery('SELECT 1');
            return true;
        }
        catch (error) {
            this.logger.error('Database connection test failed:', error.message);
            return false;
        }
    }
    getConnectionStatus() {
        return {
            isInitialized: this.dataSource.isInitialized,
            isConnected: this.dataSource.isInitialized,
        };
    }
};
exports.DatabaseConnectionService = DatabaseConnectionService;
exports.DatabaseConnectionService = DatabaseConnectionService = DatabaseConnectionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], DatabaseConnectionService);
//# sourceMappingURL=database-connection.service.js.map