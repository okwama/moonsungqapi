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
const clients_entity_1 = require("../entities/clients.entity");
let ProductsService = class ProductsService {
    constructor(productRepository, storeRepository, storeInventoryRepository, clientRepository, dataSource) {
        this.productRepository = productRepository;
        this.storeRepository = storeRepository;
        this.storeInventoryRepository = storeInventoryRepository;
        this.clientRepository = clientRepository;
        this.dataSource = dataSource;
    }
    async findAll(clientId) {
        const maxRetries = 3;
        let lastError;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                console.log(`🔍 Fetching all active products with inventory and price options... (attempt ${attempt}/${maxRetries})`);
                console.log(`🔍 Client ID parameter: ${clientId}`);
                const products = await this.productRepository
                    .createQueryBuilder('product')
                    .leftJoinAndSelect('product.storeInventory', 'storeInventory')
                    .leftJoinAndSelect('storeInventory.store', 'store')
                    .leftJoinAndSelect('product.categoryEntity', 'category')
                    .leftJoinAndSelect('category.categoryPriceOptions', 'categoryPriceOptions')
                    .where('product.isActive = :isActive', { isActive: true })
                    .orderBy('product.productName', 'ASC')
                    .getMany();
                console.log(`📦 Found ${products.length} products, now calculating stock in batch...`);
                await this.addStockInformationBatch(products);
                console.log(`✅ Found ${products.length} active products with inventory and price options data`);
                if (clientId) {
                    console.log(`💰 About to apply discount for client ${clientId}`);
                    const discountedProducts = await this.applyClientDiscount(products, clientId);
                    console.log(`💰 Applied discount for client ${clientId} - returned ${discountedProducts.length} products`);
                    return discountedProducts;
                }
                else {
                    console.log(`💰 No client ID provided - returning products without discount`);
                }
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
    async findProductsByCountry(userCountryId, clientId) {
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
            console.log(`📦 Found ${allProducts.length} total active products, calculating stock in batch...`);
            await this.addStockInformationBatch(allProducts);
            const processedProducts = allProducts.filter(product => {
                const availableStock = product['availableStock'] || 0;
                return availableStock > 0;
            });
            console.log(`✅ Found ${processedProducts.length} products available in country ${userCountryId}`);
            if (clientId) {
                const discountedProducts = await this.applyClientDiscount(processedProducts, clientId);
                console.log(`💰 Applied discount for client ${clientId} - returned ${discountedProducts.length} products`);
                return discountedProducts;
            }
            return processedProducts;
        }
        catch (error) {
            console.error('❌ Error in findProductsByCountry:', error);
            console.log('🔄 Falling back to all products due to error');
            return this.findAll();
        }
    }
    async addStockInformationBatch(products) {
        if (products.length === 0)
            return;
        console.log(`🚀 Starting batch stock calculation for ${products.length} products...`);
        const startTime = Date.now();
        try {
            const productIds = products.map(p => p.id);
            const stockData = await this.storeInventoryRepository
                .createQueryBuilder('si')
                .leftJoinAndSelect('si.store', 'store')
                .where('si.productId IN (:...productIds)', { productIds })
                .andWhere('store.isActive = :isActive', { isActive: true })
                .getMany();
            console.log(`📊 Batch query returned ${stockData.length} stock records`);
            const stockByProduct = new Map();
            stockData.forEach(stock => {
                if (!stockByProduct.has(stock.productId)) {
                    stockByProduct.set(stock.productId, []);
                }
                stockByProduct.get(stock.productId).push(stock);
            });
            products.forEach(product => {
                const productStock = stockByProduct.get(product.id) || [];
                if (productStock.length > 0) {
                    const primaryStock = productStock.reduce((max, current) => current.quantity > max.quantity ? current : max);
                    product['availableStock'] = primaryStock.quantity;
                    product['isOutOfStock'] = primaryStock.quantity <= 0;
                    product['stockSource'] = `store_${primaryStock.store.id}`;
                }
                else {
                    product['availableStock'] = 0;
                    product['isOutOfStock'] = true;
                    product['stockSource'] = 'no_stock';
                }
            });
            const endTime = Date.now();
            console.log(`⚡ Batch stock calculation completed in ${endTime - startTime}ms`);
        }
        catch (error) {
            console.error('❌ Error in batch stock calculation:', error);
            console.log('🔄 Falling back to individual stock calculations...');
            for (const product of products) {
                const stockInfo = await this.calculateProductStock(product.id, 0);
                product['availableStock'] = stockInfo.availableStock;
                product['isOutOfStock'] = stockInfo.isOutOfStock;
                product['stockSource'] = stockInfo.stockSource;
            }
        }
    }
    calculateDiscountedPrice(originalPrice, discountPercentage) {
        if (!discountPercentage || discountPercentage <= 0) {
            console.log(`💰 No discount applied - original price: ${originalPrice}`);
            return originalPrice;
        }
        const discount = originalPrice * (discountPercentage / 100);
        const discountedPrice = Math.max(0, originalPrice - discount);
        console.log(`💰 Discount calculation: Original: ${originalPrice}, Discount: ${discountPercentage}%, Discount Amount: ${discount.toFixed(2)}, Final Price: ${discountedPrice.toFixed(2)}`);
        return discountedPrice;
    }
    async applyClientDiscount(products, clientId) {
        if (!clientId) {
            console.log(`💰 No client ID provided - no discount applied`);
            return products;
        }
        try {
            console.log(`💰 Looking up discount for client ${clientId}...`);
            const startTime = Date.now();
            const client = await this.clientRepository.findOne({
                where: { id: clientId },
                select: ['id', 'name', 'discountPercentage']
            });
            if (!client) {
                console.log(`❌ Client ${clientId} not found - no discount applied`);
                return products;
            }
            if (!client.discountPercentage || client.discountPercentage <= 0) {
                console.log(`💰 Client ${clientId} has no discount (${client.discountPercentage}%) - no discount applied`);
                return products;
            }
            console.log(`💰 Client found: ${client.name} (ID: ${client.id}) with ${client.discountPercentage}% discount`);
            console.log(`💰 Processing ${products.length} products in batch...`);
            let discountedCount = 0;
            let totalOriginalValue = 0;
            let totalDiscountedValue = 0;
            const discountedProducts = products.map(product => {
                if (product.sellingPrice && product.sellingPrice > 0) {
                    const originalPrice = product.sellingPrice;
                    const discountedPrice = this.calculateDiscountedPrice(product.sellingPrice, client.discountPercentage);
                    product.sellingPrice = discountedPrice;
                    discountedCount++;
                    totalOriginalValue += originalPrice;
                    totalDiscountedValue += discountedPrice;
                }
                return product;
            });
            const totalDiscount = totalOriginalValue - totalDiscountedValue;
            const endTime = Date.now();
            console.log(`💰 Batch discount summary: ${discountedCount}/${products.length} products discounted`);
            console.log(`💰 Total original value: ${totalOriginalValue.toFixed(2)}`);
            console.log(`💰 Total discounted value: ${totalDiscountedValue.toFixed(2)}`);
            console.log(`💰 Total discount amount: ${totalDiscount.toFixed(2)}`);
            console.log(`⚡ Discount calculation completed in ${endTime - startTime}ms`);
            return discountedProducts;
        }
        catch (error) {
            console.error('❌ Error applying client discount:', error);
            return products;
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
    __param(3, (0, typeorm_1.InjectRepository)(clients_entity_1.Clients)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], ProductsService);
//# sourceMappingURL=products.service.js.map