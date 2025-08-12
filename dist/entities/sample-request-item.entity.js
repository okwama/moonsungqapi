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
exports.SampleRequestItem = void 0;
const typeorm_1 = require("typeorm");
const sample_request_entity_1 = require("./sample-request.entity");
const product_entity_1 = require("../products/entities/product.entity");
let SampleRequestItem = class SampleRequestItem {
};
exports.SampleRequestItem = SampleRequestItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SampleRequestItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SampleRequestItem.prototype, "sampleRequestId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SampleRequestItem.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 1 }),
    __metadata("design:type", Number)
], SampleRequestItem.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], SampleRequestItem.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], SampleRequestItem.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product, product => product.sampleRequestItems, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'productId' }),
    __metadata("design:type", product_entity_1.Product)
], SampleRequestItem.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sample_request_entity_1.SampleRequest, sampleRequest => sampleRequest.sampleRequestItems, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'sampleRequestId' }),
    __metadata("design:type", sample_request_entity_1.SampleRequest)
], SampleRequestItem.prototype, "sampleRequest", void 0);
exports.SampleRequestItem = SampleRequestItem = __decorate([
    (0, typeorm_1.Entity)('sample_request_item'),
    (0, typeorm_1.Index)('SampleRequestItem_sampleRequestId_fkey', ['sampleRequestId']),
    (0, typeorm_1.Index)('SampleRequestItem_productId_fkey', ['productId'])
], SampleRequestItem);
//# sourceMappingURL=sample-request-item.entity.js.map