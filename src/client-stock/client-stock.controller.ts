import { Controller, Get, Post, Param, Body, Request, Delete, UseGuards } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ClientStockService } from './client-stock.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('client-stock')
@UseGuards(JwtAuthGuard)
export class ClientStockController {
  private readonly logger = new Logger(ClientStockController.name);

  constructor(private readonly clientStockService: ClientStockService) {}

  @Get('status')
  async getFeatureStatus() {
    // Check environment variable for feature flag
    const isEnabled = process.env.CLIENT_STOCK_ENABLED !== 'false';
    
    return {
      enabled: isEnabled,
      message: isEnabled 
        ? 'Client stock feature is enabled' 
        : 'Client stock feature is disabled'
    };
  }

  @Get(':clientId')
  async getClientStock(@Param('clientId') clientId: string, @Request() req) {
    const userId = req.user?.id || 'unknown';
    const userRole = req.user?.role || 'unknown';
    this.logger.log(`🔍 GET /client-stock/${clientId} - User: ${userId}, Role: ${userRole}`);
    
    // Validate clientId parameter
    const clientIdNum = +clientId;
    if (isNaN(clientIdNum) || clientIdNum <= 0) {
      this.logger.error(`❌ Invalid clientId parameter: ${clientId}`);
      return {
        success: false,
        message: 'Invalid client ID',
        data: []
      };
    }
    
    try {
      const stock = await this.clientStockService.getClientStock(clientIdNum);
      
      // Transform the response to match Flutter's expected format
      const transformedStock = stock.map(item => ({
        id: item.id,
        clientId: item.clientId,
        productId: item.productId,
        quantity: item.quantity,
        salesrepId: item.salesrepId,
        product: item.product ? {
          id: item.product.id,
          name: item.product.productName,
          description: item.product.description,
          price: item.product.costPrice,
          imageUrl: item.product.imageUrl,
        } : null,
      }));

      return {
        success: true,
        message: 'Client stock retrieved successfully',
        data: transformedStock
      };
    } catch (error) {
      this.logger.error(`❌ Error getting client stock:`, error);
      return {
        success: false,
        message: 'Failed to get client stock',
        data: []
      };
    }
  }

  @Post()
  async updateStock(@Body() body: { clientId: number; productId: number; quantity: number }, @Request() req) {
    const userId = req.user?.id || 'unknown';
    const userRole = req.user?.role || 'unknown';
    this.logger.log(`📝 POST /client-stock - User: ${userId}, Role: ${userRole}`);
    
    try {
      const { clientId, productId, quantity } = body;
      const salesrepId = req.user?.id;
      
      if (!salesrepId) {
        throw new Error('User ID not found in request');
      }

      const stockRecord = await this.clientStockService.updateStock(clientId, productId, quantity, salesrepId);
      
      return {
        success: true,
        message: 'Client stock updated successfully',
        data: {
          id: stockRecord.id,
          clientId: stockRecord.clientId,
          productId: stockRecord.productId,
          quantity: stockRecord.quantity,
          salesrepId: stockRecord.salesrepId,
        }
      };
    } catch (error) {
      this.logger.error(`❌ Error updating client stock:`, error);
      return {
        success: false,
        message: 'Failed to update client stock',
        data: null
      };
    }
  }

  @Delete(':clientId/:productId')
  async deleteStock(@Param('clientId') clientId: string, @Param('productId') productId: string, @Request() req) {
    const userId = req.user?.id || 'unknown';
    const userRole = req.user?.role || 'unknown';
    this.logger.log(`🗑️ DELETE /client-stock/${clientId}/${productId} - User: ${userId}, Role: ${userRole}`);
    
    // Validate parameters
    const clientIdNum = +clientId;
    const productIdNum = +productId;
    if (isNaN(clientIdNum) || clientIdNum <= 0 || isNaN(productIdNum) || productIdNum <= 0) {
      this.logger.error(`❌ Invalid parameters: clientId=${clientId}, productId=${productId}`);
      return {
        success: false,
        message: 'Invalid client ID or product ID',
        data: null
      };
    }
    
    try {
      await this.clientStockService.deleteStock(clientIdNum, productIdNum);
      
      return {
        success: true,
        message: 'Client stock deleted successfully',
        data: null
      };
    } catch (error) {
      this.logger.error(`❌ Error deleting client stock:`, error);
      return {
        success: false,
        message: 'Failed to delete client stock',
        data: null
      };
    }
  }

}
