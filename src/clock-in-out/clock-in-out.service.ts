import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { LoginHistory } from '../entities/login-history.entity';
import { ClockInDto } from './dto/clock-in.dto';
import { ClockOutDto } from './dto/clock-out.dto';

@Injectable()
export class ClockInOutService {
  private readonly logger = new Logger(ClockInOutService.name);

  constructor(
    @InjectRepository(LoginHistory)
    private loginHistoryRepository: Repository<LoginHistory>,
    private dataSource: DataSource,
  ) {}

  /**
   * Clock In - Start or resume daily session
   */
  async clockIn(clockInDto: ClockInDto): Promise<{ success: boolean; message: string; sessionId?: number }> {
    try {
      const { userId, clientTime } = clockInDto;

      this.logger.log(`🟢 Clock In attempt for user ${userId} at ${clientTime}`);

      // Get today's date (start of day) for finding existing records
      const today = new Date(clientTime);
      today.setHours(0, 0, 0, 0);
      const todayStart = today.getFullYear() + '-' + 
        String(today.getMonth() + 1).padStart(2, '0') + '-' + 
        String(today.getDate()).padStart(2, '0') + ' 00:00:00.000';
      
      // Format the actual client time for sessionStart
      const actualTime = new Date(clientTime);
      const sessionStartTime = actualTime.getFullYear() + '-' + 
        String(actualTime.getMonth() + 1).padStart(2, '0') + '-' + 
        String(actualTime.getDate()).padStart(2, '0') + ' ' + 
        String(actualTime.getHours()).padStart(2, '0') + ':' + 
        String(actualTime.getMinutes()).padStart(2, '0') + ':' + 
        String(actualTime.getSeconds()).padStart(2, '0') + '.000';

      // Check if user already has a record for today (using date range)
      const todayRecord = await this.loginHistoryRepository
        .createQueryBuilder('session')
        .where('session.userId = :userId', { userId })
        .andWhere('DATE(session.sessionStart) = DATE(:clientDate)', { clientDate: clientTime })
        .getOne();

      if (todayRecord) {
        // Update existing record - resume session
        await this.loginHistoryRepository.update(todayRecord.id, {
          status: 1, // Active
          sessionEnd: null, // Clear end time
          duration: 0, // Reset duration
        });

        this.logger.log(`✅ User ${userId} resumed session. Record ID: ${todayRecord.id}`);

        return {
          success: true,
          message: 'Successfully resumed session',
          sessionId: todayRecord.id,
        };
      } else {
        // Create new record for today
      const newSession = this.loginHistoryRepository.create({
        userId,
        status: 1, // Active
          sessionStart: sessionStartTime, // Use actual clock-in time
          sessionEnd: null,
        timezone: 'Africa/Nairobi',
          duration: 0,
      });

      const savedSession = await this.loginHistoryRepository.save(newSession);

        this.logger.log(`✅ User ${userId} started new session. Record ID: ${savedSession.id}`);

      return {
        success: true,
          message: 'Successfully started new session',
        sessionId: savedSession.id,
      };
      }
    } catch (error) {
      this.logger.error(`❌ Clock In failed for user ${clockInDto.userId}: ${error.message}`);
      return {
        success: false,
        message: 'Failed to clock in. Please try again.',
      };
    }
  }

