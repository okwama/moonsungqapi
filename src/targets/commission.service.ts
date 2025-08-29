import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpliftSale } from '../entities/uplift-sale.entity';
import { SalesRep } from '../entities/sales-rep.entity';
import { CommissionConfig } from './entities/commission-config.entity';
import { DailyCommission } from './entities/daily-commission.entity';

@Injectable()
export class CommissionService {
  private readonly logger = new Logger(CommissionService.name);

  constructor(
    @InjectRepository(UpliftSale)
    private upliftSaleRepository: Repository<UpliftSale>,
    @InjectRepository(SalesRep)
    private salesRepRepository: Repository<SalesRep>,
    @InjectRepository(CommissionConfig)
    private commissionConfigRepository: Repository<CommissionConfig>,
    @InjectRepository(DailyCommission)
    private dailyCommissionRepository: Repository<DailyCommission>,
  ) {}

  /**
   * Calculate daily commission for a sales rep
   */
  async calculateDailyCommission(
    salesRepId: number,
    date: Date = new Date(),
  ): Promise<any> {
    try {
      this.logger.log(`Calculating daily commission for sales rep ${salesRepId} on ${date.toISOString().split('T')[0]}`);

      // Get daily sales for the sales rep
      const dailySales = await this.getDailySales(salesRepId, date);
      
      if (!dailySales || dailySales.totalAmount === 0) {
        return {
          salesRepId,
          date: date.toISOString().split('T')[0],
          dailySalesAmount: 0,
          commissionAmount: 0,
          commissionTier: 'No Sales',
          salesCount: 0,
          message: 'No sales found for this date',
        };
      }

      // Get commission configuration
      const commissionConfig = await this.getCommissionConfig();
      
      // Calculate commission based on daily sales amount
      const commissionCalculation = this.calculateCommissionAmount(
        dailySales.totalAmount,
        commissionConfig,
      );

      const result = {
        salesRepId,
        date: date.toISOString().split('T')[0],
        dailySalesAmount: dailySales.totalAmount,
        commissionAmount: commissionCalculation.commissionAmount,
        commissionTier: commissionCalculation.tierName,
        salesCount: dailySales.salesCount,
        salesBreakdown: dailySales.sales,
        commissionConfig: commissionCalculation.config,
      };

      this.logger.log(`Commission calculation result: ${JSON.stringify(result)}`);
      return result;

    } catch (error) {
      this.logger.error(`Error calculating daily commission: ${error.message}`);
      throw new Error(`Failed to calculate daily commission: ${error.message}`);
    }
  }

  /**
   * Get daily sales for a sales rep
   */
  private async getDailySales(salesRepId: number, date: Date): Promise<any> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const sales = await this.upliftSaleRepository
      .createQueryBuilder('sale')
      .select([
        'sale.id',
        'sale.totalAmount',
        'sale.createdAt',
        'sale.status',
        'sale.comment'
      ])
      .where('sale.userId = :salesRepId', { salesRepId })
      .andWhere('sale.createdAt >= :startOfDay', { startOfDay })
      .andWhere('sale.createdAt <= :endOfDay', { endOfDay })
      .andWhere('sale.status = :status', { status: 1 }) // Only completed sales
      .orderBy('sale.createdAt', 'ASC')
      .getMany();

    const totalAmount = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const salesCount = sales.length;

