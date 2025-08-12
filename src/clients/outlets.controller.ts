import { Controller, Post, Body, UseGuards, Request, Get, Param, Put, Logger } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OutletQuantityService } from '../outlet-quantity/outlet-quantity.service';
import { ClientAssignmentService } from '../client-assignment/client-assignment.service';

@Controller('outlets')
@UseGuards(JwtAuthGuard)
export class OutletsController {
  private readonly logger = new Logger(OutletsController.name);

  constructor(
    private readonly clientsService: ClientsService,
    private readonly outletQuantityService: OutletQuantityService,
    private readonly clientAssignmentService: ClientAssignmentService
  ) {}

  @Get()
  async getOutlets(@Request() req) {
    const userRole = req.user.role;
    const salesRepId = req.user.id;
    const userCountryId = req.user.countryId;

    this.logger.log(`🔍 GET /outlets - User: ${salesRepId}, Role: ${userRole}, Country: ${userCountryId}`);

    try {
      let outlets;
      
      if (userRole === 'ADMIN' || userRole === 'RELIEVER') {
        // Admin or Reliever: view all outlets in their country (including pending ones)
        outlets = await this.clientsService.findAllForAdmin(userCountryId);
      } else {
        // Regular sales rep: only view assigned outlets
        outlets = await this.clientAssignmentService.getAssignedOutlets(salesRepId, userCountryId);
      }

      this.logger.log(`✅ Returning ${outlets.length} outlets`);
      return outlets;
    } catch (error) {
      this.logger.error(`❌ Error fetching outlets:`, error);
      throw error;
    }
  }

  @Get(':id')
  async getOutlet(@Param('id') id: string, @Request() req) {
    const client = await this.clientsService.findOne(+id, req.user.countryId);
    
    if (!client) {
      return null;
    }

    // Apply fallback coordinates if needed
    if (client.latitude === null || client.longitude === null) {
      const fallbackCoordinates = this.getFallbackCoordinates(client.countryId || 1);
      console.log(`⚠️ Client ${client.id} has null coordinates, using fallback:`, fallbackCoordinates);
      client.latitude = fallbackCoordinates.latitude;
      client.longitude = fallbackCoordinates.longitude;
    }

    // Transform response to match Flutter's expected Client model
    return {
      id: client.id,
      name: client.name,
      address: client.address,
      contact: client.contact,
      email: client.email,
      latitude: client.latitude,
      longitude: client.longitude,
      regionId: client.region_id,
      region: client.region,
      countryId: client.countryId,
      status: client.status,
      taxPin: client.tax_pin,
      location: client.location,
      clientType: client.client_type,
      outletAccount: client.outlet_account,
      balance: client.balance,
      createdAt: client.created_at,
    };
  }

  @Post()
  async createOutlet(@Body() body: any, @Request() req) {
    // Transform snake_case to camelCase for compatibility
    const createClientDto: CreateClientDto = {
      name: body.name,
      address: body.address,
      taxPin: body.tax_pin,
      email: body.email,
      contact: body.contact,
      latitude: body.latitude,
      longitude: body.longitude,
      location: body.location,
      clientType: body.client_type,
      regionId: body.region_id,
      region: body.region,
      routeId: body.route_id,
      routeName: body.route_name,
      routeIdUpdate: body.route_id_update,
      routeNameUpdate: body.route_name_update,
      balance: body.balance,
      outletAccount: body.outlet_account,
      countryId: body.country || req.user.countryId,
      addedBy: req.user.id,
    };

    const client = await this.clientsService.create(createClientDto, req.user.countryId);
    
    // Transform response to match Flutter's expected Client model
    return {
      id: client.id,
      name: client.name,
      address: client.address,
      contact: client.contact,
      email: client.email,
      latitude: client.latitude,
      longitude: client.longitude,
      regionId: client.region_id,
      region: client.region,
      countryId: client.countryId,
      status: client.status,
      taxPin: client.tax_pin,
      location: client.location,
      clientType: client.client_type,
      outletAccount: client.outlet_account,
      balance: client.balance,
      createdAt: client.created_at,
    };
  }

