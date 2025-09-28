"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ClockInOutService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClockInOutService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const login_history_entity_1 = require("../entities/login-history.entity");
let ClockInOutService = ClockInOutService_1 = class ClockInOutService {
    constructor(loginHistoryRepository, dataSource) {
        this.loginHistoryRepository = loginHistoryRepository;
        this.dataSource = dataSource;
        this.logger = new common_1.Logger(ClockInOutService_1.name);
        this.userStatusCache = new Map();
        this.CACHE_TTL = 30 * 1000;
    }
    async clockIn(clockInDto) {
        try {
            const { userId, clientTime } = clockInDto;
            this.logger.log(`🟢 Clock In attempt for user ${userId} at ${clientTime}`);
            const actualTime = new Date(clientTime);
            const startOfDay = new Date(actualTime);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(actualTime);
            endOfDay.setHours(23, 59, 59, 999);
            const sessionStartTime = actualTime.toISOString().slice(0, 19).replace('T', ' ');
            const startOfDayStr = startOfDay.toISOString().slice(0, 19).replace('T', ' ');
            const endOfDayStr = endOfDay.toISOString().slice(0, 19).replace('T', ' ');
            const todayRecord = await this.loginHistoryRepository
                .createQueryBuilder('session')
                .where('session.userId = :userId', { userId })
                .andWhere('session.sessionStart >= :startOfDay', { startOfDay: startOfDayStr })
                .andWhere('session.sessionStart <= :endOfDay', { endOfDay: endOfDayStr })
                .getOne();
            if (todayRecord) {
                await this.loginHistoryRepository.update(todayRecord.id, {
                    status: 1,
                    sessionEnd: null,
                    duration: 0,
                });
                this.logger.log(`✅ User ${userId} resumed session. Record ID: ${todayRecord.id}`);
                this.clearUserCache(userId);
                return {
                    success: true,
                    message: 'Successfully resumed session',
                    sessionId: todayRecord.id,
                };
            }
            else {
                const newSession = this.loginHistoryRepository.create({
                    userId,
                    status: 1,
                    sessionStart: sessionStartTime,
                    sessionEnd: null,
                    timezone: 'Africa/Nairobi',
                    duration: 0,
                });
                const savedSession = await this.loginHistoryRepository.save(newSession);
                this.logger.log(`✅ User ${userId} started new session. Record ID: ${savedSession.id}`);
                this.clearUserCache(userId);
                return {
                    success: true,
                    message: 'Successfully started new session',
                    sessionId: savedSession.id,
                };
            }
        }
        catch (error) {
            this.logger.error(`❌ Clock In failed for user ${clockInDto.userId}: ${error.message}`);
            return {
                success: false,
                message: 'Failed to clock in. Please try again.',
            };
        }
    }
    async clockOut(clockOutDto) {
        try {
            const { userId, clientTime } = clockOutDto;
            this.logger.log(`🔴 Clock Out attempt for user ${userId} at ${clientTime}`);
            const actualTime = new Date(clientTime);
            const startOfDay = new Date(actualTime);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(actualTime);
            endOfDay.setHours(23, 59, 59, 999);
            const sessionEndTime = actualTime.toISOString().slice(0, 19).replace('T', ' ');
            const startOfDayStr = startOfDay.toISOString().slice(0, 19).replace('T', ' ');
            const endOfDayStr = endOfDay.toISOString().slice(0, 19).replace('T', ' ');
            const todayRecord = await this.loginHistoryRepository
                .createQueryBuilder('session')
                .where('session.userId = :userId', { userId })
                .andWhere('session.sessionStart >= :startOfDay', { startOfDay: startOfDayStr })
                .andWhere('session.sessionStart <= :endOfDay', { endOfDay: endOfDayStr })
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
            const startTime = new Date(todayRecord.sessionStart);
            const endTime = new Date(clientTime);
            const durationMinutes = Math.floor((endTime.getTime() - startTime.getTime()) / (1000 * 60));
            await this.loginHistoryRepository.update(todayRecord.id, {
                status: 2,
                sessionEnd: sessionEndTime,
                duration: durationMinutes,
            });
            this.logger.log(`✅ User ${userId} ended session. Total duration: ${durationMinutes} minutes`);
            this.clearUserCache(userId);
            return {
                success: true,
                message: 'Successfully ended session',
                duration: durationMinutes,
            };
        }
        catch (error) {
            this.logger.error(`❌ Clock Out failed for user ${clockOutDto.userId}: ${error.message}`);
            return {
                success: false,
                message: 'Failed to clock out. Please try again.',
            };
        }
    }
    async getCurrentStatus(userId, clientTime) {
        try {
            const cached = this.userStatusCache.get(userId);
            if (cached && cached.expiry > Date.now()) {
                this.logger.log(`✅ Cache hit for user ${userId} status`);
                return cached.status;
            }
            const referenceTime = clientTime ? new Date(clientTime) : new Date();
            const startOfDay = new Date(referenceTime);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(referenceTime);
            endOfDay.setHours(23, 59, 59, 999);
            this.logger.log(`🔍 Checking status for user ${userId} (client time: ${clientTime || 'not provided'})`);
            const todayRecord = await this.loginHistoryRepository
                .createQueryBuilder('session')
                .where('session.userId = :userId', { userId })
                .andWhere('session.sessionStart >= :startOfDay', { startOfDay })
                .andWhere('session.sessionStart <= :endOfDay', { endOfDay })
                .getOne();
            if (!todayRecord) {
                this.logger.log(`❌ No record found for user ${userId}`);
                const result = { isClockedIn: false };
                this.userStatusCache.set(userId, {
                    status: result,
                    expiry: Date.now() + this.CACHE_TTL
                });
                return result;
            }
            this.logger.log(`✅ Found record for user ${userId}: status=${todayRecord.status}, sessionStart=${todayRecord.sessionStart}`);
            const result = {
                isClockedIn: todayRecord.status === 1,
                sessionStart: todayRecord.sessionStart,
                duration: todayRecord.duration,
                sessionId: todayRecord.id,
            };
            this.userStatusCache.set(userId, {
                status: result,
                expiry: Date.now() + this.CACHE_TTL
            });
            return result;
        }
        catch (error) {
            this.logger.error(`❌ Error getting current status for user ${userId}: ${error.message}`);
            return { isClockedIn: false };
        }
    }
    async getTodaySessions(userId, clientTime) {
        try {
            const referenceTime = clientTime ? new Date(clientTime) : new Date();
            const startOfDay = new Date(referenceTime);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(referenceTime);
            endOfDay.setHours(23, 59, 59, 999);
            this.logger.log(`🔍 Getting today's sessions for user ${userId} (client time: ${clientTime || 'not provided'})`);
            const todayRecord = await this.loginHistoryRepository
                .createQueryBuilder('session')
                .where('session.userId = :userId', { userId })
                .andWhere('session.sessionStart >= :startOfDay', { startOfDay })
                .andWhere('session.sessionStart <= :endOfDay', { endOfDay })
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
        }
        catch (error) {
            this.logger.error(`❌ Error getting today's sessions for user ${userId}: ${error.message}`);
            return { sessions: [] };
        }
    }
    async getClockHistory(userId, startDate, endDate) {
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
        }
        catch (error) {
            this.logger.error(`❌ Error getting clock history for user ${userId}: ${error.message}`);
            return { sessions: [] };
        }
    }
    async getClockSessionsWithProcedure(userId, startDate, endDate, limit = 50) {
        try {
            const result = await this.dataSource.query('CALL GetClockSessions(?, ?, ?, ?)', [userId, startDate || null, endDate || null, limit]);
            return { sessions: result[0] || [] };
        }
        catch (error) {
            this.logger.warn(`⚠️ Stored procedure failed, using fallback: ${error.message}`);
            return this.getClockHistory(userId, startDate, endDate);
        }
    }
    async getClockSessionsFallback(userId, startDate, endDate) {
        return this.getClockHistory(userId, startDate, endDate);
    }
    clearUserCache(userId) {
        this.userStatusCache.delete(userId);
    }
    formatDateTime(dateTimeStr) {
        if (!dateTimeStr)
            return '';
        try {
            const date = new Date(dateTimeStr);
            return date.toISOString().slice(0, 19).replace('T', ' ');
        }
        catch (error) {
            return dateTimeStr;
        }
    }
    formatDuration(minutes) {
        if (!minutes || minutes <= 0)
            return '0h 0m';
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}h ${remainingMinutes}m`;
    }
};
exports.ClockInOutService = ClockInOutService;
exports.ClockInOutService = ClockInOutService = ClockInOutService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(login_history_entity_1.LoginHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource])
], ClockInOutService);
//# sourceMappingURL=clock-in-out.service.js.map