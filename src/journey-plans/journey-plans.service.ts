import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, DataSource } from 'typeorm';
import { JourneyPlan } from './entities/journey-plan.entity';
import { Clients } from '../entities/clients.entity';
import { SalesRep } from '../entities/sales-rep.entity';
import { CreateJourneyPlanDto } from './dto/create-journey-plan.dto';
import { UpdateJourneyPlanDto } from './dto/update-journey-plan.dto';

interface FindAllOptions {
  page: number;
  limit: number;
  status?: string;
  timezone?: string;
  date?: string;
  userId?: number;
}

interface FindByDateRangeOptions {
  page: number;
  limit: number;
  status?: string;
  timezone?: string;
  startDate: string;
  endDate: string;
  userId?: number;
}

@Injectable()
export class JourneyPlansService {
  constructor(
    @InjectRepository(JourneyPlan)
    private journeyPlanRepository: Repository<JourneyPlan>,
    @InjectRepository(Clients)
    private clientsRepository: Repository<Clients>,
    @InjectRepository(SalesRep)
    private salesRepRepository: Repository<SalesRep>,
    private dataSource: DataSource,
  ) {}

  // Helper method to provide fallback coordinates
  private getFallbackCoordinates(countryId: number): { latitude: number; longitude: number } {
    // Default coordinates for different countries
    const countryCoordinates: { [key: number]: { latitude: number; longitude: number } } = {
      1: { latitude: -1.300897837533575, longitude: 36.777742335574864 }, // Kenya (Nairobi)
      2: { latitude: -6.8235, longitude: 39.2695 }, // Tanzania (Dar es Salaam)
      3: { latitude: 0.3476, longitude: 32.5825 }, // Uganda (Kampala)
      4: { latitude: -1.9441, longitude: 30.0619 }, // Rwanda (Kigali)
      5: { latitude: -3.3731, longitude: 29.9189 }, // Burundi (Bujumbura)
    };

    return countryCoordinates[countryId] || countryCoordinates[1]; // Default to Kenya
  }

  // Helper method to ensure client has valid coordinates
  private async ensureClientCoordinates(client: any): Promise<any> {
    if (!client) return client;
    
    console.log(`🔍 Checking coordinates for client ${client.id}:`, {
      latitude: client.latitude,
      longitude: client.longitude,
      countryId: client.countryId
    });
    
    // If client doesn't have coordinates, fetch them from the database
    if (client.latitude === null || client.longitude === null || client.latitude === undefined || client.longitude === undefined) {
      try {
        console.log(`🔍 Fetching full client data for client ${client.id}...`);
        const fullClient = await this.clientsRepository.findOne({
          where: { id: client.id },
          select: ['id', 'name', 'address', 'contact', 'email', 'latitude', 'longitude', 'region_id', 'region', 'countryId', 'status', 'tax_pin', 'location', 'client_type', 'outlet_account', 'balance', 'created_at']
        });
        
        if (fullClient) {
          console.log(`🔍 Full client data for ${client.id}:`, {
            latitude: fullClient.latitude,
            longitude: fullClient.longitude,
            countryId: fullClient.countryId
          });
          
          // If still null, use fallback coordinates
          if (fullClient.latitude === null || fullClient.longitude === null) {
            const fallback = this.getFallbackCoordinates(fullClient.countryId || 1);
            console.log(`⚠️ Client ${client.id} has null coordinates in DB, using fallback:`, fallback);
            return {
              ...client,
              latitude: fallback.latitude,
              longitude: fallback.longitude,
            };
          } else {
            console.log(`✅ Client ${client.id} coordinates fetched from DB:`, { latitude: fullClient.latitude, longitude: fullClient.longitude });
            return {
              ...client,
              latitude: fullClient.latitude,
              longitude: fullClient.longitude,
            };
          }
        } else {
          console.log(`⚠️ Client ${client.id} not found in database`);
        }
      } catch (error) {
        console.error(`❌ Error fetching client coordinates for client ${client.id}:`, error);
      }
      
      // Fallback to default coordinates if database fetch fails
      const fallback = this.getFallbackCoordinates(client.countryId || 1);
      console.log(`⚠️ Client ${client.id} using fallback coordinates:`, fallback);
      return {
        ...client,
        latitude: fallback.latitude,
        longitude: fallback.longitude,
      };
    } else {
      console.log(`✅ Client ${client.id} already has valid coordinates:`, { latitude: client.latitude, longitude: client.longitude });
    }
    return client;
  }

