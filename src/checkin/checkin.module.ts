import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckinController } from './checkin.controller';
import { CheckinService } from './checkin.service';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [CheckinController],
  providers: [CheckinService],
  exports: [CheckinService],
})

export class CheckinModule {} 