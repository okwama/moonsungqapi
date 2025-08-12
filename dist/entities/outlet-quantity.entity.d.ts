import { Clients } from './clients.entity';
import { Product } from '../products/entities/product.entity';
export declare class OutletQuantity {
    id: number;
    clientId: number;
    productId: number;
    quantity: number;
    createdAt: Date;
    client: Clients;
    product: Product;
}
