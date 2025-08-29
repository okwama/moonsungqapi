import { SalesRep } from '../../entities/sales-rep.entity';
export declare class DailyCommission {
    id: number;
    salesRepId: number;
    commissionDate: Date;
    dailySalesAmount: number;
    commissionAmount: number;
    commissionTier: string;
    salesCount: number;
    status: string;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
    salesRep: SalesRep;
}
