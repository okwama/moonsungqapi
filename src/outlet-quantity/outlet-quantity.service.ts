import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OutletQuantity } from '../entities/outlet-quantity.entity';

@Injectable()
export class OutletQuantityService {
  private readonly logger = new Logger(OutletQuantityService.name);

  constructor(
    @InjectRepository(OutletQuantity)
    private outletQuantityRepository: Repository<OutletQuantity>,
  ) {}

  async findByOutletId(outletId: number) {
    this.logger.log(`🔍 Finding products for outlet ${outletId}`);
    
    return this.outletQuantityRepository.find({
      where: { clientId: outletId },
      relations: ['product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByOutletAndProduct(outletId: number, productId: number) {
    return this.outletQuantityRepository.findOne({
      where: { clientId: outletId, productId },
      relations: ['product'],
    });
  }

  async updateQuantity(outletId: number, productId: number, quantity: number) {
    const existing = await this.findByOutletAndProduct(outletId, productId);
    
    if (existing) {
      existing.quantity = quantity;
      return this.outletQuantityRepository.save(existing);
    } else {
      const newQuantity = this.outletQuantityRepository.create({
        clientId: outletId,
        productId,
        quantity,
      });
      return this.outletQuantityRepository.save(newQuantity);
    }
  }

  async decrementQuantity(outletId: number, productId: number, amount: number) {
    const existing = await this.findByOutletAndProduct(outletId, productId);
    
    if (existing && existing.quantity >= amount) {
      existing.quantity -= amount;
      return this.outletQuantityRepository.save(existing);
    }
    
    throw new Error('Insufficient quantity at outlet');
  }

  async create(outletId: number, productId: number, quantity: number) {
    const newQuantity = this.outletQuantityRepository.create({
      clientId: outletId,
      productId,
      quantity,
    });
    return this.outletQuantityRepository.save(newQuantity);
  }
}
