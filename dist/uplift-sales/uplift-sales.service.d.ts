import { Repository, DataSource } from 'typeorm';
import { UpliftSale } from '../entities/uplift-sale.entity';
import { UpliftSaleItem } from '../entities/uplift-sale-item.entity';
import { ClientStock } from '../entities/client-stock.entity';
import { OutletQuantityTransactionsService } from '../outlet-quantity-transactions/outlet-quantity-transactions.service';
export declare class UpliftSalesService {
    private upliftSaleRepository;
    private upliftSaleItemRepository;
    private clientStockRepository;
    private dataSource;
    private outletQuantityTransactionsService;
    constructor(upliftSaleRepository: Repository<UpliftSale>, upliftSaleItemRepository: Repository<UpliftSaleItem>, clientStockRepository: Repository<ClientStock>, dataSource: DataSource, outletQuantityTransactionsService: OutletQuantityTransactionsService);
    findAll(query: any): Promise<UpliftSale[]>;
    findOne(id: number): Promise<UpliftSale>;
    validateStock(clientId: number, items: any[]): Promise<{
        isValid: boolean;
        errors: string[];
    }>;
    deductStock(queryRunner: any, clientId: number, productId: number, quantity: number, salesrepId: number): Promise<void>;
    restoreStock(queryRunner: any, clientId: number, productId: number, quantity: number, salesrepId: number): Promise<void>;
    create(createUpliftSaleDto: any): Promise<UpliftSale>;
    update(id: number, updateUpliftSaleDto: any): Promise<UpliftSale>;
    voidSale(id: number, reason: string): Promise<UpliftSale>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
