import { SalesRep } from './sales-rep.entity';
import { Clients } from './clients.entity';
export declare class FeedbackReport {
    id: number;
    comment: string;
    createdAt: Date;
    clientId: number;
    userId: number;
    user: SalesRep;
    client: Clients;
}