  async create(createJourneyPlanDto: CreateJourneyPlanDto, userId?: number): Promise<JourneyPlan> {
    console.log('🚀 Creating new journey plan...');
    console.log('📊 Journey plan data:', createJourneyPlanDto);
    console.log('👤 User ID:', userId);

    const journeyPlan = this.journeyPlanRepository.create({
      ...createJourneyPlanDto,
      userId: userId,
      status: 0, // pending
      date: new Date(createJourneyPlanDto.date),
    });
    
    const saved = await this.journeyPlanRepository.save(journeyPlan);
    console.log('✅ Journey plan created with ID:', saved.id);
    console.log('🏪 Client ID:', saved.clientId);
    
    // Update client's route to match sales rep's route
    if (userId && saved.clientId) {
      console.log('🔄 Updating client route to match sales rep route...');
      await this.updateClientRoute(saved.clientId, userId);
    } else {
      console.log('⚠️ Skipping client route update - missing userId or clientId');
    }
    
    return this.findOne(saved.id);
  }

  // Update client's route to match sales rep's route
  private async updateClientRoute(clientId: number, salesRepId: number): Promise<void> {
    try {
      // Get sales rep's route information
      const salesRep = await this.salesRepRepository.findOne({
        where: { id: salesRepId },
        select: ['route_id', 'route']
      });

      if (!salesRep) {
        console.log(`⚠️ SalesRep with ID ${salesRepId} not found`);
        return;
      }

      // Update client's route to match sales rep's route
      await this.clientsRepository.update(clientId, {
        route_id: salesRep.route_id,
        route_name: salesRep.route,
        route_id_update: salesRep.route_id,
        route_name_update: salesRep.route,
      });

      console.log(`✅ Updated client ${clientId} route to match sales rep ${salesRepId}`);
      console.log(`   - New route_id: ${salesRep.route_id}`);
      console.log(`   - New route_name: ${salesRep.route}`);
    } catch (error) {
      console.error(`❌ Error updating client route: ${error}`);
    }
  }

