import { SalesRep } from './sales-rep.entity';
import { AssetRequestItem } from './asset-request-item.entity';
export declare class AssetRequest {
    id: number;
    requestNumber: string;
    salesRepId: number;
    requestDate: Date;
    status: string;
    notes: string;
    approvedBy: number;
    approvedAt: Date;
    assignedBy: number;
    assignedAt: Date;
    returnDate: Date;
    createdAt: Date;
    updatedAt: Date;
    salesRep: SalesRep;
    approver: SalesRep;
    assigner: SalesRep;
    items: AssetRequestItem[];
}
