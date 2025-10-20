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
exports.FeedbackReport = void 0;
const typeorm_1 = require("typeorm");
const sales_rep_entity_1 = require("./sales-rep.entity");
const clients_entity_1 = require("./clients.entity");
const journey_plan_entity_1 = require("../journey-plans/entities/journey-plan.entity");
let FeedbackReport = class FeedbackReport {
};
exports.FeedbackReport = FeedbackReport;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], FeedbackReport.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'comment', nullable: true }),
    __metadata("design:type", String)
], FeedbackReport.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'createdAt' }),
    __metadata("design:type", Date)
], FeedbackReport.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'clientId' }),
    __metadata("design:type", Number)
], FeedbackReport.prototype, "clientId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'userId' }),
    __metadata("design:type", Number)
], FeedbackReport.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'journeyPlanId', nullable: true }),
    __metadata("design:type", Number)
], FeedbackReport.prototype, "journeyPlanId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sales_rep_entity_1.SalesRep),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", sales_rep_entity_1.SalesRep)
], FeedbackReport.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => clients_entity_1.Clients),
    (0, typeorm_1.JoinColumn)({ name: 'clientId' }),
    __metadata("design:type", clients_entity_1.Clients)
], FeedbackReport.prototype, "client", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => journey_plan_entity_1.JourneyPlan, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'journeyPlanId' }),
    __metadata("design:type", journey_plan_entity_1.JourneyPlan)
], FeedbackReport.prototype, "journeyPlan", void 0);
exports.FeedbackReport = FeedbackReport = __decorate([
    (0, typeorm_1.Entity)('FeedbackReport'),
    (0, typeorm_1.Index)('idx_feedback_report_journey_plan', ['journeyPlanId']),
    (0, typeorm_1.Index)('idx_feedback_report_user_journey', ['userId', 'journeyPlanId'])
], FeedbackReport);
//# sourceMappingURL=feedback-report.entity.js.map