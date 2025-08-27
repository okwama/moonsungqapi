import { SalesRep } from './sales-rep.entity';
export declare class Token {
    id: number;
    token: string;
    salesRepId: number;
    tokenType: string;
    expiresAt: Date;
    blacklisted: boolean;
    lastUsedAt: Date;
    createdAt: Date;
    salesRep: SalesRep;
}
