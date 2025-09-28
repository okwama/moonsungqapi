import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController, HealthController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductsCacheService } from './products-cache.service';
import { Product } from './entities/product.entity';
import { Store } from '../entities/store.entity';
import { StoreInventory } from '../entities/store-inventory.entity';
import { Category } from '../entities/category.entity';
import { CategoryPriceOption } from '../entities/category-price-option.entity';
import { Clients } from '../entities/clients.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Store, StoreInventory, Category, CategoryPriceOption, Clients])],
  controllers: [ProductsController, HealthController],
  providers: [ProductsService, ProductsCacheService],
  exports: [ProductsService],
})
export class ProductsModule {} 