  /**
   * Clock Out - End current session (but keep record for potential resume)
   */
  async clockOut(clockOutDto: ClockOutDto): Promise<{ success: boolean; message: string; duration?: number }> {
    try {
      const { userId, clientTime } = clockOutDto;

      this.logger.log(`🔴 Clock Out attempt for user ${userId} at ${clientTime}`);

      // Get today's date (start of day) for finding existing records
      const today = new Date(clientTime);
      today.setHours(0, 0, 0, 0);
      const todayStart = today.getFullYear() + '-' + 
        String(today.getMonth() + 1).padStart(2, '0') + '-' + 
        String(today.getDate()).padStart(2, '0') + ' 00:00:00.000';
      
      // Format the actual client time for sessionEnd
      const actualTime = new Date(clientTime);
      const sessionEndTime = actualTime.getFullYear() + '-' + 
        String(actualTime.getMonth() + 1).padStart(2, '0') + '-' + 
        String(actualTime.getDate()).padStart(2, '0') + ' ' + 
        String(actualTime.getHours()).padStart(2, '0') + ':' + 
        String(actualTime.getMinutes()).padStart(2, '0') + ':' + 
        String(actualTime.getSeconds()).padStart(2, '0') + '.000';

      // Find today's record (using date range)
      const todayRecord = await this.loginHistoryRepository
        .createQueryBuilder('session')
        .where('session.userId = :userId', { userId })
        .andWhere('DATE(session.sessionStart) = DATE(:clientDate)', { clientDate: clientTime })
        .getOne();

      if (!todayRecord) {
        this.logger.warn(`⚠️ User ${userId} has no session record for today`);
        return {
          success: false,
          message: 'No active session found for today.',
        };
      }

      if (todayRecord.status === 2 && todayRecord.sessionEnd) {
        this.logger.warn(`⚠️ User ${userId} session already ended for today`);
        return {
          success: false,
          message: 'Session already ended for today.',
        };
      }

      // Calculate total duration for the day
      const startTime = new Date(todayRecord.sessionStart);
      const endTime = new Date(clientTime);
      const durationMinutes = Math.floor((endTime.getTime() - startTime.getTime()) / (1000 * 60));

      // Update record - end session but keep it for potential resume
      await this.loginHistoryRepository.update(todayRecord.id, {
        status: 2, // Ended
        sessionEnd: sessionEndTime, // Use formatted time
        duration: durationMinutes,
      });

      this.logger.log(`✅ User ${userId} ended session. Total duration: ${durationMinutes} minutes`);

      return {
        success: true,
        message: 'Successfully ended session',
        duration: durationMinutes,
      };
    } catch (error) {
      this.logger.error(`❌ Clock Out failed for user ${clockOutDto.userId}: ${error.message}`);
      return {
        success: false,
        message: 'Failed to clock out. Please try again.',
      };
    }
  }

  /**
   * Get current session status for today
   */
  async getCurrentStatus(userId: number, clientTime?: string): Promise<{ isClockedIn: boolean; sessionStart?: string; duration?: number; sessionId?: number }> {
    try {
      // Use client time if provided, otherwise use current time as fallback
      const referenceTime = clientTime ? new Date(clientTime) : new Date();
      
      // Get today's date (start of day) based on client time
      const today = new Date(referenceTime);
      today.setHours(0, 0, 0, 0);
      // Format as YYYY-MM-DD HH:mm:ss.000 (matching database format)
      const todayStart = today.getFullYear() + '-' + 
        String(today.getMonth() + 1).padStart(2, '0') + '-' + 
        String(today.getDate()).padStart(2, '0') + ' 00:00:00.000';

      this.logger.log(`🔍 Checking status for user ${userId} on date: ${todayStart} (client time: ${clientTime || 'not provided'})`);

      const todayRecord = await this.loginHistoryRepository
        .createQueryBuilder('session')
        .where('session.userId = :userId', { userId })
        .andWhere('DATE(session.sessionStart) = DATE(:clientDate)', { clientDate: referenceTime })
        .getOne();

      if (!todayRecord) {
        this.logger.log(`❌ No record found for user ${userId} on ${todayStart}`);
        return { isClockedIn: false };
      }

      this.logger.log(`✅ Found record for user ${userId}: status=${todayRecord.status}, sessionStart=${todayRecord.sessionStart}`);

      return {
        isClockedIn: todayRecord.status === 1,
        sessionStart: todayRecord.sessionStart,
        duration: todayRecord.duration,
        sessionId: todayRecord.id,
      };
    } catch (error) {
      this.logger.error(`❌ Error getting current status for user ${userId}: ${error.message}`);
      return { isClockedIn: false };
    }
  }

