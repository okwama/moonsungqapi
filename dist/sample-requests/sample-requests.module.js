"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SampleRequestsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const sample_request_entity_1 = require("../entities/sample-request.entity");
const sample_request_item_entity_1 = require("../entities/sample-request-item.entity");
const sample_requests_controller_1 = require("./sample-requests.controller");
const sample_requests_service_1 = require("./sample-requests.service");
let SampleRequestsModule = class SampleRequestsModule {
};
exports.SampleRequestsModule = SampleRequestsModule;
exports.SampleRequestsModule = SampleRequestsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([sample_request_entity_1.SampleRequest, sample_request_item_entity_1.SampleRequestItem]),
        ],
        controllers: [sample_requests_controller_1.SampleRequestsController],
        providers: [sample_requests_service_1.SampleRequestsService],
        exports: [sample_requests_service_1.SampleRequestsService],
    })
], SampleRequestsModule);
//# sourceMappingURL=sample-requests.module.js.map