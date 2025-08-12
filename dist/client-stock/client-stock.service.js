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
var ClientStockService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientStockService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const client_stock_entity_1 = require("../entities/client-stock.entity");
let ClientStockService = ClientStockService_1 = class ClientStockService {
    constructor(clientStockRepository) {
        this.clientStockRepository = clientStockRepository;
        this.logger = new common_1.Logger(ClientStockService_1.name);
    }
    async getClientStock(clientId) {
        this.logger.log(`🔍 Getting client stock for client ${clientId}`);
        try {
            const stock = await this.clientStockRepository.find({
                where: { clientId },
                relations: ['product'],
                order: { id: 'DESC' },
            });
            this.logger.log(`✅ Found ${stock.length} stock items for client ${clientId}`);
            return stock;
        }
        catch (error) {
            this.logger.error(`❌ Error getting client stock:`, error);
            throw error;
        }
    }
    async updateStock(clientId, productId, quantity, salesrepId) {
        this.logger.log(`📝 Updating stock for client ${clientId}, product ${productId}, quantity ${quantity}`);
        try {
            let stockRecord = await this.clientStockRepository.findOne({
                where: { clientId, productId }
            });
            if (stockRecord) {
                stockRecord.quantity = quantity;
                stockRecord.salesrepId = salesrepId;
                stockRecord = await this.clientStockRepository.save(stockRecord);
                this.logger.log(`✅ Updated existing stock record for client ${clientId}, product ${productId}`);
            }
            else {
                stockRecord = this.clientStockRepository.create({
                    clientId,
                    productId,
                    quantity,
                    salesrepId,
                });
                stockRecord = await this.clientStockRepository.save(stockRecord);
                this.logger.log(`✅ Created new stock record for client ${clientId}, product ${productId}`);
            }
            return stockRecord;
        }
        catch (error) {
            this.logger.error(`❌ Error updating client stock:`, error);
            throw error;
        }
    }
    async getStockByClientAndProduct(clientId, productId) {
        return this.clientStockRepository.findOne({
            where: { clientId, productId },
            relations: ['product'],
        });
    }
    async deleteStock(clientId, productId) {
        this.logger.log(`🗑️ Deleting stock for client ${clientId}, product ${productId}`);
        try {
            await this.clientStockRepository.delete({ clientId, productId });
            this.logger.log(`✅ Deleted stock record for client ${clientId}, product ${productId}`);
        }
        catch (error) {
            this.logger.error(`❌ Error deleting client stock:`, error);
            throw error;
        }
    }
};
exports.ClientStockService = ClientStockService;
exports.ClientStockService = ClientStockService = ClientStockService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(client_stock_entity_1.ClientStock)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ClientStockService);
//# sourceMappingURL=client-stock.service.js.map