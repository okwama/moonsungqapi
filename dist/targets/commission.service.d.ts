import { Repository } from 'typeorm';
import { UpliftSale } from '../entities/uplift-sale.entity';
import { SalesRep } from '../entities/sales-rep.entity';
import { CommissionConfig } from './entities/commission-config.entity';
import { DailyCommission } from './entities/daily-commission.entity';
export declare class CommissionService {
    private upliftSaleRepository;
    private salesRepRepository;
    private commissionConfigRepository;
    private dailyCommissionRepository;
    private readonly logger;
    constructor(upliftSaleRepository: Repository<UpliftSale>, salesRepRepository: Repository<SalesRep>, commissionConfigRepository: Repository<CommissionConfig>, dailyCommissionRepository: Repository<DailyCommission>);
    calculateDailyCommission(salesRepId: number, date?: Date): Promise<any>;
    private getDailySales;
    private getCommissionConfig;
    private createDefaultCommissionConfigs;
    private calculateCommissionAmount;
    saveDailyCommission(commissionData: any): Promise<DailyCommission>;
    getCommissionHistory(salesRepId: number, startDate?: Date, endDate?: Date): Promise<any[]>;
    getCommissionSummary(salesRepId: number, period?: string): Promise<any>;
    updateCommissionStatus(commissionId: number, status: string, notes?: string): Promise<DailyCommission>;
}
