import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssetRequest } from '../entities/asset-request.entity';
import { AssetRequestItem } from '../entities/asset-request-item.entity';

export interface CreateAssetRequestDto {
  salesRepId: number;
  notes?: string;
  items: CreateAssetRequestItemDto[];
}

export interface CreateAssetRequestItemDto {
  assetName: string;
  assetType: string;
  quantity: number;
  notes?: string;
}

export interface UpdateAssetRequestDto {
  status?: string;
  notes?: string;
  approvedBy?: number;
  assignedBy?: number;
}

export interface AssignAssetsDto {
  assignments: {
    itemId: number;
    assignedQuantity: number;
  }[];
}

export interface ReturnAssetsDto {
  returns: {
    itemId: number;
    returnedQuantity: number;
  }[];
}

@Injectable()
export class AssetRequestsService {
  constructor(
    @InjectRepository(AssetRequest)
    private assetRequestRepository: Repository<AssetRequest>,
    @InjectRepository(AssetRequestItem)
    private assetRequestItemRepository: Repository<AssetRequestItem>,
  ) {}

  async create(createDto: CreateAssetRequestDto): Promise<AssetRequest> {
    // Generate request number
    const requestNumber = await this.generateRequestNumber();

    // Create the asset request
    const assetRequest = this.assetRequestRepository.create({
      requestNumber,
      salesRepId: createDto.salesRepId,
      notes: createDto.notes,
      status: 'pending',
    });

    const savedRequest = await this.assetRequestRepository.save(assetRequest);

    // Create the items
    const items = createDto.items.map(item => 
      this.assetRequestItemRepository.create({
        assetRequestId: savedRequest.id,
        assetName: item.assetName,
        assetType: item.assetType,
        quantity: item.quantity,
        notes: item.notes,
      })
    );

    await this.assetRequestItemRepository.save(items);

    // Return the complete request with items
    return this.findOne(savedRequest.id);
  }

  async findAll(): Promise<AssetRequest[]> {
    return this.assetRequestRepository.find({
      relations: ['salesRep', 'approver', 'assigner', 'items'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: number): Promise<AssetRequest[]> {
    return this.assetRequestRepository.find({
      where: { salesRepId: userId },
      relations: ['salesRep', 'approver', 'assigner', 'items'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByStatus(status: string): Promise<AssetRequest[]> {
    return this.assetRequestRepository.find({
      where: { status },
      relations: ['salesRep', 'approver', 'assigner', 'items'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<AssetRequest> {
    const assetRequest = await this.assetRequestRepository.findOne({
      where: { id },
      relations: ['salesRep', 'approver', 'assigner', 'items'],
    });

    if (!assetRequest) {
      throw new NotFoundException(`Asset request with ID ${id} not found`);
    }

    return assetRequest;
  }

  async update(id: number, updateDto: UpdateAssetRequestDto): Promise<AssetRequest> {
    const assetRequest = await this.findOne(id);

    // Update status-specific fields
    if (updateDto.status === 'approved' && assetRequest.status === 'pending') {
      assetRequest.status = 'approved';
      assetRequest.approvedBy = updateDto.approvedBy;
      assetRequest.approvedAt = new Date();
    } else if (updateDto.status === 'rejected' && assetRequest.status === 'pending') {
      assetRequest.status = 'rejected';
      assetRequest.approvedBy = updateDto.approvedBy;
      assetRequest.approvedAt = new Date();
    } else if (updateDto.status === 'assigned' && assetRequest.status === 'approved') {
      assetRequest.status = 'assigned';
      assetRequest.assignedBy = updateDto.assignedBy;
      assetRequest.assignedAt = new Date();
    } else if (updateDto.status === 'returned' && assetRequest.status === 'assigned') {
      assetRequest.status = 'returned';
      assetRequest.returnDate = new Date();
    } else if (updateDto.status) {
      assetRequest.status = updateDto.status;
    }

    if (updateDto.notes !== undefined) {
      assetRequest.notes = updateDto.notes;
    }

    return this.assetRequestRepository.save(assetRequest);
  }

  async assignAssets(id: number, assignDto: AssignAssetsDto): Promise<AssetRequest> {
    const assetRequest = await this.findOne(id);

    if (assetRequest.status !== 'approved') {
      throw new BadRequestException('Can only assign assets to approved requests');
    }

    // Update item assignments
    for (const assignment of assignDto.assignments) {
      const item = assetRequest.items.find(item => item.id === assignment.itemId);
      if (!item) {
        throw new NotFoundException(`Item with ID ${assignment.itemId} not found`);
      }

      if (assignment.assignedQuantity > item.quantity) {
        throw new BadRequestException(`Cannot assign more than requested quantity for item ${item.assetName}`);
      }

      await this.assetRequestItemRepository.update(assignment.itemId, {
        assignedQuantity: assignment.assignedQuantity,
      });
    }

    // Update request status to assigned
    assetRequest.status = 'assigned';
    assetRequest.assignedAt = new Date();

    return this.assetRequestRepository.save(assetRequest);
  }

  async returnAssets(id: number, returnDto: ReturnAssetsDto): Promise<AssetRequest> {
    const assetRequest = await this.findOne(id);

    if (assetRequest.status !== 'assigned') {
      throw new BadRequestException('Can only return assets from assigned requests');
    }

    // Update item returns
    for (const returnItem of returnDto.returns) {
      const item = assetRequest.items.find(item => item.id === returnItem.itemId);
      if (!item) {
        throw new NotFoundException(`Item with ID ${returnItem.itemId} not found`);
      }

      if (returnItem.returnedQuantity > item.assignedQuantity) {
        throw new BadRequestException(`Cannot return more than assigned quantity for item ${item.assetName}`);
      }

      await this.assetRequestItemRepository.update(returnItem.itemId, {
        returnedQuantity: returnItem.returnedQuantity,
      });
    }

    // Update request status to returned
    assetRequest.status = 'returned';
    assetRequest.returnDate = new Date();

    return this.assetRequestRepository.save(assetRequest);
  }

  async remove(id: number): Promise<void> {
    const assetRequest = await this.findOne(id);

    if (assetRequest.status !== 'pending') {
      throw new BadRequestException('Can only delete pending requests');
    }

    await this.assetRequestRepository.remove(assetRequest);
  }

  async getAssetTypes(): Promise<string[]> {
    // Return predefined asset types
    return [
      'Display Stand',
      'Banner',
      'Poster',
      'Brochure',
      'Sample Kit',
      'Merchandising Material',
      'Equipment',
      'Other'
    ];
  }

  private async generateRequestNumber(): Promise<string> {
    const today = new Date();
    const dateStr = today.getFullYear().toString() +
      (today.getMonth() + 1).toString().padStart(2, '0') +
      today.getDate().toString().padStart(2, '0');

    // Count existing requests for today
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const count = await this.assetRequestRepository
      .createQueryBuilder('assetRequest')
      .where('assetRequest.createdAt >= :startOfDay', { startOfDay })
      .andWhere('assetRequest.createdAt < :endOfDay', { endOfDay })
      .getCount();

    const sequence = (count + 1).toString().padStart(3, '0');
    return `AR-${dateStr}-${sequence}`;
  }
}
