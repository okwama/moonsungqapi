import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Product } from './entities/product.entity';
import { Store } from '../entities/store.entity';
import { StoreInventory } from '../entities/store-inventory.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    @InjectRepository(StoreInventory)
    private storeInventoryRepository: Repository<StoreInventory>,
    private dataSource: DataSource,
  ) {}

  async findAll(): Promise<Product[]> {
    const maxRetries = 3;
    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔍 Fetching all active products with inventory and price options... (attempt ${attempt}/${maxRetries})`);
        
        // First, let's check if there are any products at all
        const totalProducts = await this.productRepository.count();
        console.log(`📊 Total products in database: ${totalProducts}`);
        
        const activeProducts = await this.productRepository.count({
          where: { isActive: true }
        });
        console.log(`📊 Active products in database: ${activeProducts}`);
        
        // Get products with their store inventory data and category price options
        const products = await this.productRepository
          .createQueryBuilder('product')
          .leftJoinAndSelect('product.storeInventory', 'storeInventory')
          .leftJoinAndSelect('storeInventory.store', 'store')
          .leftJoinAndSelect('product.categoryEntity', 'category')
          .leftJoinAndSelect('category.categoryPriceOptions', 'categoryPriceOptions')
          .where('product.isActive = :isActive', { isActive: true })
          .orderBy('product.productName', 'ASC')
          .getMany();

        // Add stock information to each product (using store 1 as default)
        for (const product of products) {
          const stockInfo = await this.calculateProductStock(product.id, 0); // 0 means use fallback
          product['availableStock'] = stockInfo.availableStock;
          product['isOutOfStock'] = stockInfo.isOutOfStock;
          product['stockSource'] = stockInfo.stockSource;
        }

        console.log(`✅ Found ${products.length} active products with inventory and price options data`);
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

  async findProductsByCountry(userCountryId: number): Promise<Product[]> {
    try {
      console.log(`🌍 Fetching products for country: ${userCountryId}`);
      
      // Get all products with inventory data and category price options
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

      // Process each product to calculate stock availability
      const processedProducts = [];
      
      for (const product of allProducts) {
        const stockInfo = await this.calculateProductStock(product.id, userCountryId);
        
        if (stockInfo.isAvailable) {
          // Add stock information to product
          product['availableStock'] = stockInfo.availableStock;
          product['isOutOfStock'] = stockInfo.isOutOfStock;
          product['stockSource'] = stockInfo.stockSource;
          
          // Filter store inventory to only include relevant stores
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

    } catch (error) {
      console.error('❌ Error in findProductsByCountry:', error);
      
      // Fallback: Return all products if country filtering fails
      console.log('🔄 Falling back to all products due to error');
      return this.findAll();
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