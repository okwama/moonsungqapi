import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Product } from './entities/product.entity';
import { Store } from '../entities/store.entity';
import { StoreInventory } from '../entities/store-inventory.entity';
import { Clients } from '../entities/clients.entity';

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
  ) {}

  async findAll(clientId?: number): Promise<Product[]> {
    const maxRetries = 3;
    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔍 Fetching all active products with inventory and price options... (attempt ${attempt}/${maxRetries})`);
        console.log(`🔍 Client ID parameter: ${clientId}`);
        
        // OPTIMIZATION: Single query with all data
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

        // OPTIMIZATION: Batch stock calculation instead of sequential
        await this.addStockInformationBatch(products);

        console.log(`✅ Found ${products.length} active products with inventory and price options data`);
        
        // Apply client discount if clientId is provided
        if (clientId) {
          console.log(`💰 About to apply discount for client ${clientId}`);
          const discountedProducts = await this.applyClientDiscount(products, clientId);
          console.log(`💰 Applied discount for client ${clientId} - returned ${discountedProducts.length} products`);
          return discountedProducts;
        } else {
          console.log(`💰 No client ID provided - returning products without discount`);
        }
        
        return products;
      } catch (error) {
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

      // Filter products based on availability
      const processedProducts = allProducts.filter(product => {
        const availableStock = product['availableStock'] || 0;
        return availableStock > 0;
      });

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