import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LoginHistory } from '../entities/login-history.entity';

@Injectable()
export class AutoClockoutService {
  private readonly logger = new Logger(AutoClockoutService.name);

  constructor(
    @InjectRepository(LoginHistory)
    private loginHistoryRepository: Repository<LoginHistory>,
  ) {}

  /**
   * Auto clockout all active users at 10 PM, but record 8 PM as the actual clock-out time
   * Runs every day at 22:00 (10 PM)
   */
  @Cron('0 22 * * *', {
    name: 'auto-clockout',
    timeZone: 'Africa/Nairobi',
  })
  async autoClockoutAllUsers() {
    try {
      this.logger.log('🕙 Starting auto clockout process at 10 PM...');

      // Get current date in Nairobi timezone
      const now = new Date();
      const nairobiTime = new Date(now.toLocaleString('en-US', { timeZone: 'Africa/Nairobi' }));
      
      // Create 8 PM timestamp for today (the time we want to record)
      const eightPMToday = new Date(nairobiTime);
      eightPMToday.setHours(20, 0, 0, 0); // 8 PM (20:00)
      
      // Format 8 PM time for database
      const eightPMTimeString = eightPMToday.getFullYear() + '-' + 
        String(eightPMToday.getMonth() + 1).padStart(2, '0') + '-' + 
        String(eightPMToday.getDate()).padStart(2, '0') + ' ' + 
        String(eightPMToday.getHours()).padStart(2, '0') + ':' + 
        String(eightPMToday.getMinutes()).padStart(2, '0') + ':' + 
        String(eightPMToday.getSeconds()).padStart(2, '0') + '.000';

      // Find all active sessions for today
      const todayStart = nairobiTime.getFullYear() + '-' + 
        String(nairobiTime.getMonth() + 1).padStart(2, '0') + '-' + 
        String(nairobiTime.getDate()).padStart(2, '0') + ' 00:00:00.000';

      const activeSessions = await this.loginHistoryRepository
        .createQueryBuilder('session')
        .where('DATE(session.sessionStart) = DATE(:today)', { today: todayStart })
        .andWhere('session.status = :status', { status: 1 }) // Active sessions only
        .getMany();

      this.logger.log(`📊 Found ${activeSessions.length} active sessions to auto clockout`);

      let clockedOutCount = 0;
      let errorCount = 0;

      for (const session of activeSessions) {
        try {
          // Calculate duration from session start to 8 PM
          const startTime = new Date(session.sessionStart);
          const endTime = new Date(eightPMTimeString);
          const durationMinutes = Math.floor((endTime.getTime() - startTime.getTime()) / (1000 * 60));

          // Update session to clock out at 8 PM
          await this.loginHistoryRepository.update(session.id, {
            status: 2, // Ended
            sessionEnd: eightPMTimeString, // Record as 8 PM
            duration: durationMinutes,
          });

          this.logger.log(`✅ Auto clocked out user ${session.userId} at 8 PM (duration: ${durationMinutes} minutes)`);
          clockedOutCount++;

        } catch (error) {
          this.logger.error(`❌ Failed to auto clockout user ${session.userId}: ${error.message}`);
          errorCount++;
        }
      }

      this.logger.log(`🎯 Auto clockout completed: ${clockedOutCount} users clocked out, ${errorCount} errors`);

    } catch (error) {
      this.logger.error(`💥 Auto clockout process failed: ${error.message}`);
    }
  }

  /**
   * Manual trigger for auto clockout (for testing)
   */
  async manualAutoClockout() {
    this.logger.log('🔧 Manual auto clockout triggered');
    await this.autoClockoutAllUsers();
  }

  /**
   * Get statistics about auto clockout
   */
  async getAutoClockoutStats() {
    try {
      const today = new Date();
      const todayStart = today.getFullYear() + '-' + 
        String(today.getMonth() + 1).padStart(2, '0') + '-' + 
        String(today.getDate()).padStart(2, '0') + ' 00:00:00.000';

      const activeSessions = await this.loginHistoryRepository
        .createQueryBuilder('session')
        .where('DATE(session.sessionStart) = DATE(:today)', { today: todayStart })
        .andWhere('session.status = :status', { status: 1 })
        .getCount();

      return {
        activeSessions,
        nextAutoClockout: '22:00 (10 PM) daily',
        recordedTime: '20:00 (8 PM)',
        timezone: 'Africa/Nairobi',
      };
    } catch (error) {
      this.logger.error(`Error getting auto clockout stats: ${error.message}`);
      return null;
    }
  }
}
