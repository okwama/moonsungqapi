import { Controller, Post, Get, Param, Body, UseGuards, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  async submitReport(@Body() reportData: any) {
    try {
      console.log('📋 Reports Controller: Received report submission');
      console.log('📋 Report data:', reportData);
      
      // Validate userId is provided (fallback mechanism if token is invalid)
      const userId = reportData.userId || reportData.salesRepId;
      if (!userId) {
        throw new BadRequestException('userId or salesRepId is required');
      }
      
      // Ensure userId is set in reportData
      reportData.userId = userId;
      reportData.salesRepId = userId; // Keep both for compatibility
      
      const result = await this.reportsService.submitReport(reportData);
      
      // Format response to match Flutter app expectations
      const response = {
        success: true,
        report: {
          id: result.id,
          type: reportData.type,
          journeyPlanId: reportData.journeyPlanId,
          userId: reportData.userId || reportData.salesRepId, // Use userId if available, fallback to salesRepId
          clientId: reportData.clientId,
          createdAt: result.createdAt,
        },
        specificReport: result,
        message: 'Report submitted successfully',
      };
      
      console.log('✅ Reports Controller: Report submitted successfully');
      console.log('✅ Response:', response);
      
      return response;
    } catch (error) {
      console.error('❌ Reports Controller: Report submission failed:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Get('journey-plan/:journeyPlanId')
  @UseGuards(JwtAuthGuard) // Keep JWT for GET endpoints
  async getReportsByJourneyPlan(@Param('journeyPlanId') journeyPlanId: number) {
    try {
      const reports = await this.reportsService.getReportsByJourneyPlan(journeyPlanId);
      return {
        success: true,
        data: reports,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard) // Keep JWT for GET endpoints
  async getAllReports() {
    try {
      const reports = await this.reportsService.findAll();
      return {
        success: true,
        data: reports,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