    return {
      totalAmount,
      salesCount,
      sales: sales.map(sale => ({
        id: sale.id,
        amount: sale.totalAmount,
        time: sale.createdAt,
        comment: sale.comment,
      })),
    };
  }

  /**
   * Get commission configuration
   */
  private async getCommissionConfig(): Promise<CommissionConfig[]> {
    const configs = await this.commissionConfigRepository
      .createQueryBuilder('config')
      .where('config.isActive = :isActive', { isActive: true })
      .orderBy('config.minAmount', 'ASC')
      .getMany();

    // If no configs exist, create default ones
    if (configs.length === 0) {
      await this.createDefaultCommissionConfigs();
      return await this.getCommissionConfig();
    }

    return configs;
  }

  /**
   * Create default commission configurations
   */
  private async createDefaultCommissionConfigs(): Promise<void> {
    const defaultConfigs = [
      {
        tierName: 'Bronze Tier',
        minAmount: 0,
        maxAmount: 14999.99,
        commissionAmount: 0,
        description: 'No commission for sales below 15,000',
      },
      {
        tierName: 'Silver Tier',
        minAmount: 15000,
        maxAmount: 19999.99,
        commissionAmount: 500,
        description: '500 commission for sales 15,000 - 19,999',
      },
      {
        tierName: 'Gold Tier',
        minAmount: 20000,
        maxAmount: null,
        commissionAmount: 1000,
        description: '1000 commission for sales 20,000 and above',
      },
    ];

    for (const config of defaultConfigs) {
      const newConfig = this.commissionConfigRepository.create(config);
      await this.commissionConfigRepository.save(newConfig);
    }

    this.logger.log('Default commission configurations created');
  }

  /**
   * Calculate commission amount based on daily sales
   */
  private calculateCommissionAmount(
    dailySalesAmount: number,
    commissionConfigs: CommissionConfig[],
  ): any {
    // Find the appropriate commission tier
    const applicableConfig = commissionConfigs.find(config => {
      const meetsMin = dailySalesAmount >= config.minAmount;
      const meetsMax = config.maxAmount === null || dailySalesAmount <= config.maxAmount;
      return meetsMin && meetsMax;
    });

    if (!applicableConfig) {
      return {
        commissionAmount: 0,
        tierName: 'No Tier',
        config: null,
      };
    }

    return {
      commissionAmount: applicableConfig.commissionAmount,
      tierName: applicableConfig.tierName,
      config: {
        minAmount: applicableConfig.minAmount,
        maxAmount: applicableConfig.maxAmount,
        description: applicableConfig.description,
      },
    };
  }

  /**
   * Save daily commission record
   */
  async saveDailyCommission(commissionData: any): Promise<DailyCommission> {
    try {
      const existingCommission = await this.dailyCommissionRepository.findOne({
        where: {
          salesRepId: commissionData.salesRepId,
          commissionDate: new Date(commissionData.date),
        },
      });

      if (existingCommission) {
        // Update existing record
        existingCommission.dailySalesAmount = commissionData.dailySalesAmount;
        existingCommission.commissionAmount = commissionData.commissionAmount;
        existingCommission.commissionTier = commissionData.commissionTier;
        existingCommission.salesCount = commissionData.salesCount;
        existingCommission.updatedAt = new Date();
        
        return await this.dailyCommissionRepository.save(existingCommission);
      } else {
        // Create new record
        const newCommission = this.dailyCommissionRepository.create({
          salesRepId: commissionData.salesRepId,
          commissionDate: new Date(commissionData.date),
          dailySalesAmount: commissionData.dailySalesAmount,
          commissionAmount: commissionData.commissionAmount,
          commissionTier: commissionData.commissionTier,
          salesCount: commissionData.salesCount,
          status: 'pending',
        });

        return await this.dailyCommissionRepository.save(newCommission);
      }
    } catch (error) {
      this.logger.error(`Error saving daily commission: ${error.message}`);
      throw new Error(`Failed to save daily commission: ${error.message}`);
    }
  }

  /**
   * Get commission history for a sales rep
   */
  async getCommissionHistory(
    salesRepId: number,
    startDate?: Date,
    endDate?: Date,
  ): Promise<any[]> {
    try {
      const queryBuilder = this.dailyCommissionRepository
        .createQueryBuilder('commission')
        .where('commission.salesRepId = :salesRepId', { salesRepId })
        .orderBy('commission.commissionDate', 'DESC');

      if (startDate) {
        queryBuilder.andWhere('commission.commissionDate >= :startDate', { startDate });
      }

      if (endDate) {
        queryBuilder.andWhere('commission.commissionDate <= :endDate', { endDate });
      }

      const commissions = await queryBuilder.getMany();

      return commissions.map(commission => ({
        id: commission.id,
        date: commission.commissionDate,
        dailySalesAmount: commission.dailySalesAmount,
        commissionAmount: commission.commissionAmount,
        commissionTier: commission.commissionTier,
        salesCount: commission.salesCount,
        status: commission.status,
        createdAt: commission.createdAt,
      }));
    } catch (error) {
      this.logger.error(`Error getting commission history: ${error.message}`);
      throw new Error(`Failed to get commission history: ${error.message}`);
    }
  }

  /**
   * Get commission summary for a sales rep
   */
  async getCommissionSummary(salesRepId: number, period: string = 'current_month'): Promise<any> {
    try {
      const currentDate = new Date();
      let startDate: Date;
      let endDate: Date;

      // Calculate date range based on period
      switch (period) {
        case 'current_month':
          startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
          endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
          break;
        case 'last_month':
          startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
          endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
          break;
        case 'current_year':
          startDate = new Date(currentDate.getFullYear(), 0, 1);
          endDate = new Date(currentDate.getFullYear(), 11, 31);
          break;
        default:
          startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
          endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      }

      const commissions = await this.getCommissionHistory(salesRepId, startDate, endDate);

      const totalCommission = commissions.reduce((sum, commission) => sum + commission.commissionAmount, 0);
      const totalSales = commissions.reduce((sum, commission) => sum + commission.dailySalesAmount, 0);
      const totalDays = commissions.length;
      const averageDailySales = totalDays > 0 ? totalSales / totalDays : 0;

      // Get tier breakdown
      const tierBreakdown = commissions.reduce((acc, commission) => {
        const tier = commission.commissionTier;
        if (!acc[tier]) {
          acc[tier] = { count: 0, totalCommission: 0 };
        }
        acc[tier].count++;
        acc[tier].totalCommission += commission.commissionAmount;
        return acc;
      }, {});

      return {
        period,
        dateRange: {
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
        },
        summary: {
          totalCommission,
          totalSales,
          totalDays,
          averageDailySales,
          averageDailyCommission: totalDays > 0 ? totalCommission / totalDays : 0,
        },
        tierBreakdown,
        commissions,
      };
    } catch (error) {
      this.logger.error(`Error getting commission summary: ${error.message}`);
      throw new Error(`Failed to get commission summary: ${error.message}`);
    }
  }

  /**
   * Update commission status
   */
  async updateCommissionStatus(
    commissionId: number,
    status: string,
    notes?: string,
  ): Promise<DailyCommission> {
    try {
      const commission = await this.dailyCommissionRepository.findOne({
        where: { id: commissionId },
      });

      if (!commission) {
        throw new Error('Commission record not found');
      }

      commission.status = status;
      if (notes) {
        commission.notes = notes;
      }
      commission.updatedAt = new Date();

      return await this.dailyCommissionRepository.save(commission);
    } catch (error) {
      this.logger.error(`Error updating commission status: ${error.message}`);
      throw new Error(`Failed to update commission status: ${error.message}`);
    }
  }
}
