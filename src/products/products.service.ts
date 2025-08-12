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

      // Filter products available in user's country
      const countryProducts = [];
      
      for (const product of allProducts) {
        const isAvailableInCountry = await this.isProductAvailableInCountry(
          product.id, 
          userCountryId
        );
        
        if (isAvailableInCountry) {
          // Filter store inventory to only include stores in user's country
          if (product.storeInventory) {
            product.storeInventory = product.storeInventory.filter(inventory => {
              return inventory.store && 
                     inventory.store.countryId === userCountryId && 
                     inventory.store.isActive === true &&
                     inventory.quantity > 0;
            });
          }
          
          countryProducts.push(product);
        }
      }

      console.log(`✅ Found ${countryProducts.length} products available in country ${userCountryId}`);
      return countryProducts;

    } catch (error) {
      console.error('❌ Error in findProductsByCountry:', error);
      
      // Fallback: Return all products if country filtering fails
      console.log('🔄 Falling back to all products due to error');
      return this.findAll();
    }
  }

  private async isProductAvailableInCountry(productId: number, countryId: number): Promise<boolean> {
    try {
      // Check if any store in the country has this product with stock
      const result = await this.dataSource
        .createQueryBuilder()
        .select('si.quantity')
        .from('store_inventory', 'si')
        .innerJoin('stores', 's', 's.id = si.store_id')
        .where('si.product_id = :productId', { productId })
        .andWhere('s.country_id = :countryId', { countryId })
        .andWhere('s.is_active = :isActive', { isActive: true })
        .andWhere('si.quantity > 0')
        .getRawOne();

      return !!result; // Returns true if product is available in country

    } catch (error) {
      console.error(`❌ Error checking product ${productId} availability in country ${countryId}:`, error);
      
      // Fallback: Check if product exists in store 1 (default store)
      try {
        const fallbackResult = await this.dataSource
          .createQueryBuilder()
          .select('si.quantity')
          .from('store_inventory', 'si')
          .where('si.product_id = :productId', { productId })
          .andWhere('si.store_id = 1') // Default to store 1
          .andWhere('si.quantity > 0')
          .getRawOne();

        console.log(`🔄 Product ${productId} fallback to store 1: ${!!fallbackResult}`);
        return !!fallbackResult;

      } catch (fallbackError) {
        console.error(`❌ Fallback check failed for product ${productId}:`, fallbackError);
        return false; // If even fallback fails, exclude the product
      }
    }
  }

  async findOne(id: number): Promise<Product> {
    return this.productRepository.findOne({ where: { id } });
  }
} 