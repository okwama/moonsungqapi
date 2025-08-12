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
exports.SampleRequest = void 0;
const typeorm_1 = require("typeorm");
const clients_entity_1 = require("./clients.entity");
const sales_rep_entity_1 = require("./sales-rep.entity");
const sample_request_item_entity_1 = require("./sample-request-item.entity");
let SampleRequest = class SampleRequest {
};
exports.SampleRequest = SampleRequest;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SampleRequest.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SampleRequest.prototype, "clientId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SampleRequest.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], SampleRequest.prototype, "requestNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], SampleRequest.prototype, "requestDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }),
    __metadata("design:type", String)
], SampleRequest.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], SampleRequest.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], SampleRequest.prototype, "approvedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], SampleRequest.prototype, "approvedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], SampleRequest.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP'
    }),
    __metadata("design:type", Date)
], SampleRequest.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => clients_entity_1.Clients, clients => clients.sampleRequests, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'clientId' }),
    __metadata("design:type", clients_entity_1.Clients)
], SampleRequest.prototype, "client", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sales_rep_entity_1.SalesRep, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", sales_rep_entity_1.SalesRep)
], SampleRequest.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => sample_request_item_entity_1.SampleRequestItem, sampleRequestItem => sampleRequestItem.sampleRequest),
    __metadata("design:type", Array)
], SampleRequest.prototype, "sampleRequestItems", void 0);
exports.SampleRequest = SampleRequest = __decorate([
    (0, typeorm_1.Entity)('sample_request'),
    (0, typeorm_1.Index)('SampleRequest_clientId_fkey', ['clientId']),
    (0, typeorm_1.Index)('SampleRequest_userId_fkey', ['userId'])
], SampleRequest);
//# sourceMappingURL=sample-request.entity.js.map