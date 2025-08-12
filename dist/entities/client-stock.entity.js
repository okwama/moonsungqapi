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
exports.ClientStock = void 0;
const typeorm_1 = require("typeorm");
const clients_entity_1 = require("./clients.entity");
const product_entity_1 = require("../products/entities/product.entity");
const sales_rep_entity_1 = require("./sales-rep.entity");
let ClientStock = class ClientStock {
};
exports.ClientStock = ClientStock;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ClientStock.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], ClientStock.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'clientId', type: 'int' }),
    __metadata("design:type", Number)
], ClientStock.prototype, "clientId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'productId', type: 'int' }),
    __metadata("design:type", Number)
], ClientStock.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'salesrepId', type: 'int' }),
    __metadata("design:type", Number)
], ClientStock.prototype, "salesrepId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => clients_entity_1.Clients, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'clientId' }),
    __metadata("design:type", clients_entity_1.Clients)
], ClientStock.prototype, "client", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'productId' }),
    __metadata("design:type", product_entity_1.Product)
], ClientStock.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sales_rep_entity_1.SalesRep, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'salesrepId' }),
    __metadata("design:type", sales_rep_entity_1.SalesRep)
], ClientStock.prototype, "salesRep", void 0);
exports.ClientStock = ClientStock = __decorate([
    (0, typeorm_1.Entity)('ClientStock')
], ClientStock);
//# sourceMappingURL=client-stock.entity.js.map