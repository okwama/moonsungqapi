import { AssetRequest } from './asset-request.entity';
export declare class AssetRequestItem {
    id: number;
    assetRequestId: number;
    assetName: string;
    assetType: string;
    quantity: number;
    notes: string;
    assignedQuantity: number;
    returnedQuantity: number;
    createdAt: Date;
    assetRequest: AssetRequest;
}
