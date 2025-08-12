import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientStock } from '../entities/client-stock.entity';
import { ClientStockService } from './client-stock.service';
import { ClientStockController } from './client-stock.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ClientStock])],
  providers: [ClientStockService],
  controllers: [ClientStockController],
  exports: [ClientStockService],
})
export class ClientStockModule {}
