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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./entities/product.entity");
const store_entity_1 = require("../entities/store.entity");
const store_inventory_entity_1 = require("../entities/store-inventory.entity");
let ProductsService = class ProductsService {
    constructor(productRepository, storeRepository, storeInventoryRepository, dataSource) {
        this.productRepository = productRepository;
        this.storeRepository = storeRepository;
        this.storeInventoryRepository = storeInventoryRepository;
        this.dataSource = dataSource;
    }
    async findAll() {
        const maxRetries = 3;
        let lastError;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                console.log(`🔍 Fetching all active products with inventory and price options... (attempt ${attempt}/${maxRetries})`);
                const totalProducts = await this.productRepository.count();
                console.log(`📊 Total products in database: ${totalProducts}`);
                const activeProducts = await this.productRepository.count({
                    where: { isActive: true }
                });
                console.log(`📊 Active products in database: ${activeProducts}`);
                const products = await this.productRepository
                    .createQueryBuilder('product')
                    .leftJoinAndSelect('product.storeInventory', 'storeInventory')
                    .leftJoinAndSelect('storeInventory.store', 'store')
                    .leftJoinAndSelect('product.categoryEntity', 'category')
                    .leftJoinAndSelect('category.categoryPriceOptions', 'categoryPriceOptions')
                    .where('product.isActive = :isActive', { isActive: true })
                    .orderBy('product.productName', 'ASC')
                    .getMany();
                for (const product of products) {
                    const stockInfo = await this.calculateProductStock(product.id, 0);
                    product['availableStock'] = stockInfo.availableStock;
                    product['isOutOfStock'] = stockInfo.isOutOfStock;
                    product['stockSource'] = stockInfo.stockSource;
                }
                console.log(`✅ Found ${products.length} active products with inventory and price options data`);
                return products;
            }
            catch (error) {
                lastError = error;
                console.error(`❌ Error fetching products (attempt ${attempt}/${maxRetries}):`, error);
                if (attempt < maxRetries) {
                    console.log(`⏳ Retrying in ${attempt * 1000}ms...`);
                    await new Promise(resolve => setTimeout(resolve, attempt * 1000));
                }
            }
        }
        console.error('❌ Failed to fetch products after all retries');
        throw lastError;
    }
    async findProductsByCountry(userCountryId) {
        try {
            console.log(`🌍 Fetching products for country: ${userCountryId}`);
            const allProducts = await this.productRepository
                .createQueryBuilder('product')
                .leftJoinAndSelect('product.storeInventory', 'storeInventory')
                .leftJoinAndSelect('storeInventory.store', 'store')
                .leftJoinAndSelect('product.categoryEntity', 'category')
                .leftJoinAndSelect('category.categoryPriceOptions', 'categoryPriceOptions')
                .where('product.isActive = :isActive', { isActive: true })
                .orderBy('product.productName', 'ASC')
                .getMany();
            console.log(`📦 Found ${allProducts.length} total active products with inventory and price options`);
            const processedProducts = [];
            for (const product of allProducts) {
                const stockInfo = await this.calculateProductStock(product.id, userCountryId);
                if (stockInfo.isAvailable) {
                    product['availableStock'] = stockInfo.availableStock;
                    product['isOutOfStock'] = stockInfo.isOutOfStock;
                    product['stockSource'] = stockInfo.stockSource;
                    if (product.storeInventory) {
                        product.storeInventory = product.storeInventory.filter(inventory => {
                            return inventory.store &&
                                inventory.store.isActive === true &&
                                inventory.quantity > 0;
                        });
                    }
                    processedProducts.push(product);
                }
            }
            console.log(`✅ Found ${processedProducts.length} products available in country ${userCountryId}`);
            return processedProducts;
        }
        catch (error) {
            console.error('❌ Error in findProductsByCountry:', error);
            console.log('🔄 Falling back to all products due to error');
            return this.findAll();
        }
    }
    async calculateProductStock(productId, userCountryId) {
        try {
            console.log(`📊 Calculating stock for product ${productId} in country ${userCountryId}`);
            if (userCountryId > 0) {
                const countryStock = await this.dataSource
                    .createQueryBuilder()
                    .select('SUM(si.quantity)', 'totalStock')
                    .addSelect('MAX(si.quantity)', 'maxStock')
                    .from('store_inventory', 'si')
                    .innerJoin('stores', 's', 's.id = si.store_id')
                    .where('si.product_id = :productId', { productId })
                    .andWhere('s.country_id = :countryId', { countryId: userCountryId })
                    .andWhere('s.is_active = :isActive', { isActive: true })
                    .andWhere('si.quantity > 0')
                    .getRawOne();
                if (countryStock && countryStock.totalStock > 0) {
                    const availableStock = parseInt(countryStock.maxStock) || 0;
                    console.log(`✅ Product ${productId}: Found ${availableStock} stock in country ${userCountryId}`);
                    return {
                        isAvailable: true,
                        availableStock,
                        isOutOfStock: availableStock <= 0,
                        stockSource: `country_${userCountryId}`
                    };
                }
            }
            console.log(`🔄 Product ${productId}: Falling back to store 1`);
            const store1Stock = await this.dataSource
                .createQueryBuilder()
                .select('si.quantity', 'stock')
                .from('store_inventory', 'si')
                .where('si.product_id = :productId', { productId })
                .andWhere('si.store_id = 1')
                .andWhere('si.quantity > 0')
                .getRawOne();
            if (store1Stock && store1Stock.stock > 0) {
                const availableStock = parseInt(store1Stock.stock) || 0;
                console.log(`✅ Product ${productId}: Found ${availableStock} stock in store 1 (fallback)`);
                return {
                    isAvailable: true,
                    availableStock,
                    isOutOfStock: availableStock <= 0,
                    stockSource: 'store_1_fallback'
                };
            }
            console.log(`🔄 Product ${productId}: Checking any available store`);
            const anyStock = await this.dataSource
                .createQueryBuilder()
                .select('MAX(si.quantity)', 'maxStock')
                .from('store_inventory', 'si')
                .where('si.product_id = :productId', { productId })
                .andWhere('si.quantity > 0')
                .getRawOne();
            if (anyStock && anyStock.maxStock > 0) {
                const availableStock = parseInt(anyStock.maxStock) || 0;
                console.log(`✅ Product ${productId}: Found ${availableStock} stock in any store`);
                return {
                    isAvailable: true,
                    availableStock,
                    isOutOfStock: availableStock <= 0,
                    stockSource: 'any_store'
                };
            }
            console.log(`❌ Product ${productId}: No stock available anywhere`);
            return {
                isAvailable: false,
                availableStock: 0,
                isOutOfStock: true,
                stockSource: 'none'
            };
        }
        catch (error) {
            console.error(`❌ Error calculating stock for product ${productId}:`, error);
            try {
                const emergencyStock = await this.dataSource
                    .createQueryBuilder()
                    .select('si.quantity', 'stock')
                    .from('store_inventory', 'si')
                    .where('si.product_id = :productId', { productId })
                    .andWhere('si.store_id = 1')
                    .getRawOne();
                const availableStock = emergencyStock ? parseInt(emergencyStock.stock) || 0 : 0;
                console.log(`🚨 Product ${productId}: Emergency fallback to store 1, stock: ${availableStock}`);
                return {
                    isAvailable: availableStock > 0,
                    availableStock,
                    isOutOfStock: availableStock <= 0,
                    stockSource: 'store_1_emergency'
                };
            }
            catch (emergencyError) {
                console.error(`❌ Emergency fallback failed for product ${productId}:`, emergencyError);
                return {
                    isAvailable: false,
                    availableStock: 0,
                    isOutOfStock: true,
                    stockSource: 'error'
                };
            }
        }
    }
    async findOne(id) {
        return this.productRepository.findOne({ where: { id } });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(store_entity_1.Store)),
    __param(2, (0, typeorm_1.InjectRepository)(store_inventory_entity_1.StoreInventory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], ProductsService);
//# sourceMappingURL=products.service.js.map