import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsController } from './clients.controller';
import { OutletsController } from './outlets.controller';
import { ClientsService } from './clients.service';
import { Clients } from '../entities/clients.entity';
import { OutletQuantityModule } from '../outlet-quantity/outlet-quantity.module';
import { ClientAssignmentModule } from '../client-assignment/client-assignment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Clients]),
    OutletQuantityModule,
    ClientAssignmentModule
  ],
  controllers: [ClientsController, OutletsController],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class ClientsModule {} 