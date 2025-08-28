import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetRequestsService } from './asset-requests.service';
import { AssetRequestsController, AssetTypesController } from './asset-requests.controller';
import { AssetRequest } from '../entities/asset-request.entity';
import { AssetRequestItem } from '../entities/asset-request-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AssetRequest, AssetRequestItem])],
  controllers: [AssetRequestsController, AssetTypesController],
  providers: [AssetRequestsService],
  exports: [AssetRequestsService],
})
export class AssetRequestsModule {}
