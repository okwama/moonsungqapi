import { Clients } from './clients.entity';
import { SalesRep } from './sales-rep.entity';
export declare class ClientPayment {
    id: number;
    clientId: number;
    salesrepId: number;
    amount: number;
    imageUrl: string;
    payment_method: string;
    status: string;
    date: Date;
    client: Clients;
    salesRep: SalesRep;
}
