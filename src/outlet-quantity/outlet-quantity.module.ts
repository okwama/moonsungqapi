import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OutletQuantityService } from './outlet-quantity.service';
import { OutletQuantity } from '../entities/outlet-quantity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OutletQuantity])],
  providers: [OutletQuantityService],
  exports: [OutletQuantityService],
})
export class OutletQuantityModule {}

