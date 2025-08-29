import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TargetsService } from './targets.service';
import { TargetsController } from './targets.controller';
import { CommissionService } from './commission.service';
import { CommissionController } from './commission.controller';
import { JourneyPlan } from '../journey-plans/entities/journey-plan.entity';
import { SalesRep } from '../entities/sales-rep.entity';
import { Clients } from '../entities/clients.entity';
import { UpliftSale } from '../entities/uplift-sale.entity';
import { CommissionConfig } from './entities/commission-config.entity';
import { DailyCommission } from './entities/daily-commission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      JourneyPlan,
      SalesRep,
      Clients,
      UpliftSale,
      CommissionConfig,
      DailyCommission,
    ]),
  ],
  controllers: [TargetsController, CommissionController],
  providers: [TargetsService, CommissionService],
  exports: [TargetsService, CommissionService],
})
export class TargetsModule {} 