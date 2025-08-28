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
exports.AssetTypesController = exports.AssetRequestsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const asset_requests_service_1 = require("./asset-requests.service");
let AssetRequestsController = class AssetRequestsController {
    constructor(assetRequestsService) {
        this.assetRequestsService = assetRequestsService;
    }
    async create(createDto, req) {
        console.log('[AssetRequest] Creating asset request:', createDto);
        console.log('[AssetRequest] User from request:', req.user);
        if (createDto.salesRepId !== req.user.id) {
            createDto.salesRepId = req.user.id;
        }
        const result = await this.assetRequestsService.create(createDto);
        console.log('[AssetRequest] Created asset request:', result);
        return result;
    }
    async findAll(userId, status) {
        if (userId) {
            return this.assetRequestsService.findByUser(parseInt(userId));
        }
        if (status && ['pending', 'approved', 'rejected', 'assigned', 'returned'].includes(status)) {
            return this.assetRequestsService.findByStatus(status);
        }
        return this.assetRequestsService.findAll();
    }
    async findMyRequests(req) {
        return this.assetRequestsService.findByUser(req.user.id);
    }
    async findOne(id) {
        return this.assetRequestsService.findOne(+id);
    }
    async updateStatus(id, updateDto, req) {
        if (updateDto.status === 'approved' && !updateDto.approvedBy) {
            updateDto.approvedBy = req.user.id;
        }
        if (updateDto.status === 'assigned' && !updateDto.assignedBy) {
            updateDto.assignedBy = req.user.id;
        }
        return this.assetRequestsService.update(+id, updateDto);
    }
    async assignAssets(id, assignDto, req) {
        console.log('[AssetRequest] Assigning assets to request:', id, assignDto);
        return this.assetRequestsService.assignAssets(+id, assignDto);
    }
    async returnAssets(id, returnDto, req) {
        console.log('[AssetRequest] Returning assets for request:', id, returnDto);
        return this.assetRequestsService.returnAssets(+id, returnDto);
    }
    async remove(id) {
        return this.assetRequestsService.remove(+id);
    }
};
exports.AssetRequestsController = AssetRequestsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AssetRequestsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AssetRequestsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my-requests'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AssetRequestsController.prototype, "findMyRequests", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssetRequestsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AssetRequestsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)(':id/assign'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AssetRequestsController.prototype, "assignAssets", null);
__decorate([
    (0, common_1.Post)(':id/return'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AssetRequestsController.prototype, "returnAssets", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssetRequestsController.prototype, "remove", null);
exports.AssetRequestsController = AssetRequestsController = __decorate([
    (0, common_1.Controller)('asset-requests'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [asset_requests_service_1.AssetRequestsService])
], AssetRequestsController);
let AssetTypesController = class AssetTypesController {
    constructor(assetRequestsService) {
        this.assetRequestsService = assetRequestsService;
    }
    async getAssetTypes() {
        return this.assetRequestsService.getAssetTypes();
    }
};
exports.AssetTypesController = AssetTypesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AssetTypesController.prototype, "getAssetTypes", null);
exports.AssetTypesController = AssetTypesController = __decorate([
    (0, common_1.Controller)('asset-types'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [asset_requests_service_1.AssetRequestsService])
], AssetTypesController);
//# sourceMappingURL=asset-requests.controller.js.map