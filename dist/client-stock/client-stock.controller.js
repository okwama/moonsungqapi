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
var ClientStockController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientStockController = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const client_stock_service_1 = require("./client-stock.service");
let ClientStockController = ClientStockController_1 = class ClientStockController {
    constructor(clientStockService) {
        this.clientStockService = clientStockService;
        this.logger = new common_2.Logger(ClientStockController_1.name);
    }
    async getClientStock(clientId, req) {
        const userId = req.user?.id || 'unknown';
        const userRole = req.user?.role || 'unknown';
        this.logger.log(`🔍 GET /client-stock/${clientId} - User: ${userId}, Role: ${userRole}`);
        try {
            const stock = await this.clientStockService.getClientStock(+clientId);
            const transformedStock = stock.map(item => ({
                id: item.id,
                clientId: item.clientId,
                productId: item.productId,
                quantity: item.quantity,
                salesrepId: item.salesrepId,
                product: item.product ? {
                    id: item.product.id,
                    name: item.product.productName,
                    description: item.product.description,
                    price: item.product.costPrice,
                    imageUrl: item.product.imageUrl,
                } : null,
            }));
            return {
                success: true,
                message: 'Client stock retrieved successfully',
                data: transformedStock
            };
        }
        catch (error) {
            this.logger.error(`❌ Error getting client stock:`, error);
            return {
                success: false,
                message: 'Failed to get client stock',
                data: []
            };
        }
    }
    async updateStock(body, req) {
        const userId = req.user?.id || 'unknown';
        const userRole = req.user?.role || 'unknown';
        this.logger.log(`📝 POST /client-stock - User: ${userId}, Role: ${userRole}`);
        try {
            const { clientId, productId, quantity } = body;
            const salesrepId = req.user?.id;
            if (!salesrepId) {
                throw new Error('User ID not found in request');
            }
            const stockRecord = await this.clientStockService.updateStock(clientId, productId, quantity, salesrepId);
            return {
                success: true,
                message: 'Client stock updated successfully',
                data: {
                    id: stockRecord.id,
                    clientId: stockRecord.clientId,
                    productId: stockRecord.productId,
                    quantity: stockRecord.quantity,
                    salesrepId: stockRecord.salesrepId,
                }
            };
        }
        catch (error) {
            this.logger.error(`❌ Error updating client stock:`, error);
            return {
                success: false,
                message: 'Failed to update client stock',
                data: null
            };
        }
    }
    async deleteStock(clientId, productId, req) {
        const userId = req.user?.id || 'unknown';
        const userRole = req.user?.role || 'unknown';
        this.logger.log(`🗑️ DELETE /client-stock/${clientId}/${productId} - User: ${userId}, Role: ${userRole}`);
        try {
            await this.clientStockService.deleteStock(+clientId, +productId);
            return {
                success: true,
                message: 'Client stock deleted successfully',
                data: null
            };
        }
        catch (error) {
            this.logger.error(`❌ Error deleting client stock:`, error);
            return {
                success: false,
                message: 'Failed to delete client stock',
                data: null
            };
        }
    }
    async getFeatureStatus() {
        return {
            enabled: true,
            message: 'Client stock feature is enabled'
        };
    }
};
exports.ClientStockController = ClientStockController;
__decorate([
    (0, common_1.Get)(':clientId'),
    __param(0, (0, common_1.Param)('clientId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ClientStockController.prototype, "getClientStock", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ClientStockController.prototype, "updateStock", null);
__decorate([
    (0, common_1.Delete)(':clientId/:productId'),
    __param(0, (0, common_1.Param)('clientId')),
    __param(1, (0, common_1.Param)('productId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ClientStockController.prototype, "deleteStock", null);
__decorate([
    (0, common_1.Get)('status'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClientStockController.prototype, "getFeatureStatus", null);
exports.ClientStockController = ClientStockController = ClientStockController_1 = __decorate([
    (0, common_1.Controller)('client-stock'),
    __metadata("design:paramtypes", [client_stock_service_1.ClientStockService])
], ClientStockController);
//# sourceMappingURL=client-stock.controller.js.map