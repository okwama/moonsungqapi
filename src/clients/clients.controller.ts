import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { SearchClientsDto } from './dto/search-clients.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('clients')
@UseGuards(JwtAuthGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  async create(@Body() createClientDto: CreateClientDto, @Request() req) {
    const userCountryId = req.user.countryId;
    return this.clientsService.create(createClientDto, userCountryId);
  }

  @Get()
  @SkipThrottle() // Whitelist - frequently called, now cached client-side
  async findAll(
    @Request() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    const userCountryId = req.user.countryId;
    const userRole = req.user.role;
    const userId = req.user.id;
    
    // ✅ FIX: Parse pagination parameters
    const pageNum = page ? Math.max(1, parseInt(page)) : 1;
    const limitNum = limit ? Math.min(100, Math.max(1, parseInt(limit))) : 50;
    
    return this.clientsService.findAll(userCountryId, userRole, userId, pageNum, limitNum);
  }

  @Get('basic')
  async findAllBasic(@Request() req) {
    const userCountryId = req.user.countryId;
    const userRole = req.user.role;
    const userId = req.user.id;
    return this.clientsService.findAll(userCountryId, userRole, userId); // Uses select fields
  }

  @Get('search')
  async search(@Query() searchDto: SearchClientsDto, @Request() req) {
    const userCountryId = req.user.countryId;
    const userRole = req.user.role;
    const userId = req.user.id;
    return this.clientsService.search(searchDto, userCountryId, userRole, userId);
  }

  @Get('search/basic')
  async searchBasic(@Query() searchDto: SearchClientsDto, @Request() req) {
    const userCountryId = req.user.countryId;
    const userRole = req.user.role;
    const userId = req.user.id;
    return this.clientsService.search(searchDto, userCountryId, userRole, userId); // Uses select fields
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const userCountryId = req.user.countryId;
    const userRole = req.user.role;
    const userId = req.user.id;
    return this.clientsService.findOne(+id, userCountryId, userRole, userId);
  }

  @Get(':id/basic')
  async findOneBasic(@Param('id') id: string, @Request() req) {
    const userCountryId = req.user.countryId;
    const userRole = req.user.role;
    const userId = req.user.id;
    return this.clientsService.findOneBasic(+id, userCountryId, userRole, userId);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateClientDto: Partial<CreateClientDto>, @Request() req) {
    const userCountryId = req.user.countryId;
    return this.clientsService.update(+id, updateClientDto, userCountryId);
  }

  // Remove delete endpoint for sales reps
  // @Delete(':id')
  // async remove(@Param('id') id: string) {
  //   return this.clientsService.remove(+id);
  // }

  @Get('country/:countryId')
  async findByCountry(@Param('countryId') countryId: string, @Request() req) {
    const userCountryId = req.user.countryId;
    const userRole = req.user.role;
    const userId = req.user.id;
    return this.clientsService.findByCountry(+countryId, userCountryId, userRole, userId);
  }

  @Get('region/:regionId')
  async findByRegion(@Param('regionId') regionId: string, @Request() req) {
    const userCountryId = req.user.countryId;
    const userRole = req.user.role;
    const userId = req.user.id;
    return this.clientsService.findByRegion(+regionId, userCountryId, userRole, userId);
  }

  @Get('route/:routeId')
  async findByRoute(@Param('routeId') routeId: string, @Request() req) {
    const userCountryId = req.user.countryId;
    const userRole = req.user.role;
    const userId = req.user.id;
    return this.clientsService.findByRoute(+routeId, userCountryId, userRole, userId);
  }

  @Get('location/nearby')
  async findByLocation(
    @Query('latitude') latitude: string,
    @Query('longitude') longitude: string,
    @Query('radius') radius: string,
    @Request() req
  ) {
    const userCountryId = req.user.countryId;
    const userRole = req.user.role;
    const userId = req.user.id;
    return this.clientsService.findByLocation(
      +latitude,
      +longitude,
      radius ? +radius : 10,
      userCountryId,
      userRole,
      userId
    );
  }

  @Get('stats/overview')
  async getClientStats(@Query('regionId') regionId: string, @Request() req) {
    const userCountryId = req.user.countryId;
    return this.clientsService.getClientStats(userCountryId, regionId ? +regionId : undefined);
  }
} 