  @Put(':id')
  async updateOutlet(@Param('id') id: string, @Body() body: any, @Request() req) {
    const updateData = {
      name: body.name,
      address: body.address,
      taxPin: body.tax_pin,
      email: body.email,
      contact: body.contact,
      latitude: body.latitude,
      longitude: body.longitude,
      location: body.location,
      clientType: body.client_type,
      regionId: body.region_id,
      region: body.region,
      routeId: body.route_id,
      routeName: body.route_name,
      balance: body.balance,
      outletAccount: body.outlet_account,
    };

    const client = await this.clientsService.update(+id, updateData, req.user.countryId);
    
    return {
      id: client.id,
      name: client.name,
      address: client.address,
      contact: client.contact,
      email: client.email,
      latitude: client.latitude,
      longitude: client.longitude,
      regionId: client.region_id,
      region: client.region,
      countryId: client.countryId,
      status: client.status,
      taxPin: client.tax_pin,
      location: client.location,
      clientType: client.client_type,
      outletAccount: client.outlet_account,
      balance: client.balance,
      createdAt: client.created_at,
    };
  }

  @Get(':id/products')
  async getOutletProducts(@Param('id') id: string, @Request() req) {
    this.logger.log(`🔍 GET /outlets/${id}/products - Fetching products for outlet ${id}`);
    
    try {
      const products = await this.outletQuantityService.findByOutletId(+id);
      
      this.logger.log(`✅ Found ${products.length} products for outlet ${id}`);
      
      // Transform to include product details
      const transformedProducts = products.map(item => ({
        id: item.id,
        clientId: item.clientId,
        productId: item.productId,
        quantity: item.quantity,
        createdAt: item.createdAt,
        product: item.product ? {
          id: item.product.id,
          name: item.product.productName,
          description: item.product.description,
          price: item.product.costPrice,
          imageUrl: item.product.imageUrl,
        } : null,
      }));
      
      return transformedProducts;
    } catch (error) {
      this.logger.error(`❌ Error fetching outlet products:`, error);
      throw error;
    }
  }

  @Post('assign')
  async assignOutlet(@Body() body: { outletId: number; salesRepId: number }, @Request() req) {
    this.logger.log(`📋 POST /outlets/assign - Assigning outlet ${body.outletId} to sales rep ${body.salesRepId}`);
    
    try {
      // Check if user has permission to assign outlets
      if (req.user.role !== 'ADMIN' && req.user.role !== 'RELIEVER') {
        throw new Error('Insufficient permissions to assign outlets');
      }

      const assignment = await this.clientAssignmentService.assignOutletToSalesRep(body.outletId, body.salesRepId);
      
      this.logger.log(`✅ Successfully assigned outlet ${body.outletId} to sales rep ${body.salesRepId}`);
      
      return {
        id: assignment.id,
        outletId: assignment.outletId,
        salesRepId: assignment.salesRepId,
        assignedAt: assignment.assignedAt,
        status: assignment.status,
        message: 'Outlet assigned successfully',
      };
    } catch (error) {
      this.logger.error(`❌ Error assigning outlet:`, error);
      throw error;
    }
  }

  @Get(':id/assignment')
  async getOutletAssignment(@Param('id') id: string) {
    this.logger.log(`🔍 GET /outlets/${id}/assignment - Getting assignment for outlet ${id}`);
    
    try {
      const assignment = await this.clientAssignmentService.getOutletAssignment(+id);
      
      if (!assignment) {
        return { message: 'No active assignment found for this outlet' };
      }
      
      return {
        id: assignment.id,
        outletId: assignment.outletId,
        salesRepId: assignment.salesRepId,
        assignedAt: assignment.assignedAt,
        status: assignment.status,
        salesRep: assignment.salesRep ? {
          id: assignment.salesRep.id,
          name: assignment.salesRep.name,
          email: assignment.salesRep.email,
        } : null,
      };
    } catch (error) {
      this.logger.error(`❌ Error getting outlet assignment:`, error);
      throw error;
    }
  }

  @Get(':id/assignment-history')
  async getOutletAssignmentHistory(@Param('id') id: string) {
    this.logger.log(`🔍 GET /outlets/${id}/assignment-history - Getting assignment history for outlet ${id}`);
    
    try {
      const history = await this.clientAssignmentService.getAssignmentHistory(+id);
      
      return history.map(assignment => ({
        id: assignment.id,
        outletId: assignment.outletId,
        salesRepId: assignment.salesRepId,
        assignedAt: assignment.assignedAt,
        status: assignment.status,
        salesRep: assignment.salesRep ? {
          id: assignment.salesRep.id,
          name: assignment.salesRep.name,
          email: assignment.salesRep.email,
        } : null,
      }));
    } catch (error) {
      this.logger.error(`❌ Error getting outlet assignment history:`, error);
      throw error;
    }
  }

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
} 