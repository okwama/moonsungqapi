import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginHistory } from '../entities/login-history.entity';
import { JourneyPlan } from '../journey-plans/entities/journey-plan.entity';
import { UpliftSale } from '../entities/uplift-sale.entity';
import { ProductReport } from '../entities/product-report.entity';
import { FeedbackReport } from '../entities/feedback-report.entity';
import { VisibilityReport } from '../entities/visibility-report.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(LoginHistory)
    private loginHistoryRepository: Repository<LoginHistory>,
    @InjectRepository(JourneyPlan)
    private journeyPlanRepository: Repository<JourneyPlan>,
    @InjectRepository(UpliftSale)
    private upliftSaleRepository: Repository<UpliftSale>,
    @InjectRepository(ProductReport)
    private productReportRepository: Repository<ProductReport>,
    @InjectRepository(FeedbackReport)
    private feedbackReportRepository: Repository<FeedbackReport>,
    @InjectRepository(VisibilityReport)
    private visibilityReportRepository: Repository<VisibilityReport>,
  ) {}

  async findAll(query: any) {
    try {
      const userId = query.userId ? parseInt(query.userId, 10) : null;
      const startDate = query.startDate ? new Date(query.startDate) : null;
      const endDate = query.endDate ? new Date(query.endDate) : null;

      const analytics = {
        loginStats: await this._getLoginStats(userId, startDate, endDate),
        journeyStats: await this._getJourneyStats(userId, startDate, endDate),
        salesStats: await this._getSalesStats(userId, startDate, endDate),
        reportStats: await this._getReportStats(userId, startDate, endDate),
      };

      return analytics;
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      throw new Error('Failed to fetch analytics data');
    }
  }

  async findOne(id: number) {
    try {
      // Return user-specific analytics
      const userId = id;
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1); // Last 30 days
      const endDate = new Date();

      return {
        loginStats: await this._getLoginStats(userId, startDate, endDate),
        journeyStats: await this._getJourneyStats(userId, startDate, endDate),
        salesStats: await this._getSalesStats(userId, startDate, endDate),
        reportStats: await this._getReportStats(userId, startDate, endDate),
      };
    } catch (error) {
      console.error('Error fetching analytics by ID:', error);
      throw new Error('Failed to fetch analytics data');
    }
  }

  async create(createAnalyticsDto: any) {
    try {
      // Analytics data is derived from existing tables, so we don't create new records
      // Instead, we can log analytics events or return a success message
      return { message: 'Analytics data is automatically generated from user activities' };
    } catch (error) {
      console.error('Error creating analytics data:', error);
      throw new Error('Failed to create analytics data');
    }
  }

  async update(id: number, updateAnalyticsDto: any) {
    try {
      // Analytics data is derived from existing tables, so we don't update records
      return { message: 'Analytics data is automatically updated from user activities' };
    } catch (error) {
      console.error('Error updating analytics data:', error);
      throw new Error('Failed to update analytics data');
    }
  }

  async remove(id: number) {
    try {
      // Analytics data is derived from existing tables, so we don't delete records
      return { message: 'Analytics data is automatically managed from user activities' };
    } catch (error) {
      console.error('Error deleting analytics data:', error);
      throw new Error('Failed to delete analytics data');
    }
  }

  async getDailyLoginHours(userId: number, query: any) {
    try {
      const startDate = query.startDate ? new Date(query.startDate) : new Date();
      const endDate = query.endDate ? new Date(query.endDate) : new Date();
      
      const queryBuilder = this.loginHistoryRepository.createQueryBuilder('login');
      queryBuilder
        .where('login.userId = :userId', { userId })
        .andWhere('login.sessionStart >= :startDate', { startDate })
        .andWhere('login.sessionStart <= :endDate', { endDate });

      const logins = await queryBuilder.getMany();
      
      // Group by date and calculate daily hours
      const dailyHours = {};
      logins.forEach(login => {
        const date = login.sessionStart ? new Date(login.sessionStart).toISOString().split('T')[0] : null;
        if (date) {
          dailyHours[date] = (dailyHours[date] || 0) + (login.duration || 0);
        }
      });

      return dailyHours;
    } catch (error) {
      console.error('Error fetching daily login hours:', error);
      throw new Error('Failed to fetch daily login hours');
    }
  }

  async getDailyJourneyVisits(userId: number, query: any) {
    try {
      const startDate = query.startDate ? new Date(query.startDate) : new Date();
      const endDate = query.endDate ? new Date(query.endDate) : new Date();
      
      const queryBuilder = this.journeyPlanRepository.createQueryBuilder('journey');
      queryBuilder
        .where('journey.userId = :userId', { userId })
        .andWhere('journey.date >= :startDate', { startDate })
        .andWhere('journey.date <= :endDate', { endDate });

      const journeys = await queryBuilder.getMany();
      
      // Group by date and count visits
      const dailyVisits = {};
      journeys.forEach(journey => {
        const date = journey.date ? new Date(journey.date).toISOString().split('T')[0] : null;
        if (date) {
          dailyVisits[date] = (dailyVisits[date] || 0) + 1;
        }
      });

      return dailyVisits;
    } catch (error) {
      console.error('Error fetching daily journey visits:', error);
      throw new Error('Failed to fetch daily journey visits');
    }
  }

  // Helper methods for different types of statistics
  private async _getLoginStats(userId: number | null, startDate: Date | null, endDate: Date | null) {
    const queryBuilder = this.loginHistoryRepository.createQueryBuilder('login');
    
    if (userId) {
      queryBuilder.where('login.userId = :userId', { userId });
    }
    
    if (startDate) {
      queryBuilder.andWhere('login.sessionStart >= :startDate', { startDate });
    }
    
    if (endDate) {
      queryBuilder.andWhere('login.sessionStart <= :endDate', { endDate });
    }

    const logins = await queryBuilder.getMany();
    
    return {
      totalSessions: logins.length,
      totalDuration: logins.reduce((sum, login) => sum + (login.duration || 0), 0),
      averageDuration: logins.length > 0 ? logins.reduce((sum, login) => sum + (login.duration || 0), 0) / logins.length : 0,
      activeDays: new Set(logins.map(login => login.sessionStart ? new Date(login.sessionStart).toDateString() : null)).size,
    };
  }

  private async _getJourneyStats(userId: number | null, startDate: Date | null, endDate: Date | null) {
    const queryBuilder = this.journeyPlanRepository.createQueryBuilder('journey');
    
    if (userId) {
      queryBuilder.where('journey.userId = :userId', { userId });
    }
    
    if (startDate) {
      queryBuilder.andWhere('journey.date >= :startDate', { startDate });
    }
    
    if (endDate) {
      queryBuilder.andWhere('journey.date <= :endDate', { endDate });
    }

    const journeys = await queryBuilder.getMany();
    
    return {
      totalJourneys: journeys.length,
      completedJourneys: journeys.filter(j => j.status === 1).length,
      pendingJourneys: journeys.filter(j => j.status === 0).length,
      checkInRate: journeys.length > 0 ? (journeys.filter(j => j.checkInTime != null).length / journeys.length) * 100 : 0,
    };
  }

  private async _getSalesStats(userId: number | null, startDate: Date | null, endDate: Date | null) {
    const queryBuilder = this.upliftSaleRepository.createQueryBuilder('sale');
    
    if (userId) {
      queryBuilder.where('sale.userId = :userId', { userId });
    }
    
    if (startDate) {
      queryBuilder.andWhere('sale.createdAt >= :startDate', { startDate });
    }
    
    if (endDate) {
      queryBuilder.andWhere('sale.createdAt <= :endDate', { endDate });
    }

    const sales = await queryBuilder.getMany();
    
    return {
      totalSales: sales.length,
      totalAmount: sales.reduce((sum, sale) => sum + sale.totalAmount, 0),
      averageAmount: sales.length > 0 ? sales.reduce((sum, sale) => sum + sale.totalAmount, 0) / sales.length : 0,
      completedSales: sales.filter(s => s.status === 1).length, // 1 = active/completed
      pendingSales: sales.filter(s => s.status === 0).length,   // 0 = voided
    };
  }

  private async _getReportStats(userId: number | null, startDate: Date | null, endDate: Date | null) {
    const productReports = await this.productReportRepository.createQueryBuilder('report')
      .where(userId ? 'report.userId = :userId' : '1=1', userId ? { userId } : {})
      .getMany();
    
    const feedbackReports = await this.feedbackReportRepository.createQueryBuilder('report')
      .where(userId ? 'report.userId = :userId' : '1=1', userId ? { userId } : {})
      .getMany();
    
    const visibilityReports = await this.visibilityReportRepository.createQueryBuilder('report')
      .where(userId ? 'report.userId = :userId' : '1=1', userId ? { userId } : {})
      .getMany();
    
    return {
      totalReports: productReports.length + feedbackReports.length + visibilityReports.length,
      productReports: productReports.length,
      feedbackReports: feedbackReports.length,
      visibilityReports: visibilityReports.length,
    };
  }
} 