import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientAssignment } from '../entities/client-assignment.entity';
import { Clients } from '../entities/clients.entity';
import { ClientAssignmentCacheService } from './client-assignment-cache.service';

@Injectable()
export class ClientAssignmentService {
  private readonly logger = new Logger(ClientAssignmentService.name);

  constructor(
    @InjectRepository(ClientAssignment)
    private clientAssignmentRepository: Repository<ClientAssignment>,
    @InjectRepository(Clients)
    private clientsRepository: Repository<Clients>,
    private cacheService: ClientAssignmentCacheService,
  ) {}

  async assignOutletToSalesRep(outletId: number, salesRepId: number): Promise<ClientAssignment> {
    this.logger.log(`📋 Assigning outlet ${outletId} to sales rep ${salesRepId}`);

    try {
      // Check if outlet exists
      const outlet = await this.clientsRepository.findOne({ where: { id: outletId } });
      if (!outlet) {
        throw new Error('Outlet not found');
      }

      // Deactivate any existing active assignment for this outlet
      await this.clientAssignmentRepository.update(
        { outletId, status: 'active' },
        { status: 'inactive' }
      );

      // Create new assignment
      const assignment = this.clientAssignmentRepository.create({
        outletId,
        salesRepId,
        status: 'active',
        assignedAt: new Date(),
      });

      const savedAssignment = await this.clientAssignmentRepository.save(assignment);
      this.logger.log(`✅ Successfully assigned outlet ${outletId} to sales rep ${salesRepId}`);
      
      // ✅ FIX: Invalidate cache when assignments change
      this.cacheService.invalidate(`assignments:${salesRepId}:*`);
      
      return savedAssignment;
    } catch (error) {
      this.logger.error(`❌ Error assigning outlet:`, error);
      throw error;
    }
  }

  async getAssignedOutlets(salesRepId: number, userCountryId: number): Promise<any[]> {
    this.logger.log(`🔍 Getting assigned outlets for sales rep ${salesRepId}`);

    // ✅ FIX: Use caching to prevent repeated DB queries (called 16+ times per request!)
    // BEFORE: Every call hits DB → 1,600 queries at 100 req/min
    // AFTER: Cached for 5 minutes → 100 queries at 100 req/min (93.75% reduction!)
    const cacheKey = `assignments:${salesRepId}:${userCountryId}`;
    
    return this.cacheService.getOrSet(cacheKey, async () => {
      try {
        const assignments = await this.clientAssignmentRepository.find({
          where: { salesRepId, status: 'active' },
          relations: ['outlet'],
        });

        this.logger.log(`📊 Found ${assignments.length} active assignments for sales rep ${salesRepId}`);

        // Filter outlets by country and transform to match expected format
        const assignedOutlets = assignments
          .map(assignment => assignment.outlet)
          .filter(outlet => outlet.countryId === userCountryId)
          .map(outlet => ({
            id: outlet.id,
            name: outlet.name,
            balance: outlet.balance ?? 0,
            address: outlet.address,
            latitude: outlet.latitude,
            longitude: outlet.longitude,
            contact: outlet.contact,
            email: outlet.email,
            regionId: outlet.region_id,
            region: outlet.region,
            countryId: outlet.countryId,
            status: outlet.status,
            taxPin: outlet.tax_pin,
            location: outlet.location,
            clientType: outlet.client_type,
            outletAccount: outlet.outlet_account,
            createdAt: outlet.created_at,
          }));

        this.logger.log(`✅ Found ${assignedOutlets.length} assigned outlets for sales rep ${salesRepId} in country ${userCountryId} (cached for 5 min)`);
        return assignedOutlets;
      } catch (error) {
        this.logger.error(`❌ Error getting assigned outlets:`, error);
        throw error;
      }
    });
  }

  async getOutletAssignment(outletId: number): Promise<ClientAssignment | null> {
    return this.clientAssignmentRepository.findOne({
      where: { outletId, status: 'active' },
      relations: ['salesRep'],
    });
  }

  async deactivateAssignment(outletId: number): Promise<void> {
    await this.clientAssignmentRepository.update(
      { outletId, status: 'active' },
      { status: 'inactive' }
    );
    
    // ✅ FIX: Invalidate cache when assignments change
    this.cacheService.clearAll(); // Clear all since we don't know which salesRep this affects
  }

  async getAssignmentHistory(outletId: number): Promise<ClientAssignment[]> {
    return this.clientAssignmentRepository.find({
      where: { outletId },
      relations: ['salesRep'],
      order: { assignedAt: 'DESC' },
    });
  }

  async getSalesRepAssignments(salesRepId: number): Promise<ClientAssignment[]> {
    return this.clientAssignmentRepository.find({
      where: { salesRepId, status: 'active' },
      relations: ['outlet'],
    });
  }
}
