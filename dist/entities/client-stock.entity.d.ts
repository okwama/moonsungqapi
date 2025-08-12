import { Clients } from './clients.entity';
import { Product } from '../products/entities/product.entity';
import { SalesRep } from './sales-rep.entity';
export declare class ClientStock {
    id: number;
    quantity: number;
    clientId: number;
    productId: number;
    salesrepId: number;
    client: Clients;
    product: Product;
    salesRep: SalesRep;
}
