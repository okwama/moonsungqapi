import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OutletQuantityTransaction } from '../entities/outlet-quantity-transaction.entity';
import { OutletQuantityTransactionsService } from './outlet-quantity-transactions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([OutletQuantityTransaction]),
  ],
  providers: [OutletQuantityTransactionsService],
  exports: [OutletQuantityTransactionsService],
})
export class OutletQuantityTransactionsModule {}
