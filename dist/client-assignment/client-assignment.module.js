"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientAssignmentModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const client_assignment_service_1 = require("./client-assignment.service");
const client_assignment_entity_1 = require("../entities/client-assignment.entity");
const clients_entity_1 = require("../entities/clients.entity");
let ClientAssignmentModule = class ClientAssignmentModule {
};
exports.ClientAssignmentModule = ClientAssignmentModule;
exports.ClientAssignmentModule = ClientAssignmentModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([client_assignment_entity_1.ClientAssignment, clients_entity_1.Clients])],
        providers: [client_assignment_service_1.ClientAssignmentService],
        exports: [client_assignment_service_1.ClientAssignmentService],
    })
], ClientAssignmentModule);
//# sourceMappingURL=client-assignment.module.js.map