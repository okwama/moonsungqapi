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
exports.UpliftSale = void 0;
const typeorm_1 = require("typeorm");
const sales_rep_entity_1 = require("./sales-rep.entity");
const clients_entity_1 = require("./clients.entity");
const uplift_sale_item_entity_1 = require("./uplift-sale-item.entity");
let UpliftSale = class UpliftSale {
};
exports.UpliftSale = UpliftSale;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], UpliftSale.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], UpliftSale.prototype, "clientId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], UpliftSale.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 1 }),
    __metadata("design:type", Number)
], UpliftSale.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0 }),
    __metadata("design:type", Number)
], UpliftSale.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], UpliftSale.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], UpliftSale.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 119, default: '' }),
    __metadata("design:type", String)
], UpliftSale.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => clients_entity_1.Clients, clients => clients.upliftSales, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'clientId' }),
    __metadata("design:type", clients_entity_1.Clients)
], UpliftSale.prototype, "client", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sales_rep_entity_1.SalesRep, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", sales_rep_entity_1.SalesRep)
], UpliftSale.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => uplift_sale_item_entity_1.UpliftSaleItem, upliftSaleItem => upliftSaleItem.upliftSale),
    __metadata("design:type", Array)
], UpliftSale.prototype, "upliftSaleItems", void 0);
exports.UpliftSale = UpliftSale = __decorate([
    (0, typeorm_1.Entity)('UpliftSale'),
    (0, typeorm_1.Index)('UpliftSale_clientId_fkey', ['clientId']),
    (0, typeorm_1.Index)('UpliftSale_userId_fkey', ['userId'])
], UpliftSale);
//# sourceMappingURL=uplift-sale.entity.js.map