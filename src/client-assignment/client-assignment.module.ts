import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientAssignmentService } from './client-assignment.service';
import { ClientAssignmentCacheService } from './client-assignment-cache.service';
import { ClientAssignment } from '../entities/client-assignment.entity';
import { Clients } from '../entities/clients.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClientAssignment, Clients])],
  providers: [
    ClientAssignmentService,
    ClientAssignmentCacheService, // ✅ FIX: Provide cache service
  ],
  exports: [ClientAssignmentService, ClientAssignmentCacheService],
})
export class ClientAssignmentModule {}

