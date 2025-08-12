"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const clients_controller_1 = require("./clients.controller");
const outlets_controller_1 = require("./outlets.controller");
const clients_service_1 = require("./clients.service");
const clients_entity_1 = require("../entities/clients.entity");
const outlet_quantity_module_1 = require("../outlet-quantity/outlet-quantity.module");
const client_assignment_module_1 = require("../client-assignment/client-assignment.module");
let ClientsModule = class ClientsModule {
};
exports.ClientsModule = ClientsModule;
exports.ClientsModule = ClientsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([clients_entity_1.Clients]),
            outlet_quantity_module_1.OutletQuantityModule,
            client_assignment_module_1.ClientAssignmentModule
        ],
        controllers: [clients_controller_1.ClientsController, outlets_controller_1.OutletsController],
        providers: [clients_service_1.ClientsService],
        exports: [clients_service_1.ClientsService],
    })
], ClientsModule);
//# sourceMappingURL=clients.module.js.map