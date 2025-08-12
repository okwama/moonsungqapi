"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientStockModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const client_stock_entity_1 = require("../entities/client-stock.entity");
const client_stock_service_1 = require("./client-stock.service");
const client_stock_controller_1 = require("./client-stock.controller");
let ClientStockModule = class ClientStockModule {
};
exports.ClientStockModule = ClientStockModule;
exports.ClientStockModule = ClientStockModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([client_stock_entity_1.ClientStock])],
        providers: [client_stock_service_1.ClientStockService],
        controllers: [client_stock_controller_1.ClientStockController],
        exports: [client_stock_service_1.ClientStockService],
    })
], ClientStockModule);
//# sourceMappingURL=client-stock.module.js.map