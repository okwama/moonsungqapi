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
const schedule_1 = require("@nestjs/schedule");
let ClockInOutService = ClockInOutService_1 = class ClockInOutService {
    constructor(loginHistoryRepository, dataSource) {
        this.loginHistoryRepository = loginHistoryRepository;
        this.dataSource = dataSource;
        this.logger = new common_1.Logger(ClockInOutService_1.name);
        this.userStatusCache = new Map();
        this.CACHE_TTL = 30 * 1000;
    }
    todayRange(ref = new Date()) {
        const nairobi = new Date(ref.toLocaleString('en-US', { timeZone: 'Africa/Nairobi' }));
        const start = new Date(nairobi);
        start.setHours(0, 0, 0, 0);
        const end = new Date(nairobi);
        end.setHours(23, 59, 59, 999);
        return {
            startStr: start.toISOString().slice(0, 19).replace('T', ' '),
            endStr: end.toISOString().slice(0, 19).replace('T', ' '),
        };
    }
    async clockIn(dto) {
        try {
            const { userId, clientTime } = dto;
            const now = new Date(clientTime);
            const { startStr, endStr } = this.todayRange(now);
            const sessionStartTime = now.toISOString().slice(0, 19).replace('T', ' ');
            this.logger.log(`Clock In attempt for user ${userId} at ${clientTime}`);
            const activeSession = await this.loginHistoryRepository
                .createQueryBuilder('s')
                .where('s.userId = :userId', { userId })
                .andWhere('s.sessionStart >= :start', { start: startStr })
                .andWhere('s.sessionStart <= :end', { end: endStr })
                .andWhere('s.status = 1')
                .andWhere('s.sessionEnd IS NULL')
                .orderBy('s.sessionStart', 'DESC')
                .getOne();
            if (activeSession) {
                await this.loginHistoryRepository.update(activeSession.id, {
                    status: 1,
                    sessionEnd: null,
                    duration: 0,
                });
                this.clearUserCache(userId);
                this.logger.log(`User ${userId} resumed session. ID: ${activeSession.id}`);
                return { success: true, message: 'Successfully resumed session', sessionId: activeSession.id };
            }
            const newSession = this.loginHistoryRepository.create({
                userId,
                sessionStart: sessionStartTime,
                sessionEnd: null,
                status: 1,
                duration: 0,
                timezone: 'Africa/Nairobi',
            });
            const saved = await this.loginHistoryRepository.save(newSession);
            this.clearUserCache(userId);
            this.logger.log(`User ${userId} started new session. ID: ${saved.id}`);
            return { success: true, message: 'Successfully started new session', sessionId: saved.id };
        }
        catch (error) {
            this.logger.error(`Clock In failed for user ${dto.userId}: ${error.message}`);
            return { success: false, message: 'Failed to clock in. Please try again.' };
        }
    }
    async clockOut(dto) {
        try {
            const { userId, clientTime } = dto;
            const now = new Date(clientTime);
            const { startStr, endStr } = this.todayRange(now);
            const sessionEndTime = now.toISOString().slice(0, 19).replace('T', ' ');
            this.logger.log(`Clock Out attempt for user ${userId} at ${clientTime}`);
            const activeSession = await this.loginHistoryRepository
                .createQueryBuilder('s')
                .where('s.userId = :userId', { userId })
                .andWhere('s.sessionStart >= :start', { start: startStr })
                .andWhere('s.sessionStart <= :end', { end: endStr })
                .andWhere('s.status = 1')
                .andWhere('s.sessionEnd IS NULL')
                .getOne();
            if (!activeSession) {
                this.logger.warn(`User ${userId} has no active session today`);
                return { success: false, message: 'No active session found for today.' };
            }
            const durationMinutes = Math.floor((now.getTime() - new Date(activeSession.sessionStart).getTime()) / (1000 * 60));
            await this.loginHistoryRepository.update(activeSession.id, {
                status: 2,
                sessionEnd: sessionEndTime,
                duration: durationMinutes,
            });
            this.clearUserCache(userId);
            this.logger.log(`User ${userId} ended session. Duration: ${durationMinutes} min`);
            return { success: true, message: 'Successfully ended session', duration: durationMinutes };
        }
        catch (error) {
            this.logger.error(`Clock Out failed for user ${dto.userId}: ${error.message}`);
            return { success: false, message: 'Failed to clock out. Please try again.' };
        }
    }
    async getCurrentStatus(userId, clientTime) {
        try {
            const cached = this.userStatusCache.get(userId);
            if (cached && cached.expiry > Date.now()) {
                this.logger.log(`Cache hit for user ${userId} status`);
                return cached.status;
            }
            const ref = clientTime ? new Date(clientTime) : new Date();
            const { startStr, endStr } = this.todayRange(ref);
            const activeSession = await this.loginHistoryRepository
                .createQueryBuilder('s')
                .where('s.userId = :userId', { userId })
                .andWhere('s.sessionStart >= :start', { start: startStr })
                .andWhere('s.sessionStart <= :end', { end: endStr })
                .andWhere('s.status = 1')
                .andWhere('s.sessionEnd IS NULL')
                .orderBy('s.sessionStart', 'DESC')
                .getOne();
            const result = activeSession
                ? {
                    isClockedIn: true,
                    sessionStart: activeSession.sessionStart,
                    duration: activeSession.duration,
                    sessionId: activeSession.id,
                }
                : { isClockedIn: false };
            this.userStatusCache.set(userId, { status: result, expiry: Date.now() + this.CACHE_TTL });
            return result;
        }
        catch (error) {
            this.logger.error(`Error getting status for user ${userId}: ${error.message}`);
            return { isClockedIn: false };
        }
    }
    async getTodaySessions(userId, clientTime) {
        try {
            const ref = clientTime ? new Date(clientTime) : new Date();
            const { startStr, endStr } = this.todayRange(ref);
            const records = await this.loginHistoryRepository
                .createQueryBuilder('s')
                .where('s.userId = :userId', { userId })
                .andWhere('s.sessionStart >= :start', { start: startStr })
                .andWhere('s.sessionStart <= :end', { end: endStr })
                .orderBy('s.sessionStart', 'DESC')
                .getMany();
            return {
                sessions: records.map(r => ({
                    id: r.id,
                    userId: r.userId,
                    sessionStart: r.sessionStart,
                    sessionEnd: r.sessionEnd,
                    duration: r.duration,
                    status: r.status,
                    timezone: r.timezone,
                    isActive: r.status === 1 && !r.sessionEnd,
                })),
            };
        }
        catch (error) {
            this.logger.error(`Error getting today sessions for user ${userId}: ${error.message}`);
            return { sessions: [] };
        }
    }
    async autoCleanupStaleSessions() {
        this.logger.log('Running scheduled stale session cleanup...');
        await this.cleanupStaleSessions();
    }
    async cleanupStaleSessions() {
        try {
            this.logger.log('Starting stale session cleanup...');
            const now = new Date();
            const nairobiTime = new Date(now.toLocaleString('en-US', { timeZone: 'Africa/Nairobi' }));
            const yesterday = new Date(nairobiTime);
            yesterday.setDate(yesterday.getDate() - 1);
            yesterday.setHours(0, 0, 0, 0);
            const yesterdayStr = yesterday.toISOString().slice(0, 19).replace('T', ' ');
            const stale = await this.loginHistoryRepository
                .createQueryBuilder('s')
                .where('s.status = 1')
                .andWhere('s.sessionStart < :yesterday', { yesterday: yesterdayStr })
                .andWhere('s.sessionEnd IS NULL')
                .getMany();
            if (stale.length === 0) {
                this.logger.log('No stale sessions found');
                return { cleanedCount: 0, message: 'No stale sessions found' };
            }
            let cleaned = 0;
            for (const s of stale) {
                const start = new Date(s.sessionStart);
                const end = new Date(start);
                end.setHours(23, 59, 59, 999);
                const endStr = end.toISOString().slice(0, 19).replace('T', ' ');
                const mins = Math.floor((end.getTime() - start.getTime()) / 60000);
                await this.loginHistoryRepository.update(s.id, {
                    status: 2,
                    sessionEnd: endStr,
                    duration: mins,
                });
                cleaned++;
                this.clearUserCache(s.userId);
            }
            this.logger.log(`Cleaned ${cleaned} stale sessions`);
            return { cleanedCount: cleaned, message: `Cleaned ${cleaned} stale sessions` };
        }
        catch (error) {
            this.logger.error(`Cleanup failed: ${error.message}`);
            return { cleanedCount: 0, message: `Cleanup failed: ${error.message}` };
        }
    }
    async getClockHistory(userId, startDate, endDate) {
        try {
            let query = this.loginHistoryRepository
                .createQueryBuilder('s')
                .where('s.userId = :userId', { userId })
                .orderBy('s.sessionStart', 'DESC');
            if (startDate)
                query = query.andWhere('s.sessionStart >= :startDate', { startDate });
            if (endDate)
                query = query.andWhere('s.sessionStart <= :endDate', { endDate });
            const sessions = await query.getMany();
            return {
                sessions: sessions.map(s => ({
                    id: s.id,
                    userId: s.userId,
                    sessionStart: s.sessionStart,
                    sessionEnd: s.sessionEnd,
                    duration: s.duration,
                    status: s.status,
                    timezone: s.timezone,
                })),
            };
        }
        catch (error) {
            this.logger.error(`History error: ${error.message}`);
            return { sessions: [] };
        }
    }
    async getClockSessionsWithProcedure(userId, startDate, endDate, limit = 50) {
        try {
            const result = await this.dataSource.query('CALL GetClockSessions(?, ?, ?, ?)', [
                userId,
                startDate || null,
                endDate || null,
                limit,
            ]);
            return { sessions: result[0] || [] };
        }
        catch (error) {
            this.logger.warn(`Stored proc failed: ${error.message}`);
            return this.getClockHistory(userId, startDate, endDate);
        }
    }
    clearUserCache(userId) {
        this.userStatusCache.delete(userId);
    }
    formatDuration(minutes) {
        if (!minutes || minutes <= 0)
            return '0h 0m';
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}h ${m}m`;
    }
};
exports.ClockInOutService = ClockInOutService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT, { timeZone: 'Africa/Nairobi' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClockInOutService.prototype, "autoCleanupStaleSessions", null);
exports.ClockInOutService = ClockInOutService = ClockInOutService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(login_history_entity_1.LoginHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource])
], ClockInOutService);
//# sourceMappingURL=clock-in-out.service.js.map