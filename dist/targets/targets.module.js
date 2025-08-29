"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TargetsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const targets_service_1 = require("./targets.service");
const targets_controller_1 = require("./targets.controller");
const commission_service_1 = require("./commission.service");
const commission_controller_1 = require("./commission.controller");
const journey_plan_entity_1 = require("../journey-plans/entities/journey-plan.entity");
const sales_rep_entity_1 = require("../entities/sales-rep.entity");
const clients_entity_1 = require("../entities/clients.entity");
const uplift_sale_entity_1 = require("../entities/uplift-sale.entity");
const commission_config_entity_1 = require("./entities/commission-config.entity");
const daily_commission_entity_1 = require("./entities/daily-commission.entity");
let TargetsModule = class TargetsModule {
};
exports.TargetsModule = TargetsModule;
exports.TargetsModule = TargetsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                journey_plan_entity_1.JourneyPlan,
                sales_rep_entity_1.SalesRep,
                clients_entity_1.Clients,
                uplift_sale_entity_1.UpliftSale,
                commission_config_entity_1.CommissionConfig,
                daily_commission_entity_1.DailyCommission,
            ]),
        ],
        controllers: [targets_controller_1.TargetsController, commission_controller_1.CommissionController],
        providers: [targets_service_1.TargetsService, commission_service_1.CommissionService],
        exports: [targets_service_1.TargetsService, commission_service_1.CommissionService],
    })
], TargetsModule);
//# sourceMappingURL=targets.module.js.map