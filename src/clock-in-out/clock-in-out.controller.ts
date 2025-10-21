import { Controller, Post, Get, Body, Param, HttpCode, HttpStatus, Query, UseGuards, Request } from '@nestjs/common';
import { ClockInOutService } from './clock-in-out.service';
import { ClockInDto, ClockOutDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('clock-in-out')
@UseGuards(JwtAuthGuard)
export class ClockInOutController {
  constructor(private readonly clockInOutService: ClockInOutService) {}

  /**
   * Clock In - Start a new session
   */
  @Post('clock-in')
  @HttpCode(HttpStatus.OK)
  async clockIn(@Body() clockInDto: ClockInDto) {
    return await this.clockInOutService.clockIn(clockInDto);
  }

  /**
   * Clock Out - End current session
   */
  @Post('clock-out')
  @HttpCode(HttpStatus.OK)
  async clockOut(@Body() clockOutDto: ClockOutDto) {
    return await this.clockInOutService.clockOut(clockOutDto);
  }

  /**
   * Get current clock status
   */
  @Get('status')
  async getCurrentStatus(
    @Request() req,
    @Query('clientTime') clientTime?: string
  ) {
    const userId = req.user?.id;
    return await this.clockInOutService.getCurrentStatus(userId, clientTime);
  }

  /**
   * Get today's sessions
   */
  @Get('today')
  async getTodaySessions(
    @Request() req,
    @Query('clientTime') clientTime?: string
  ) {
    const userId = req.user?.id;
    return await this.clockInOutService.getTodaySessions(userId, clientTime);
  }

  /**
   * Get clock history with optional date range
   */
  @Get('history')
  async getClockHistory(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const userId = req.user?.id;
    return await this.clockInOutService.getClockSessionsWithProcedure(
      userId,
      startDate,
      endDate,
    );
  }

  /**
   * Clean up stale sessions (admin/maintenance endpoint)
   */
  @Post('cleanup-stale-sessions')
  async cleanupStaleSessions() {
    return await this.clockInOutService.cleanupStaleSessions();
  }
} 