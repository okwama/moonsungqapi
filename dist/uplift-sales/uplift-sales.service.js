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
exports.UpliftSalesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const uplift_sale_entity_1 = require("../entities/uplift-sale.entity");
const uplift_sale_item_entity_1 = require("../entities/uplift-sale-item.entity");
const client_stock_entity_1 = require("../entities/client-stock.entity");
const outlet_quantity_transactions_service_1 = require("../outlet-quantity-transactions/outlet-quantity-transactions.service");
let UpliftSalesService = class UpliftSalesService {
    constructor(upliftSaleRepository, upliftSaleItemRepository, clientStockRepository, dataSource, outletQuantityTransactionsService) {
        this.upliftSaleRepository = upliftSaleRepository;
        this.upliftSaleItemRepository = upliftSaleItemRepository;
        this.clientStockRepository = clientStockRepository;
        this.dataSource = dataSource;
        this.outletQuantityTransactionsService = outletQuantityTransactionsService;
    }
    async findAll(query) {
        try {
            console.log('🔍 Uplift Sales Query Parameters:', query);
            if (!query.salesrepId && !query.userId) {
                throw new Error('salesrepId parameter is required');
            }
            const queryBuilder = this.upliftSaleRepository.createQueryBuilder('upliftSale')
                .leftJoinAndSelect('upliftSale.client', 'client')
                .leftJoinAndSelect('upliftSale.user', 'user')
                .leftJoinAndSelect('upliftSale.upliftSaleItems', 'items')
                .leftJoinAndSelect('items.product', 'product');
            const salesrepId = parseInt(query.salesrepId || query.userId);
            console.log('👤 Filtering by salesrepId/userId:', salesrepId, 'Type:', typeof salesrepId);
            if (isNaN(salesrepId)) {
                throw new Error('Invalid salesrepId: must be a valid number');
            }
            queryBuilder.where('upliftSale.userId = :salesrepId', { salesrepId });
            if (query.status) {
                queryBuilder.andWhere('upliftSale.status = :status', { status: query.status });
            }
            if (query.startDate) {
                queryBuilder.andWhere('upliftSale.createdAt >= :startDate', { startDate: query.startDate });
            }
            if (query.endDate) {
                queryBuilder.andWhere('upliftSale.createdAt <= :endDate', { endDate: query.endDate });
            }
            const sql = queryBuilder.getSql();
            console.log('🔍 Generated SQL Query:', sql);
            console.log('🔍 Query Parameters:', queryBuilder.getParameters());
            const result = await queryBuilder.orderBy('upliftSale.createdAt', 'DESC').getMany();
            console.log(`📊 Found ${result.length} uplift sales for salesrepId: ${salesrepId}`);
            if (result.length > 0) {
                console.log('📋 First 3 results userId values:', result.slice(0, 3).map(sale => sale.userId));
            }
            return result;
        }
        catch (error) {
            console.error('Error fetching uplift sales:', error);
            throw new Error(`Failed to fetch uplift sales: ${error.message}`);
        }
    }
    async findOne(id) {
        try {
            return this.upliftSaleRepository.findOne({
                where: { id },
                relations: ['client', 'user', 'upliftSaleItems', 'upliftSaleItems.product']
            });
        }
        catch (error) {
            console.error('Error fetching uplift sale by ID:', error);
            throw new Error('Failed to fetch uplift sale');
        }
    }
    async validateStock(clientId, items) {
        const errors = [];
        for (const item of items) {
            const stockRecord = await this.clientStockRepository.findOne({
                where: { clientId, productId: item.productId }
            });
            if (!stockRecord) {
                errors.push(`Product ${item.productId} not available in client stock`);
            }
            else if (stockRecord.quantity < item.quantity) {
                errors.push(`Insufficient stock for product ${item.productId}: available ${stockRecord.quantity}, requested ${item.quantity}`);
            }
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    async deductStock(queryRunner, clientId, productId, quantity, salesrepId) {
        const stockRecord = await queryRunner.manager.findOne(client_stock_entity_1.ClientStock, {
            where: { clientId, productId }
        });
        if (!stockRecord) {
            throw new Error(`Stock record not found for client ${clientId}, product ${productId}`);
        }
        if (stockRecord.quantity < quantity) {
            throw new Error(`Insufficient stock: available ${stockRecord.quantity}, requested ${quantity}`);
        }
        const previousStock = stockRecord.quantity;
        stockRecord.quantity -= quantity;
        stockRecord.salesrepId = salesrepId;
        await queryRunner.manager.save(client_stock_entity_1.ClientStock, stockRecord);
        await this.outletQuantityTransactionsService.logSaleTransaction(clientId, productId, quantity, previousStock, stockRecord.quantity, 0, salesrepId, 'Sale made');
    }
    async restoreStock(queryRunner, clientId, productId, quantity, salesrepId) {
        const stockRecord = await queryRunner.manager.findOne(client_stock_entity_1.ClientStock, {
            where: { clientId, productId }
        });
        if (!stockRecord) {
            throw new Error(`Stock record not found for client ${clientId}, product ${productId}`);
        }
        const previousStock = stockRecord.quantity;
        stockRecord.quantity += quantity;
        stockRecord.salesrepId = salesrepId;
        await queryRunner.manager.save(client_stock_entity_1.ClientStock, stockRecord);
        await this.outletQuantityTransactionsService.logVoidTransaction(clientId, productId, quantity, previousStock, stockRecord.quantity, 0, salesrepId, 'Sale voided');
    }
    async create(createUpliftSaleDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            console.log('🔄 Creating Uplift Sale with data:', JSON.stringify(createUpliftSaleDto, null, 2));
            const { items, ...saleData } = createUpliftSaleDto;
            if (items && items.length > 0) {
                const stockValidation = await this.validateStock(saleData.clientId, items);
                if (!stockValidation.isValid) {
                    throw new Error(`Insufficient stock: ${stockValidation.errors.join(', ')}`);
                }
            }
            let totalAmount = saleData.totalAmount || 0;
            if (items && items.length > 0) {
                totalAmount = items.reduce((sum, item) => {
                    const itemTotal = (item.unitPrice || 0) * (item.quantity || 0);
                    return sum + itemTotal;
                }, 0);
            }
            console.log('📊 Calculated total amount:', totalAmount);
            const upliftSale = this.upliftSaleRepository.create({
                ...saleData,
                totalAmount: totalAmount,
                status: 1,
            });
            const savedSale = await queryRunner.manager.save(uplift_sale_entity_1.UpliftSale, upliftSale);
            const saleEntity = Array.isArray(savedSale) ? savedSale[0] : savedSale;
            console.log('✅ Uplift sale created with ID:', saleEntity.id);
            if (items && items.length > 0) {
                console.log('📦 Starting to create ${items.length} uplift sale items and deduct stock...');
                for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    try {
                        const itemTotal = (item.unitPrice || 0) * (item.quantity || 0);
                        console.log(`📦 Processing item ${i + 1}/${items.length}:`, {
                            productId: item.productId,
                            quantity: item.quantity,
                            unitPrice: item.unitPrice,
                            calculatedTotal: itemTotal,
                        });
                        const upliftSaleItem = this.upliftSaleItemRepository.create({
                            upliftSaleId: saleEntity.id,
                            productId: item.productId,
                            quantity: item.quantity,
                            unitPrice: item.unitPrice,
                            total: itemTotal,
                        });
                        await queryRunner.manager.save(uplift_sale_item_entity_1.UpliftSaleItem, upliftSaleItem);
                        console.log(`✅ Uplift sale item ${i + 1} saved`);
                        await this.deductStock(queryRunner, saleData.clientId, item.productId, item.quantity, saleData.userId);
                        console.log(`📉 Stock deducted for product ${item.productId}`);
                    }
                    catch (itemError) {
                        console.error(`❌ Error processing item ${i + 1}:`, itemError);
                        throw new Error(`Failed to process item: ${itemError.message}`);
                    }
                }
                console.log('✅ All uplift sale items created and stock deducted successfully');
            }
            else {
                console.log('⚠️ No items provided for uplift sale');
            }
            await queryRunner.commitTransaction();
            console.log('✅ Transaction committed successfully');
            return this.findOne(saleEntity.id);
        }
        catch (error) {
            console.error('❌ Error creating uplift sale:', error);
            await queryRunner.rollbackTransaction();
            throw new Error(`Failed to create uplift sale: ${error.message}`);
        }
        finally {
            await queryRunner.release();
        }
    }
    async update(id, updateUpliftSaleDto) {
        try {
            await this.upliftSaleRepository.update(id, updateUpliftSaleDto);
            return this.findOne(id);
        }
        catch (error) {
            console.error('Error updating uplift sale:', error);
            throw new Error('Failed to update uplift sale');
        }
    }
    async voidSale(id, reason) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            console.log(`🔄 Voiding Uplift Sale ${id} with reason: ${reason}`);
            const sale = await this.findOne(id);
            if (!sale) {
                throw new Error('Uplift sale not found');
            }
            if (sale.status === 0) {
                throw new Error('Sale is already voided');
            }
            if (sale.upliftSaleItems && sale.upliftSaleItems.length > 0) {
                console.log(`📦 Restoring stock for ${sale.upliftSaleItems.length} items...`);
                for (const item of sale.upliftSaleItems) {
                    try {
                        await this.restoreStock(queryRunner, sale.clientId, item.productId, item.quantity, sale.userId);
                        console.log(`📈 Stock restored for product ${item.productId}`);
                    }
                    catch (error) {
                        console.error(`❌ Error restoring stock for product ${item.productId}:`, error);
                        throw error;
                    }
                }
                console.log('✅ All stock restored successfully');
            }
            await queryRunner.manager.update(uplift_sale_entity_1.UpliftSale, id, {
                status: 0,
                comment: reason,
                updatedAt: new Date()
            });
            await queryRunner.commitTransaction();
            console.log('✅ Sale voided successfully');
            return this.findOne(id);
        }
        catch (error) {
            console.error('❌ Error voiding uplift sale:', error);
            await queryRunner.rollbackTransaction();
            throw new Error(`Failed to void uplift sale: ${error.message}`);
        }
        finally {
            await queryRunner.release();
        }
    }
    async remove(id) {
        try {
            await this.upliftSaleRepository.delete(id);
            return { message: 'Uplift sale deleted successfully' };
        }
        catch (error) {
            console.error('Error deleting uplift sale:', error);
            throw new Error('Failed to delete uplift sale');
        }
    }
};
exports.UpliftSalesService = UpliftSalesService;
exports.UpliftSalesService = UpliftSalesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(uplift_sale_entity_1.UpliftSale)),
    __param(1, (0, typeorm_1.InjectRepository)(uplift_sale_item_entity_1.UpliftSaleItem)),
    __param(2, (0, typeorm_1.InjectRepository)(client_stock_entity_1.ClientStock)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource,
        outlet_quantity_transactions_service_1.OutletQuantityTransactionsService])
], UpliftSalesService);
//# sourceMappingURL=uplift-sales.service.js.map