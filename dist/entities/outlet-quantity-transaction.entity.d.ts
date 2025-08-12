import { Clients } from './clients.entity';
import { Product } from '../products/entities/product.entity';
export declare class OutletQuantityTransaction {
    id: number;
    clientId: number;
    productId: number;
    transactionType: 'sale' | 'return' | 'stock_adjustment' | 'void';
    quantityIn: number;
    quantityOut: number;
    previousBalance: number;
    newBalance: number;
    referenceId: number;
    referenceType: string;
    transactionDate: Date;
    userId: number;
    notes: string;
    createdAt: Date;
    client: Clients;
    product: Product;
}
