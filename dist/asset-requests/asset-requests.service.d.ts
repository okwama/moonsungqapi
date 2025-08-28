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
export declare class AssetRequestsService {
    private assetRequestRepository;
    private assetRequestItemRepository;
    constructor(assetRequestRepository: Repository<AssetRequest>, assetRequestItemRepository: Repository<AssetRequestItem>);
    create(createDto: CreateAssetRequestDto): Promise<AssetRequest>;
    findAll(): Promise<AssetRequest[]>;
    findByUser(userId: number): Promise<AssetRequest[]>;
    findByStatus(status: string): Promise<AssetRequest[]>;
    findOne(id: number): Promise<AssetRequest>;
    update(id: number, updateDto: UpdateAssetRequestDto): Promise<AssetRequest>;
    assignAssets(id: number, assignDto: AssignAssetsDto): Promise<AssetRequest>;
    returnAssets(id: number, returnDto: ReturnAssetsDto): Promise<AssetRequest>;
    remove(id: number): Promise<void>;
    getAssetTypes(): Promise<string[]>;
    private generateRequestNumber;
}
