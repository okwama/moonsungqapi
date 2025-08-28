"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoClockoutModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const auto_clockout_service_1 = require("./auto-clockout.service");
const auto_clockout_controller_1 = require("./auto-clockout.controller");
const login_history_entity_1 = require("../entities/login-history.entity");
let AutoClockoutModule = class AutoClockoutModule {
};
exports.AutoClockoutModule = AutoClockoutModule;
exports.AutoClockoutModule = AutoClockoutModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([login_history_entity_1.LoginHistory])],
        providers: [auto_clockout_service_1.AutoClockoutService],
        controllers: [auto_clockout_controller_1.AutoClockoutController],
        exports: [auto_clockout_service_1.AutoClockoutService],
    })
], AutoClockoutModule);
//# sourceMappingURL=auto-clockout.module.js.map