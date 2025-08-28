import { AssetRequestsService, CreateAssetRequestDto, UpdateAssetRequestDto, AssignAssetsDto, ReturnAssetsDto } from './asset-requests.service';
export declare class AssetRequestsController {
    private readonly assetRequestsService;
    constructor(assetRequestsService: AssetRequestsService);
    create(createDto: CreateAssetRequestDto, req: any): Promise<import("../entities").AssetRequest>;
    findAll(userId?: string, status?: string): Promise<import("../entities").AssetRequest[]>;
    findMyRequests(req: any): Promise<import("../entities").AssetRequest[]>;
    findOne(id: string): Promise<import("../entities").AssetRequest>;
    updateStatus(id: string, updateDto: UpdateAssetRequestDto, req: any): Promise<import("../entities").AssetRequest>;
    assignAssets(id: string, assignDto: AssignAssetsDto, req: any): Promise<import("../entities").AssetRequest>;
    returnAssets(id: string, returnDto: ReturnAssetsDto, req: any): Promise<import("../entities").AssetRequest>;
    remove(id: string): Promise<void>;
}
export declare class AssetTypesController {
    private readonly assetRequestsService;
    constructor(assetRequestsService: AssetRequestsService);
    getAssetTypes(): Promise<string[]>;
}
