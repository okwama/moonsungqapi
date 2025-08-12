import { Controller, Post, Get, Body, Param, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ClockInOutService } from './clock-in-out.service';
import { ClockInDto, ClockOutDto } from './dto';

@Controller('clock-in-out')
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
  @Get('status/:userId')
  async getCurrentStatus(
    @Param('userId') userId: string,
    @Query('clientTime') clientTime?: string
  ) {
    return await this.clockInOutService.getCurrentStatus(parseInt(userId), clientTime);
  }

  /**
   * Get today's sessions
   */
  @Get('today/:userId')
  async getTodaySessions(
    @Param('userId') userId: string,
    @Query('clientTime') clientTime?: string
  ) {
    return await this.clockInOutService.getTodaySessions(parseInt(userId), clientTime);
  }

  /**
   * Get clock history with optional date range
   */
  @Get('history/:userId')
  async getClockHistory(
    @Param('userId') userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return await this.clockInOutService.getClockSessionsWithProcedure(
      parseInt(userId),
      startDate,
      endDate,
    );
  }
} 