  // Stored Procedure Method - TEMPORARILY DISABLED
  // Use findAll() method instead for better control and debugging
  async findAllWithProcedure(options: FindAllOptions): Promise<{
    data: JourneyPlan[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    success: boolean;
  }> {
    try {
      const { page, limit, status, date, userId, timezone } = options;
      const offset = (page - 1) * limit;

      // Convert status string to number
      const statusMap: { [key: string]: number } = {
        'pending': 0,
        'checked_in': 1,
        'in_progress': 2,
        'completed': 3,
        'cancelled': 4,
      };
      const statusValue = status ? (statusMap[status] ?? -1) : -1;

      // Use today's date if not provided
      const targetDate = date || new Date().toISOString().split('T')[0];

      console.log('🚀 Using stored procedure for journey plans');
      console.log('📊 Params:', { userId, statusValue, targetDate, page, limit, offset });

      // Call stored procedure
      const result = await this.dataSource.query(
        'CALL GetJourneyPlans(?, ?, ?, ?, ?, ?)',
        [userId || 0, statusValue, targetDate, page, limit, offset]
      );

      if (result && result.length > 0) {
        const rawData = result[0]; // First result set contains the data
        const total = result[1]?.[0]?.total || 0; // Second result set contains count

        // Transform flat fields back to nested objects
        const data = rawData.map((row: any) => {
          const journeyPlan: any = {};
          const client: any = {};
          const user: any = {};

          // Extract journey plan fields
          Object.keys(row).forEach(key => {
            if (key.startsWith('client.')) {
              const clientKey = key.replace('client.', '');
              client[clientKey] = row[key];
            } else if (key.startsWith('user.')) {
              const userKey = key.replace('user.', '');
              user[userKey] = row[key];
            } else {
              journeyPlan[key] = row[key];
            }
          });

          return {
            ...journeyPlan,
            client, // Remove async call to prevent N+1
            user,
          };
        });

        console.log('✅ Stored procedure executed successfully');
        console.log('📊 Total found:', total);
        console.log('📊 Data length:', data.length);

        return {
          data,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
          success: true,
        };
      } else {
        throw new Error('No results from stored procedure');
      }
    } catch (error) {
      console.log('⚠️ Stored procedure disabled, using service method instead');
      return this.findAll(options);
    }
  }

  // Enhanced service method with better performance and coordinate handling
  async findAll(options: FindAllOptions): Promise<{
    data: JourneyPlan[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    success: boolean;
  }> {
    const { page, limit, status, date, userId, timezone } = options;
    const offset = (page - 1) * limit;

    console.log('🚀 Using service method for journey plans (stored procedure disabled)');
    console.log('📊 Params:', { userId, status, date, page, limit, offset });

    // Build query with optimized joins and explicit field selection
    let query = this.journeyPlanRepository
      .createQueryBuilder('journeyPlan')
      .leftJoinAndSelect('journeyPlan.client', 'client')
      .leftJoinAndSelect('journeyPlan.user', 'user')
      .select([
        'journeyPlan.id',
        'journeyPlan.date',
        'journeyPlan.time',
        'journeyPlan.userId',
        'journeyPlan.clientId',
        'journeyPlan.status',
        'journeyPlan.checkInTime',
        'journeyPlan.latitude',
        'journeyPlan.longitude',
        'journeyPlan.imageUrl',
        'journeyPlan.notes',
        'journeyPlan.checkoutLatitude',
        'journeyPlan.checkoutLongitude',
        'journeyPlan.checkoutTime',
        'journeyPlan.showUpdateLocation',
        'journeyPlan.routeId',
        'client.id',
        'client.name',
        'client.address',
        'client.contact',
        'client.email',
        'client.latitude',
        'client.longitude',
        'client.region_id',
        'client.region',
        'client.countryId',
        'client.status',
        'client.tax_pin',
        'client.location',
        'client.client_type',
        'client.outlet_account',
        'client.balance',
        'client.created_at',
        'user.id',
        'user.name',
        'user.email',
        'user.phoneNumber',
        'user.role',
        'user.status',
        'user.countryId',
        'user.region_id',
        'user.route_id',
        'user.route',
        'user.createdAt',
        'user.updatedAt'
      ]);

    // Add filters
    if (userId) {
      query = query.where('journeyPlan.userId = :userId', { userId });
    }

    if (status) {
      const statusMap: { [key: string]: number } = {
        'pending': 0,
        'checked_in': 1,
        'in_progress': 2,
        'completed': 3,
        'cancelled': 4,
      };
      const statusValue = statusMap[status] ?? 0;
      query = query.andWhere('journeyPlan.status = :status', { status: statusValue });
    }

    // Always filter by date - use provided date or default to today
    const targetDate = date || new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const startOfDay = new Date(targetDate);
    const endOfDay = new Date(targetDate);
    endOfDay.setDate(endOfDay.getDate() + 1);
    
    console.log('🔍 Journey Plans Filter Debug:');
    console.log('🔍 Target Date:', targetDate);
    console.log('🔍 Start of Day:', startOfDay);
    console.log('🔍 End of Day:', endOfDay);
    console.log('🔍 User ID:', userId);
    console.log('🔍 Status:', status);
    
    query = query.andWhere('journeyPlan.date >= :startDate AND journeyPlan.date < :endDate', {
      startDate: startOfDay,
      endDate: endOfDay,
    });

    // Get total count
    const total = await query.getCount();

    // Get paginated results
    const data = await query
      .orderBy('journeyPlan.date', 'DESC')
      .addOrderBy('journeyPlan.time', 'DESC')
      .skip(offset)
      .take(limit)
      .getMany();

    // Apply coordinate fixes to each journey plan
    const fixedData = await Promise.all(data.map(async journeyPlan => ({
      ...journeyPlan,
      client: await this.ensureClientCoordinates(journeyPlan.client),
    })));

    const totalPages = Math.ceil(total / limit);

    console.log('🔍 Journey Plans Results:');
    console.log('🔍 Total found:', total);
    console.log('🔍 Data length:', fixedData.length);
    console.log('🔍 First journey plan date:', fixedData[0]?.date);
    console.log('🔍 Sample client data:', fixedData[0]?.client ? {
      id: fixedData[0].client.id,
      name: fixedData[0].client.name,
      latitude: fixedData[0].client.latitude,
      longitude: fixedData[0].client.longitude
    } : 'No client data');

    return {
      data: fixedData,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
      success: true,
    };
  }

  async findByDateRange(options: FindByDateRangeOptions): Promise<{
    data: JourneyPlan[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    success: boolean;
  }> {
    const { page, limit, status, startDate, endDate, userId } = options;
    const offset = (page - 1) * limit;

    // Build query
    let query = this.journeyPlanRepository
      .createQueryBuilder('journeyPlan')
      .leftJoinAndSelect('journeyPlan.client', 'client')
      .leftJoinAndSelect('journeyPlan.user', 'user');

    // Add filters
    if (userId) {
      query = query.where('journeyPlan.userId = :userId', { userId });
    }

    if (status) {
      const statusMap: { [key: string]: number } = {
        'pending': 0,
        'checked_in': 1,
        'in_progress': 2,
        'completed': 3,
        'cancelled': 4,
      };
      const statusValue = statusMap[status] ?? 0;
      query = query.andWhere('journeyPlan.status = :status', { status: statusValue });
    }

    // Filter by date range
    const startOfRange = new Date(startDate);
    const endOfRange = new Date(endDate);
    endOfRange.setDate(endOfRange.getDate() + 1); // Include the end date
    
    query = query.andWhere('journeyPlan.date >= :startDate AND journeyPlan.date < :endDate', {
      startDate: startOfRange,
      endDate: endOfRange,
    });

    // Get total count
    const total = await query.getCount();

    // Get paginated results
    const data = await query
      .orderBy('journeyPlan.date', 'DESC')
      .addOrderBy('journeyPlan.time', 'DESC')
      .skip(offset)
      .take(limit)
      .getMany();

    // Apply coordinate fixes to each journey plan
    const fixedData = await Promise.all(data.map(async journeyPlan => ({
      ...journeyPlan,
      client: await this.ensureClientCoordinates(journeyPlan.client),
    })));

    const totalPages = Math.ceil(total / limit);

    return {
      data: fixedData,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
      success: true,
    };
  }

  async findOne(id: number): Promise<JourneyPlan | null> {
    const journeyPlan = await this.journeyPlanRepository.findOne({
      where: { id },
      relations: ['client', 'user'],
    });

    if (journeyPlan && journeyPlan.client) {
      journeyPlan.client = await this.ensureClientCoordinates(journeyPlan.client);
    }

    return journeyPlan;
  }

  async update(id: number, updateJourneyPlanDto: UpdateJourneyPlanDto): Promise<JourneyPlan | null> {
    const journeyPlan = await this.findOne(id);
    if (!journeyPlan) {
      throw new NotFoundException(`Journey plan with ID ${id} not found`);
    }

    // Test database connection and table structure
    try {
      const tableInfo = await this.dataSource.query('DESCRIBE JourneyPlan');
      console.log('📊 JourneyPlan table structure:', tableInfo);
    } catch (error) {
      console.log('📊 Error checking table structure:', error);
    }

    console.log('🔄 Journey Plan Update Request:');
    console.log('📊 Journey Plan ID:', id);
    console.log('📊 Update DTO:', JSON.stringify(updateJourneyPlanDto, null, 2));
    console.log('📊 ImageUrl in DTO:', updateJourneyPlanDto.imageUrl);
    
    // Determine operation type
    const isCheckInOperation = updateJourneyPlanDto.checkInTime !== undefined;
    const isCheckoutOperation = updateJourneyPlanDto.checkoutTime !== undefined;
    console.log('📊 Operation Type:', {
      isCheckIn: isCheckInOperation,
      isCheckout: isCheckoutOperation,
      hasImageUrl: updateJourneyPlanDto.imageUrl !== undefined
    });

    // Convert status string to number if provided
    let statusValue: number | undefined;
    if (updateJourneyPlanDto.status) {
      const statusMap: { [key: string]: number } = {
        'pending': 0,
        'checked_in': 1,
        'in_progress': 2,
        'completed': 3,
        'cancelled': 4,
      };
      statusValue = statusMap[updateJourneyPlanDto.status] ?? 0;
    }

    // Convert date strings to Date objects
    const updateData: any = { ...updateJourneyPlanDto };
    if (statusValue !== undefined) {
      updateData.status = statusValue;
    }
    if (updateData.checkInTime) {
      updateData.checkInTime = new Date(updateData.checkInTime);
    }
    if (updateData.checkoutTime) {
      updateData.checkoutTime = new Date(updateData.checkoutTime);
    }
    
    // Only include imageUrl if this is a check-in operation (when checkInTime is being set)
    const isCheckIn = updateData.checkInTime !== undefined;
    if (!isCheckIn) {
      // Remove imageUrl from update data if this is not a check-in
      delete updateData.imageUrl;
      console.log('📊 Not a check-in operation - removing imageUrl from update');
    } else {
      // This is a check-in operation
      console.log('📊 Check-in operation detected - processing imageUrl');
      if (updateData.imageUrl !== undefined) {
        console.log('📊 Check-in operation - ImageUrl type:', typeof updateData.imageUrl);
        console.log('📊 Check-in operation - ImageUrl value:', updateData.imageUrl);
        // Ensure it's a string or null
        updateData.imageUrl = updateData.imageUrl || null;
        console.log('📊 Check-in operation - Final ImageUrl value:', updateData.imageUrl);
      } else {
        console.log('📊 Check-in operation - No imageUrl provided, keeping existing value');
      }
    }

    console.log('📊 Final Update Data:', JSON.stringify(updateData, null, 2));
    console.log('📊 ImageUrl in Update Data:', updateData.imageUrl);

    // Debug: Check if the journey plan exists before update
    const existingPlan = await this.journeyPlanRepository.findOne({ where: { id } });
    console.log('📊 Existing Journey Plan before update:', {
      id: existingPlan?.id,
      imageUrl: existingPlan?.imageUrl,
      status: existingPlan?.status
    });

    // Perform the update using query builder for more control
    const queryBuilder = this.journeyPlanRepository
      .createQueryBuilder()
      .update(JourneyPlan)
      .set(updateData)
      .where('id = :id', { id });
    
    // Log the generated SQL
    const sql = queryBuilder.getSql();
    console.log('📊 Generated SQL:', sql);
    console.log('📊 SQL Parameters:', queryBuilder.getParameters());
    
    const updateResult = await queryBuilder.execute();
    console.log('📊 Update Result:', updateResult);

    // Verify the update by querying the database directly
    const updatedJourneyPlan = await this.findOne(id);
    console.log('📊 Updated Journey Plan ImageUrl:', updatedJourneyPlan?.imageUrl);
    
    // Additional verification - query directly from repository
    const directQuery = await this.journeyPlanRepository.findOne({ 
      where: { id },
      select: ['id', 'imageUrl', 'status', 'checkInTime']
    });
    console.log('📊 Direct Query Result:', {
      id: directQuery?.id,
      imageUrl: directQuery?.imageUrl,
      status: directQuery?.status,
      checkInTime: directQuery?.checkInTime
    });
    
    return updatedJourneyPlan;
  }

  async remove(id: number): Promise<void> {
    const journeyPlan = await this.findOne(id);
    if (!journeyPlan) {
      throw new NotFoundException(`Journey plan with ID ${id} not found`);
    }
    await this.journeyPlanRepository.delete(id);
  }

  /**
   * Checkout a journey plan - this method should NEVER include imageUrl
   * ImageUrl is only for check-in operations
   */
  async checkout(
    id: number,
    checkoutDto: {
      checkoutTime?: string;
      checkoutLatitude?: number;
      checkoutLongitude?: number;
    },
  ): Promise<JourneyPlan> {
    const journeyPlan = await this.findOne(id);
    if (!journeyPlan) {
      throw new NotFoundException(`Journey plan with ID ${id} not found`);
    }

    const updateData: any = {
      status: 3, // completed
      checkoutTime: checkoutDto.checkoutTime ? new Date(checkoutDto.checkoutTime) : new Date(),
    };

    if (checkoutDto.checkoutLatitude !== undefined) {
      updateData.checkoutLatitude = checkoutDto.checkoutLatitude;
    }
    if (checkoutDto.checkoutLongitude !== undefined) {
      updateData.checkoutLongitude = checkoutDto.checkoutLongitude;
    }

    // Explicitly ensure imageUrl is not included in checkout updates
    console.log('📊 Checkout operation - ensuring imageUrl is not included');
    
    await this.journeyPlanRepository.update(id, updateData);
    return this.findOne(id);
  }
} 