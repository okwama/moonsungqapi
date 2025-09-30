import { Repository, DataSource } from 'typeorm';
import { Product } from './entities/product.entity';
import { Store } from '../entities/store.entity';
import { StoreInventory } from '../entities/store-inventory.entity';
import { Clients } from '../entities/clients.entity';
import { ProductsCacheService } from './products-cache.service';
export declare class ProductsService {
    private productRepository;
    private storeRepository;
    private storeInventoryRepository;
    private clientRepository;
    private dataSource;
    private cacheService;
    constructor(productRepository: Repository<Product>, storeRepository: Repository<Store>, storeInventoryRepository: Repository<StoreInventory>, clientRepository: Repository<Clients>, dataSource: DataSource, cacheService: ProductsCacheService);
    findAllPaginated(options: {
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
    }>;
    findAll(clientId?: number): Promise<Product[]>;
    findProductsByCountry(userCountryId: number, clientId?: number): Promise<Product[]>;
    private addStockInformationOptimized;
    private addStockInformationBatch;
    private calculateDiscountedPrice;
    private applyClientDiscountOptimized;
    private applyClientDiscount;
    private calculateProductStock;
    findOne(id: number): Promise<Product>;
}
