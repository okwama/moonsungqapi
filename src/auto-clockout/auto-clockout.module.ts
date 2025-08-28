import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutoClockoutService } from './auto-clockout.service';
import { AutoClockoutController } from './auto-clockout.controller';
import { LoginHistory } from '../entities/login-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LoginHistory])],
  providers: [AutoClockoutService],
  controllers: [AutoClockoutController],
  exports: [AutoClockoutService],
})
export class AutoClockoutModule {}
