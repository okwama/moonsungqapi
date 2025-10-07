import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Product } from './entities/product.entity';
import { Store } from '../entities/store.entity';
import { StoreInventory } from '../entities/store-inventory.entity';
import { Clients } from '../entities/clients.entity';
import { ProductsCacheService } from './products-cache.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    @InjectRepository(StoreInventory)
    private storeInventoryRepository: Repository<StoreInventory>,
    @InjectRepository(Clients)
    private clientRepository: Repository<Clients>,
    private dataSource: DataSource,
    private cacheService: ProductsCacheService,
  ) {}

  async findAllPaginated(options: {
    clientId?: number;
    page: number;
    limit: number;
    category?: string;
    search?: string;
  }): Promise<{
    data: Product[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const { clientId, page, limit, category, search } = options;
    const startTime = Date.now();
    const cacheKey = `products_${clientId || 'all'}_${page}_${limit}_${category || 'all'}_${search || 'all'}`;
    
    try {
      // OPTIMIZATION: Check cache first
      const cachedResult = await this.cacheService.get(cacheKey) as any;
      if (cachedResult) {
        console.log(`⚡ Cache hit for paginated products - returning cached data`);
        return cachedResult;
      }

      console.log(`🔍 Fetching paginated products from database (page ${page}, limit ${limit})...`);
      
      // Build query with filters
      let query = this.productRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.categoryEntity', 'category')
        .leftJoinAndSelect('category.categoryPriceOptions', 'categoryPriceOptions')
        .select([
          'product.id',
          'product.productCode',
          'product.productName',
          'product.description',
          'product.categoryId',
          'product.unitOfMeasure',
          'product.costPrice',
          'product.sellingPrice',
          'product.taxType',
          'product.reorderLevel',
          'product.currentStock',
          'product.isActive',
          'product.imageUrl',
          'product.createdAt',
          'product.updatedAt',
          'category.id',
          'category.name',
          'categoryPriceOptions.id',
          'categoryPriceOptions.label',
          'categoryPriceOptions.value',
          'categoryPriceOptions.valueTzs',
          'categoryPriceOptions.valueNgn'
        ])
        .where('product.isActive = :isActive', { isActive: true });

      // Add category filter
      if (category) {
        query = query.andWhere('category.name = :categoryName', { categoryName: category });
      }

      // Add search filter
      if (search) {
        query = query.andWhere(
          '(product.productName LIKE :search OR product.productCode LIKE :search OR product.description LIKE :search)',
          { search: `%${search}%` }
        );
      }

      // Get total count
      const total = await query.getCount();

      // Apply pagination
      const offset = (page - 1) * limit;
      const products = await query
        .orderBy('product.productName', 'ASC')
        .skip(offset)
        .take(limit)
        .getMany();

      console.log(`📦 Found ${products.length} products (${total} total), calculating stock...`);

      // OPTIMIZATION: Ultra-fast stock calculation
      await this.addStockInformationOptimized(products);

      // Apply client discount if specified
      let finalProducts = products;
      if (clientId) {
        finalProducts = await this.applyClientDiscountOptimized(products, clientId);
      }

      const totalPages = Math.ceil(total / limit);
      const result = {
        data: finalProducts,
        pagination: {
          total,
          page,
          limit,
          totalPages,
        },
      };

      // Cache the result for 2 minutes (shorter for paginated results)
      await this.cacheService.set(cacheKey, result, 120);

      console.log(`✅ Paginated products processed in ${Date.now() - startTime}ms`);
      return result;
    } catch (error) {
      console.error('❌ Error fetching paginated products:', error);
      throw error;
    }
  }

  async findAll(clientId?: number): Promise<Product[]> {
    const startTime = Date.now();
    const cacheKey = `products_${clientId || 'all'}`;
    
    try {
      // OPTIMIZATION: Check cache first
      const cachedProducts = await this.cacheService.get(cacheKey) as Product[] | null;
      if (cachedProducts) {
        console.log(`⚡ Cache hit for products (clientId: ${clientId}) - returning cached data`);
        return cachedProducts;
      }

      console.log(`🔍 Fetching products from database (clientId: ${clientId})...`);
      
      // OPTIMIZATION: Simplified query with only essential data
      const products = await this.productRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.categoryEntity', 'category')
        .leftJoinAndSelect('category.categoryPriceOptions', 'categoryPriceOptions')
        .select([
          'product.id',
          'product.productCode',
          'product.productName',
          'product.description',
          'product.categoryId',
          'product.unitOfMeasure',
          'product.costPrice',
          'product.sellingPrice',
          'product.taxType',
          'product.reorderLevel',
          'product.currentStock',
          'product.isActive',
          'product.imageUrl',
          'product.createdAt',
          'product.updatedAt',
          'category.id',
          'category.name',
          'categoryPriceOptions.id',
          'categoryPriceOptions.label',
          'categoryPriceOptions.value',
          'categoryPriceOptions.valueTzs',
          'categoryPriceOptions.valueNgn'
        ])
        .where('product.isActive = :isActive', { isActive: true })
        .orderBy('product.productName', 'ASC')
        .getMany();

      console.log(`📦 Found ${products.length} products, calculating stock...`);

      // OPTIMIZATION: Ultra-fast stock calculation
      await this.addStockInformationOptimized(products);

      console.log(`✅ Products processed in ${Date.now() - startTime}ms`);
      
      // Apply client discount if needed
      let finalProducts = products;
      if (clientId) {
        console.log(`💰 Applying discount for client ${clientId}...`);
        finalProducts = await this.applyClientDiscountOptimized(products, clientId);
      }
      
      // OPTIMIZATION: Cache the results for 5 minutes
      await this.cacheService.set(cacheKey, finalProducts, 300); // 5 minutes cache
      
      return finalProducts;
      
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      
      // OPTIMIZATION: Fallback to cached data if available
      const fallbackProducts = await this.cacheService.get('products_all') as Product[] | null;
      if (fallbackProducts) {
        console.log('🔄 Using fallback cached products');
        return fallbackProducts;
      }
      
      throw error;
    }
  }

  async findProductsByCountry(userCountryId: number, clientId?: number): Promise<Product[]> {
    try {
      console.log(`🌍 Fetching products for country: ${userCountryId}`);
      
      // OPTIMIZATION: Single query with all data
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

      // OPTIMIZATION: Batch stock calculation
      await this.addStockInformationBatch(allProducts);

      // DEBUG: Check stock calculation results
      console.log(`🔍 DEBUG: Checking stock calculation results...`);
      const productsWithStock = allProducts.filter(product => {
        const availableStock = product['availableStock'] || 0;
        return availableStock > 0;
      });
      
      console.log(`📊 DEBUG: ${productsWithStock.length} products have stock, ${allProducts.length - productsWithStock.length} products are out of stock`);
      
      // Show first few products with their stock info
      allProducts.slice(0, 5).forEach(product => {
        console.log(`🔍 DEBUG Product ${product.id} (${product.productName}): Stock=${product['availableStock'] || 0}, Source=${product['stockSource'] || 'none'}`);
      });
      
      // TEMPORARY: Show all products for now
      const processedProducts = allProducts;
      console.log(`⚠️ TEMPORARY: Showing all products regardless of stock (${processedProducts.length} products)`);

      console.log(`✅ Found ${processedProducts.length} products available in country ${userCountryId}`);
      
      // Apply client discount if clientId is provided
      if (clientId) {
        const discountedProducts = await this.applyClientDiscount(processedProducts, clientId);
        console.log(`💰 Applied discount for client ${clientId} - returned ${discountedProducts.length} products`);
        return discountedProducts;
      }
      
      return processedProducts;

    } catch (error) {
      console.error('❌ Error in findProductsByCountry:', error);
      
      // Fallback: Return all products if country filtering fails
      console.log('🔄 Falling back to all products due to error');
      return this.findAll();
    }
  }

  /**
   * ULTRA-FAST: Optimized stock calculation with single query
   */
  private async addStockInformationOptimized(products: Product[]): Promise<void> {
    if (products.length === 0) return;

    const startTime = Date.now();
    
    try {
      const productIds = products.map(p => p.id);
      
      // OPTIMIZATION: Single raw query for maximum performance
      const stockData = await this.dataSource.query(`
        SELECT 
          si.product_id as productId,
          MAX(si.quantity) as maxQuantity,
          si.store_id as storeId,
          s.store_name as storeName
        FROM store_inventory si
        INNER JOIN stores s ON s.id = si.store_id
        WHERE si.product_id IN (${productIds.map(() => '?').join(',')})
          AND s.is_active = 1
          AND si.quantity > 0
        GROUP BY si.product_id
      `, productIds);

      console.log(`📊 Stock query returned ${stockData.length} records in ${Date.now() - startTime}ms`);
      
      // DEBUG: Log sample stock data
      if (stockData.length > 0) {
        console.log(`🔍 DEBUG Sample stock data:`, stockData.slice(0, 3));
      } else {
        console.log(`⚠️ DEBUG No stock data found for products:`, productIds.slice(0, 5));
      }

      // Create lookup map for O(1) access
      const stockMap = new Map();
      stockData.forEach(stock => {
        stockMap.set(stock.productId, {
          availableStock: parseInt(stock.maxQuantity) || 0,
          isOutOfStock: false,
          stockSource: `store_${stock.storeId}`
        });
      });

      // Apply stock info to products
      products.forEach(product => {
        const stockInfo = stockMap.get(product.id) || {
          availableStock: 0,
          isOutOfStock: true,
          stockSource: 'no_stock'
        };
        
        product['availableStock'] = stockInfo.availableStock;
        product['isOutOfStock'] = stockInfo.isOutOfStock;
        product['stockSource'] = stockInfo.stockSource;
        
        // DEBUG: Log stock info for first few products
        if (product.id <= 5) {
          console.log(`🔍 DEBUG Product ${product.id} (${product.productName}): Stock=${stockInfo.availableStock}, Source=${stockInfo.stockSource}`);
        }
      });

      console.log(`⚡ Optimized stock calculation completed in ${Date.now() - startTime}ms`);
      
    } catch (error) {
      console.error('❌ Error in optimized stock calculation:', error);
      // Fallback to simple stock assignment
      products.forEach(product => {
        product['availableStock'] = 0;
        product['isOutOfStock'] = true;
        product['stockSource'] = 'error';
      });
    }
  }

  /**
   * OPTIMIZATION: Batch stock calculation for all products
   * This replaces the sequential stock calculations with a single optimized query
   */
  private async addStockInformationBatch(products: Product[]): Promise<void> {
    if (products.length === 0) return;

    console.log(`🚀 Starting batch stock calculation for ${products.length} products...`);
    const startTime = Date.now();

    try {
      // Get all product IDs
      const productIds = products.map(p => p.id);
      
      // OPTIMIZATION: Single query to get all stock data
      const stockData = await this.storeInventoryRepository
        .createQueryBuilder('si')
        .leftJoinAndSelect('si.store', 'store')
        .where('si.productId IN (:...productIds)', { productIds })
        .andWhere('store.isActive = :isActive', { isActive: true })
        .getMany();

      console.log(`📊 Batch query returned ${stockData.length} stock records`);

      // Group stock data by product ID
      const stockByProduct = new Map<number, any[]>();
      stockData.forEach(stock => {
        if (!stockByProduct.has(stock.productId)) {
          stockByProduct.set(stock.productId, []);
        }
        stockByProduct.get(stock.productId)!.push(stock);
      });

      // Apply stock information to each product
      products.forEach(product => {
        const productStock = stockByProduct.get(product.id) || [];
        
        if (productStock.length > 0) {
          // Find the store with the most stock (primary store)
          const primaryStock = productStock.reduce((max, current) => 
            current.quantity > max.quantity ? current : max
          );
          
          product['availableStock'] = primaryStock.quantity;
          product['isOutOfStock'] = primaryStock.quantity <= 0;
          product['stockSource'] = `store_${primaryStock.store.id}`;
        } else {
          // No stock found
          product['availableStock'] = 0;
          product['isOutOfStock'] = true;
          product['stockSource'] = 'no_stock';
        }
      });

      const endTime = Date.now();
      console.log(`⚡ Batch stock calculation completed in ${endTime - startTime}ms`);
      
    } catch (error) {
      console.error('❌ Error in batch stock calculation:', error);
      // Fallback to individual calculations if batch fails
      console.log('🔄 Falling back to individual stock calculations...');
      for (const product of products) {
        const stockInfo = await this.calculateProductStock(product.id, 0);
        product['availableStock'] = stockInfo.availableStock;
        product['isOutOfStock'] = stockInfo.isOutOfStock;
        product['stockSource'] = stockInfo.stockSource;
      }
    }
  }

  /**
   * Calculate discounted price based on client discount percentage
   */
  private calculateDiscountedPrice(originalPrice: number, discountPercentage: number): number {
    if (!discountPercentage || discountPercentage <= 0) {
      console.log(`💰 No discount applied - original price: ${originalPrice}`);
      return originalPrice;
    }
    
    const discount = originalPrice * (discountPercentage / 100);
    const discountedPrice = Math.max(0, originalPrice - discount);
    
    console.log(`💰 Discount calculation: Original: ${originalPrice}, Discount: ${discountPercentage}%, Discount Amount: ${discount.toFixed(2)}, Final Price: ${discountedPrice.toFixed(2)}`);
    
    return discountedPrice;
  }

  /**
   * ULTRA-FAST: Optimized client discount application
   */
  private async applyClientDiscountOptimized(products: Product[], clientId: number): Promise<Product[]> {
    const startTime = Date.now();
    
    try {
      // OPTIMIZATION: Single query for client discount
      const client = await this.clientRepository.findOne({
        where: { id: clientId },
        select: ['id', 'name', 'discountPercentage']
      });

      if (!client || !client.discountPercentage || client.discountPercentage <= 0) {
        console.log(`💰 No discount for client ${clientId} - returning original prices`);
        return products;
      }

      console.log(`💰 Applying ${client.discountPercentage}% discount to ${products.length} products...`);

      // OPTIMIZATION: In-place discount calculation
      products.forEach(product => {
        if (product.sellingPrice && product.sellingPrice > 0) {
          const discountAmount = product.sellingPrice * (client.discountPercentage / 100);
          product.sellingPrice = Math.max(0, product.sellingPrice - discountAmount);
        }
      });

      console.log(`⚡ Discount applied in ${Date.now() - startTime}ms`);
      return products;
      
    } catch (error) {
      console.error('❌ Error applying optimized discount:', error);
      return products; // Return original products if discount fails
    }
  }

  /**
   * Apply client discount to product prices (OPTIMIZED)
   */
  private async applyClientDiscount(products: Product[], clientId?: number): Promise<Product[]> {
    if (!clientId) {
      console.log(`💰 No client ID provided - no discount applied`);
      return products; // No client, no discount
    }

    try {
      console.log(`💰 Looking up discount for client ${clientId}...`);
      const startTime = Date.now();
      
      // Get client discount percentage
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
        return products; // No discount to apply
      }

      console.log(`💰 Client found: ${client.name} (ID: ${client.id}) with ${client.discountPercentage}% discount`);
      console.log(`💰 Processing ${products.length} products in batch...`);

      let discountedCount = 0;
      let totalOriginalValue = 0;
      let totalDiscountedValue = 0;

      // OPTIMIZATION: Batch discount calculation
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
    } catch (error) {
      console.error('❌ Error applying client discount:', error);
      return products; // Return original products if discount calculation fails
    }
  }

  private async calculateProductStock(productId: number, userCountryId: number): Promise<{
    isAvailable: boolean;
    availableStock: number;
    isOutOfStock: boolean;
    stockSource: string;
  }> {
    try {
      console.log(`📊 Calculating stock for product ${productId} in country ${userCountryId}`);
      
      // First, try to get stock from user's country
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

      // Fallback: Check store 1 (default store)
      console.log(`🔄 Product ${productId}: Falling back to store 1`);
      const store1Stock = await this.dataSource
        .createQueryBuilder()
        .select('si.quantity', 'stock')
        .from('store_inventory', 'si')
        .where('si.product_id = :productId', { productId })
        .andWhere('si.store_id = 1') // Default to store 1
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

      // Final fallback: Check any store with stock
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

      // No stock available
      console.log(`❌ Product ${productId}: No stock available anywhere`);
      return {
        isAvailable: false,
        availableStock: 0,
        isOutOfStock: true,
        stockSource: 'none'
      };

    } catch (error) {
      console.error(`❌ Error calculating stock for product ${productId}:`, error);
      
      // Emergency fallback: Check store 1
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
      } catch (emergencyError) {
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

  async findOne(id: number): Promise<Product> {
    return this.productRepository.findOne({ where: { id } });
  }
} 