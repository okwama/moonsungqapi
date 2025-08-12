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
exports.ProductReport = void 0;
const typeorm_1 = require("typeorm");
const sales_rep_entity_1 = require("./sales-rep.entity");
const clients_entity_1 = require("./clients.entity");
let ProductReport = class ProductReport {
};
exports.ProductReport = ProductReport;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ProductReport.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'productName', nullable: true }),
    __metadata("design:type", String)
], ProductReport.prototype, "productName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'quantity', nullable: true }),
    __metadata("design:type", Number)
], ProductReport.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'comment', nullable: true }),
    __metadata("design:type", String)
], ProductReport.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'createdAt' }),
    __metadata("design:type", Date)
], ProductReport.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'clientId' }),
    __metadata("design:type", Number)
], ProductReport.prototype, "clientId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'userId' }),
    __metadata("design:type", Number)
], ProductReport.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'productId', nullable: true }),
    __metadata("design:type", Number)
], ProductReport.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sales_rep_entity_1.SalesRep),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", sales_rep_entity_1.SalesRep)
], ProductReport.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => clients_entity_1.Clients),
    (0, typeorm_1.JoinColumn)({ name: 'clientId' }),
    __metadata("design:type", clients_entity_1.Clients)
], ProductReport.prototype, "client", void 0);
exports.ProductReport = ProductReport = __decorate([
    (0, typeorm_1.Entity)('ProductReport')
], ProductReport);
//# sourceMappingURL=product-report.entity.js.map