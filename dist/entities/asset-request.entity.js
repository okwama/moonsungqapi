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
exports.AssetRequest = void 0;
const typeorm_1 = require("typeorm");
const sales_rep_entity_1 = require("./sales-rep.entity");
const asset_request_item_entity_1 = require("./asset-request-item.entity");
let AssetRequest = class AssetRequest {
};
exports.AssetRequest = AssetRequest;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AssetRequest.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], AssetRequest.prototype, "requestNumber", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], AssetRequest.prototype, "salesRepId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], AssetRequest.prototype, "requestDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['pending', 'approved', 'rejected', 'assigned', 'returned'],
        default: 'pending'
    }),
    __metadata("design:type", String)
], AssetRequest.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AssetRequest.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], AssetRequest.prototype, "approvedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], AssetRequest.prototype, "approvedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], AssetRequest.prototype, "assignedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], AssetRequest.prototype, "assignedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], AssetRequest.prototype, "returnDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], AssetRequest.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP'
    }),
    __metadata("design:type", Date)
], AssetRequest.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sales_rep_entity_1.SalesRep, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'salesRepId' }),
    __metadata("design:type", sales_rep_entity_1.SalesRep)
], AssetRequest.prototype, "salesRep", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sales_rep_entity_1.SalesRep, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'approvedBy' }),
    __metadata("design:type", sales_rep_entity_1.SalesRep)
], AssetRequest.prototype, "approver", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sales_rep_entity_1.SalesRep, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'assignedBy' }),
    __metadata("design:type", sales_rep_entity_1.SalesRep)
], AssetRequest.prototype, "assigner", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => asset_request_item_entity_1.AssetRequestItem, assetRequestItem => assetRequestItem.assetRequest),
    __metadata("design:type", Array)
], AssetRequest.prototype, "items", void 0);
exports.AssetRequest = AssetRequest = __decorate([
    (0, typeorm_1.Entity)('asset_requests'),
    (0, typeorm_1.Index)('AssetRequest_salesRepId_fkey', ['salesRepId']),
    (0, typeorm_1.Index)('AssetRequest_approvedBy_fkey', ['approvedBy']),
    (0, typeorm_1.Index)('AssetRequest_assignedBy_fkey', ['assignedBy'])
], AssetRequest);
//# sourceMappingURL=asset-request.entity.js.map