import { Controller, Get, Post, Put, Param, Query, Body, UseGuards } from '@nestjs/common';
import { CommissionService } from './commission.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('commission')
@UseGuards(JwtAuthGuard)
export class CommissionController {
  constructor(private readonly commissionService: CommissionService) {}

  /**
   * Calculate daily commission for a sales rep
   */
  @Get('daily/:salesRepId')
  async calculateDailyCommission(
    @Param('salesRepId') salesRepId: string,
    @Query('date') date?: string,
  ) {
    const targetDate = date ? new Date(date) : new Date();
    const result = await this.commissionService.calculateDailyCommission(
      +salesRepId,
      targetDate,
    );
    
    // Save the commission record
    await this.commissionService.saveDailyCommission(result);
    
    return {
      success: true,
      data: result,
      message: 'Daily commission calculated successfully',
    };
  }

  /**
   * Get commission history for a sales rep
   */
  @Get('history/:salesRepId')
  async getCommissionHistory(
    @Param('salesRepId') salesRepId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    
    const history = await this.commissionService.getCommissionHistory(
      +salesRepId,
      start,
      end,
    );

    return {
      success: true,
      data: history,
      message: 'Commission history retrieved successfully',
    };
  }

  /**
   * Get commission summary for a sales rep
   */
  @Get('summary/:salesRepId')
  async getCommissionSummary(
    @Param('salesRepId') salesRepId: string,
    @Query('period') period: string = 'current_month',
  ) {
    const summary = await this.commissionService.getCommissionSummary(
      +salesRepId,
      period,
    );

    return {
      success: true,
      data: summary,
      message: 'Commission summary retrieved successfully',
    };
  }

  /**
   * Update commission status
   */
  @Put('status/:commissionId')
  async updateCommissionStatus(
    @Param('commissionId') commissionId: string,
    @Body() body: { status: string; notes?: string },
  ) {
    const updatedCommission = await this.commissionService.updateCommissionStatus(
      +commissionId,
      body.status,
      body.notes,
    );

    return {
      success: true,
      data: updatedCommission,
      message: 'Commission status updated successfully',
    };
  }

  /**
   * Get today's commission for a sales rep
   */
  @Get('today/:salesRepId')
  async getTodayCommission(@Param('salesRepId') salesRepId: string) {
    const today = new Date();
    const result = await this.commissionService.calculateDailyCommission(
      +salesRepId,
      today,
    );

    return {
      success: true,
      data: result,
      message: 'Today\'s commission calculated successfully',
    };
  }

  /**
   * Get commission breakdown for a specific date range
   */
  @Get('breakdown/:salesRepId')
  async getCommissionBreakdown(
    @Param('salesRepId') salesRepId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const history = await this.commissionService.getCommissionHistory(
      +salesRepId,
      start,
      end,
    );

    // Calculate breakdown statistics
    const totalCommission = history.reduce((sum, commission) => sum + commission.commissionAmount, 0);
    const totalSales = history.reduce((sum, commission) => sum + commission.dailySalesAmount, 0);
    const totalDays = history.length;
    const daysWithCommission = history.filter(commission => commission.commissionAmount > 0).length;

    const breakdown = {
      dateRange: {
        startDate: startDate,
        endDate: endDate,
      },
      summary: {
        totalCommission,
        totalSales,
        totalDays,
        daysWithCommission,
        averageDailySales: totalDays > 0 ? totalSales / totalDays : 0,
        averageDailyCommission: totalDays > 0 ? totalCommission / totalDays : 0,
        commissionRate: totalSales > 0 ? (totalCommission / totalSales) * 100 : 0,
      },
      dailyBreakdown: history,
    };

    return {
      success: true,
      data: breakdown,
      message: 'Commission breakdown retrieved successfully',
    };
  }
}
