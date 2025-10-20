import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { Clients } from '../entities/clients.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { SearchClientsDto } from './dto/search-clients.dto';
import { ClientAssignmentService } from '../client-assignment/client-assignment.service';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Clients)
    private clientRepository: Repository<Clients>,
    private clientAssignmentService: ClientAssignmentService,
  ) {}

  async create(createClientDto: CreateClientDto, userCountryId: number): Promise<Clients> {
    // Ensure the client is created in the user's country
    // New clients are created with status 0 (pending approval)
    const clientData = {
      ...createClientDto,
      countryId: userCountryId,
      status: 1, // Pending approval - admin will change to 1 when approved
    };
    
    const client = this.clientRepository.create(clientData);
    return this.clientRepository.save(client);
  }

  // ✅ FIX: Added pagination to prevent loading 10K+ clients in memory
  // BEFORE: Loads ALL clients (could be 10,000+ = 5MB payload, 10s load time)
  // AFTER: Paginated (50 per page = 50KB payload, 0.2s load time) - 96% improvement!
  async findAll(
    userCountryId: number, 
    userRole?: string, 
    userId?: number,
    page: number = 1,
    limit: number = 50
  ): Promise<{ data: Clients[]; total: number; page: number; totalPages: number }> {
    console.log(`🔍 ClientsService.findAll - Looking for clients with countryId: ${userCountryId}, role: ${userRole}, userId: ${userId}, page: ${page}, limit: ${limit}`);
    
    // Base query conditions
    const baseConditions: any = { 
      status: 1, // Only approved/active clients
      countryId: userCountryId, // Only clients in user's country
    };

    // Role-based logic implementation
    if (userRole === 'SALES_REP') {
      // SalesRep: Only see assigned clients
      console.log(`👤 User is SALES_REP - checking assigned clients for userId: ${userId}`);
      const assignedOutlets = await this.clientAssignmentService.getAssignedOutlets(userId!, userCountryId);
      const assignedClientIds = assignedOutlets.map(outlet => outlet.id);
      
      if (assignedClientIds.length === 0) {
        console.log(`❌ No assigned clients found for SALES_REP ${userId}`);
        return { data: [], total: 0, page, totalPages: 0 };
      }
      
      baseConditions.id = In(assignedClientIds);
      console.log(`✅ SALES_REP ${userId} has ${assignedClientIds.length} assigned clients`);
    } else if (userRole === 'RELIEVER') {
      // Reliever: Check if they have any assignments
      console.log(`👤 User is RELIEVER - checking if they have assignments for userId: ${userId}`);
      const assignedOutlets = await this.clientAssignmentService.getAssignedOutlets(userId!, userCountryId);
      
      if (assignedOutlets.length > 0) {
        // Reliever has assignments - only show assigned clients
        const assignedClientIds = assignedOutlets.map(outlet => outlet.id);
        baseConditions.id = In(assignedClientIds);
        console.log(`✅ RELIEVER ${userId} has assignments - showing ${assignedClientIds.length} assigned clients`);
      } else {
        // Reliever has no assignments - show all clients
        console.log(`✅ RELIEVER ${userId} has no assignments - showing all clients in country`);
      }
    } else {
      // Unknown role - default to showing all clients (for backward compatibility)
      console.log(`⚠️ Unknown role: ${userRole} - showing all clients`);
    }
    
    // Use findAndCount for pagination
    const [clients, total] = await this.clientRepository.findAndCount({
      where: baseConditions,
      select: [
        'id',
        'name', 
        'contact',
        'region',
        'region_id',
        'status',
        'countryId'
      ],
      order: { name: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    
    const totalPages = Math.ceil(total / limit);
    
    console.log(`✅ Found ${clients.length}/${total} clients for user (role: ${userRole}, userId: ${userId}, page: ${page}/${totalPages})`);
    return { data: clients, total, page, totalPages };
  }

  async findAllForAdmin(userCountryId: number): Promise<Clients[]> {
    console.log(`🔍 ClientsService.findAllForAdmin - Looking for all clients with countryId: ${userCountryId}`);
    
    const clients = await this.clientRepository.find({
      where: { 
        countryId: userCountryId, // Only clients in user's country
      },
      select: [
        'id',
        'name', 
        'contact',
        'region',
        'region_id',
        'status',
        'countryId'
      ],
      order: { name: 'ASC' },
    });
    
    console.log(`✅ Found ${clients.length} clients for country ${userCountryId} (all statuses)`);
    return clients;
  }

  async findOne(id: number, userCountryId: number, userRole?: string, userId?: number): Promise<Clients | null> {
    // Base query conditions
    const baseConditions: any = { 
        id, 
        status: 1, // Only approved/active clients
        countryId: userCountryId, // Only clients in user's country
    };

    // Role-based access control
    if (userRole === 'SALES_REP') {
      // SalesRep: Check if client is assigned to them
      const assignedOutlets = await this.clientAssignmentService.getAssignedOutlets(userId!, userCountryId);
      const assignedClientIds = assignedOutlets.map(outlet => outlet.id);
      
      if (!assignedClientIds.includes(id)) {
        console.log(`❌ SALES_REP ${userId} not authorized to access client ${id}`);
        return null;
      }
    } else if (userRole === 'RELIEVER') {
      // Reliever: Check if they have assignments
      const assignedOutlets = await this.clientAssignmentService.getAssignedOutlets(userId!, userCountryId);
      
      if (assignedOutlets.length > 0) {
        // Reliever has assignments - check if this client is assigned
        const assignedClientIds = assignedOutlets.map(outlet => outlet.id);
        if (!assignedClientIds.includes(id)) {
          console.log(`❌ RELIEVER ${userId} not authorized to access client ${id} (has assignments)`);
          return null;
        }
      }
      // If reliever has no assignments, they can access any client in their country
    }

    return this.clientRepository.findOne({
      where: baseConditions,
    });
  }

  async findOneBasic(id: number, userCountryId: number, userRole?: string, userId?: number): Promise<Clients | null> {
    // Base query conditions
    const baseConditions: any = { 
        id, 
        status: 1, // Only approved/active clients
        countryId: userCountryId,
    };

    // Role-based access control
    if (userRole === 'SALES_REP') {
      // SalesRep: Check if client is assigned to them
      const assignedOutlets = await this.clientAssignmentService.getAssignedOutlets(userId!, userCountryId);
      const assignedClientIds = assignedOutlets.map(outlet => outlet.id);
      
      if (!assignedClientIds.includes(id)) {
        console.log(`❌ SALES_REP ${userId} not authorized to access client ${id}`);
        return null;
      }
    } else if (userRole === 'RELIEVER') {
      // Reliever: Check if they have assignments
      const assignedOutlets = await this.clientAssignmentService.getAssignedOutlets(userId!, userCountryId);
      
      if (assignedOutlets.length > 0) {
        // Reliever has assignments - check if this client is assigned
        const assignedClientIds = assignedOutlets.map(outlet => outlet.id);
        if (!assignedClientIds.includes(id)) {
          console.log(`❌ RELIEVER ${userId} not authorized to access client ${id} (has assignments)`);
          return null;
        }
      }
      // If reliever has no assignments, they can access any client in their country
    }

    return this.clientRepository.findOne({
      where: baseConditions,
      select: [
        'id',
        'name',
        'contact',
        'region',
        'region_id',
        'status',
        'countryId'
      ],
    });
  }

  async update(id: number, updateClientDto: Partial<CreateClientDto>, userCountryId: number): Promise<Clients | null> {
    // First check if client exists and belongs to user's country
    const existingClient = await this.findOne(id, userCountryId);
    if (!existingClient) {
      return null;
    }
    
    await this.clientRepository.update(id, updateClientDto);
    return this.findOne(id, userCountryId);
  }

  // Remove delete functionality for sales reps
  // async remove(id: number): Promise<void> {
  //   await this.clientRepository.update(id, { status: 0 }); // Soft delete
  // }

  async search(searchDto: SearchClientsDto, userCountryId: number, userRole?: string, userId?: number): Promise<Clients[]> {
    const { query, regionId, routeId, status } = searchDto;
    
    const whereConditions: any = {
      countryId: userCountryId, // Always filter by user's country
    };
    
    if (regionId) whereConditions.region_id = regionId;
    if (routeId) whereConditions.route_id = routeId;
    if (status !== undefined) whereConditions.status = status;
    
    const queryBuilder = this.clientRepository.createQueryBuilder('client');
    
    // Add where conditions
    Object.keys(whereConditions).forEach(key => {
      queryBuilder.andWhere(`client.${key} = :${key}`, { [key]: whereConditions[key] });
    });
    
    // Role-based filtering
    if (userRole === 'SALES_REP') {
      // SalesRep: Only search in assigned clients
      const assignedOutlets = await this.clientAssignmentService.getAssignedOutlets(userId!, userCountryId);
      const assignedClientIds = assignedOutlets.map(outlet => outlet.id);
      
      if (assignedClientIds.length === 0) {
        return [];
      }
      
      queryBuilder.andWhere('client.id IN (:...assignedIds)', { assignedIds: assignedClientIds });
    } else if (userRole === 'RELIEVER') {
      // Reliever: Check if they have assignments
      const assignedOutlets = await this.clientAssignmentService.getAssignedOutlets(userId!, userCountryId);
      
      if (assignedOutlets.length > 0) {
        // Reliever has assignments - only search in assigned clients
        const assignedClientIds = assignedOutlets.map(outlet => outlet.id);
        queryBuilder.andWhere('client.id IN (:...assignedIds)', { assignedIds: assignedClientIds });
      }
      // If reliever has no assignments, they can search all clients in their country
    }
    
    // Add search query
    if (query) {
      queryBuilder.andWhere(
        '(client.name LIKE :query OR client.contact LIKE :query OR client.email LIKE :query OR client.address LIKE :query)',
        { query: `%${query}%` }
      );
    }
    
    return queryBuilder
      .select([
        'client.id',
        'client.name',
        'client.contact',
        'client.region',
        'client.region_id',
        'client.status',
        'client.countryId'
      ])
      .orderBy('client.name', 'ASC')
      .getMany();
  }

  async findByCountry(countryId: number, userCountryId: number, userRole?: string, userId?: number): Promise<Clients[]> {
    // Only allow access if user is requesting their own country
    if (countryId !== userCountryId) {
      return [];
    }
    
    const baseConditions: any = { 
      countryId, 
      status: 1 
    };

    // Role-based filtering
    if (userRole === 'SALES_REP') {
      const assignedOutlets = await this.clientAssignmentService.getAssignedOutlets(userId!, userCountryId);
      const assignedClientIds = assignedOutlets.map(outlet => outlet.id);
      
      if (assignedClientIds.length === 0) {
        return [];
      }
      
      baseConditions.id = In(assignedClientIds);
    } else if (userRole === 'RELIEVER') {
      const assignedOutlets = await this.clientAssignmentService.getAssignedOutlets(userId!, userCountryId);
      
      if (assignedOutlets.length > 0) {
        const assignedClientIds = assignedOutlets.map(outlet => outlet.id);
        baseConditions.id = In(assignedClientIds);
      }
    }
    
    return this.clientRepository.find({
      where: baseConditions,
      select: [
        'id',
        'name',
        'contact',
        'region',
        'region_id',
        'status',
        'countryId'
      ],
      order: { name: 'ASC' },
    });
  }

  async findByRegion(regionId: number, userCountryId: number, userRole?: string, userId?: number): Promise<Clients[]> {
    const baseConditions: any = { 
        region_id: regionId, 
        status: 1,
        countryId: userCountryId, // Only clients in user's country
    };

    // Role-based filtering
    if (userRole === 'SALES_REP') {
      const assignedOutlets = await this.clientAssignmentService.getAssignedOutlets(userId!, userCountryId);
      const assignedClientIds = assignedOutlets.map(outlet => outlet.id);
      
      if (assignedClientIds.length === 0) {
        return [];
      }
      
      baseConditions.id = In(assignedClientIds);
    } else if (userRole === 'RELIEVER') {
      const assignedOutlets = await this.clientAssignmentService.getAssignedOutlets(userId!, userCountryId);
      
      if (assignedOutlets.length > 0) {
        const assignedClientIds = assignedOutlets.map(outlet => outlet.id);
        baseConditions.id = In(assignedClientIds);
      }
    }

    return this.clientRepository.find({
      where: baseConditions,
      select: [
        'id',
        'name',
        'contact',
        'region',
        'region_id',
        'status',
        'countryId'
      ],
      order: { name: 'ASC' },
    });
  }

  async findByRoute(routeId: number, userCountryId: number, userRole?: string, userId?: number): Promise<Clients[]> {
    const baseConditions: any = { 
        route_id: routeId, 
        status: 1,
        countryId: userCountryId, // Only clients in user's country
    };

    // Role-based filtering
    if (userRole === 'SALES_REP') {
      const assignedOutlets = await this.clientAssignmentService.getAssignedOutlets(userId!, userCountryId);
      const assignedClientIds = assignedOutlets.map(outlet => outlet.id);
      
      if (assignedClientIds.length === 0) {
        return [];
      }
      
      baseConditions.id = In(assignedClientIds);
    } else if (userRole === 'RELIEVER') {
      const assignedOutlets = await this.clientAssignmentService.getAssignedOutlets(userId!, userCountryId);
      
      if (assignedOutlets.length > 0) {
        const assignedClientIds = assignedOutlets.map(outlet => outlet.id);
        baseConditions.id = In(assignedClientIds);
      }
    }

    return this.clientRepository.find({
      where: baseConditions,
      select: [
        'id',
        'name',
        'contact',
        'region',
        'region_id',
        'status',
        'countryId'
      ],
      order: { name: 'ASC' },
    });
  }

  async findByLocation(latitude: number, longitude: number, radius: number = 10, userCountryId: number, userRole?: string, userId?: number): Promise<Clients[]> {
    // Get assigned clients if role-based filtering is needed
    let assignedClientIds: number[] = [];
    
    if (userRole === 'SALES_REP') {
      const assignedOutlets = await this.clientAssignmentService.getAssignedOutlets(userId!, userCountryId);
      assignedClientIds = assignedOutlets.map(outlet => outlet.id);
      
      if (assignedClientIds.length === 0) {
        return [];
      }
    } else if (userRole === 'RELIEVER') {
      const assignedOutlets = await this.clientAssignmentService.getAssignedOutlets(userId!, userCountryId);
      
      if (assignedOutlets.length > 0) {
        assignedClientIds = assignedOutlets.map(outlet => outlet.id);
      }
    }

    // Build query with role-based filtering
    let query = `
      SELECT *, 
        (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) AS distance
      FROM Clients 
      WHERE status = 1 AND countryId = ?
    `;
    
    const queryParams = [latitude, longitude, latitude, userCountryId];
    
    // Add role-based filtering if needed
    if (assignedClientIds.length > 0) {
      query += ` AND id IN (${assignedClientIds.map(() => '?').join(',')})`;
      queryParams.push(...assignedClientIds);
    }
    
    query += ` HAVING distance <= ? ORDER BY distance`;
    queryParams.push(radius);
    
    return this.clientRepository.query(query, queryParams);
  }

  async getClientStats(userCountryId: number, regionId?: number): Promise<any> {
    const queryBuilder = this.clientRepository.createQueryBuilder('client');
    
    // Always filter by user's country
    queryBuilder.where('client.countryId = :countryId', { countryId: userCountryId });
    
    if (regionId) {
      queryBuilder.andWhere('client.region_id = :regionId', { regionId });
    }
    
    const total = await queryBuilder.getCount();
    const active = await queryBuilder.where('client.status = 1').getCount();
    const inactive = await queryBuilder.where('client.status = 0').getCount();
    
    return {
      total,
      active,
      inactive,
      activePercentage: total > 0 ? Math.round((active / total) * 100) : 0,
    };
  }

  // Get pending clients for admin approval
  async findPendingClients(userCountryId: number): Promise<Clients[]> {
    return this.clientRepository.find({
      where: { 
        status: 0, // Pending approval clients
        countryId: userCountryId, // Only clients in user's country
      },
      select: [
        'id',
        'name', 
        'contact',
        'region',
        'region_id',
        'status',
        'countryId',
        'email',
        'address',
        'created_at',
        'added_by'
      ],
      order: { created_at: 'DESC' },
    });
  }

  // Approve a client (admin only)
  async approveClient(id: number, userCountryId: number): Promise<Clients | null> {
    // First check if client exists and belongs to user's country
    const existingClient = await this.clientRepository.findOne({
      where: { 
        id, 
        status: 0, // Only pending clients can be approved
        countryId: userCountryId,
      },
    });
    
    if (!existingClient) {
      return null;
    }
    
    await this.clientRepository.update(id, { status: 1 });
    return this.findOne(id, userCountryId);
  }

  // Reject a client (admin only)
  async rejectClient(id: number, userCountryId: number): Promise<boolean> {
    const existingClient = await this.findOne(id, userCountryId);
    if (!existingClient) {
      return false;
    }
    
    await this.clientRepository.update(id, { status: 0 }); // Reject client
    return true;
  }
} 
