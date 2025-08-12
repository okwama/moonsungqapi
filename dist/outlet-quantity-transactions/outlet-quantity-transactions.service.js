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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutletQuantityTransactionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const outlet_quantity_transaction_entity_1 = require("../entities/outlet-quantity-transaction.entity");
let OutletQuantityTransactionsService = class OutletQuantityTransactionsService {
    constructor(outletQuantityTransactionRepository) {
        this.outletQuantityTransactionRepository = outletQuantityTransactionRepository;
    }
    async logTransaction(createDto) {
        const transaction = this.outletQuantityTransactionRepository.create({
            ...createDto,
            transactionDate: new Date(),
        });
        return this.outletQuantityTransactionRepository.save(transaction);
    }
    async logSaleTransaction(clientId, productId, quantity, previousBalance, newBalance, referenceId, userId, notes) {
        return this.logTransaction({
            clientId,
            productId,
            transactionType: 'sale',
            quantityIn: 0,
            quantityOut: Math.abs(quantity),
            previousBalance,
            newBalance,
            referenceId,
            referenceType: 'uplift_sale',
            userId,
            notes: notes || 'Sale made',
        });
    }
    async logVoidTransaction(clientId, productId, quantity, previousBalance, newBalance, referenceId, userId, notes) {
        return this.logTransaction({
            clientId,
            productId,
            transactionType: 'void',
            quantityIn: Math.abs(quantity),
            quantityOut: 0,
            previousBalance,
            newBalance,
            referenceId,
            referenceType: 'uplift_sale',
            userId,
            notes: notes || 'Sale voided',
        });
    }
    async logStockAdjustment(clientId, productId, quantity, previousBalance, newBalance, referenceId, userId, notes) {
        const quantityIn = quantity > 0 ? quantity : 0;
        const quantityOut = quantity < 0 ? Math.abs(quantity) : 0;
        return this.logTransaction({
            clientId,
            productId,
            transactionType: 'stock_adjustment',
            quantityIn,
            quantityOut,
            previousBalance,
            newBalance,
            referenceId,
            referenceType: 'client_stock',
            userId,
            notes: notes || 'Stock adjustment',
        });
    }
    async findByClient(clientId) {
        return this.outletQuantityTransactionRepository.find({
            where: { clientId },
            relations: ['client', 'product'],
            order: { transactionDate: 'DESC' },
        });
    }
    async findByProduct(productId) {
        return this.outletQuantityTransactionRepository.find({
            where: { productId },
            relations: ['client', 'product'],
            order: { transactionDate: 'DESC' },
        });
    }
    async findByDateRange(startDate, endDate) {
        return this.outletQuantityTransactionRepository.find({
            where: {
                transactionDate: {
                    $gte: startDate,
                    $lte: endDate,
                },
            },
            relations: ['client', 'product'],
            order: { transactionDate: 'DESC' },
        });
    }
    async findByTransactionType(transactionType) {
        return this.outletQuantityTransactionRepository.find({
            where: { transactionType: transactionType },
            relations: ['client', 'product'],
            order: { transactionDate: 'DESC' },
        });
    }
    async getStockLevelOnDate(clientId, productId, date) {
        const transactions = await this.outletQuantityTransactionRepository
            .createQueryBuilder('transaction')
            .where('transaction.clientId = :clientId', { clientId })
            .andWhere('transaction.productId = :productId', { productId })
            .andWhere('transaction.transactionDate <= :date', { date })
            .orderBy('transaction.transactionDate', 'DESC')
            .addOrderBy('transaction.id', 'DESC')
            .getOne();
        return transactions ? transactions.newBalance : 0;
    }
};
exports.OutletQuantityTransactionsService = OutletQuantityTransactionsService;
exports.OutletQuantityTransactionsService = OutletQuantityTransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(outlet_quantity_transaction_entity_1.OutletQuantityTransaction)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], OutletQuantityTransactionsService);
//# sourceMappingURL=outlet-quantity-transactions.service.js.map