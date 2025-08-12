import { SalesRep } from './sales-rep.entity';
import { Clients } from './clients.entity';
export declare class ProductReport {
    id: number;
    productName: string;
    quantity: number;
    comment: string;
    createdAt: Date;
    clientId: number;
    userId: number;
    productId: number;
    user: SalesRep;
    client: Clients;
}
