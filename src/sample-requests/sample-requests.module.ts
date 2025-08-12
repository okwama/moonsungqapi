import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SampleRequest } from '../entities/sample-request.entity';
import { SampleRequestItem } from '../entities/sample-request-item.entity';
import { SampleRequestsController } from './sample-requests.controller';
import { SampleRequestsService } from './sample-requests.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SampleRequest, SampleRequestItem]),
  ],
  controllers: [SampleRequestsController],
  providers: [SampleRequestsService],
  exports: [SampleRequestsService],
})
export class SampleRequestsModule {}
