import { SalesRep } from './sales-rep.entity';
import { Clients } from './clients.entity';
import { UpliftSaleItem } from './uplift-sale-item.entity';
export declare class UpliftSale {
    id: number;
    clientId: number;
    userId: number;
    status: number;
    totalAmount: number;
    createdAt: Date;
    updatedAt: Date;
    comment: string;
    client: Clients;
    user: SalesRep;
    upliftSaleItems: UpliftSaleItem[];
}