  /**
   * Get today's session record
   */
  async getTodaySessions(userId: number, clientTime?: string): Promise<{ sessions: any[] }> {
    try {
      // Use client time if provided, otherwise use current time as fallback
      const referenceTime = clientTime ? new Date(clientTime) : new Date();
      
      // Get today's date (start of day) based on client time
      const today = new Date(referenceTime);
      today.setHours(0, 0, 0, 0);
      // Format as YYYY-MM-DD HH:mm:ss.000 (matching database format)
      const todayStart = today.getFullYear() + '-' + 
        String(today.getMonth() + 1).padStart(2, '0') + '-' + 
        String(today.getDate()).padStart(2, '0') + ' 00:00:00.000';

      this.logger.log(`🔍 Getting today's sessions for user ${userId} on date: ${todayStart} (client time: ${clientTime || 'not provided'})`);

      const todayRecord = await this.loginHistoryRepository
        .createQueryBuilder('session')
        .where('session.userId = :userId', { userId })
        .andWhere('DATE(session.sessionStart) = DATE(:clientDate)', { clientDate: referenceTime })
        .getOne();

      if (!todayRecord) {
        return { sessions: [] };
      }

      return {
        sessions: [{
          id: todayRecord.id,
          userId: todayRecord.userId,
          sessionStart: todayRecord.sessionStart,
          sessionEnd: todayRecord.sessionEnd,
          duration: todayRecord.duration,
          status: todayRecord.status,
          timezone: todayRecord.timezone,
        }],
      };
    } catch (error) {
      this.logger.error(`❌ Error getting today's sessions for user ${userId}: ${error.message}`);
      return { sessions: [] };
    }
  }

  /**
   * Get session history for a date range
   */
  async getClockHistory(userId: number, startDate?: string, endDate?: string): Promise<{ sessions: any[] }> {
    try {
      let query = this.loginHistoryRepository
        .createQueryBuilder('session')
        .where('session.userId = :userId', { userId })
        .orderBy('session.sessionStart', 'DESC');

      if (startDate) {
        query = query.andWhere('session.sessionStart >= :startDate', { startDate });
      }

      if (endDate) {
        query = query.andWhere('session.sessionStart <= :endDate', { endDate });
      }

      const sessions = await query.getMany();

      return {
        sessions: sessions.map(session => ({
        id: session.id,
          userId: session.userId,
        sessionStart: session.sessionStart,
        sessionEnd: session.sessionEnd,
        duration: session.duration,
        status: session.status,
        timezone: session.timezone,
        })),
      };
    } catch (error) {
      this.logger.error(`❌ Error getting clock history for user ${userId}: ${error.message}`);
      return { sessions: [] };
    }
  }

  /**
   * Get clock sessions using stored procedure (fallback)
   */
  async getClockSessionsWithProcedure(
    userId: number, 
    startDate?: string, 
    endDate?: string,
    limit: number = 50
  ): Promise<{ sessions: any[] }> {
    try {
      const result = await this.dataSource.query(
        'CALL GetClockSessions(?, ?, ?, ?)',
        [userId, startDate || null, endDate || null, limit]
      );

      return { sessions: result[0] || [] };
    } catch (error) {
      this.logger.warn(`⚠️ Stored procedure failed, using fallback: ${error.message}`);
      return this.getClockHistory(userId, startDate, endDate);
    }
  }

  /**
   * Fallback method for getting clock sessions
   */
  private async getClockSessionsFallback(
    userId: number, 
    startDate?: string, 
    endDate?: string
  ): Promise<{ sessions: any[] }> {
    return this.getClockHistory(userId, startDate, endDate);
  }

  /**
   * Format datetime string
   */
  private formatDateTime(dateTimeStr: string): string {
    if (!dateTimeStr) return '';
    
    try {
      const date = new Date(dateTimeStr);
      return date.toISOString().slice(0, 19).replace('T', ' ');
    } catch (error) {
      return dateTimeStr;
    }
  }

  /**
   * Format duration in hours and minutes
   */
  private formatDuration(minutes: number): string {
    if (!minutes || minutes <= 0) return '0h 0m';
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
      return `${hours}h ${remainingMinutes}m`;
  }
} 