import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpliftSalesController } from './uplift-sales.controller';
import { UpliftSalesService } from './uplift-sales.service';
import { UpliftSale, UpliftSaleItem, ClientStock } from '../entities';
import { OutletQuantityTransactionsModule } from '../outlet-quantity-transactions/outlet-quantity-transactions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UpliftSale, UpliftSaleItem, ClientStock]),
    OutletQuantityTransactionsModule,
  ],
  controllers: [UpliftSalesController],
  providers: [UpliftSalesService],
  exports: [UpliftSalesService],
})
export class UpliftSalesModule {} 