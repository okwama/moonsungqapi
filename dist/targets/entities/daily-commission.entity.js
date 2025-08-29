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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyCommission = void 0;
const typeorm_1 = require("typeorm");
const sales_rep_entity_1 = require("../../entities/sales-rep.entity");
let DailyCommission = class DailyCommission {
};
exports.DailyCommission = DailyCommission;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], DailyCommission.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sales_rep_id', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], DailyCommission.prototype, "salesRepId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'commission_date', type: 'date', nullable: false }),
    __metadata("design:type", Date)
], DailyCommission.prototype, "commissionDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'daily_sales_amount', type: 'decimal', precision: 15, scale: 2, nullable: false }),
    __metadata("design:type", Number)
], DailyCommission.prototype, "dailySalesAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'commission_amount', type: 'decimal', precision: 10, scale: 2, nullable: false }),
    __metadata("design:type", Number)
], DailyCommission.prototype, "commissionAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'commission_tier', length: 100, nullable: false }),
    __metadata("design:type", String)
], DailyCommission.prototype, "commissionTier", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sales_count', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], DailyCommission.prototype, "salesCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', length: 20, default: 'pending' }),
    __metadata("design:type", String)
], DailyCommission.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'notes', type: 'text', nullable: true }),
    __metadata("design:type", String)
], DailyCommission.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], DailyCommission.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], DailyCommission.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sales_rep_entity_1.SalesRep, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'sales_rep_id' }),
    __metadata("design:type", sales_rep_entity_1.SalesRep)
], DailyCommission.prototype, "salesRep", void 0);
exports.DailyCommission = DailyCommission = __decorate([
    (0, typeorm_1.Entity)('daily_commissions')
], DailyCommission);
//# sourceMappingURL=daily-commission.entity.js.map