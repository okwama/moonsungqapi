import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { Clients } from '../entities/clients.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { SearchClientsDto } from './dto/search-clients.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Clients)
    private clientRepository: Repository<Clients>,
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

  async findAll(userCountryId: number): Promise<Clients[]> {
    console.log(`🔍 ClientsService.findAll - Looking for clients with countryId: ${userCountryId}, status: 1`);
    
    // First, let's check what clients exist in the database
    const allClients = await this.clientRepository.find({
      select: ['id', 'name', 'countryId', 'status']
    });
    console.log(`📊 Total clients in database: ${allClients.length}`);
    console.log(`📊 Clients by country:`, allClients.reduce((acc, client) => {
      acc[client.countryId] = (acc[client.countryId] || 0) + 1;
      return acc;
    }, {}));
    console.log(`📊 Clients by status:`, allClients.reduce((acc, client) => {
      acc[client.status] = (acc[client.status] || 0) + 1;
      return acc;
    }, {}));
    
    const clients = await this.clientRepository.find({
      where: { 
        status: 1, // Only approved/active clients
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
    
    console.log(`✅ Found ${clients.length} clients for country ${userCountryId} with status 1`);
    return clients;
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

  async findOne(id: number, userCountryId: number): Promise<Clients | null> {
    return this.clientRepository.findOne({
      where: { 
        id, 
        status: 1, // Only approved/active clients
        countryId: userCountryId, // Only clients in user's country
      },
    });
  }

  async findOneBasic(id: number, userCountryId: number): Promise<Clients | null> {
    return this.clientRepository.findOne({
      where: { 
        id, 
        status: 1, // Only approved/active clients
        countryId: userCountryId,
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

  async search(searchDto: SearchClientsDto, userCountryId: number): Promise<Clients[]> {
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

  async findByCountry(countryId: number, userCountryId: number): Promise<Clients[]> {
    // Only allow access if user is requesting their own country
    if (countryId !== userCountryId) {
      return [];
    }
    
    return this.clientRepository.find({
      where: { countryId, status: 1 },
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

  async findByRegion(regionId: number, userCountryId: number): Promise<Clients[]> {
    return this.clientRepository.find({
      where: { 
        region_id: regionId, 
        status: 1,
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
  }

  async findByRoute(routeId: number, userCountryId: number): Promise<Clients[]> {
    return this.clientRepository.find({
      where: { 
        route_id: routeId, 
        status: 1,
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
  }

  async findByLocation(latitude: number, longitude: number, radius: number = 10, userCountryId: number): Promise<Clients[]> {
    // Simple distance calculation using Haversine formula with country filter
    const query = `
      SELECT *, 
        (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) AS distance
      FROM Clients 
      WHERE status = 1 AND countryId = ?
      HAVING distance <= ?
      ORDER BY distance
    `;
    
    return this.clientRepository.query(query, [latitude, longitude, latitude, userCountryId, radius]);
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
