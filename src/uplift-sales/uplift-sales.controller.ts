import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpliftSalesService } from './uplift-sales.service';

@Controller('uplift-sales')
@UseGuards(JwtAuthGuard)
export class UpliftSalesController {
  constructor(private readonly upliftSalesService: UpliftSalesService) {}

  @Get()
  async findAll(@Query() query: any) {
    return this.upliftSalesService.findAll(query);
  }

  @Get(':id')
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
} 