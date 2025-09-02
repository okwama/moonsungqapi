import { Body, Controller, Get, Param, Put, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommissionService } from './commission.service';
import { DailyCommission } from './entities/daily-commission.entity';

@Controller('commission')
@UseGuards(JwtAuthGuard)
export class CommissionController {
  constructor(private readonly commissionService: CommissionService) {}

  @Get('daily/:salesRepId')
  async calculateDailyCommission(
    @Param('salesRepId') salesRepId: string,
    @Query('date') date?: string,
  ): Promise<{ success: boolean; data: any; message: string }> {
    const targetDate = date ? new Date(date) : new Date();
    const result = await this.commissionService.calculateDailyCommission(+salesRepId, targetDate);
    await this.commissionService.saveDailyCommission(result);
    return {
      success: true,
      data: result,
      message: 'Daily commission calculated successfully',
    };
  }

  @Get('history/:salesRepId')
  async getCommissionHistory(
    @Param('salesRepId') salesRepId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<{ success: boolean; data: any[]; message: string }> {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    const history = await this.commissionService.getCommissionHistory(+salesRepId, start, end);
    return {
      success: true,
      data: history,
      message: 'Commission history retrieved successfully',
    };
  }

  @Get('summary/:salesRepId')
  async getCommissionSummary(
    @Param('salesRepId') salesRepId: string,
    @Query('period') period: string = 'current_month',
  ): Promise<{ success: boolean; data: any; message: string }> {
    const summary = await this.commissionService.getCommissionSummary(+salesRepId, period);
    return {
      success: true,
      data: summary,
      message: 'Commission summary retrieved successfully',
    };
  }

  @Put('status/:commissionId')
  async updateCommissionStatus(
    @Param('commissionId') commissionId: string,
    @Body() body: { status: string; notes?: string },
  ): Promise<{ success: boolean; data: DailyCommission; message: string }> {
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

  @Get('today/:salesRepId')
  async getTodayCommission(
    @Param('salesRepId') salesRepId: string,
  ): Promise<{ success: boolean; data: any; message: string }> {
    const today = new Date();
    const result = await this.commissionService.calculateDailyCommission(+salesRepId, today);
    return {
      success: true,
      data: result,
      message: "Today's commission calculated successfully",
    };
    }

  @Get('breakdown/:salesRepId')
  async getCommissionBreakdown(
    @Param('salesRepId') salesRepId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<{
    success: boolean;
    data: {
      dateRange: { startDate: string; endDate: string };
      summary: {
        totalCommission: number;
        totalSales: number;
        totalDays: number;
        daysWithCommission: number;
        averageDailySales: number;
        averageDailyCommission: number;
        commissionRate: number;
      };
      dailyBreakdown: any[];
    };
    message: string;
  }> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const history = await this.commissionService.getCommissionHistory(+salesRepId, start, end);

    const totalCommission = history.reduce((sum, commission) => sum + commission.commissionAmount, 0);
    const totalSales = history.reduce((sum, commission) => sum + commission.dailySalesAmount, 0);
    const totalDays = history.length;
    const daysWithCommission = history.filter((commission) => commission.commissionAmount > 0).length;

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


