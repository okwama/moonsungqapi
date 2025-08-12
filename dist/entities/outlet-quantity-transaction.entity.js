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
exports.OutletQuantityTransaction = void 0;
const typeorm_1 = require("typeorm");
const clients_entity_1 = require("./clients.entity");
const product_entity_1 = require("../products/entities/product.entity");
let OutletQuantityTransaction = class OutletQuantityTransaction {
};
exports.OutletQuantityTransaction = OutletQuantityTransaction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], OutletQuantityTransaction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'clientId', type: 'int' }),
    __metadata("design:type", Number)
], OutletQuantityTransaction.prototype, "clientId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'productId', type: 'int' }),
    __metadata("design:type", Number)
], OutletQuantityTransaction.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'transactionType',
        type: 'enum',
        enum: ['sale', 'return', 'stock_adjustment', 'void'],
    }),
    __metadata("design:type", String)
], OutletQuantityTransaction.prototype, "transactionType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'quantity', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], OutletQuantityTransaction.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'previousStock', type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], OutletQuantityTransaction.prototype, "previousStock", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'newStock', type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], OutletQuantityTransaction.prototype, "newStock", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'referenceId', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], OutletQuantityTransaction.prototype, "referenceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'referenceType', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], OutletQuantityTransaction.prototype, "referenceType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'transactionDate', type: 'datetime' }),
    __metadata("design:type", Date)
], OutletQuantityTransaction.prototype, "transactionDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'userId', type: 'int' }),
    __metadata("design:type", Number)
], OutletQuantityTransaction.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'notes', type: 'text', nullable: true }),
    __metadata("design:type", String)
], OutletQuantityTransaction.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'createdAt', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], OutletQuantityTransaction.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => clients_entity_1.Clients, client => client.id),
    (0, typeorm_1.JoinColumn)({ name: 'clientId' }),
    __metadata("design:type", clients_entity_1.Clients)
], OutletQuantityTransaction.prototype, "client", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product, product => product.id),
    (0, typeorm_1.JoinColumn)({ name: 'productId' }),
    __metadata("design:type", product_entity_1.Product)
], OutletQuantityTransaction.prototype, "product", void 0);
exports.OutletQuantityTransaction = OutletQuantityTransaction = __decorate([
    (0, typeorm_1.Entity)('outlet_quantity_transactions'),
    (0, typeorm_1.Index)('outlet_quantity_transactions_clientId_idx', ['clientId']),
    (0, typeorm_1.Index)('outlet_quantity_transactions_productId_idx', ['productId']),
    (0, typeorm_1.Index)('outlet_quantity_transactions_transactionType_idx', ['transactionType']),
    (0, typeorm_1.Index)('outlet_quantity_transactions_transactionDate_idx', ['transactionDate']),
    (0, typeorm_1.Index)('outlet_quantity_transactions_referenceId_idx', ['referenceId'])
], OutletQuantityTransaction);
//# sourceMappingURL=outlet-quantity-transaction.entity.js.map