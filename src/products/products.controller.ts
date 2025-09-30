import { Controller, Get, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  @Get()
  async findAll(
    @Query('clientId') clientId?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '50',
    @Query('category') category?: string,
    @Query('search') search?: string
  ) {
    try {
      console.log('📦 Products API: GET /products called with pagination');
      const parsedClientId = clientId ? parseInt(clientId) : undefined;
      const pageNum = Math.max(1, parseInt(page, 10));
      const limitNum = Math.min(100, Math.max(10, parseInt(limit, 10))); // Limit between 10-100
      
      console.log(`📦 Products API: Page=${pageNum}, Limit=${limitNum}, ClientId=${parsedClientId}`);
      
      const startTime = Date.now();
      const result = await this.productsService.findAllPaginated({
        clientId: parsedClientId,
        page: pageNum,
        limit: limitNum,
        category: category,
        search: search
      });
      const processingTime = Date.now() - startTime;
      
      console.log(`📦 Products API: Returning ${result.data.length} products (page ${pageNum}/${result.pagination.totalPages}) in ${processingTime}ms`);
      
      // Return optimized response format with pagination
      return {
        success: true,
        data: result.data,
        pagination: result.pagination,
        meta: {
          processingTime: `${processingTime}ms`,
          cached: true,
          timestamp: new Date().toISOString(),
          clientId: parsedClientId,
          filters: {
            category,
            search
          }
        }
      };
    } catch (error) {
      console.error('❌ Products API Error:', error);
      throw error;
    }
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  async findProductsForUser(@Request() req, @Query('clientId') clientId?: string) {
    try {
      console.log('🌍 Products API: GET /products/user called');
      const userCountryId = req.user?.countryId || req.user?.country_id;
      
      const parsedClientId = clientId ? parseInt(clientId) : undefined;
      
      if (parsedClientId) {
        console.log(`💰 Products API: Applying discount for client ${parsedClientId}`);
        console.log(`💰 API Call: GET /products/user?clientId=${parsedClientId}`);
      } else {
        console.log(`💰 Products API: No client discount requested`);
      }
      
      if (!userCountryId || isNaN(userCountryId)) {
        console.log('⚠️ No valid country ID found in user data, using fallback');
        // Use fallback (store 1) if no country ID
        const products = await this.productsService.findProductsByCountry(0, parsedClientId);
        console.log(`🌍 Products API: Returning ${products.length} products using fallback`);
        return products;
      }

      const products = await this.productsService.findProductsByCountry(userCountryId, parsedClientId);
      console.log(`🌍 Products API: Returning ${products.length} products for country ${userCountryId}`);
      return products;
    } catch (error) {
      console.error('❌ Products API Error:', error);
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }
}

// Separate controller for health checks without authentication
@Controller('health')
export class HealthController {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  @Get('products')
  async productsHealthCheck() {
    try {
      console.log('🏥 Products Health Check: Testing database connection...');
      const result = await this.dataSource.query('SELECT 1 as test');
      console.log('✅ Database connection successful:', result);
      return { status: 'healthy', database: 'connected', timestamp: new Date().toISOString() };
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      return { status: 'unhealthy', database: 'disconnected', error: error.message, timestamp: new Date().toISOString() };
    }
  }
} 