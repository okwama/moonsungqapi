import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    // Extract salesrep ID from JWT token
    const salesrepId = req.user?.sub || req.user?.id;
    const order = await this.ordersService.create(createOrderDto, salesrepId);
    
    // Return in format expected by Flutter app
    return {
      success: true,
      data: order
    };
  }

  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Request() req
  ) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const userId = req.user?.id;
    const userRole = req.user?.role;
    
    console.log(`🔍 GET /orders - User: ${userId}, Role: ${userRole}, Page: ${pageNum}, Limit: ${limitNum}`);
    console.log(`🔍 Complete user object from JWT:`, JSON.stringify(req.user, null, 2));
    
    // Get orders based on user role
    const orders = await this.ordersService.findAll(userId, userRole);
    
    // Calculate pagination
    const total = orders.length;
    const totalPages = Math.ceil(total / limitNum);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedOrders = orders.slice(startIndex, endIndex);
    
    console.log(`📊 Orders: Found ${total} orders, returning ${paginatedOrders.length} for page ${pageNum}`);
    
    // Debug: Log first few orders with timestamps
    if (paginatedOrders.length > 0) {
      console.log(`🕒 Order timestamps (sorted by createdAt DESC):`);
      paginatedOrders.slice(0, 3).forEach((order, index) => {
        console.log(`  ${index + 1}. Order ${order.id}: createdAt=${order.createdAt}, updatedAt=${order.updatedAt}`);
      });
    }
    
    // Return in format expected by Flutter app
    return {
      success: true,
      data: paginatedOrders,
      total: total,
      page: pageNum,
      limit: limitNum,
      totalPages: totalPages,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    
    console.log(`🔍 GET /orders/${id} - User: ${userId}, Role: ${userRole}`);
    
    const order = await this.ordersService.findOne(+id, userId, userRole);
    
    if (!order) {
      console.log(`❌ Order ${id} not found or access denied for user ${userId}`);
      return {
        success: false,
        error: 'Order not found or access denied'
      };
    }
    
    // Return in format expected by Flutter app
    return {
      success: true,
      data: order
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateOrderDto: Partial<CreateOrderDto>) {
    const order = await this.ordersService.update(+id, updateOrderDto);
    
    // Return in format expected by Flutter app
    return {
      success: true,
      data: order
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
} 