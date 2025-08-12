"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const profile_controller_1 = require("./profile.controller");
const profile_service_1 = require("./profile.service");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
const clock_in_out_module_1 = require("../clock-in-out/clock-in-out.module");
const sales_rep_entity_1 = require("../entities/sales-rep.entity");
const platform_express_1 = require("@nestjs/platform-express");
let ProfileModule = class ProfileModule {
};
exports.ProfileModule = ProfileModule;
exports.ProfileModule = ProfileModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([sales_rep_entity_1.SalesRep]),
            clock_in_out_module_1.ClockInOutModule,
            platform_express_1.MulterModule.register({
                storage: require('multer').memoryStorage(),
                limits: {
                    fileSize: 5 * 1024 * 1024,
                },
                fileFilter: (req, file, cb) => {
                    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
                    if (allowedMimeTypes.includes(file.mimetype)) {
                        cb(null, true);
                    }
                    else {
                        cb(new Error('Only JPEG and PNG files are allowed'), false);
                    }
                },
            }),
        ],
        controllers: [profile_controller_1.ProfileController],
        providers: [profile_service_1.ProfileService, cloudinary_service_1.CloudinaryService],
        exports: [profile_service_1.ProfileService],
    })
], ProfileModule);
//# sourceMappingURL=profile.module.js.map