import { Repository } from 'typeorm';
import { OutletQuantityTransaction } from '../entities/outlet-quantity-transaction.entity';
export interface CreateTransactionDto {
    clientId: number;
    productId: number;
    transactionType: 'sale' | 'return' | 'stock_adjustment' | 'void';
    quantityIn: number;
    quantityOut: number;
    previousBalance: number;
    newBalance: number;
    referenceId?: number;
    referenceType?: string;
    userId: number;
    notes?: string;
}
export declare class OutletQuantityTransactionsService {
    private outletQuantityTransactionRepository;
    constructor(outletQuantityTransactionRepository: Repository<OutletQuantityTransaction>);
    logTransaction(createDto: CreateTransactionDto): Promise<OutletQuantityTransaction>;
    logSaleTransaction(clientId: number, productId: number, quantity: number, previousBalance: number, newBalance: number, referenceId: number, userId: number, notes?: string): Promise<OutletQuantityTransaction>;
    logVoidTransaction(clientId: number, productId: number, quantity: number, previousBalance: number, newBalance: number, referenceId: number, userId: number, notes?: string): Promise<OutletQuantityTransaction>;
    logStockAdjustment(clientId: number, productId: number, quantity: number, previousBalance: number, newBalance: number, referenceId: number, userId: number, notes?: string): Promise<OutletQuantityTransaction>;
    findByClient(clientId: number): Promise<OutletQuantityTransaction[]>;
    findByProduct(productId: number): Promise<OutletQuantityTransaction[]>;
    findByDateRange(startDate: Date, endDate: Date): Promise<OutletQuantityTransaction[]>;
    findByTransactionType(transactionType: string): Promise<OutletQuantityTransaction[]>;
    getStockLevelOnDate(clientId: number, productId: number, date: Date): Promise<number>;
}
