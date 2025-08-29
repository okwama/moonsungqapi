import { Repository, DataSource } from 'typeorm';
import { Product } from './entities/product.entity';
import { Store } from '../entities/store.entity';
import { StoreInventory } from '../entities/store-inventory.entity';
import { Clients } from '../entities/clients.entity';
export declare class ProductsService {
    private productRepository;
    private storeRepository;
    private storeInventoryRepository;
    private clientRepository;
    private dataSource;
    constructor(productRepository: Repository<Product>, storeRepository: Repository<Store>, storeInventoryRepository: Repository<StoreInventory>, clientRepository: Repository<Clients>, dataSource: DataSource);
    findAll(clientId?: number): Promise<Product[]>;
    findProductsByCountry(userCountryId: number, clientId?: number): Promise<Product[]>;
    private addStockInformationBatch;
    private calculateDiscountedPrice;
    private applyClientDiscount;
    private calculateProductStock;
    findOne(id: number): Promise<Product>;
}
