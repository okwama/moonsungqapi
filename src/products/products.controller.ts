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
  async findAll(@Query('clientId') clientId?: string) {
    try {
      console.log('📦 Products API: GET /products called');
      const parsedClientId = clientId ? parseInt(clientId) : undefined;
      
      if (parsedClientId) {
        console.log(`💰 Products API: Applying discount for client ${parsedClientId}`);
        console.log(`💰 API Call: GET /products?clientId=${parsedClientId}`);
      } else {
        console.log(`💰 Products API: No client discount requested`);
      }
      
      const products = await this.productsService.findAll(parsedClientId);
      console.log(`📦 Products API: Returning ${products.length} products`);
      return products;
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