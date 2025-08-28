import { Controller, Post, Get, UseGuards } from '@nestjs/common';
import { AutoClockoutService } from './auto-clockout.service';

@Controller('auto-clockout')
export class AutoClockoutController {
  constructor(private readonly autoClockoutService: AutoClockoutService) {}

  /**
   * Manual trigger for auto clockout (for testing purposes)
   * POST /auto-clockout/trigger
   */
  @Post('trigger')
  async triggerAutoClockout() {
    try {
      await this.autoClockoutService.manualAutoClockout();
      return {
        success: true,
        message: 'Auto clockout process triggered successfully',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to trigger auto clockout',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Get auto clockout statistics
   * GET /auto-clockout/stats
   */
  @Get('stats')
  async getAutoClockoutStats() {
    try {
      const stats = await this.autoClockoutService.getAutoClockoutStats();
      return {
        success: true,
        data: stats,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to get auto clockout stats',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Get auto clockout configuration
   * GET /auto-clockout/config
   */
  @Get('config')
  async getAutoClockoutConfig() {
    return {
      success: true,
      config: {
        cronSchedule: '0 22 * * *', // 10 PM daily
        timezone: 'Africa/Nairobi',
        recordedTime: '20:00 (8 PM)',
        description: 'Auto clockout runs at 10 PM but records 8 PM as clock-out time',
        nextRun: '22:00 (10 PM) daily',
      },
      timestamp: new Date().toISOString(),
    };
  }
}
