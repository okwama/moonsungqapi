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
var CommissionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const uplift_sale_entity_1 = require("../entities/uplift-sale.entity");
const sales_rep_entity_1 = require("../entities/sales-rep.entity");
const commission_config_entity_1 = require("./entities/commission-config.entity");
const daily_commission_entity_1 = require("./entities/daily-commission.entity");
let CommissionService = CommissionService_1 = class CommissionService {
    constructor(upliftSaleRepository, salesRepRepository, commissionConfigRepository, dailyCommissionRepository) {
        this.upliftSaleRepository = upliftSaleRepository;
        this.salesRepRepository = salesRepRepository;
        this.commissionConfigRepository = commissionConfigRepository;
        this.dailyCommissionRepository = dailyCommissionRepository;
        this.logger = new common_1.Logger(CommissionService_1.name);
    }
    async calculateDailyCommission(salesRepId, date = new Date()) {
        try {
            this.logger.log(`Calculating daily commission for sales rep ${salesRepId} on ${date.toISOString().split('T')[0]}`);
            const dailySales = await this.getDailySales(salesRepId, date);
            if (!dailySales || dailySales.totalAmount === 0) {
                return {
                    salesRepId,
                    date: date.toISOString().split('T')[0],
                    dailySalesAmount: 0,
                    commissionAmount: 0,
                    commissionTier: 'No Sales',
                    salesCount: 0,
                    message: 'No sales found for this date',
                };
            }
            const commissionConfig = await this.getCommissionConfig();
            const commissionCalculation = this.calculateCommissionAmount(dailySales.totalAmount, commissionConfig);
            const result = {
                salesRepId,
                date: date.toISOString().split('T')[0],
                dailySalesAmount: dailySales.totalAmount,
                commissionAmount: commissionCalculation.commissionAmount,
                commissionTier: commissionCalculation.tierName,
                salesCount: dailySales.salesCount,
                salesBreakdown: dailySales.sales,
                commissionConfig: commissionCalculation.config,
            };
            this.logger.log(`Commission calculation result: ${JSON.stringify(result)}`);
            return result;
        }
        catch (error) {
            this.logger.error(`Error calculating daily commission: ${error.message}`);
            throw new Error(`Failed to calculate daily commission: ${error.message}`);
        }
    }
    async getDailySales(salesRepId, date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        const sales = await this.upliftSaleRepository
            .createQueryBuilder('sale')
            .select([
            'sale.id',
            'sale.totalAmount',
            'sale.createdAt',
            'sale.status',
            'sale.comment'
        ])
            .where('sale.userId = :salesRepId', { salesRepId })
            .andWhere('sale.createdAt >= :startOfDay', { startOfDay })
            .andWhere('sale.createdAt <= :endOfDay', { endOfDay })
            .andWhere('sale.status = :status', { status: 1 })
            .orderBy('sale.createdAt', 'ASC')
            .getMany();
        const totalAmount = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
        const salesCount = sales.length;
        return {
            totalAmount,
            salesCount,
            sales: sales.map(sale => ({
                id: sale.id,
                amount: sale.totalAmount,
                time: sale.createdAt,
                comment: sale.comment,
            })),
        };
    }
    async getCommissionConfig() {
        const configs = await this.commissionConfigRepository
            .createQueryBuilder('config')
            .where('config.isActive = :isActive', { isActive: true })
            .orderBy('config.minAmount', 'ASC')
            .getMany();
        if (configs.length === 0) {
            await this.createDefaultCommissionConfigs();
            return await this.getCommissionConfig();
        }
        return configs;
    }
    async createDefaultCommissionConfigs() {
        const defaultConfigs = [
            {
                tierName: 'Bronze Tier',
                minAmount: 0,
                maxAmount: 14999.99,
                commissionAmount: 0,
                description: 'No commission for sales below 15,000',
            },
            {
                tierName: 'Silver Tier',
                minAmount: 15000,
                maxAmount: 19999.99,
                commissionAmount: 500,
                description: '500 commission for sales 15,000 - 19,999',
            },
            {
                tierName: 'Gold Tier',
                minAmount: 20000,
                maxAmount: null,
                commissionAmount: 1000,
                description: '1000 commission for sales 20,000 and above',
            },
        ];
        for (const config of defaultConfigs) {
            const newConfig = this.commissionConfigRepository.create(config);
            await this.commissionConfigRepository.save(newConfig);
        }
        this.logger.log('Default commission configurations created');
    }
    calculateCommissionAmount(dailySalesAmount, commissionConfigs) {
        const applicableConfig = commissionConfigs.find(config => {
            const meetsMin = dailySalesAmount >= config.minAmount;
            const meetsMax = config.maxAmount === null || dailySalesAmount <= config.maxAmount;
            return meetsMin && meetsMax;
        });
        if (!applicableConfig) {
            return {
                commissionAmount: 0,
                tierName: 'No Tier',
                config: null,
            };
        }
        return {
            commissionAmount: applicableConfig.commissionAmount,
            tierName: applicableConfig.tierName,
            config: {
                minAmount: applicableConfig.minAmount,
                maxAmount: applicableConfig.maxAmount,
                description: applicableConfig.description,
            },
        };
    }
    async saveDailyCommission(commissionData) {
        try {
            const existingCommission = await this.dailyCommissionRepository.findOne({
                where: {
                    salesRepId: commissionData.salesRepId,
                    commissionDate: new Date(commissionData.date),
                },
            });
            if (existingCommission) {
                existingCommission.dailySalesAmount = commissionData.dailySalesAmount;
                existingCommission.commissionAmount = commissionData.commissionAmount;
                existingCommission.commissionTier = commissionData.commissionTier;
                existingCommission.salesCount = commissionData.salesCount;
                existingCommission.updatedAt = new Date();
                return await this.dailyCommissionRepository.save(existingCommission);
            }
            else {
                const newCommission = this.dailyCommissionRepository.create({
                    salesRepId: commissionData.salesRepId,
                    commissionDate: new Date(commissionData.date),
                    dailySalesAmount: commissionData.dailySalesAmount,
                    commissionAmount: commissionData.commissionAmount,
                    commissionTier: commissionData.commissionTier,
                    salesCount: commissionData.salesCount,
                    status: 'pending',
                });
                return await this.dailyCommissionRepository.save(newCommission);
            }
        }
        catch (error) {
            this.logger.error(`Error saving daily commission: ${error.message}`);
            throw new Error(`Failed to save daily commission: ${error.message}`);
        }
    }
    async getCommissionHistory(salesRepId, startDate, endDate) {
        try {
            const queryBuilder = this.dailyCommissionRepository
                .createQueryBuilder('commission')
                .where('commission.salesRepId = :salesRepId', { salesRepId })
                .orderBy('commission.commissionDate', 'DESC');
            if (startDate) {
                queryBuilder.andWhere('commission.commissionDate >= :startDate', { startDate });
            }
            if (endDate) {
                queryBuilder.andWhere('commission.commissionDate <= :endDate', { endDate });
            }
            const commissions = await queryBuilder.getMany();
            return commissions.map(commission => ({
                id: commission.id,
                date: commission.commissionDate,
                dailySalesAmount: commission.dailySalesAmount,
                commissionAmount: commission.commissionAmount,
                commissionTier: commission.commissionTier,
                salesCount: commission.salesCount,
                status: commission.status,
                createdAt: commission.createdAt,
            }));
        }
        catch (error) {
            this.logger.error(`Error getting commission history: ${error.message}`);
            throw new Error(`Failed to get commission history: ${error.message}`);
        }
    }
    async getCommissionSummary(salesRepId, period = 'current_month') {
        try {
            const currentDate = new Date();
            let startDate;
            let endDate;
            switch (period) {
                case 'current_month':
                    startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                    endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
                    break;
                case 'last_month':
                    startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
                    endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
                    break;
                case 'current_year':
                    startDate = new Date(currentDate.getFullYear(), 0, 1);
                    endDate = new Date(currentDate.getFullYear(), 11, 31);
                    break;
                default:
                    startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                    endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
            }
            const commissions = await this.getCommissionHistory(salesRepId, startDate, endDate);
            const totalCommission = commissions.reduce((sum, commission) => sum + commission.commissionAmount, 0);
            const totalSales = commissions.reduce((sum, commission) => sum + commission.dailySalesAmount, 0);
            const totalDays = commissions.length;
            const averageDailySales = totalDays > 0 ? totalSales / totalDays : 0;
            const tierBreakdown = commissions.reduce((acc, commission) => {
                const tier = commission.commissionTier;
                if (!acc[tier]) {
                    acc[tier] = { count: 0, totalCommission: 0 };
                }
                acc[tier].count++;
                acc[tier].totalCommission += commission.commissionAmount;
                return acc;
            }, {});
            return {
                period,
                dateRange: {
                    startDate: startDate.toISOString().split('T')[0],
                    endDate: endDate.toISOString().split('T')[0],
                },
                summary: {
                    totalCommission,
                    totalSales,
                    totalDays,
                    averageDailySales,
                    averageDailyCommission: totalDays > 0 ? totalCommission / totalDays : 0,
                },
                tierBreakdown,
                commissions,
            };
        }
        catch (error) {
            this.logger.error(`Error getting commission summary: ${error.message}`);
            throw new Error(`Failed to get commission summary: ${error.message}`);
        }
    }
    async updateCommissionStatus(commissionId, status, notes) {
        try {
            const commission = await this.dailyCommissionRepository.findOne({
                where: { id: commissionId },
            });
            if (!commission) {
                throw new Error('Commission record not found');
            }
            commission.status = status;
            if (notes) {
                commission.notes = notes;
            }
            commission.updatedAt = new Date();
            return await this.dailyCommissionRepository.save(commission);
        }
        catch (error) {
            this.logger.error(`Error updating commission status: ${error.message}`);
            throw new Error(`Failed to update commission status: ${error.message}`);
        }
    }
};
exports.CommissionService = CommissionService;
exports.CommissionService = CommissionService = CommissionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(uplift_sale_entity_1.UpliftSale)),
    __param(1, (0, typeorm_1.InjectRepository)(sales_rep_entity_1.SalesRep)),
    __param(2, (0, typeorm_1.InjectRepository)(commission_config_entity_1.CommissionConfig)),
    __param(3, (0, typeorm_1.InjectRepository)(daily_commission_entity_1.DailyCommission)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CommissionService);
//# sourceMappingURL=commission.service.js.map