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

      // OPTIMIZATION: Use date range instead of DATE() function for better index usage
      const startOfDay = new Date(nairobiTime);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(nairobiTime);
      endOfDay.setHours(23, 59, 59, 999);

      // Convert dates to strings for comparison with sessionStart (which is stored as string)
      const startOfDayStr = startOfDay.toISOString().slice(0, 19).replace('T', ' ');
      const endOfDayStr = endOfDay.toISOString().slice(0, 19).replace('T', ' ');
      
      const activeSessions = await this.loginHistoryRepository
        .createQueryBuilder('session')
        .where('session.sessionStart >= :startOfDay', { startOfDay: startOfDayStr })
        .andWhere('session.sessionStart <= :endOfDay', { endOfDay: endOfDayStr })
        .andWhere('session.status = :status', { status: 1 }) // Active sessions only
        .getMany();

      this.logger.log(`📊 Found ${activeSessions.length} active sessions to auto clockout`);

      let clockedOutCount = 0;
      let errorCount = 0;

      // OPTIMIZATION: Batch update all sessions at once instead of N+1 queries
      if (activeSessions.length > 0) {
        try {
          // Calculate durations for all sessions
          const sessionUpdates = activeSessions.map(session => {
            const startTime = new Date(session.sessionStart);
            const endTime = new Date(eightPMTimeString);
            const durationMinutes = Math.floor((endTime.getTime() - startTime.getTime()) / (1000 * 60));
            
            return {
              id: session.id,
              userId: session.userId,
              duration: durationMinutes
            };
          });

          // OPTIMIZATION: Single batch update instead of individual updates
          const sessionIds = sessionUpdates.map(s => s.id);
          await this.loginHistoryRepository
            .createQueryBuilder()
            .update(LoginHistory)
            .set({ 
              status: 2, // Ended
              sessionEnd: eightPMTimeString, // Record as 8 PM
            })
            .where('id IN (:...ids)', { ids: sessionIds })
            .execute();

          // Update durations individually (since they're different for each session)
          for (const update of sessionUpdates) {
            await this.loginHistoryRepository.update(update.id, {
              duration: update.duration,
            });
            
            this.logger.log(`✅ Auto clocked out user ${update.userId} at 8 PM (duration: ${update.duration} minutes)`);
            clockedOutCount++;
          }

        } catch (error) {
          this.logger.error(`❌ Failed to batch auto clockout: ${error.message}`);
          errorCount = activeSessions.length;
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
      // OPTIMIZATION: Use date range instead of DATE() function
      const today = new Date();
      const startOfDay = new Date(today);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(today);
      endOfDay.setHours(23, 59, 59, 999);

      // Convert dates to strings for comparison with sessionStart (which is stored as string)
      const startOfDayStr = startOfDay.toISOString().slice(0, 19).replace('T', ' ');
      const endOfDayStr = endOfDay.toISOString().slice(0, 19).replace('T', ' ');
      
      const activeSessions = await this.loginHistoryRepository
        .createQueryBuilder('session')
        .where('session.sessionStart >= :startOfDay', { startOfDay: startOfDayStr })
        .andWhere('session.sessionStart <= :endOfDay', { endOfDay: endOfDayStr })
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
