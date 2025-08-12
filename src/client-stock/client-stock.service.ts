import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientStock } from '../entities/client-stock.entity';

@Injectable()
export class ClientStockService {
  private readonly logger = new Logger(ClientStockService.name);

  constructor(
    @InjectRepository(ClientStock)
    private clientStockRepository: Repository<ClientStock>,
  ) {}

  async getClientStock(clientId: number): Promise<ClientStock[]> {
    this.logger.log(`🔍 Getting client stock for client ${clientId}`);
    
    try {
      const stock = await this.clientStockRepository.find({
        where: { clientId },
        relations: ['product'],
        order: { id: 'DESC' },
      });

      this.logger.log(`✅ Found ${stock.length} stock items for client ${clientId}`);
      return stock;
    } catch (error) {
      this.logger.error(`❌ Error getting client stock:`, error);
      throw error;
    }
  }

  async updateStock(clientId: number, productId: number, quantity: number, salesrepId: number): Promise<ClientStock> {
    this.logger.log(`📝 Updating stock for client ${clientId}, product ${productId}, quantity ${quantity}`);
    
    try {
      // Check if stock record exists
      let stockRecord = await this.clientStockRepository.findOne({
        where: { clientId, productId }
      });

      if (stockRecord) {
        // Update existing record
        stockRecord.quantity = quantity;
        stockRecord.salesrepId = salesrepId;
        stockRecord = await this.clientStockRepository.save(stockRecord);
        this.logger.log(`✅ Updated existing stock record for client ${clientId}, product ${productId}`);
      } else {
        // Create new record
        stockRecord = this.clientStockRepository.create({
          clientId,
          productId,
          quantity,
          salesrepId,
        });
        stockRecord = await this.clientStockRepository.save(stockRecord);
        this.logger.log(`✅ Created new stock record for client ${clientId}, product ${productId}`);
      }

      return stockRecord;
    } catch (error) {
      this.logger.error(`❌ Error updating client stock:`, error);
      throw error;
    }
  }

  async getStockByClientAndProduct(clientId: number, productId: number): Promise<ClientStock | null> {
    return this.clientStockRepository.findOne({
      where: { clientId, productId },
      relations: ['product'],
    });
  }

  async deleteStock(clientId: number, productId: number): Promise<void> {
    this.logger.log(`🗑️ Deleting stock for client ${clientId}, product ${productId}`);
    
    try {
      await this.clientStockRepository.delete({ clientId, productId });
      this.logger.log(`✅ Deleted stock record for client ${clientId}, product ${productId}`);
    } catch (error) {
      this.logger.error(`❌ Error deleting client stock:`, error);
      throw error;
    }
  }
}
