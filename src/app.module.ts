import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ScheduleModule } from '@nestjs/schedule';
import { getDatabaseConfig } from './config/database.config';
import { DatabaseHealthService } from './config/database-health.service';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProfileModule } from './profile/profile.module';
import { ClientsModule } from './clients/clients.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { TargetsModule } from './targets/targets.module';
import { JourneyPlansModule } from './journey-plans/journey-plans.module';
import { NoticesModule } from './notices/notices.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { TasksModule } from './tasks/tasks.module';
import { UploadsModule } from './uploads/uploads.module';
import { UpliftSalesModule } from './uplift-sales/uplift-sales.module';
import { CheckinModule } from './checkin/checkin.module';
import { LeaveModule } from './leave/leave.module';
import { ExcelImportModule } from './excel-import/excel-import.module';
import { ClockInOutModule } from './clock-in-out/clock-in-out.module';
import { ReportsModule } from './reports/reports.module';
import { RoutesModule } from './routes/routes.module';
import { VersionModule } from './version/version.module';
import { PaymentsModule } from './payments/payments.module';
import { OutletQuantityModule } from './outlet-quantity/outlet-quantity.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ClientAssignmentModule } from './client-assignment/client-assignment.module';
import { ClientStockModule } from './client-stock/client-stock.module';
import { NoticeBoardModule } from './notice-board/notice-board.module';
import { RolesModule } from './roles/roles.module';
import { SampleRequestsModule } from './sample-requests/sample-requests.module';
import { AssetRequestsModule } from './asset-requests/asset-requests.module';
import { OutletQuantityTransactionsModule } from './outlet-quantity-transactions/outlet-quantity-transactions.module';
import { AutoClockoutModule } from './auto-clockout/auto-clockout.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => getDatabaseConfig(configService),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'woosh-secret-key'),
        signOptions: { expiresIn: '9h' },
      }),
      inject: [ConfigService],
    }),
    PassportModule,
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    ProfileModule,
    ClientsModule,
    ProductsModule,
    OrdersModule,
    TargetsModule,
    JourneyPlansModule,
    NoticesModule,
    AnalyticsModule,
    TasksModule,
    UploadsModule,
    UpliftSalesModule,
    CheckinModule,
    LeaveModule,
    ExcelImportModule,
    ClockInOutModule,
    ReportsModule,
    RoutesModule,
    VersionModule,
    PaymentsModule,
    OutletQuantityModule,
    CloudinaryModule,
    ClientAssignmentModule,
    ClientStockModule,
    NoticeBoardModule,
    RolesModule,
    SampleRequestsModule,
    AssetRequestsModule,
    OutletQuantityTransactionsModule,
    AutoClockoutModule,
  ],
  providers: [DatabaseHealthService],
})
export class AppModule {} 