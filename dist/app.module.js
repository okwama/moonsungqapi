"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const schedule_1 = require("@nestjs/schedule");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const database_config_1 = require("./config/database.config");
const database_health_service_1 = require("./config/database-health.service");
const database_connection_service_1 = require("./config/database-connection.service");
const health_controller_1 = require("./config/health.controller");
const performance_monitor_service_1 = require("./config/performance-monitor.service");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const profile_module_1 = require("./profile/profile.module");
const clients_module_1 = require("./clients/clients.module");
const products_module_1 = require("./products/products.module");
const orders_module_1 = require("./orders/orders.module");
const targets_module_1 = require("./targets/targets.module");
const journey_plans_module_1 = require("./journey-plans/journey-plans.module");
const notices_module_1 = require("./notices/notices.module");
const analytics_module_1 = require("./analytics/analytics.module");
const tasks_module_1 = require("./tasks/tasks.module");
const uploads_module_1 = require("./uploads/uploads.module");
const uplift_sales_module_1 = require("./uplift-sales/uplift-sales.module");
const checkin_module_1 = require("./checkin/checkin.module");
const leave_module_1 = require("./leave/leave.module");
const excel_import_module_1 = require("./excel-import/excel-import.module");
const clock_in_out_module_1 = require("./clock-in-out/clock-in-out.module");
const reports_module_1 = require("./reports/reports.module");
const routes_module_1 = require("./routes/routes.module");
const version_module_1 = require("./version/version.module");
const payments_module_1 = require("./payments/payments.module");
const outlet_quantity_module_1 = require("./outlet-quantity/outlet-quantity.module");
const cloudinary_module_1 = require("./cloudinary/cloudinary.module");
const client_assignment_module_1 = require("./client-assignment/client-assignment.module");
const client_stock_module_1 = require("./client-stock/client-stock.module");
const notice_board_module_1 = require("./notice-board/notice-board.module");
const roles_module_1 = require("./roles/roles.module");
const sample_requests_module_1 = require("./sample-requests/sample-requests.module");
const asset_requests_module_1 = require("./asset-requests/asset-requests.module");
const outlet_quantity_transactions_module_1 = require("./outlet-quantity-transactions/outlet-quantity-transactions.module");
const auto_clockout_module_1 = require("./auto-clockout/auto-clockout.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env.local', '.env'],
            }),
            throttler_1.ThrottlerModule.forRoot([{
                    ttl: 60000,
                    limit: 100,
                }]),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => (0, database_config_1.getDatabaseConfig)(configService),
                inject: [config_1.ConfigService],
            }),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    secret: configService.get('JWT_SECRET', 'woosh-secret-key'),
                    signOptions: { expiresIn: '9h' },
                }),
                inject: [config_1.ConfigService],
            }),
            passport_1.PassportModule,
            schedule_1.ScheduleModule.forRoot(),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            profile_module_1.ProfileModule,
            clients_module_1.ClientsModule,
            products_module_1.ProductsModule,
            orders_module_1.OrdersModule,
            targets_module_1.TargetsModule,
            journey_plans_module_1.JourneyPlansModule,
            notices_module_1.NoticesModule,
            analytics_module_1.AnalyticsModule,
            tasks_module_1.TasksModule,
            uploads_module_1.UploadsModule,
            uplift_sales_module_1.UpliftSalesModule,
            checkin_module_1.CheckinModule,
            leave_module_1.LeaveModule,
            excel_import_module_1.ExcelImportModule,
            clock_in_out_module_1.ClockInOutModule,
            reports_module_1.ReportsModule,
            routes_module_1.RoutesModule,
            version_module_1.VersionModule,
            payments_module_1.PaymentsModule,
            outlet_quantity_module_1.OutletQuantityModule,
            cloudinary_module_1.CloudinaryModule,
            client_assignment_module_1.ClientAssignmentModule,
            client_stock_module_1.ClientStockModule,
            notice_board_module_1.NoticeBoardModule,
            roles_module_1.RolesModule,
            sample_requests_module_1.SampleRequestsModule,
            asset_requests_module_1.AssetRequestsModule,
            outlet_quantity_transactions_module_1.OutletQuantityTransactionsModule,
            auto_clockout_module_1.AutoClockoutModule,
        ],
        providers: [
            database_health_service_1.DatabaseHealthService,
            database_connection_service_1.DatabaseConnectionService,
            performance_monitor_service_1.PerformanceMonitorService,
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
        controllers: [health_controller_1.HealthController],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map