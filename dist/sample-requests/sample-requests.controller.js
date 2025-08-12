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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SampleRequestsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const sample_requests_service_1 = require("./sample-requests.service");
let SampleRequestsController = class SampleRequestsController {
    constructor(sampleRequestsService) {
        this.sampleRequestsService = sampleRequestsService;
    }
    async create(createDto, req) {
        console.log('[SampleRequest] Creating sample request:', createDto);
        console.log('[SampleRequest] User from request:', req.user);
        if (createDto.userId !== req.user.id) {
            createDto.userId = req.user.id;
        }
        const result = await this.sampleRequestsService.create(createDto);
        console.log('[SampleRequest] Created sample request:', result);
        return result;
    }
    async findAll(clientId, status) {
        if (clientId) {
            return this.sampleRequestsService.findByClient(parseInt(clientId));
        }
        if (status && ['pending', 'approved', 'rejected'].includes(status)) {
            return this.sampleRequestsService.findByStatus(status);
        }
        return this.sampleRequestsService.findAll();
    }
    async findMyRequests(req) {
        return this.sampleRequestsService.findByUser(req.user.id);
    }
    async findOne(id) {
        return this.sampleRequestsService.findOne(+id);
    }
    async update(id, updateDto, req) {
        if (updateDto.status === 'approved' && !updateDto.approvedBy) {
            updateDto.approvedBy = req.user.id;
        }
        return this.sampleRequestsService.update(+id, updateDto);
    }
    async remove(id) {
        return this.sampleRequestsService.remove(+id);
    }
};
exports.SampleRequestsController = SampleRequestsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SampleRequestsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('clientId')),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SampleRequestsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my-requests'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SampleRequestsController.prototype, "findMyRequests", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SampleRequestsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], SampleRequestsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SampleRequestsController.prototype, "remove", null);
exports.SampleRequestsController = SampleRequestsController = __decorate([
    (0, common_1.Controller)('sample-requests'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [sample_requests_service_1.SampleRequestsService])
], SampleRequestsController);
//# sourceMappingURL=sample-requests.controller.js.map