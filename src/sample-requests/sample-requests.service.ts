import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { SampleRequest } from '../entities/sample-request.entity';
import { SampleRequestItem } from '../entities/sample-request-item.entity';

export interface CreateSampleRequestDto {
  clientId: number;
  userId: number;
  notes?: string;
  items: Array<{
    productId: number;
    quantity: number;
    notes?: string;
  }>;
}

export interface UpdateSampleRequestDto {
  status?: 'pending' | 'approved' | 'rejected';
  notes?: string;
  approvedBy?: number;
}

@Injectable()
export class SampleRequestsService {
  constructor(
    @InjectRepository(SampleRequest)
    private sampleRequestRepository: Repository<SampleRequest>,
    @InjectRepository(SampleRequestItem)
    private sampleRequestItemRepository: Repository<SampleRequestItem>,
    private dataSource: DataSource,
  ) {}

  async create(createDto: CreateSampleRequestDto): Promise<SampleRequest> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Generate request number
      const requestNumber = await this.generateRequestNumber();

      // Create sample request
      const sampleRequest = this.sampleRequestRepository.create({
        clientId: createDto.clientId,
        userId: createDto.userId,
        requestNumber,
        requestDate: new Date(),
        status: 'pending',
        notes: createDto.notes || '',
      });

      const savedRequest = await queryRunner.manager.save(sampleRequest);

      // Create sample request items
      const items = createDto.items.map(item => 
        this.sampleRequestItemRepository.create({
          sampleRequestId: savedRequest.id,
          productId: item.productId,
          quantity: item.quantity,
          notes: item.notes || '',
        })
      );

      await queryRunner.manager.save(SampleRequestItem, items);

      await queryRunner.commitTransaction();

      // Return the created request with items
      return this.findOne(savedRequest.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<SampleRequest[]> {
    return this.sampleRequestRepository.find({
      relations: ['client', 'user', 'sampleRequestItems', 'sampleRequestItems.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<SampleRequest> {
    const sampleRequest = await this.sampleRequestRepository.findOne({
      where: { id },
      relations: ['client', 'user', 'sampleRequestItems', 'sampleRequestItems.product'],
    });

    if (!sampleRequest) {
      throw new NotFoundException(`Sample request with ID ${id} not found`);
    }

    return sampleRequest;
  }

  async update(id: number, updateDto: UpdateSampleRequestDto): Promise<SampleRequest> {
    const sampleRequest = await this.findOne(id);

    if (updateDto.status) {
      sampleRequest.status = updateDto.status;
      
      if (updateDto.status === 'approved' && updateDto.approvedBy) {
        sampleRequest.approvedBy = updateDto.approvedBy;
        sampleRequest.approvedAt = new Date();
      }
    }

    if (updateDto.notes !== undefined) {
      sampleRequest.notes = updateDto.notes;
    }

    await this.sampleRequestRepository.save(sampleRequest);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const sampleRequest = await this.findOne(id);
    await this.sampleRequestRepository.remove(sampleRequest);
  }

  async findByClient(clientId: number): Promise<SampleRequest[]> {
    return this.sampleRequestRepository.find({
      where: { clientId },
      relations: ['client', 'user', 'sampleRequestItems', 'sampleRequestItems.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: number): Promise<SampleRequest[]> {
    return this.sampleRequestRepository.find({
      where: { userId },
      relations: ['client', 'user', 'sampleRequestItems', 'sampleRequestItems.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByStatus(status: 'pending' | 'approved' | 'rejected'): Promise<SampleRequest[]> {
    return this.sampleRequestRepository.find({
      where: { status },
      relations: ['client', 'user', 'sampleRequestItems', 'sampleRequestItems.product'],
      order: { createdAt: 'DESC' },
    });
  }

  private async generateRequestNumber(): Promise<string> {
    const today = new Date();
    const dateStr = today.getFullYear().toString() + 
                   (today.getMonth() + 1).toString().padStart(2, '0') + 
                   today.getDate().toString().padStart(2, '0');
    
    // Get count of requests for today
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
    const count = await this.sampleRequestRepository
      .createQueryBuilder('sr')
      .where('sr.createdAt >= :startOfDay', { startOfDay })
      .andWhere('sr.createdAt < :endOfDay', { endOfDay })
      .getCount();

    const sequence = (count + 1).toString().padStart(3, '0');
    return `SR-${dateStr}-${sequence}`;
  }
}
