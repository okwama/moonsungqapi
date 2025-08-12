import { Clients } from './clients.entity';
import { SalesRep } from './sales-rep.entity';
import { SampleRequestItem } from './sample-request-item.entity';
export declare class SampleRequest {
    id: number;
    clientId: number;
    userId: number;
    requestNumber: string;
    requestDate: Date;
    status: string;
    notes: string;
    approvedBy: number;
    approvedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    client: Clients;
    user: SalesRep;
    sampleRequestItems: SampleRequestItem[];
}
