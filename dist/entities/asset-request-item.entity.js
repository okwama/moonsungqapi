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
exports.AssetRequestItem = void 0;
const typeorm_1 = require("typeorm");
const asset_request_entity_1 = require("./asset-request.entity");
let AssetRequestItem = class AssetRequestItem {
};
exports.AssetRequestItem = AssetRequestItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AssetRequestItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], AssetRequestItem.prototype, "assetRequestId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AssetRequestItem.prototype, "assetName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AssetRequestItem.prototype, "assetType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 1 }),
    __metadata("design:type", Number)
], AssetRequestItem.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AssetRequestItem.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], AssetRequestItem.prototype, "assignedQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], AssetRequestItem.prototype, "returnedQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], AssetRequestItem.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asset_request_entity_1.AssetRequest, assetRequest => assetRequest.items, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'assetRequestId' }),
    __metadata("design:type", asset_request_entity_1.AssetRequest)
], AssetRequestItem.prototype, "assetRequest", void 0);
exports.AssetRequestItem = AssetRequestItem = __decorate([
    (0, typeorm_1.Entity)('asset_request_items'),
    (0, typeorm_1.Index)('AssetRequestItem_assetRequestId_fkey', ['assetRequestId'])
], AssetRequestItem);
//# sourceMappingURL=asset-request-item.entity.js.map