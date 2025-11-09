import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpliftSalesService } from './uplift-sales.service';

@Controller('uplift-sales')
@UseGuards(JwtAuthGuard)
export class UpliftSalesController {
  constructor(private readonly upliftSalesService: UpliftSalesService) {}

  @Get()
  @SkipThrottle() // Whitelist - read-only, frequently accessed for sales history
  async findAll(@Query() query: any, @Request() req: any) {
    // Optional query parameters:
    // - userId: filter by specific user ID (if not provided, uses authenticated user)
    // - status: filter by status (0=voided, 1=active)
    // - startDate: filter by creation date (from)
    // - endDate: filter by creation date (to)
    return this.upliftSalesService.findAll(query, req.user);
  }

  @Get(':id')
  @SkipThrottle() // Whitelist - read-only, single record fetch
  async findOne(@Param('id') id: string) {
    return this.upliftSalesService.findOne(+id);
  }

  @Post()
  async create(@Body() createUpliftSaleDto: any) {
    console.log('📥 Received uplift sale creation request:');
    console.log('📊 Request body:', JSON.stringify(createUpliftSaleDto, null, 2));
    return this.upliftSalesService.create(createUpliftSaleDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUpliftSaleDto: any) {
    return this.upliftSalesService.update(+id, updateUpliftSaleDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.upliftSalesService.remove(+id);
  }

  @Post(':id/void')
  async voidSale(@Param('id') id: string, @Body() body: { reason: string }) {
    console.log(`📥 Received void sale request for ID ${id}:`);
    console.log('📊 Void reason:', body.reason);
    return this.upliftSalesService.voidSale(+id, body.reason);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: number },
  ) {
    return this.upliftSalesService.update(+id, { status: body.status, updatedAt: new Date() });
  }
} 